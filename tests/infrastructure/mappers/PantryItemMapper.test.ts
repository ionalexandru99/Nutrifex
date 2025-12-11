/**
 * PantryItemMapper unit tests.
 */

import { PantryItemMapper } from '@infrastructure/mappers/PantryItemMapper';

import { createTestPantryItem, createTestFood } from '../../helpers';

describe('PantryItemMapper', () => {
  describe('toPersistence()', () => {
    it('should convert PantryItem entity to database row', () => {
      const pantryItem = createTestPantryItem();
      const row = PantryItemMapper.toPersistence(pantryItem);

      expect(row.id).toBe(pantryItem.id);
      expect(row.food_id).toBe(pantryItem.food.id);
      expect(row.location).toBe(pantryItem.location);
      expect(row.notes).toBe(pantryItem.notes);
    });

    it('should flatten quantity', () => {
      const pantryItem = createTestPantryItem();
      const row = PantryItemMapper.toPersistence(pantryItem);

      expect(row.quantity_amount).toBe(pantryItem.quantity.amount);
      expect(row.quantity_unit).toBe(pantryItem.quantity.unit);
      expect(row.quantity_type).toBe(pantryItem.quantity.type);
    });

    it('should flatten expiration', () => {
      const pantryItem = createTestPantryItem();
      const row = PantryItemMapper.toPersistence(pantryItem);

      expect(row.expiration_type).toBe(pantryItem.expiration.type);
      expect(typeof row.expiration_date).toBe('string');
    });

    it('should convert dates to ISO strings', () => {
      const pantryItem = createTestPantryItem();
      const row = PantryItemMapper.toPersistence(pantryItem);

      expect(typeof row.created_at).toBe('string');
      expect(typeof row.updated_at).toBe('string');
      expect(row.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(row.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should handle optional fields', () => {
      const pantryItem = createTestPantryItem({
        purchasedAt: undefined,
        location: undefined,
        notes: undefined,
      });
      const row = PantryItemMapper.toPersistence(pantryItem);

      expect(row.purchased_at).toBeUndefined();
      expect(row.location).toBeUndefined();
      expect(row.notes).toBeUndefined();
    });
  });

  describe('toDomain()', () => {
    it('should convert database row to PantryItem entity', () => {
      const pantryItem = createTestPantryItem();
      const food = pantryItem.food;
      const row = PantryItemMapper.toPersistence(pantryItem);

      const restoredItem = PantryItemMapper.toDomain(row, food);

      expect(restoredItem.id).toBe(pantryItem.id);
      expect(restoredItem.food.id).toBe(food.id);
      expect(restoredItem.quantity.amount).toBe(pantryItem.quantity.amount);
    });

    it('should reconstruct quantity', () => {
      const pantryItem = createTestPantryItem();
      const food = pantryItem.food;
      const row = PantryItemMapper.toPersistence(pantryItem);

      const restoredItem = PantryItemMapper.toDomain(row, food);

      expect(restoredItem.quantity.amount).toBe(pantryItem.quantity.amount);
      expect(restoredItem.quantity.unit).toBe(pantryItem.quantity.unit);
      expect(restoredItem.quantity.type).toBe(pantryItem.quantity.type);
    });

    it('should reconstruct expiration', () => {
      const pantryItem = createTestPantryItem();
      const food = pantryItem.food;
      const row = PantryItemMapper.toPersistence(pantryItem);

      const restoredItem = PantryItemMapper.toDomain(row, food);

      expect(restoredItem.expiration.type).toBe(pantryItem.expiration.type);
      expect(restoredItem.expiration.date.getTime()).toBeCloseTo(
        pantryItem.expiration.date.getTime(),
        -2,
      );
    });

    it('should convert ISO string dates back to Date objects', () => {
      const pantryItem = createTestPantryItem();
      const food = pantryItem.food;
      const row = PantryItemMapper.toPersistence(pantryItem);

      const restoredItem = PantryItemMapper.toDomain(row, food);

      expect(restoredItem.createdAt instanceof Date).toBe(true);
      expect(restoredItem.updatedAt instanceof Date).toBe(true);
      expect(restoredItem.expiration.date instanceof Date).toBe(true);
    });

    it('should throw on food ID mismatch', () => {
      const pantryItem = createTestPantryItem();
      const wrongFood = createTestFood({ id: 'different-food-id' });
      const row = PantryItemMapper.toPersistence(pantryItem);

      expect(() => PantryItemMapper.toDomain(row, wrongFood)).toThrow(
        'Food ID mismatch: provided food does not match persisted foodId',
      );
    });
  });

  describe('Round-trip conversion', () => {
    it('should preserve data through conversion cycle', () => {
      const pantryItem = createTestPantryItem();
      const food = pantryItem.food;

      const row = PantryItemMapper.toPersistence(pantryItem);
      const restoredItem = PantryItemMapper.toDomain(row, food);
      const rerow = PantryItemMapper.toPersistence(restoredItem);

      expect(rerow.id).toBe(row.id);
      expect(rerow.food_id).toBe(row.food_id);
      expect(rerow.quantity_amount).toBe(row.quantity_amount);
    });
  });

  describe('getColumnList()', () => {
    it('should return comma-separated column names', () => {
      const columns = PantryItemMapper.getColumnList();

      expect(columns).toContain('id');
      expect(columns).toContain('food_id');
      expect(columns).toContain('quantity_amount');
    });
  });

  describe('getParameterPlaceholders()', () => {
    it('should return correct number of placeholders', () => {
      const placeholders = PantryItemMapper.getParameterPlaceholders();
      const count = placeholders.split(',').length;

      expect(count).toBe(12); // 12 columns in PantryItem
    });
  });

  describe('getInsertParameters()', () => {
    it('should return parameters in correct order', () => {
      const pantryItem = createTestPantryItem();
      const params = PantryItemMapper.getInsertParameters(pantryItem);

      expect(params[0]).toBe(pantryItem.id);
      expect(params[1]).toBe(pantryItem.food.id);
      expect(params.length).toBe(12);
    });
  });

  describe('getUpdateParameters()', () => {
    it('should return parameters with ID at the end', () => {
      const pantryItem = createTestPantryItem();
      const params = PantryItemMapper.getUpdateParameters(pantryItem);

      expect(params[params.length - 1]).toBe(pantryItem.id); // ID should be last
      expect(params.length).toBe(11); // 11 columns to update + 1 ID for WHERE
    });
  });
});
