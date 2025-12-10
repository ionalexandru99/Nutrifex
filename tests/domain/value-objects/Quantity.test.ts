import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';
import { Quantity, QuantityProps } from '@domain/value-objects/Quantity';

import { createTestQuantity } from '../../helpers';

describe('Quantity', () => {
  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create a valid weight-based quantity', () => {
        const quantity = Quantity.create({
          amount: 500,
          unit: MeasurementUnit.GRAM,
          type: QuantityType.BY_WEIGHT,
        });

        expect(quantity.amount).toBe(500);
        expect(quantity.unit).toBe(MeasurementUnit.GRAM);
        expect(quantity.type).toBe(QuantityType.BY_WEIGHT);
      });

      it('should create a valid volume-based quantity', () => {
        const quantity = Quantity.create({
          amount: 1000,
          unit: MeasurementUnit.MILLILITER,
          type: QuantityType.BY_VOLUME,
        });

        expect(quantity.amount).toBe(1000);
        expect(quantity.unit).toBe(MeasurementUnit.MILLILITER);
        expect(quantity.type).toBe(QuantityType.BY_VOLUME);
      });

      it('should create a valid count-based quantity', () => {
        const quantity = Quantity.create({
          amount: 5,
          unit: MeasurementUnit.PIECE,
          type: QuantityType.BY_UNIT,
        });

        expect(quantity.amount).toBe(5);
        expect(quantity.unit).toBe(MeasurementUnit.PIECE);
        expect(quantity.type).toBe(QuantityType.BY_UNIT);
      });

      it('should create with zero amount', () => {
        const quantity = Quantity.create({
          amount: 0,
          unit: MeasurementUnit.GRAM,
          type: QuantityType.BY_WEIGHT,
        });

        expect(quantity.amount).toBe(0);
      });

      it('should throw on negative amount', () => {
        expect(() =>
          Quantity.create({
            amount: -1,
            unit: MeasurementUnit.GRAM,
            type: QuantityType.BY_WEIGHT,
          }),
        ).toThrow('Quantity amount cannot be negative');
      });

      it('should throw on incompatible unit/type (weight unit with volume type)', () => {
        expect(() =>
          Quantity.create({
            amount: 100,
            unit: MeasurementUnit.GRAM,
            type: QuantityType.BY_VOLUME,
          }),
        ).toThrow('Unit GRAM is not compatible with type BY_VOLUME');
      });

      it('should throw on incompatible unit/type (volume unit with weight type)', () => {
        expect(() =>
          Quantity.create({
            amount: 100,
            unit: MeasurementUnit.LITER,
            type: QuantityType.BY_WEIGHT,
          }),
        ).toThrow('Unit LITER is not compatible with type BY_WEIGHT');
      });

      it('should throw on incompatible unit/type (count unit with weight type)', () => {
        expect(() =>
          Quantity.create({
            amount: 5,
            unit: MeasurementUnit.PIECE,
            type: QuantityType.BY_WEIGHT,
          }),
        ).toThrow('Unit PIECE is not compatible with type BY_WEIGHT');
      });

      it('should throw on incompatible unit/type (weight unit with count type)', () => {
        expect(() =>
          Quantity.create({
            amount: 100,
            unit: MeasurementUnit.KILOGRAM,
            type: QuantityType.BY_UNIT,
          }),
        ).toThrow('Unit KILOGRAM is not compatible with type BY_UNIT');
      });
    });

    describe('zero()', () => {
      it('should create zero quantity with correct unit/type', () => {
        const quantity = Quantity.zero(MeasurementUnit.GRAM, QuantityType.BY_WEIGHT);

        expect(quantity.amount).toBe(0);
        expect(quantity.unit).toBe(MeasurementUnit.GRAM);
        expect(quantity.type).toBe(QuantityType.BY_WEIGHT);
      });
    });

    describe('byWeight()', () => {
      it('should create weight quantity with GRAM', () => {
        const quantity = Quantity.byWeight(500, MeasurementUnit.GRAM);

        expect(quantity.amount).toBe(500);
        expect(quantity.unit).toBe(MeasurementUnit.GRAM);
        expect(quantity.type).toBe(QuantityType.BY_WEIGHT);
      });

      it('should create weight quantity with KILOGRAM', () => {
        const quantity = Quantity.byWeight(2, MeasurementUnit.KILOGRAM);

        expect(quantity.amount).toBe(2);
        expect(quantity.unit).toBe(MeasurementUnit.KILOGRAM);
        expect(quantity.type).toBe(QuantityType.BY_WEIGHT);
      });
    });

    describe('byVolume()', () => {
      it('should create volume quantity with MILLILITER', () => {
        const quantity = Quantity.byVolume(500, MeasurementUnit.MILLILITER);

        expect(quantity.amount).toBe(500);
        expect(quantity.unit).toBe(MeasurementUnit.MILLILITER);
        expect(quantity.type).toBe(QuantityType.BY_VOLUME);
      });

      it('should create volume quantity with LITER', () => {
        const quantity = Quantity.byVolume(2, MeasurementUnit.LITER);

        expect(quantity.amount).toBe(2);
        expect(quantity.unit).toBe(MeasurementUnit.LITER);
        expect(quantity.type).toBe(QuantityType.BY_VOLUME);
      });
    });

    describe('byUnit()', () => {
      it('should create count quantity with PIECE', () => {
        const quantity = Quantity.byUnit(5, MeasurementUnit.PIECE);

        expect(quantity.amount).toBe(5);
        expect(quantity.unit).toBe(MeasurementUnit.PIECE);
        expect(quantity.type).toBe(QuantityType.BY_UNIT);
      });

      it('should create count quantity with SERVING', () => {
        const quantity = Quantity.byUnit(3, MeasurementUnit.SERVING);

        expect(quantity.amount).toBe(3);
        expect(quantity.unit).toBe(MeasurementUnit.SERVING);
        expect(quantity.type).toBe(QuantityType.BY_UNIT);
      });
    });
  });

  describe('Getters', () => {
    it('should return correct values for all properties', () => {
      const props: QuantityProps = {
        amount: 250,
        unit: MeasurementUnit.MILLILITER,
        type: QuantityType.BY_VOLUME,
      };
      const quantity = Quantity.create(props);

      expect(quantity.amount).toBe(props.amount);
      expect(quantity.unit).toBe(props.unit);
      expect(quantity.type).toBe(props.type);
    });
  });

  describe('Methods', () => {
    describe('isEmpty()', () => {
      it('should return true for zero amount', () => {
        const quantity = Quantity.zero(MeasurementUnit.GRAM, QuantityType.BY_WEIGHT);

        expect(quantity.isEmpty()).toBe(true);
      });

      it('should return false for non-zero amount', () => {
        const quantity = createTestQuantity({ amount: 100 });

        expect(quantity.isEmpty()).toBe(false);
      });
    });

    describe('add()', () => {
      it('should add quantities with same unit', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(50, MeasurementUnit.GRAM);

        const result = quantity1.add(quantity2);

        expect(result.amount).toBe(150);
        expect(result.unit).toBe(MeasurementUnit.GRAM);
        expect(result.type).toBe(QuantityType.BY_WEIGHT);
      });

      it('should throw on different units', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(1, MeasurementUnit.KILOGRAM);

        expect(() => quantity1.add(quantity2)).toThrow(
          'Cannot add quantities with different units',
        );
      });

      it('should return a new instance (immutability)', () => {
        const quantity1 = createTestQuantity({ amount: 100 });
        const quantity2 = createTestQuantity({ amount: 50 });
        const result = quantity1.add(quantity2);

        expect(result).not.toBe(quantity1);
        expect(result).not.toBe(quantity2);
        expect(quantity1.amount).toBe(100);
      });
    });

    describe('subtract()', () => {
      it('should subtract quantities with same unit', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(30, MeasurementUnit.GRAM);

        const result = quantity1.subtract(quantity2);

        expect(result.amount).toBe(70);
        expect(result.unit).toBe(MeasurementUnit.GRAM);
        expect(result.type).toBe(QuantityType.BY_WEIGHT);
      });

      it('should allow subtracting to zero', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(100, MeasurementUnit.GRAM);

        const result = quantity1.subtract(quantity2);

        expect(result.amount).toBe(0);
        expect(result.isEmpty()).toBe(true);
      });

      it('should throw on different units', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byVolume(50, MeasurementUnit.MILLILITER);

        expect(() => quantity1.subtract(quantity2)).toThrow(
          'Cannot subtract quantities with different units',
        );
      });

      it('should throw when result would be negative', () => {
        const quantity1 = Quantity.byWeight(50, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(100, MeasurementUnit.GRAM);

        expect(() => quantity1.subtract(quantity2)).toThrow(
          'Cannot subtract: result would be negative',
        );
      });

      it('should return a new instance (immutability)', () => {
        const quantity1 = createTestQuantity({ amount: 100 });
        const quantity2 = createTestQuantity({ amount: 30 });
        const result = quantity1.subtract(quantity2);

        expect(result).not.toBe(quantity1);
        expect(quantity1.amount).toBe(100);
      });
    });

    describe('equals()', () => {
      it('should return true for identical instances', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(100, MeasurementUnit.GRAM);

        expect(quantity1.equals(quantity2)).toBe(true);
      });

      it('should return false for different amounts', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(200, MeasurementUnit.GRAM);

        expect(quantity1.equals(quantity2)).toBe(false);
      });

      it('should return false for different units', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byWeight(100, MeasurementUnit.KILOGRAM);

        expect(quantity1.equals(quantity2)).toBe(false);
      });

      it('should return false for different types', () => {
        const quantity1 = Quantity.byWeight(100, MeasurementUnit.GRAM);
        const quantity2 = Quantity.byVolume(100, MeasurementUnit.MILLILITER);

        expect(quantity1.equals(quantity2)).toBe(false);
      });
    });

    describe('toObject()', () => {
      it('should return plain object with correct values', () => {
        const props: QuantityProps = {
          amount: 250,
          unit: MeasurementUnit.MILLILITER,
          type: QuantityType.BY_VOLUME,
        };
        const quantity = Quantity.create(props);
        const obj = quantity.toObject();

        expect(obj).toEqual(props);
      });

      it('should return a new object (not reference)', () => {
        const quantity = createTestQuantity();
        const obj1 = quantity.toObject();
        const obj2 = quantity.toObject();

        expect(obj1).not.toBe(obj2);
        expect(obj1).toEqual(obj2);
      });
    });
  });
});
