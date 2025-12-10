import { PantryItem, PantryItemPersistenceData } from '@domain/entities/PantryItem';
import { ExpirationType } from '@domain/enums/ExpirationType';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';

import {
  createTestPantryItem,
  createTestFood,
  daysFromNow,
  daysAgo,
  DEFAULT_QUANTITY_PROPS,
} from '../../helpers';

describe('PantryItem', () => {
  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create a valid PantryItem instance', () => {
        const food = createTestFood();
        const expirationDate = daysFromNow(7);

        const pantryItem = PantryItem.create({
          id: 'pantry-1',
          food,
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: {
            date: expirationDate,
            type: ExpirationType.BEST_BEFORE,
          },
          location: 'Fridge',
          notes: 'Test notes',
        });

        expect(pantryItem.id).toBe('pantry-1');
        expect(pantryItem.food).toBe(food);
        expect(pantryItem.quantity.amount).toBe(DEFAULT_QUANTITY_PROPS.amount);
        expect(pantryItem.location).toBe('Fridge');
        expect(pantryItem.notes).toBe('Test notes');
      });

      it('should set createdAt and updatedAt automatically', () => {
        const before = new Date();
        const pantryItem = createTestPantryItem();
        const after = new Date();

        expect(pantryItem.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(pantryItem.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
        expect(pantryItem.updatedAt.getTime()).toBe(pantryItem.createdAt.getTime());
      });

      it('should throw on empty ID', () => {
        expect(() => createTestPantryItem({ id: '' })).toThrow('PantryItem ID is required');
      });

      it('should throw on whitespace-only ID', () => {
        expect(() => createTestPantryItem({ id: '   ' })).toThrow('PantryItem ID is required');
      });

      it('should allow optional fields to be undefined', () => {
        const food = createTestFood();
        const pantryItem = PantryItem.create({
          id: 'pantry-1',
          food,
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: {
            date: daysFromNow(7),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        expect(pantryItem.purchasedAt).toBeUndefined();
        expect(pantryItem.location).toBeUndefined();
        expect(pantryItem.notes).toBeUndefined();
      });

      it('should set purchasedAt when provided', () => {
        const purchasedAt = new Date();
        const pantryItem = createTestPantryItem({ purchasedAt });

        expect(pantryItem.purchasedAt?.getTime()).toBe(purchasedAt.getTime());
      });
    });

    describe('fromPersistence()', () => {
      it('should reconstruct from persistence data', () => {
        const food = createTestFood({ id: 'food-1' });
        const persistenceData: PantryItemPersistenceData = {
          id: 'pantry-1',
          foodId: 'food-1',
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: {
            date: '2025-12-31T00:00:00.000Z',
            type: ExpirationType.USE_BY,
          },
          location: 'Pantry',
          notes: 'Some notes',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
        };

        const pantryItem = PantryItem.fromPersistence(persistenceData, food);

        expect(pantryItem.id).toBe('pantry-1');
        expect(pantryItem.food.id).toBe('food-1');
        expect(pantryItem.location).toBe('Pantry');
        expect(pantryItem.notes).toBe('Some notes');
      });

      it('should throw on Food ID mismatch', () => {
        const food = createTestFood({ id: 'food-1' });
        const persistenceData: PantryItemPersistenceData = {
          id: 'pantry-1',
          foodId: 'different-food-id',
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: {
            date: '2025-12-31T00:00:00.000Z',
            type: ExpirationType.BEST_BEFORE,
          },
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
        };

        expect(() => PantryItem.fromPersistence(persistenceData, food)).toThrow(
          'Food ID mismatch: provided food does not match persisted foodId',
        );
      });

      it('should parse optional dates correctly', () => {
        const food = createTestFood({ id: 'food-1' });
        const persistenceData: PantryItemPersistenceData = {
          id: 'pantry-1',
          foodId: 'food-1',
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: {
            date: '2025-12-31T00:00:00.000Z',
            type: ExpirationType.BEST_BEFORE,
          },
          purchasedAt: '2025-01-15T00:00:00.000Z',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
        };

        const pantryItem = PantryItem.fromPersistence(persistenceData, food);

        expect(pantryItem.purchasedAt?.toISOString()).toBe('2025-01-15T00:00:00.000Z');
      });

      it('should handle missing optional fields', () => {
        const food = createTestFood({ id: 'food-1' });
        const persistenceData: PantryItemPersistenceData = {
          id: 'pantry-1',
          foodId: 'food-1',
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: {
            date: '2025-12-31T00:00:00.000Z',
            type: ExpirationType.BEST_BEFORE,
          },
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
        };

        const pantryItem = PantryItem.fromPersistence(persistenceData, food);

        expect(pantryItem.purchasedAt).toBeUndefined();
        expect(pantryItem.location).toBeUndefined();
        expect(pantryItem.notes).toBeUndefined();
      });
    });
  });

  describe('Getters', () => {
    it('should return correct values for all properties', () => {
      const food = createTestFood();
      const expirationDate = daysFromNow(7);
      const purchasedAt = new Date();

      const pantryItem = PantryItem.create({
        id: 'pantry-1',
        food,
        quantity: DEFAULT_QUANTITY_PROPS,
        expiration: {
          date: expirationDate,
          type: ExpirationType.USE_BY,
        },
        purchasedAt,
        location: 'Fridge',
        notes: 'Test notes',
      });

      expect(pantryItem.id).toBe('pantry-1');
      expect(pantryItem.food).toBe(food);
      expect(pantryItem.quantity.amount).toBe(DEFAULT_QUANTITY_PROPS.amount);
      expect(pantryItem.expiration.type).toBe(ExpirationType.USE_BY);
      expect(pantryItem.purchasedAt?.getTime()).toBe(purchasedAt.getTime());
      expect(pantryItem.location).toBe('Fridge');
      expect(pantryItem.notes).toBe('Test notes');
    });
  });

  describe('Status Checks', () => {
    describe('isExpired()', () => {
      it('should return false for future expiration', () => {
        const pantryItem = createTestPantryItem({
          expiration: {
            date: daysFromNow(7),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        expect(pantryItem.isExpired()).toBe(false);
      });

      it('should return true for past expiration', () => {
        const pantryItem = createTestPantryItem({
          expiration: {
            date: daysAgo(1),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        expect(pantryItem.isExpired()).toBe(true);
      });
    });

    describe('isExpiringSoon()', () => {
      it('should return true within threshold', () => {
        const pantryItem = createTestPantryItem({
          expiration: {
            date: daysFromNow(2),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        expect(pantryItem.isExpiringSoon()).toBe(true);
      });

      it('should return false beyond threshold', () => {
        const pantryItem = createTestPantryItem({
          expiration: {
            date: daysFromNow(10),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        expect(pantryItem.isExpiringSoon()).toBe(false);
      });

      it('should use custom threshold', () => {
        const pantryItem = createTestPantryItem({
          expiration: {
            date: daysFromNow(5),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        expect(pantryItem.isExpiringSoon(3)).toBe(false);
        expect(pantryItem.isExpiringSoon(7)).toBe(true);
      });
    });

    describe('daysUntilExpiration()', () => {
      it('should return correct days', () => {
        const pantryItem = createTestPantryItem({
          expiration: {
            date: daysFromNow(7),
            type: ExpirationType.BEST_BEFORE,
          },
        });

        const days = pantryItem.daysUntilExpiration();
        expect(days).toBeGreaterThanOrEqual(6);
        expect(days).toBeLessThanOrEqual(8);
      });
    });

    describe('isLow()', () => {
      it('should return true below threshold', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 10, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        expect(pantryItem.isLow(50)).toBe(true);
      });

      it('should return true at threshold', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 50, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        expect(pantryItem.isLow(50)).toBe(true);
      });

      it('should return false above threshold', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        expect(pantryItem.isLow(50)).toBe(false);
      });
    });

    describe('isEmpty()', () => {
      it('should return true for zero quantity', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 0, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        expect(pantryItem.isEmpty()).toBe(true);
      });

      it('should return false for non-zero quantity', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        expect(pantryItem.isEmpty()).toBe(false);
      });
    });
  });

  describe('Calculations', () => {
    describe('calculateCurrentMacronutrients()', () => {
      it('should calculate for current quantity', () => {
        const food = createTestFood({
          servingSize: 100,
          macronutrients: { calories: 200, protein: 10, carbohydrates: 25, fat: 8 },
        });
        const pantryItem = createTestPantryItem({
          food,
          quantity: { amount: 200, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        const macros = pantryItem.calculateCurrentMacronutrients();

        expect(macros.calories).toBe(400);
        expect(macros.protein).toBe(20);
        expect(macros.carbohydrates).toBe(50);
        expect(macros.fat).toBe(16);
      });

      it('should use correct ratio based on serving size', () => {
        const food = createTestFood({
          servingSize: 50,
          macronutrients: { calories: 100, protein: 5, carbohydrates: 10, fat: 4 },
        });
        const pantryItem = createTestPantryItem({
          food,
          quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        const macros = pantryItem.calculateCurrentMacronutrients();

        // 100g / 50g serving = 2x
        expect(macros.calories).toBe(200);
        expect(macros.protein).toBe(10);
      });
    });
  });

  describe('Quantity Operations', () => {
    describe('consume()', () => {
      it('should reduce quantity correctly', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        const consumed = pantryItem.consume(30);

        expect(consumed.quantity.amount).toBe(70);
      });

      it('should return new instance (immutable)', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        const consumed = pantryItem.consume(30);

        expect(consumed).not.toBe(pantryItem);
        expect(pantryItem.quantity.amount).toBe(100);
      });

      it('should update updatedAt timestamp', () => {
        const pantryItem = createTestPantryItem();
        const originalUpdatedAt = pantryItem.updatedAt;

        const consumed = pantryItem.consume(10);

        expect(consumed.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
      });

      it('should throw on zero amount', () => {
        const pantryItem = createTestPantryItem();

        expect(() => pantryItem.consume(0)).toThrow('Consume amount must be greater than 0');
      });

      it('should throw on negative amount', () => {
        const pantryItem = createTestPantryItem();

        expect(() => pantryItem.consume(-10)).toThrow('Consume amount must be greater than 0');
      });

      it('should throw when consuming more than available', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 50, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        expect(() => pantryItem.consume(100)).toThrow('Cannot subtract: result would be negative');
      });

      it('should allow consuming all quantity', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 50, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        const consumed = pantryItem.consume(50);

        expect(consumed.quantity.amount).toBe(0);
        expect(consumed.isEmpty()).toBe(true);
      });
    });

    describe('addQuantity()', () => {
      it('should increase quantity correctly', () => {
        const pantryItem = createTestPantryItem({
          quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
        });

        const added = pantryItem.addQuantity(50);

        expect(added.quantity.amount).toBe(150);
      });

      it('should return new instance (immutable)', () => {
        const pantryItem = createTestPantryItem();
        const added = pantryItem.addQuantity(50);

        expect(added).not.toBe(pantryItem);
      });

      it('should throw on zero amount', () => {
        const pantryItem = createTestPantryItem();

        expect(() => pantryItem.addQuantity(0)).toThrow('Add amount must be greater than 0');
      });

      it('should throw on negative amount', () => {
        const pantryItem = createTestPantryItem();

        expect(() => pantryItem.addQuantity(-10)).toThrow('Add amount must be greater than 0');
      });
    });

    describe('updateQuantity()', () => {
      it('should update quantity correctly', () => {
        const pantryItem = createTestPantryItem();
        const newQuantity = {
          amount: 500,
          unit: MeasurementUnit.GRAM,
          type: QuantityType.BY_WEIGHT,
        };

        const updated = pantryItem.updateQuantity(newQuantity);

        expect(updated.quantity.amount).toBe(500);
        expect(updated.quantity.unit).toBe(MeasurementUnit.GRAM);
      });

      it('should validate new quantity', () => {
        const pantryItem = createTestPantryItem();

        expect(() =>
          pantryItem.updateQuantity({
            amount: -1,
            unit: MeasurementUnit.GRAM,
            type: QuantityType.BY_WEIGHT,
          }),
        ).toThrow('Quantity amount cannot be negative');
      });

      it('should return new instance (immutable)', () => {
        const pantryItem = createTestPantryItem();
        const updated = pantryItem.updateQuantity({
          amount: 500,
          unit: MeasurementUnit.GRAM,
          type: QuantityType.BY_WEIGHT,
        });

        expect(updated).not.toBe(pantryItem);
      });
    });
  });

  describe('Update Methods', () => {
    describe('updateExpiration()', () => {
      it('should return new instance with updated expiration', () => {
        const pantryItem = createTestPantryItem();
        const newExpiration = {
          date: daysFromNow(30),
          type: ExpirationType.USE_BY,
        };

        const updated = pantryItem.updateExpiration(newExpiration);

        expect(updated.expiration.type).toBe(ExpirationType.USE_BY);
      });

      it('should keep original instance unchanged', () => {
        const pantryItem = createTestPantryItem({
          expiration: { date: daysFromNow(7), type: ExpirationType.BEST_BEFORE },
        });

        pantryItem.updateExpiration({
          date: daysFromNow(30),
          type: ExpirationType.USE_BY,
        });

        expect(pantryItem.expiration.type).toBe(ExpirationType.BEST_BEFORE);
      });
    });

    describe('updateLocation()', () => {
      it('should return new instance with updated location', () => {
        const pantryItem = createTestPantryItem({ location: 'Fridge' });
        const updated = pantryItem.updateLocation('Pantry');

        expect(updated.location).toBe('Pantry');
      });

      it('should allow setting to undefined', () => {
        const pantryItem = createTestPantryItem({ location: 'Fridge' });
        const updated = pantryItem.updateLocation(undefined);

        expect(updated.location).toBeUndefined();
      });

      it('should keep original instance unchanged', () => {
        const pantryItem = createTestPantryItem({ location: 'Fridge' });
        pantryItem.updateLocation('Pantry');

        expect(pantryItem.location).toBe('Fridge');
      });
    });

    describe('updateNotes()', () => {
      it('should return new instance with updated notes', () => {
        const pantryItem = createTestPantryItem({ notes: 'Original notes' });
        const updated = pantryItem.updateNotes('New notes');

        expect(updated.notes).toBe('New notes');
      });

      it('should allow setting to undefined', () => {
        const pantryItem = createTestPantryItem({ notes: 'Some notes' });
        const updated = pantryItem.updateNotes(undefined);

        expect(updated.notes).toBeUndefined();
      });

      it('should keep original instance unchanged', () => {
        const pantryItem = createTestPantryItem({ notes: 'Original' });
        pantryItem.updateNotes('New');

        expect(pantryItem.notes).toBe('Original');
      });
    });
  });

  describe('Persistence', () => {
    describe('toPersistence()', () => {
      it('should convert to persistence format', () => {
        const food = createTestFood({ id: 'food-123' });
        const pantryItem = createTestPantryItem({
          id: 'pantry-123',
          food,
          location: 'Fridge',
          notes: 'Test notes',
        });

        const persistence = pantryItem.toPersistence();

        expect(persistence.id).toBe('pantry-123');
        expect(persistence.location).toBe('Fridge');
        expect(persistence.notes).toBe('Test notes');
      });

      it('should store Food as ID reference only', () => {
        const food = createTestFood({ id: 'food-456' });
        const pantryItem = createTestPantryItem({ food });

        const persistence = pantryItem.toPersistence();

        expect(persistence.foodId).toBe('food-456');
        expect(persistence).not.toHaveProperty('food');
      });

      it('should convert dates to ISO strings', () => {
        const pantryItem = createTestPantryItem();
        const persistence = pantryItem.toPersistence();

        expect(typeof persistence.createdAt).toBe('string');
        expect(typeof persistence.updatedAt).toBe('string');
        expect(typeof persistence.expiration.date).toBe('string');
      });

      it('should handle optional fields correctly', () => {
        const food = createTestFood();
        const pantryItem = PantryItem.create({
          id: 'pantry-1',
          food,
          quantity: DEFAULT_QUANTITY_PROPS,
          expiration: { date: daysFromNow(7), type: ExpirationType.BEST_BEFORE },
        });

        const persistence = pantryItem.toPersistence();

        expect(persistence.purchasedAt).toBeUndefined();
        expect(persistence.location).toBeUndefined();
        expect(persistence.notes).toBeUndefined();
      });

      it('should round-trip correctly', () => {
        const food = createTestFood({ id: 'food-1' });
        const original = createTestPantryItem({
          id: 'pantry-1',
          food,
          location: 'Freezer',
          notes: 'Test',
        });

        const persistence = original.toPersistence();
        const restored = PantryItem.fromPersistence(persistence, food);

        expect(restored.id).toBe(original.id);
        expect(restored.food.id).toBe(original.food.id);
        expect(restored.quantity.equals(original.quantity)).toBe(true);
        expect(restored.location).toBe(original.location);
        expect(restored.notes).toBe(original.notes);
      });
    });
  });
});
