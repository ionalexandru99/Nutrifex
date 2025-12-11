/**
 * PantryItemRepository integration tests.
 *
 * These tests use better-sqlite3 to test real SQL behavior in Node.js.
 * The SQL queries are identical to what expo-sqlite executes in production.
 */

import { ExpirationType } from '@domain/enums/ExpirationType';
import { PantryItemSpecifications } from '@domain/specifications/PantryItemSpecifications';

import {
  createTestPantryItem,
  createTestFood,
  daysFromNow,
  daysAgo,
  createTestDatabase,
  TestDatabase,
  TestFoodRepository,
  TestPantryItemRepository,
} from '../../helpers';

describe('PantryItemRepository Integration Tests', () => {
  let db: TestDatabase;
  let pantryRepository: TestPantryItemRepository;
  let foodRepository: TestFoodRepository;

  beforeEach(async () => {
    // Fresh in-memory database for each test
    db = await createTestDatabase();
    foodRepository = new TestFoodRepository(db);
    pantryRepository = new TestPantryItemRepository(db, foodRepository);
  });

  afterEach(async () => {
    await db.close();
  });

  describe('save() and findById()', () => {
    it('should save and retrieve a pantry item with food', async () => {
      const food = createTestFood({ id: 'pantry-food-1' });
      await foodRepository.save(food);

      const item = createTestPantryItem({
        id: 'pantry-item-1',
        food,
      });
      await pantryRepository.save(item);

      const retrieved = await pantryRepository.findById('pantry-item-1');

      expect(retrieved.id).toBe(item.id);
      expect(retrieved.food.id).toBe(food.id);
      expect(retrieved.quantity.amount).toBe(item.quantity.amount);
    });

    it('should throw when pantry item not found', async () => {
      await expect(pantryRepository.findById('nonexistent-item')).rejects.toThrow(
        'PantryItem with ID nonexistent-item not found',
      );
    });

    it('should return null from findByIdOrNull when not found', async () => {
      const result = await pantryRepository.findByIdOrNull('nonexistent-item-2');
      expect(result).toBeNull();
    });

    it('should throw foreign key error when food does not exist', async () => {
      const food = createTestFood({ id: 'missing-food' });
      const item = createTestPantryItem({
        id: 'orphan-item',
        food,
      });

      // Should fail due to foreign key constraint
      await expect(pantryRepository.save(item)).rejects.toThrow();
    });
  });

  describe('findAll()', () => {
    it('should retrieve all pantry items', async () => {
      const food = createTestFood({ id: 'pantry-all-food' });
      await foodRepository.save(food);

      await pantryRepository.save(createTestPantryItem({ id: 'item-all-1', food }));
      await pantryRepository.save(createTestPantryItem({ id: 'item-all-2', food }));

      const allItems = await pantryRepository.findAll();

      expect(allItems.length).toBe(2);
      expect(allItems.some((i) => i.id === 'item-all-1')).toBe(true);
      expect(allItems.some((i) => i.id === 'item-all-2')).toBe(true);
    });
  });

  describe('findByFoodId()', () => {
    it('should find all items for a food', async () => {
      const food = createTestFood({ id: 'food-for-items' });
      await foodRepository.save(food);

      await pantryRepository.save(createTestPantryItem({ id: 'item-food-1', food }));
      await pantryRepository.save(createTestPantryItem({ id: 'item-food-2', food }));

      const items = await pantryRepository.findByFoodId('food-for-items');

      expect(items.length).toBe(2);
      expect(items.some((i) => i.id === 'item-food-1')).toBe(true);
      expect(items.some((i) => i.id === 'item-food-2')).toBe(true);
    });

    it('should return empty array when no items found', async () => {
      const items = await pantryRepository.findByFoodId('food-with-no-items');
      expect(items).toEqual([]);
    });
  });

  describe('find() with specifications', () => {
    beforeEach(async () => {
      const food = createTestFood({ id: 'spec-test-food' });
      await foodRepository.save(food);

      const freshItem = createTestPantryItem({
        id: 'fresh-item',
        food,
        location: 'Kitchen',
        expiration: {
          date: daysFromNow(10),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      const expiringItem = createTestPantryItem({
        id: 'expiring-item',
        food,
        location: 'Freezer',
        expiration: {
          date: daysFromNow(1),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      const expiredItem = createTestPantryItem({
        id: 'expired-item',
        food,
        location: 'Pantry',
        expiration: {
          date: daysAgo(1),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      await pantryRepository.save(freshItem);
      await pantryRepository.save(expiringItem);
      await pantryRepository.save(expiredItem);
    });

    it('should find expired items', async () => {
      const spec = PantryItemSpecifications.expired();
      const results = await pantryRepository.find(spec);

      expect(results.some((i) => i.id === 'expired-item')).toBe(true);
      expect(results.some((i) => i.id === 'fresh-item')).toBe(false);
    });

    it('should find non-expired items', async () => {
      const spec = PantryItemSpecifications.notExpired();
      const results = await pantryRepository.find(spec);

      expect(results.some((i) => i.id === 'fresh-item')).toBe(true);
      expect(results.some((i) => i.id === 'expiring-item')).toBe(true);
      expect(results.some((i) => i.id === 'expired-item')).toBe(false);
    });

    it('should find items by location', async () => {
      const spec = PantryItemSpecifications.byLocation('Kitchen');
      const results = await pantryRepository.find(spec);

      expect(results.some((i) => i.id === 'fresh-item')).toBe(true);
      expect(results.some((i) => i.id === 'expiring-item')).toBe(false);
      expect(results.some((i) => i.id === 'expired-item')).toBe(false);
    });

    it('should combine specifications', async () => {
      const spec = PantryItemSpecifications.notExpired().and(
        PantryItemSpecifications.byLocation('Kitchen'),
      );
      const results = await pantryRepository.find(spec);

      expect(results.length).toBe(1);
      expect(results.some((i) => i.id === 'fresh-item')).toBe(true);
    });

    it('should find by food ID', async () => {
      const spec = PantryItemSpecifications.byFoodId('spec-test-food');
      const results = await pantryRepository.find(spec);

      expect(results.length).toBe(3);
    });
  });

  describe('update()', () => {
    it('should update a pantry item', async () => {
      const food = createTestFood({ id: 'update-item-food' });
      await foodRepository.save(food);

      const original = createTestPantryItem({
        id: 'update-item-test',
        food,
        location: 'Kitchen',
      });
      await pantryRepository.save(original);

      const updated = original.updateLocation('Freezer');
      await pantryRepository.update(updated);

      const retrieved = await pantryRepository.findById('update-item-test');
      expect(retrieved.location).toBe('Freezer');
    });

    it('should throw when updating nonexistent item', async () => {
      const food = createTestFood({ id: 'dummy-food' });
      const item = createTestPantryItem({
        id: 'nonexistent-update-item',
        food,
      });

      await expect(pantryRepository.update(item)).rejects.toThrow(
        'PantryItem with ID nonexistent-update-item not found for update',
      );
    });
  });

  describe('delete()', () => {
    it('should delete a pantry item', async () => {
      const food = createTestFood({ id: 'delete-item-food' });
      await foodRepository.save(food);

      const item = createTestPantryItem({
        id: 'delete-item-test',
        food,
      });
      await pantryRepository.save(item);

      await pantryRepository.delete('delete-item-test');

      const result = await pantryRepository.findByIdOrNull('delete-item-test');
      expect(result).toBeNull();
    });
  });

  describe('count()', () => {
    beforeEach(async () => {
      const food = createTestFood({ id: 'count-item-food' });
      await foodRepository.save(food);

      await pantryRepository.save(
        createTestPantryItem({
          id: 'count-item-1',
          food,
          expiration: {
            date: daysFromNow(10),
            type: ExpirationType.BEST_BEFORE,
          },
        }),
      );
      await pantryRepository.save(
        createTestPantryItem({
          id: 'count-item-2',
          food,
          expiration: {
            date: daysFromNow(10),
            type: ExpirationType.BEST_BEFORE,
          },
        }),
      );
    });

    it('should count items matching specification', async () => {
      const spec = PantryItemSpecifications.notExpired();
      const count = await pantryRepository.count(spec);

      expect(count).toBe(2);
    });
  });

  describe('exists()', () => {
    beforeEach(async () => {
      const food = createTestFood({ id: 'exists-item-food' });
      await foodRepository.save(food);

      await pantryRepository.save(createTestPantryItem({ id: 'exists-item-test', food }));
    });

    it('should return true for existing item', async () => {
      const exists = await pantryRepository.exists('exists-item-test');
      expect(exists).toBe(true);
    });

    it('should return false for nonexistent item', async () => {
      const exists = await pantryRepository.exists('nonexistent-item-exists');
      expect(exists).toBe(false);
    });
  });

  describe('deleteByFoodId()', () => {
    it('should delete all items for a food', async () => {
      const food = createTestFood({ id: 'cascade-delete-food' });
      await foodRepository.save(food);

      await pantryRepository.save(createTestPantryItem({ id: 'cascade-item-1', food }));
      await pantryRepository.save(createTestPantryItem({ id: 'cascade-item-2', food }));

      await pantryRepository.deleteByFoodId('cascade-delete-food');

      const items = await pantryRepository.findByFoodId('cascade-delete-food');
      expect(items).toHaveLength(0);
    });
  });

  describe('findWithPagination()', () => {
    beforeEach(async () => {
      const food = createTestFood({ id: 'pagination-item-food' });
      await foodRepository.save(food);

      for (let i = 1; i <= 5; i++) {
        await pantryRepository.save(
          createTestPantryItem({
            id: `pagination-item-${i}`,
            food,
          }),
        );
      }
    });

    it('should return paginated results', async () => {
      const spec = PantryItemSpecifications.notExpired();
      const result = await pantryRepository.findWithPagination(spec, 0, 2);

      expect(result.items.length).toBe(2);
      expect(result.total).toBe(5);
    });

    it('should skip items correctly', async () => {
      const spec = PantryItemSpecifications.notExpired();
      const page1 = await pantryRepository.findWithPagination(spec, 0, 2);
      const page2 = await pantryRepository.findWithPagination(spec, 2, 2);

      const page1Ids = page1.items.map((i) => i.id);
      const page2Ids = page2.items.map((i) => i.id);

      expect(page1Ids).not.toEqual(page2Ids);
    });
  });

  describe('Cascade delete via foreign key', () => {
    it('should cascade delete pantry items when food is deleted', async () => {
      const food = createTestFood({ id: 'fk-cascade-food' });
      await foodRepository.save(food);

      await pantryRepository.save(createTestPantryItem({ id: 'fk-cascade-item-1', food }));
      await pantryRepository.save(createTestPantryItem({ id: 'fk-cascade-item-2', food }));

      // Delete food - should cascade to pantry items
      await foodRepository.delete('fk-cascade-food');

      // Pantry items should be gone due to ON DELETE CASCADE
      const items = await pantryRepository.findByFoodId('fk-cascade-food');
      expect(items).toHaveLength(0);
    });
  });
});
