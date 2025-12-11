/**
 * FoodMapper unit tests.
 */

import { FoodMapper } from '@infrastructure/mappers/FoodMapper';

import { createTestFood } from '../../helpers';

describe('FoodMapper', () => {
  describe('toPersistence()', () => {
    it('should convert Food entity to database row', () => {
      const food = createTestFood();
      const row = FoodMapper.toPersistence(food);

      expect(row.id).toBe(food.id);
      expect(row.name).toBe(food.name);
      expect(row.description).toBe(food.description);
      expect(row.serving_size).toBe(food.servingSize);
      expect(row.state).toBe(food.state);
      expect(row.category).toBe(food.category);
      expect(row.default_quantity_type).toBe(food.defaultQuantityType);
      expect(row.default_unit).toBe(food.defaultUnit);
      expect(row.brand).toBe(food.brand);
      expect(row.barcode).toBe(food.barcode);
    });

    it('should flatten macronutrients', () => {
      const food = createTestFood();
      const row = FoodMapper.toPersistence(food);

      expect(row.macronutrients_calories).toBe(food.macronutrients.calories);
      expect(row.macronutrients_protein).toBe(food.macronutrients.protein);
      expect(row.macronutrients_carbohydrates).toBe(food.macronutrients.carbohydrates);
      expect(row.macronutrients_fat).toBe(food.macronutrients.fat);
    });

    it('should convert dates to ISO strings', () => {
      const food = createTestFood();
      const row = FoodMapper.toPersistence(food);

      expect(typeof row.created_at).toBe('string');
      expect(typeof row.updated_at).toBe('string');
      expect(row.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(row.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should handle optional fields', () => {
      const food = createTestFood({ description: undefined, brand: undefined });
      const row = FoodMapper.toPersistence(food);

      expect(row.description).toBeUndefined();
      expect(row.brand).toBeUndefined();
    });
  });

  describe('toDomain()', () => {
    it('should convert database row to Food entity', () => {
      const food = createTestFood();
      const row = FoodMapper.toPersistence(food);

      const restoredFood = FoodMapper.toDomain(row);

      expect(restoredFood.id).toBe(food.id);
      expect(restoredFood.name).toBe(food.name);
      expect(restoredFood.description).toBe(food.description);
      expect(restoredFood.servingSize).toBe(food.servingSize);
      expect(restoredFood.state).toBe(food.state);
      expect(restoredFood.category).toBe(food.category);
    });

    it('should reconstruct macronutrients', () => {
      const food = createTestFood();
      const row = FoodMapper.toPersistence(food);

      const restoredFood = FoodMapper.toDomain(row);

      expect(restoredFood.macronutrients.calories).toBe(food.macronutrients.calories);
      expect(restoredFood.macronutrients.protein).toBe(food.macronutrients.protein);
      expect(restoredFood.macronutrients.carbohydrates).toBe(food.macronutrients.carbohydrates);
      expect(restoredFood.macronutrients.fat).toBe(food.macronutrients.fat);
    });

    it('should convert ISO string dates back to Date objects', () => {
      const food = createTestFood();
      const row = FoodMapper.toPersistence(food);

      const restoredFood = FoodMapper.toDomain(row);

      expect(restoredFood.createdAt instanceof Date).toBe(true);
      expect(restoredFood.updatedAt instanceof Date).toBe(true);
    });

    it('should handle optional fields', () => {
      const food = createTestFood({ description: undefined, brand: undefined });
      const row = FoodMapper.toPersistence(food);

      const restoredFood = FoodMapper.toDomain(row);

      expect(restoredFood.description).toBeUndefined();
      expect(restoredFood.brand).toBeUndefined();
    });
  });

  describe('Round-trip conversion', () => {
    it('should preserve data through to-domain-to-persistence cycle', () => {
      const food = createTestFood();

      const row = FoodMapper.toPersistence(food);
      const restoredFood = FoodMapper.toDomain(row);
      const rerow = FoodMapper.toPersistence(restoredFood);

      expect(rerow.id).toBe(row.id);
      expect(rerow.name).toBe(row.name);
      expect(rerow.macronutrients_calories).toBe(row.macronutrients_calories);
    });
  });

  describe('getColumnList()', () => {
    it('should return comma-separated column names', () => {
      const columns = FoodMapper.getColumnList();

      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('macronutrients_calories');
    });
  });

  describe('getParameterPlaceholders()', () => {
    it('should return correct number of placeholders', () => {
      const placeholders = FoodMapper.getParameterPlaceholders();
      const count = placeholders.split(',').length;

      expect(count).toBe(16); // 16 columns in Food
    });
  });

  describe('getInsertParameters()', () => {
    it('should return parameters in correct order', () => {
      const food = createTestFood();
      const params = FoodMapper.getInsertParameters(food);

      expect(params[0]).toBe(food.id);
      expect(params[1]).toBe(food.name);
      expect(params.length).toBe(16);
    });
  });

  describe('getUpdateParameters()', () => {
    it('should return parameters excluding ID at the end', () => {
      const food = createTestFood();
      const params = FoodMapper.getUpdateParameters(food);

      expect(params[params.length - 1]).toBe(food.id); // ID should be last
      expect(params.length).toBe(15); // 15 columns to update + 1 ID for WHERE clause
    });
  });
});
