/**
 * PantryItemSpecifications unit tests.
 */

import { ExpirationType } from '@domain/enums/ExpirationType';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';
import { PantryItemSpecifications } from '@domain/specifications/PantryItemSpecifications';

import { createTestPantryItem, daysFromNow, daysAgo } from '../../helpers';

describe('PantryItemSpecifications', () => {
  describe('byId()', () => {
    it('should find pantry items by ID', () => {
      const spec = PantryItemSpecifications.byId('pantry-123');
      const item = createTestPantryItem({ id: 'pantry-123' });

      expect(spec.isSatisfiedBy(item)).toBe(true);
    });

    it('should reject items with different IDs', () => {
      const spec = PantryItemSpecifications.byId('pantry-123');
      const item = createTestPantryItem({ id: 'pantry-456' });

      expect(spec.isSatisfiedBy(item)).toBe(false);
    });
  });

  describe('byFoodId()', () => {
    it('should find items by food ID', () => {
      const spec = PantryItemSpecifications.byFoodId('food-123');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = createTestPantryItem({ food: { id: 'food-123' } as any });

      expect(spec.isSatisfiedBy(item)).toBe(true);
    });

    it('should reject items with different food IDs', () => {
      const spec = PantryItemSpecifications.byFoodId('food-123');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = createTestPantryItem({ food: { id: 'food-456' } as any });

      expect(spec.isSatisfiedBy(item)).toBe(false);
    });
  });

  describe('expired()', () => {
    it('should find expired items', () => {
      const spec = PantryItemSpecifications.expired();
      const expiredItem = createTestPantryItem({
        expiration: {
          date: daysAgo(1),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(expiredItem)).toBe(true);
    });

    it('should reject non-expired items', () => {
      const spec = PantryItemSpecifications.expired();
      const freshItem = createTestPantryItem({
        expiration: {
          date: daysFromNow(7),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(freshItem)).toBe(false);
    });
  });

  describe('expiring()', () => {
    it('should find items expiring within threshold', () => {
      const spec = PantryItemSpecifications.expiring(3);
      const expiringItem = createTestPantryItem({
        expiration: {
          date: daysFromNow(2),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(expiringItem)).toBe(true);
    });

    it('should reject items expiring after threshold', () => {
      const spec = PantryItemSpecifications.expiring(3);
      const futureItem = createTestPantryItem({
        expiration: {
          date: daysFromNow(10),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(futureItem)).toBe(false);
    });

    it('should use custom threshold', () => {
      const spec = PantryItemSpecifications.expiring(7);
      const item = createTestPantryItem({
        expiration: {
          date: daysFromNow(5),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(item)).toBe(true);
    });

    it('should reject already expired items', () => {
      const spec = PantryItemSpecifications.expiring(3);
      const expiredItem = createTestPantryItem({
        expiration: {
          date: daysAgo(1),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(expiredItem)).toBe(false);
    });
  });

  describe('notExpired()', () => {
    it('should find non-expired items', () => {
      const spec = PantryItemSpecifications.notExpired();
      const freshItem = createTestPantryItem({
        expiration: {
          date: daysFromNow(7),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(freshItem)).toBe(true);
    });

    it('should reject expired items', () => {
      const spec = PantryItemSpecifications.notExpired();
      const expiredItem = createTestPantryItem({
        expiration: {
          date: daysAgo(1),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(expiredItem)).toBe(false);
    });
  });

  describe('lowQuantity()', () => {
    it('should find items with low quantity', () => {
      const spec = PantryItemSpecifications.lowQuantity(50);
      const lowItem = createTestPantryItem({
        quantity: { amount: 25, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
      });

      expect(spec.isSatisfiedBy(lowItem)).toBe(true);
    });

    it('should reject items with sufficient quantity', () => {
      const spec = PantryItemSpecifications.lowQuantity(50);
      const adequateItem = createTestPantryItem({
        quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
      });

      expect(spec.isSatisfiedBy(adequateItem)).toBe(false);
    });

    it('should accept exact threshold match', () => {
      const spec = PantryItemSpecifications.lowQuantity(100);
      const item = createTestPantryItem({
        quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
      });

      expect(spec.isSatisfiedBy(item)).toBe(true);
    });
  });

  describe('empty()', () => {
    it('should find empty items', () => {
      const spec = PantryItemSpecifications.empty();
      const emptyItem = createTestPantryItem({
        quantity: { amount: 0, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
      });

      expect(spec.isSatisfiedBy(emptyItem)).toBe(true);
    });

    it('should reject non-empty items', () => {
      const spec = PantryItemSpecifications.empty();
      const item = createTestPantryItem({
        quantity: { amount: 100, unit: MeasurementUnit.GRAM, type: QuantityType.BY_WEIGHT },
      });

      expect(spec.isSatisfiedBy(item)).toBe(false);
    });
  });

  describe('byLocation()', () => {
    it('should find items by location', () => {
      const spec = PantryItemSpecifications.byLocation('Kitchen');
      const item = createTestPantryItem({ location: 'Kitchen' });

      expect(spec.isSatisfiedBy(item)).toBe(true);
    });

    it('should reject items at different locations', () => {
      const spec = PantryItemSpecifications.byLocation('Kitchen');
      const item = createTestPantryItem({ location: 'Freezer' });

      expect(spec.isSatisfiedBy(item)).toBe(false);
    });
  });

  describe('Composite specifications', () => {
    it('should combine with AND', () => {
      const spec = PantryItemSpecifications.notExpired().and(
        PantryItemSpecifications.byLocation('Kitchen'),
      );
      const matchingItem = createTestPantryItem({
        location: 'Kitchen',
        expiration: {
          date: daysFromNow(7),
          type: ExpirationType.BEST_BEFORE,
        },
      });
      const nonMatchingItem = createTestPantryItem({
        location: 'Freezer',
        expiration: {
          date: daysFromNow(7),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(matchingItem)).toBe(true);
      expect(spec.isSatisfiedBy(nonMatchingItem)).toBe(false);
    });

    it('should combine with OR', () => {
      const spec = PantryItemSpecifications.byLocation('Kitchen').or(
        PantryItemSpecifications.byLocation('Freezer'),
      );
      const kitchenItem = createTestPantryItem({ location: 'Kitchen' });
      const freezerItem = createTestPantryItem({ location: 'Freezer' });
      const pantryItem = createTestPantryItem({ location: 'Pantry' });

      expect(spec.isSatisfiedBy(kitchenItem)).toBe(true);
      expect(spec.isSatisfiedBy(freezerItem)).toBe(true);
      expect(spec.isSatisfiedBy(pantryItem)).toBe(false);
    });

    it('should negate with NOT', () => {
      const spec = PantryItemSpecifications.expired().not();
      const expiredItem = createTestPantryItem({
        expiration: {
          date: daysAgo(1),
          type: ExpirationType.BEST_BEFORE,
        },
      });
      const freshItem = createTestPantryItem({
        expiration: {
          date: daysFromNow(7),
          type: ExpirationType.BEST_BEFORE,
        },
      });

      expect(spec.isSatisfiedBy(expiredItem)).toBe(false);
      expect(spec.isSatisfiedBy(freshItem)).toBe(true);
    });
  });
});
