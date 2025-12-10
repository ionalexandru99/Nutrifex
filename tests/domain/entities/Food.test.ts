import { Food, CreateFoodInput, FoodPersistenceData } from '@domain/entities/Food';
import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodState } from '@domain/enums/FoodState';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';

import { createTestFood, DEFAULT_FOOD_INPUT, DEFAULT_MACRONUTRIENTS } from '../../helpers';

describe('Food', () => {
  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create a valid Food instance', () => {
        const food = Food.create(DEFAULT_FOOD_INPUT);

        expect(food.id).toBe(DEFAULT_FOOD_INPUT.id);
        expect(food.name).toBe(DEFAULT_FOOD_INPUT.name);
        expect(food.description).toBe(DEFAULT_FOOD_INPUT.description);
        expect(food.servingSize).toBe(DEFAULT_FOOD_INPUT.servingSize);
        expect(food.state).toBe(DEFAULT_FOOD_INPUT.state);
        expect(food.category).toBe(DEFAULT_FOOD_INPUT.category);
        expect(food.defaultQuantityType).toBe(DEFAULT_FOOD_INPUT.defaultQuantityType);
        expect(food.defaultUnit).toBe(DEFAULT_FOOD_INPUT.defaultUnit);
        expect(food.brand).toBe(DEFAULT_FOOD_INPUT.brand);
        expect(food.barcode).toBe(DEFAULT_FOOD_INPUT.barcode);
      });

      it('should set createdAt and updatedAt automatically', () => {
        const before = new Date();
        const food = Food.create(DEFAULT_FOOD_INPUT);
        const after = new Date();

        expect(food.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(food.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
        expect(food.updatedAt.getTime()).toBe(food.createdAt.getTime());
      });

      it('should create macronutrients correctly', () => {
        const food = createTestFood();

        expect(food.macronutrients.calories).toBe(DEFAULT_MACRONUTRIENTS.calories);
        expect(food.macronutrients.protein).toBe(DEFAULT_MACRONUTRIENTS.protein);
        expect(food.macronutrients.carbohydrates).toBe(DEFAULT_MACRONUTRIENTS.carbohydrates);
        expect(food.macronutrients.fat).toBe(DEFAULT_MACRONUTRIENTS.fat);
      });

      it('should throw on empty ID', () => {
        expect(() => createTestFood({ id: '' })).toThrow('Food ID is required');
      });

      it('should throw on whitespace-only ID', () => {
        expect(() => createTestFood({ id: '   ' })).toThrow('Food ID is required');
      });

      it('should throw on empty name', () => {
        expect(() => createTestFood({ name: '' })).toThrow('Food name is required');
      });

      it('should throw on whitespace-only name', () => {
        expect(() => createTestFood({ name: '   ' })).toThrow('Food name is required');
      });

      it('should throw on name > 200 characters', () => {
        const longName = 'a'.repeat(201);
        expect(() => createTestFood({ name: longName })).toThrow(
          'Food name must be 200 characters or less',
        );
      });

      it('should allow name with exactly 200 characters', () => {
        const exactName = 'a'.repeat(200);
        const food = createTestFood({ name: exactName });

        expect(food.name).toBe(exactName);
      });

      it('should throw on zero servingSize', () => {
        expect(() => createTestFood({ servingSize: 0 })).toThrow(
          'Serving size must be greater than 0',
        );
      });

      it('should throw on negative servingSize', () => {
        expect(() => createTestFood({ servingSize: -1 })).toThrow(
          'Serving size must be greater than 0',
        );
      });

      it('should allow optional fields to be undefined', () => {
        const input: CreateFoodInput = {
          id: 'food-1',
          name: 'Test Food',
          macronutrients: DEFAULT_MACRONUTRIENTS,
          servingSize: 100,
          state: FoodState.SOLID,
          category: FoodCategory.OTHER,
          defaultQuantityType: QuantityType.BY_WEIGHT,
          defaultUnit: MeasurementUnit.GRAM,
        };
        const food = Food.create(input);

        expect(food.description).toBeUndefined();
        expect(food.brand).toBeUndefined();
        expect(food.barcode).toBeUndefined();
      });
    });

    describe('fromPersistence()', () => {
      it('should reconstruct from persistence data', () => {
        const persistenceData: FoodPersistenceData = {
          id: 'food-1',
          name: 'Persisted Food',
          description: 'A persisted food item',
          macronutrients: DEFAULT_MACRONUTRIENTS,
          servingSize: 100,
          state: FoodState.LIQUID,
          category: FoodCategory.BEVERAGE,
          defaultQuantityType: QuantityType.BY_VOLUME,
          defaultUnit: MeasurementUnit.MILLILITER,
          brand: 'Test Brand',
          barcode: '123456',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
        };

        const food = Food.fromPersistence(persistenceData);

        expect(food.id).toBe(persistenceData.id);
        expect(food.name).toBe(persistenceData.name);
        expect(food.state).toBe(FoodState.LIQUID);
        expect(food.category).toBe(FoodCategory.BEVERAGE);
      });

      it('should parse ISO date strings correctly', () => {
        const persistenceData: FoodPersistenceData = {
          id: 'food-1',
          name: 'Test Food',
          macronutrients: DEFAULT_MACRONUTRIENTS,
          servingSize: 100,
          state: FoodState.SOLID,
          category: FoodCategory.OTHER,
          defaultQuantityType: QuantityType.BY_WEIGHT,
          defaultUnit: MeasurementUnit.GRAM,
          createdAt: '2025-01-01T12:00:00.000Z',
          updatedAt: '2025-01-02T12:00:00.000Z',
        };

        const food = Food.fromPersistence(persistenceData);

        expect(food.createdAt.toISOString()).toBe('2025-01-01T12:00:00.000Z');
        expect(food.updatedAt.toISOString()).toBe('2025-01-02T12:00:00.000Z');
      });
    });
  });

  describe('Getters', () => {
    it('should return correct values for all properties', () => {
      const food = createTestFood();

      expect(food.id).toBe(DEFAULT_FOOD_INPUT.id);
      expect(food.name).toBe(DEFAULT_FOOD_INPUT.name);
      expect(food.description).toBe(DEFAULT_FOOD_INPUT.description);
      expect(food.servingSize).toBe(DEFAULT_FOOD_INPUT.servingSize);
      expect(food.state).toBe(DEFAULT_FOOD_INPUT.state);
      expect(food.category).toBe(DEFAULT_FOOD_INPUT.category);
      expect(food.defaultQuantityType).toBe(DEFAULT_FOOD_INPUT.defaultQuantityType);
      expect(food.defaultUnit).toBe(DEFAULT_FOOD_INPUT.defaultUnit);
      expect(food.brand).toBe(DEFAULT_FOOD_INPUT.brand);
      expect(food.barcode).toBe(DEFAULT_FOOD_INPUT.barcode);
    });

    it('should return macronutrients as Macronutrients instance', () => {
      const food = createTestFood();
      const macros = food.macronutrients;

      expect(macros.calories).toBe(DEFAULT_MACRONUTRIENTS.calories);
      expect(typeof macros.calculateForQuantity).toBe('function');
    });
  });

  describe('Business Logic', () => {
    describe('calculateMacronutrientsForQuantity()', () => {
      it('should calculate correctly for 1x serving', () => {
        const food = createTestFood({ servingSize: 100 });
        const macros = food.calculateMacronutrientsForQuantity(100);

        expect(macros.calories).toBe(DEFAULT_MACRONUTRIENTS.calories);
        expect(macros.protein).toBe(DEFAULT_MACRONUTRIENTS.protein);
      });

      it('should calculate correctly for 2x serving', () => {
        const food = createTestFood({
          servingSize: 100,
          macronutrients: { calories: 100, protein: 10, carbohydrates: 20, fat: 5 },
        });
        const macros = food.calculateMacronutrientsForQuantity(200);

        expect(macros.calories).toBe(200);
        expect(macros.protein).toBe(20);
        expect(macros.carbohydrates).toBe(40);
        expect(macros.fat).toBe(10);
      });

      it('should calculate correctly for 0.5x serving', () => {
        const food = createTestFood({
          servingSize: 100,
          macronutrients: { calories: 100, protein: 10, carbohydrates: 20, fat: 5 },
        });
        const macros = food.calculateMacronutrientsForQuantity(50);

        expect(macros.calories).toBe(50);
        expect(macros.protein).toBe(5);
        expect(macros.carbohydrates).toBe(10);
        expect(macros.fat).toBe(2.5);
      });

      it('should throw on zero quantity', () => {
        const food = createTestFood();

        expect(() => food.calculateMacronutrientsForQuantity(0)).toThrow(
          'Quantity must be greater than 0',
        );
      });

      it('should throw on negative quantity', () => {
        const food = createTestFood();

        expect(() => food.calculateMacronutrientsForQuantity(-1)).toThrow(
          'Quantity must be greater than 0',
        );
      });
    });
  });

  describe('Update Methods (Immutability)', () => {
    describe('updateName()', () => {
      it('should return new instance with updated name', () => {
        const food = createTestFood({ name: 'Original Name' });
        const updated = food.updateName('New Name');

        expect(updated.name).toBe('New Name');
      });

      it('should keep original instance unchanged', () => {
        const food = createTestFood({ name: 'Original Name' });
        food.updateName('New Name');

        expect(food.name).toBe('Original Name');
      });

      it('should update updatedAt timestamp', () => {
        const food = createTestFood();
        const originalUpdatedAt = food.updatedAt;

        // Small delay to ensure different timestamp
        const updated = food.updateName('New Name');

        expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
      });

      it('should throw on empty name', () => {
        const food = createTestFood();

        expect(() => food.updateName('')).toThrow('Food name is required');
      });

      it('should throw on name > 200 characters', () => {
        const food = createTestFood();
        const longName = 'a'.repeat(201);

        expect(() => food.updateName(longName)).toThrow('Food name must be 200 characters or less');
      });

      it('should preserve other properties', () => {
        const food = createTestFood();
        const updated = food.updateName('New Name');

        expect(updated.id).toBe(food.id);
        expect(updated.description).toBe(food.description);
        expect(updated.servingSize).toBe(food.servingSize);
        expect(updated.state).toBe(food.state);
        expect(updated.category).toBe(food.category);
      });
    });

    describe('updateDescription()', () => {
      it('should return new instance with updated description', () => {
        const food = createTestFood({ description: 'Original' });
        const updated = food.updateDescription('New Description');

        expect(updated.description).toBe('New Description');
      });

      it('should allow setting to undefined', () => {
        const food = createTestFood({ description: 'Some description' });
        const updated = food.updateDescription(undefined);

        expect(updated.description).toBeUndefined();
      });

      it('should keep original instance unchanged', () => {
        const food = createTestFood({ description: 'Original' });
        food.updateDescription('New Description');

        expect(food.description).toBe('Original');
      });
    });

    describe('updateMacronutrients()', () => {
      it('should return new instance with updated macros', () => {
        const food = createTestFood();
        const newMacros = { calories: 500, protein: 30, carbohydrates: 50, fat: 20 };
        const updated = food.updateMacronutrients(newMacros);

        expect(updated.macronutrients.calories).toBe(500);
        expect(updated.macronutrients.protein).toBe(30);
        expect(updated.macronutrients.carbohydrates).toBe(50);
        expect(updated.macronutrients.fat).toBe(20);
      });

      it('should validate new macros (throw on negative)', () => {
        const food = createTestFood();

        expect(() =>
          food.updateMacronutrients({
            calories: -1,
            protein: 10,
            carbohydrates: 20,
            fat: 5,
          }),
        ).toThrow('Calories cannot be negative');
      });

      it('should keep original instance unchanged', () => {
        const food = createTestFood();
        const originalCalories = food.macronutrients.calories;
        food.updateMacronutrients({ calories: 999, protein: 99, carbohydrates: 99, fat: 99 });

        expect(food.macronutrients.calories).toBe(originalCalories);
      });
    });

    describe('updateCategory()', () => {
      it('should return new instance with updated category', () => {
        const food = createTestFood({ category: FoodCategory.OTHER });
        const updated = food.updateCategory(FoodCategory.FRUIT);

        expect(updated.category).toBe(FoodCategory.FRUIT);
      });

      it('should keep original instance unchanged', () => {
        const food = createTestFood({ category: FoodCategory.OTHER });
        food.updateCategory(FoodCategory.FRUIT);

        expect(food.category).toBe(FoodCategory.OTHER);
      });
    });

    describe('updateState()', () => {
      it('should return new instance with updated state', () => {
        const food = createTestFood({ state: FoodState.SOLID });
        const updated = food.updateState(FoodState.LIQUID);

        expect(updated.state).toBe(FoodState.LIQUID);
      });

      it('should keep original instance unchanged', () => {
        const food = createTestFood({ state: FoodState.SOLID });
        food.updateState(FoodState.LIQUID);

        expect(food.state).toBe(FoodState.SOLID);
      });
    });
  });

  describe('Persistence', () => {
    describe('toPersistence()', () => {
      it('should convert to persistence format', () => {
        const food = createTestFood();
        const persistence = food.toPersistence();

        expect(persistence.id).toBe(food.id);
        expect(persistence.name).toBe(food.name);
        expect(persistence.description).toBe(food.description);
        expect(persistence.servingSize).toBe(food.servingSize);
        expect(persistence.state).toBe(food.state);
        expect(persistence.category).toBe(food.category);
        expect(persistence.defaultQuantityType).toBe(food.defaultQuantityType);
        expect(persistence.defaultUnit).toBe(food.defaultUnit);
        expect(persistence.brand).toBe(food.brand);
        expect(persistence.barcode).toBe(food.barcode);
      });

      it('should convert dates to ISO strings', () => {
        const food = createTestFood();
        const persistence = food.toPersistence();

        expect(typeof persistence.createdAt).toBe('string');
        expect(typeof persistence.updatedAt).toBe('string');
        expect(persistence.createdAt).toBe(food.createdAt.toISOString());
        expect(persistence.updatedAt).toBe(food.updatedAt.toISOString());
      });

      it('should convert macronutrients to plain object', () => {
        const food = createTestFood();
        const persistence = food.toPersistence();

        expect(persistence.macronutrients).toEqual(DEFAULT_MACRONUTRIENTS);
      });

      it('should include all required fields', () => {
        const food = createTestFood();
        const persistence = food.toPersistence();

        expect(persistence).toHaveProperty('id');
        expect(persistence).toHaveProperty('name');
        expect(persistence).toHaveProperty('macronutrients');
        expect(persistence).toHaveProperty('servingSize');
        expect(persistence).toHaveProperty('state');
        expect(persistence).toHaveProperty('category');
        expect(persistence).toHaveProperty('defaultQuantityType');
        expect(persistence).toHaveProperty('defaultUnit');
        expect(persistence).toHaveProperty('createdAt');
        expect(persistence).toHaveProperty('updatedAt');
      });

      it('should round-trip correctly', () => {
        const original = createTestFood();
        const persistence = original.toPersistence();
        const restored = Food.fromPersistence(persistence);

        expect(restored.id).toBe(original.id);
        expect(restored.name).toBe(original.name);
        expect(restored.macronutrients.equals(original.macronutrients)).toBe(true);
        expect(restored.servingSize).toBe(original.servingSize);
        expect(restored.state).toBe(original.state);
        expect(restored.category).toBe(original.category);
      });
    });
  });
});
