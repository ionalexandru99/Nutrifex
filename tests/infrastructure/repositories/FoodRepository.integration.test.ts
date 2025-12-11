/**
 * FoodRepository integration tests.
 *
 * These tests use better-sqlite3 to test real SQL behavior in Node.js.
 * The SQL queries are identical to what expo-sqlite executes in production.
 */

import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodSpecifications } from '@domain/specifications/FoodSpecifications';

import {
  createTestFood,
  createTestDatabase,
  TestDatabase,
  TestFoodRepository,
} from '../../helpers';

describe('FoodRepository Integration Tests', () => {
  let db: TestDatabase;
  let repository: TestFoodRepository;

  beforeEach(async () => {
    // Fresh in-memory database for each test
    db = await createTestDatabase();
    repository = new TestFoodRepository(db);
  });

  afterEach(async () => {
    await db.close();
  });

  describe('save() and findById()', () => {
    it('should save and retrieve a food', async () => {
      const food = createTestFood({ id: 'integration-test-1' });
      await repository.save(food);

      const retrieved = await repository.findById('integration-test-1');

      expect(retrieved.id).toBe(food.id);
      expect(retrieved.name).toBe(food.name);
      expect(retrieved.macronutrients.calories).toBe(food.macronutrients.calories);
    });

    it('should throw when food not found', async () => {
      await expect(repository.findById('nonexistent-food')).rejects.toThrow(
        'Food with ID nonexistent-food not found',
      );
    });

    it('should return null from findByIdOrNull when not found', async () => {
      const result = await repository.findByIdOrNull('nonexistent-food-2');
      expect(result).toBeNull();
    });
  });

  describe('findAll()', () => {
    it('should retrieve all foods', async () => {
      await repository.save(createTestFood({ id: 'food-all-1' }));
      await repository.save(createTestFood({ id: 'food-all-2' }));

      const allFoods = await repository.findAll();

      expect(allFoods.length).toBe(2);
      expect(allFoods.some((f) => f.id === 'food-all-1')).toBe(true);
      expect(allFoods.some((f) => f.id === 'food-all-2')).toBe(true);
    });
  });

  describe('find() with specifications', () => {
    beforeEach(async () => {
      await repository.save(
        createTestFood({
          id: 'fruit-apple',
          name: 'Apple',
          category: FoodCategory.FRUIT,
          macronutrients: { calories: 52, protein: 0.3, carbohydrates: 14, fat: 0.2 },
        }),
      );
      await repository.save(
        createTestFood({
          id: 'veggie-carrot',
          name: 'Carrot',
          category: FoodCategory.VEGETABLE,
          macronutrients: { calories: 41, protein: 0.9, carbohydrates: 10, fat: 0.2 },
        }),
      );
    });

    it('should find foods by category', async () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const results = await repository.find(spec);

      expect(results.some((f) => f.id === 'fruit-apple')).toBe(true);
      expect(results.some((f) => f.id === 'veggie-carrot')).toBe(false);
    });

    it('should find foods by name search', async () => {
      const spec = FoodSpecifications.byNameSearch('apple');
      const results = await repository.find(spec);

      expect(results.some((f) => f.id === 'fruit-apple')).toBe(true);
      expect(results.some((f) => f.id === 'veggie-carrot')).toBe(false);
    });

    it('should find foods with calorie range', async () => {
      const spec = FoodSpecifications.withMinCalories(40).and(
        FoodSpecifications.withMaxCalories(60),
      );
      const results = await repository.find(spec);

      expect(results.some((f) => f.id === 'fruit-apple')).toBe(true);
      expect(results.some((f) => f.id === 'veggie-carrot')).toBe(true);
    });

    it('should find foods with combined specifications', async () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT).and(
        FoodSpecifications.byNameSearch('apple'),
      );
      const results = await repository.find(spec);

      expect(results.some((f) => f.id === 'fruit-apple')).toBe(true);
      expect(results.some((f) => f.id === 'veggie-carrot')).toBe(false);
    });

    it('should find foods using OR specification', async () => {
      // Note: Using different spec types to avoid param name collision
      // (two byCategory specs would both use :category param name)
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT).or(
        FoodSpecifications.byNameSearch('carrot'),
      );
      const results = await repository.find(spec);

      expect(results.length).toBe(2);
      expect(results.some((f) => f.id === 'fruit-apple')).toBe(true);
      expect(results.some((f) => f.id === 'veggie-carrot')).toBe(true);
    });
  });

  describe('update()', () => {
    it('should update a food', async () => {
      const original = createTestFood({ id: 'update-test-1', name: 'Original' });
      await repository.save(original);

      const updated = original.updateName('Updated Name');
      await repository.update(updated);

      const retrieved = await repository.findById('update-test-1');
      expect(retrieved.name).toBe('Updated Name');
    });

    it('should throw when updating nonexistent food', async () => {
      const food = createTestFood({ id: 'nonexistent-update' });

      await expect(repository.update(food)).rejects.toThrow(
        'Food with ID nonexistent-update not found for update',
      );
    });
  });

  describe('delete()', () => {
    it('should delete a food', async () => {
      const food = createTestFood({ id: 'delete-test-1' });
      await repository.save(food);

      await repository.delete('delete-test-1');

      const result = await repository.findByIdOrNull('delete-test-1');
      expect(result).toBeNull();
    });
  });

  describe('count()', () => {
    beforeEach(async () => {
      await repository.save(
        createTestFood({
          id: 'count-fruit-1',
          category: FoodCategory.FRUIT,
        }),
      );
      await repository.save(
        createTestFood({
          id: 'count-fruit-2',
          category: FoodCategory.FRUIT,
        }),
      );
      await repository.save(
        createTestFood({
          id: 'count-veggie-1',
          category: FoodCategory.VEGETABLE,
        }),
      );
    });

    it('should count foods matching specification', async () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const count = await repository.count(spec);

      expect(count).toBe(2);
    });
  });

  describe('exists()', () => {
    beforeEach(async () => {
      await repository.save(createTestFood({ id: 'exists-test-1' }));
    });

    it('should return true for existing food', async () => {
      const exists = await repository.exists('exists-test-1');
      expect(exists).toBe(true);
    });

    it('should return false for nonexistent food', async () => {
      const exists = await repository.exists('nonexistent-food-exists');
      expect(exists).toBe(false);
    });
  });

  describe('findWithPagination()', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 5; i++) {
        await repository.save(
          createTestFood({
            id: `pagination-test-${i}`,
            name: `Food ${i}`,
            category: FoodCategory.FRUIT,
          }),
        );
      }
    });

    it('should return paginated results', async () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const result = await repository.findWithPagination(spec, 0, 2);

      expect(result.items.length).toBe(2);
      expect(result.total).toBe(5);
    });

    it('should skip items correctly', async () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const page1 = await repository.findWithPagination(spec, 0, 2);
      const page2 = await repository.findWithPagination(spec, 2, 2);

      // Ensure different pages have different items
      const page1Ids = page1.items.map((f) => f.id);
      const page2Ids = page2.items.map((f) => f.id);

      expect(page1Ids).not.toEqual(page2Ids);
    });

    it('should handle last page with fewer items', async () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const lastPage = await repository.findWithPagination(spec, 4, 2);

      expect(lastPage.items.length).toBe(1);
      expect(lastPage.total).toBe(5);
    });
  });
});
