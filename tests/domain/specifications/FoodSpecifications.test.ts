/**
 * FoodSpecifications unit tests.
 */

import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodState } from '@domain/enums/FoodState';
import { FoodSpecifications } from '@domain/specifications/FoodSpecifications';

import { createTestFood } from '../../helpers';

describe('FoodSpecifications', () => {
  describe('byId()', () => {
    it('should create a specification for finding by ID', () => {
      const spec = FoodSpecifications.byId('food-123');
      const food = createTestFood({ id: 'food-123' });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject foods with different IDs', () => {
      const spec = FoodSpecifications.byId('food-123');
      const food = createTestFood({ id: 'food-456' });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });

    it('should generate WHERE clause', () => {
      const spec = FoodSpecifications.byId('food-123');
      const clause = spec.toWhereClause();

      expect(clause.clause).toBe('id = :id');
      expect(clause.params.id).toBe('food-123');
    });
  });

  describe('byCategory()', () => {
    it('should create a specification for finding by category', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const food = createTestFood({ category: FoodCategory.FRUIT });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject foods with different categories', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const food = createTestFood({ category: FoodCategory.VEGETABLE });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });

    it('should generate WHERE clause', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT);
      const clause = spec.toWhereClause();

      expect(clause.clause).toBe('category = :category');
      expect(clause.params.category).toBe(FoodCategory.FRUIT);
    });
  });

  describe('byState()', () => {
    it('should create a specification for finding by state', () => {
      const spec = FoodSpecifications.byState(FoodState.SOLID);
      const food = createTestFood({ state: FoodState.SOLID });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject foods with different states', () => {
      const spec = FoodSpecifications.byState(FoodState.SOLID);
      const food = createTestFood({ state: FoodState.LIQUID });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });
  });

  describe('byNameSearch()', () => {
    it('should find foods by substring match', () => {
      const spec = FoodSpecifications.byNameSearch('apple');
      const food = createTestFood({ name: 'Green Apple' });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should be case-insensitive', () => {
      const spec = FoodSpecifications.byNameSearch('APPLE');
      const food = createTestFood({ name: 'green apple' });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject non-matching names', () => {
      const spec = FoodSpecifications.byNameSearch('apple');
      const food = createTestFood({ name: 'Banana' });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });

    it('should generate WHERE clause with LIKE', () => {
      const spec = FoodSpecifications.byNameSearch('apple');
      const clause = spec.toWhereClause();

      expect(clause.clause).toBe('LOWER(name) LIKE :searchTerm');
      expect(clause.params.searchTerm).toBe('%apple%');
    });
  });

  describe('withMinCalories()', () => {
    it('should find foods with enough calories', () => {
      const spec = FoodSpecifications.withMinCalories(200);
      const food = createTestFood({
        macronutrients: { calories: 250, protein: 10, carbohydrates: 25, fat: 8 },
      });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject foods with insufficient calories', () => {
      const spec = FoodSpecifications.withMinCalories(300);
      const food = createTestFood({
        macronutrients: { calories: 250, protein: 10, carbohydrates: 25, fat: 8 },
      });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });

    it('should accept exact calorie match', () => {
      const spec = FoodSpecifications.withMinCalories(200);
      const food = createTestFood({
        macronutrients: { calories: 200, protein: 10, carbohydrates: 25, fat: 8 },
      });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });
  });

  describe('withMaxCalories()', () => {
    it('should find foods with acceptable calories', () => {
      const spec = FoodSpecifications.withMaxCalories(300);
      const food = createTestFood({
        macronutrients: { calories: 250, protein: 10, carbohydrates: 25, fat: 8 },
      });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject foods with too many calories', () => {
      const spec = FoodSpecifications.withMaxCalories(200);
      const food = createTestFood({
        macronutrients: { calories: 250, protein: 10, carbohydrates: 25, fat: 8 },
      });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });
  });

  describe('byBrand()', () => {
    it('should find foods by brand', () => {
      const spec = FoodSpecifications.byBrand('Organic Co');
      const food = createTestFood({ brand: 'Organic Co' });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject different brands', () => {
      const spec = FoodSpecifications.byBrand('Organic Co');
      const food = createTestFood({ brand: 'Another Brand' });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });
  });

  describe('byBarcode()', () => {
    it('should find foods by barcode', () => {
      const spec = FoodSpecifications.byBarcode('1234567890');
      const food = createTestFood({ barcode: '1234567890' });

      expect(spec.isSatisfiedBy(food)).toBe(true);
    });

    it('should reject different barcodes', () => {
      const spec = FoodSpecifications.byBarcode('1234567890');
      const food = createTestFood({ barcode: '0987654321' });

      expect(spec.isSatisfiedBy(food)).toBe(false);
    });
  });

  describe('Composite specifications', () => {
    it('should combine with AND', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT).and(
        FoodSpecifications.byState(FoodState.SOLID),
      );
      const matchingFood = createTestFood({
        category: FoodCategory.FRUIT,
        state: FoodState.SOLID,
      });
      const nonMatchingFood = createTestFood({
        category: FoodCategory.VEGETABLE,
        state: FoodState.SOLID,
      });

      expect(spec.isSatisfiedBy(matchingFood)).toBe(true);
      expect(spec.isSatisfiedBy(nonMatchingFood)).toBe(false);
    });

    it('should combine with OR', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT).or(
        FoodSpecifications.byCategory(FoodCategory.VEGETABLE),
      );
      const fruitFood = createTestFood({ category: FoodCategory.FRUIT });
      const veggieFood = createTestFood({ category: FoodCategory.VEGETABLE });
      const otherFood = createTestFood({ category: FoodCategory.OTHER });

      expect(spec.isSatisfiedBy(fruitFood)).toBe(true);
      expect(spec.isSatisfiedBy(veggieFood)).toBe(true);
      expect(spec.isSatisfiedBy(otherFood)).toBe(false);
    });

    it('should negate with NOT', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT).not();
      const fruitFood = createTestFood({ category: FoodCategory.FRUIT });
      const otherFood = createTestFood({ category: FoodCategory.OTHER });

      expect(spec.isSatisfiedBy(fruitFood)).toBe(false);
      expect(spec.isSatisfiedBy(otherFood)).toBe(true);
    });

    it('should combine multiple conditions', () => {
      const spec = FoodSpecifications.byCategory(FoodCategory.FRUIT)
        .and(FoodSpecifications.withMinCalories(100))
        .and(FoodSpecifications.withMaxCalories(500));

      const validFood = createTestFood({
        category: FoodCategory.FRUIT,
        macronutrients: { calories: 250, protein: 10, carbohydrates: 25, fat: 8 },
      });
      const tooLowCalFood = createTestFood({
        category: FoodCategory.FRUIT,
        macronutrients: { calories: 50, protein: 10, carbohydrates: 25, fat: 8 },
      });

      expect(spec.isSatisfiedBy(validFood)).toBe(true);
      expect(spec.isSatisfiedBy(tooLowCalFood)).toBe(false);
    });
  });
});
