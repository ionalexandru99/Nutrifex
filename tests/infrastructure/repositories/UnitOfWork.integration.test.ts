/**
 * UnitOfWork integration tests.
 *
 * These tests use better-sqlite3 to test real SQL transaction behavior in Node.js.
 * The transaction semantics are identical to what expo-sqlite executes in production.
 */

import {
  createTestFood,
  createTestPantryItem,
  createTestDatabase,
  TestDatabase,
  TestUnitOfWork,
} from '../../helpers';

describe('UnitOfWork Integration Tests', () => {
  let db: TestDatabase;
  let unitOfWork: TestUnitOfWork;

  beforeEach(async () => {
    // Fresh in-memory database for each test
    db = await createTestDatabase();
    unitOfWork = new TestUnitOfWork(db);
  });

  afterEach(async () => {
    await db.close();
  });

  describe('repository access', () => {
    it('should provide access to foods repository', async () => {
      const food = createTestFood({ id: 'uow-food-1' });
      await unitOfWork.foods.save(food);

      const retrieved = await unitOfWork.foods.findById('uow-food-1');
      expect(retrieved.id).toBe('uow-food-1');
    });

    it('should provide access to pantry items repository', async () => {
      const food = createTestFood({ id: 'uow-item-food' });
      await unitOfWork.foods.save(food);

      const item = createTestPantryItem({ id: 'uow-item-1', food });
      await unitOfWork.pantryItems.save(item);

      const retrieved = await unitOfWork.pantryItems.findById('uow-item-1');
      expect(retrieved.id).toBe('uow-item-1');
    });
  });

  describe('transactions', () => {
    it('should begin and commit a transaction', async () => {
      await unitOfWork.beginTransaction();
      const food = createTestFood({ id: 'tx-commit-1' });
      await unitOfWork.foods.save(food);
      await unitOfWork.commit();

      const retrieved = await unitOfWork.foods.findById('tx-commit-1');
      expect(retrieved.id).toBe('tx-commit-1');
    });

    it('should begin and rollback a transaction', async () => {
      await unitOfWork.beginTransaction();
      const food = createTestFood({ id: 'tx-rollback-1' });
      await unitOfWork.foods.save(food);
      await unitOfWork.rollback();

      const result = await unitOfWork.foods.findByIdOrNull('tx-rollback-1');
      expect(result).toBeNull();
    });

    it('should throw if beginning transaction while one in progress', async () => {
      await unitOfWork.beginTransaction();

      await expect(unitOfWork.beginTransaction()).rejects.toThrow(
        'Transaction already in progress',
      );

      // Cleanup
      await unitOfWork.rollback();
    });

    it('should throw if no transaction in progress on commit', async () => {
      await expect(unitOfWork.commit()).rejects.toThrow('No transaction in progress');
    });

    it('should throw if no transaction in progress on rollback', async () => {
      await expect(unitOfWork.rollback()).rejects.toThrow('No transaction in progress');
    });
  });

  describe('execute()', () => {
    it('should commit on successful callback', async () => {
      await unitOfWork.execute(async (uow) => {
        const food = createTestFood({ id: 'execute-success-1' });
        await uow.foods.save(food);
      });

      const retrieved = await unitOfWork.foods.findById('execute-success-1');
      expect(retrieved.id).toBe('execute-success-1');
    });

    it('should rollback on error', async () => {
      try {
        await unitOfWork.execute(async (uow) => {
          const food = createTestFood({ id: 'execute-error-1' });
          await uow.foods.save(food);
          throw new Error('Test error');
        });
      } catch {
        // Expected error
      }

      const result = await unitOfWork.foods.findByIdOrNull('execute-error-1');
      expect(result).toBeNull();
    });

    it('should support multiple operations in transaction', async () => {
      await unitOfWork.execute(async (uow) => {
        const food1 = createTestFood({ id: 'tx-multi-food-1' });
        const food2 = createTestFood({ id: 'tx-multi-food-2' });

        await uow.foods.save(food1);
        await uow.foods.save(food2);

        const item = createTestPantryItem({
          id: 'tx-multi-item-1',
          food: food1,
        });
        await uow.pantryItems.save(item);
      });

      const food1 = await unitOfWork.foods.findById('tx-multi-food-1');
      const food2 = await unitOfWork.foods.findById('tx-multi-food-2');
      const item = await unitOfWork.pantryItems.findById('tx-multi-item-1');

      expect(food1).toBeDefined();
      expect(food2).toBeDefined();
      expect(item).toBeDefined();
    });

    it('should rethrow errors from callback', async () => {
      const testError = new Error('Custom test error');

      await expect(
        unitOfWork.execute(async () => {
          throw testError;
        }),
      ).rejects.toBe(testError);
    });

    it('should return value from successful callback', async () => {
      const result = await unitOfWork.execute(async (uow) => {
        const food = createTestFood({ id: 'return-value-food' });
        await uow.foods.save(food);
        return 'success';
      });

      expect(result).toBe('success');
    });
  });

  describe('Cascade delete scenario', () => {
    it('should delete food and associated items in transaction', async () => {
      // Setup
      await unitOfWork.execute(async (uow) => {
        const food = createTestFood({ id: 'cascade-food' });
        await uow.foods.save(food);

        const item1 = createTestPantryItem({ id: 'cascade-item-1', food });
        const item2 = createTestPantryItem({ id: 'cascade-item-2', food });

        await uow.pantryItems.save(item1);
        await uow.pantryItems.save(item2);
      });

      // Delete
      await unitOfWork.execute(async (uow) => {
        await uow.pantryItems.deleteByFoodId('cascade-food');
        await uow.foods.delete('cascade-food');
      });

      // Verify
      const food = await unitOfWork.foods.findByIdOrNull('cascade-food');
      const items = await unitOfWork.pantryItems.findByFoodId('cascade-food');

      expect(food).toBeNull();
      expect(items).toHaveLength(0);
    });

    it('should rollback entire transaction on partial failure', async () => {
      // First, create a food that will be used
      const validFood = createTestFood({ id: 'valid-food' });
      await unitOfWork.foods.save(validFood);

      // Try transaction with both valid and invalid operations
      try {
        await unitOfWork.execute(async (uow) => {
          // Save a new food
          const newFood = createTestFood({ id: 'partial-fail-food' });
          await uow.foods.save(newFood);

          // This should fail - referencing non-existent food
          const invalidItem = createTestPantryItem({
            id: 'invalid-item',
            food: createTestFood({ id: 'non-existent-food' }),
          });
          await uow.pantryItems.save(invalidItem);
        });
      } catch {
        // Expected error due to foreign key violation
      }

      // The new food should NOT exist because transaction was rolled back
      const newFood = await unitOfWork.foods.findByIdOrNull('partial-fail-food');
      expect(newFood).toBeNull();
    });
  });

  describe('Update scenario', () => {
    it('should update multiple entities in transaction', async () => {
      // Setup
      const food = createTestFood({ id: 'update-food' });
      await unitOfWork.foods.save(food);

      const item = createTestPantryItem({ id: 'update-item', food });
      await unitOfWork.pantryItems.save(item);

      // Update in transaction
      await unitOfWork.execute(async (uow) => {
        const updatedFood = food.updateName('Updated Food Name');
        const updatedItem = item.updateLocation('Updated Location');

        await uow.foods.update(updatedFood);
        await uow.pantryItems.update(updatedItem);
      });

      // Verify
      const retrievedFood = await unitOfWork.foods.findById('update-food');
      const retrievedItem = await unitOfWork.pantryItems.findById('update-item');

      expect(retrievedFood.name).toBe('Updated Food Name');
      expect(retrievedItem.location).toBe('Updated Location');
    });
  });

  describe('Isolation', () => {
    it('should isolate data between test cases', async () => {
      // This test relies on beforeEach creating a fresh database
      const allFoods = await unitOfWork.foods.findAll();
      expect(allFoods).toHaveLength(0);
    });
  });
});
