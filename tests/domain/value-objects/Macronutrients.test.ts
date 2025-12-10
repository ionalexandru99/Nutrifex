import { Macronutrients, MacronutrientsProps } from '@domain/value-objects/Macronutrients';

import { createTestMacronutrients, DEFAULT_MACRONUTRIENTS } from '../../helpers';

describe('Macronutrients', () => {
  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create a valid Macronutrients instance', () => {
        const macros = Macronutrients.create({
          calories: 200,
          protein: 10,
          carbohydrates: 25,
          fat: 8,
        });

        expect(macros.calories).toBe(200);
        expect(macros.protein).toBe(10);
        expect(macros.carbohydrates).toBe(25);
        expect(macros.fat).toBe(8);
      });

      it('should create with zero values', () => {
        const macros = Macronutrients.create({
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
        });

        expect(macros.calories).toBe(0);
        expect(macros.protein).toBe(0);
        expect(macros.carbohydrates).toBe(0);
        expect(macros.fat).toBe(0);
      });

      it('should throw on negative calories', () => {
        expect(() =>
          Macronutrients.create({
            calories: -1,
            protein: 10,
            carbohydrates: 25,
            fat: 8,
          }),
        ).toThrow('Calories cannot be negative');
      });

      it('should throw on negative protein', () => {
        expect(() =>
          Macronutrients.create({
            calories: 200,
            protein: -1,
            carbohydrates: 25,
            fat: 8,
          }),
        ).toThrow('Protein cannot be negative');
      });

      it('should throw on negative carbohydrates', () => {
        expect(() =>
          Macronutrients.create({
            calories: 200,
            protein: 10,
            carbohydrates: -1,
            fat: 8,
          }),
        ).toThrow('Carbohydrates cannot be negative');
      });

      it('should throw on negative fat', () => {
        expect(() =>
          Macronutrients.create({
            calories: 200,
            protein: 10,
            carbohydrates: 25,
            fat: -1,
          }),
        ).toThrow('Fat cannot be negative');
      });
    });

    describe('empty()', () => {
      it('should create a zero-value instance', () => {
        const macros = Macronutrients.empty();

        expect(macros.calories).toBe(0);
        expect(macros.protein).toBe(0);
        expect(macros.carbohydrates).toBe(0);
        expect(macros.fat).toBe(0);
      });
    });
  });

  describe('Getters', () => {
    it('should return correct values for all properties', () => {
      const props: MacronutrientsProps = {
        calories: 150,
        protein: 12,
        carbohydrates: 20,
        fat: 5,
      };
      const macros = Macronutrients.create(props);

      expect(macros.calories).toBe(props.calories);
      expect(macros.protein).toBe(props.protein);
      expect(macros.carbohydrates).toBe(props.carbohydrates);
      expect(macros.fat).toBe(props.fat);
    });
  });

  describe('Methods', () => {
    describe('calculateForQuantity()', () => {
      it('should scale correctly with ratio 1.0', () => {
        const macros = createTestMacronutrients();
        const scaled = macros.calculateForQuantity(1.0);

        expect(scaled.calories).toBe(macros.calories);
        expect(scaled.protein).toBe(macros.protein);
        expect(scaled.carbohydrates).toBe(macros.carbohydrates);
        expect(scaled.fat).toBe(macros.fat);
      });

      it('should scale correctly with ratio 2.0', () => {
        const macros = Macronutrients.create({
          calories: 100,
          protein: 10,
          carbohydrates: 20,
          fat: 5,
        });
        const scaled = macros.calculateForQuantity(2.0);

        expect(scaled.calories).toBe(200);
        expect(scaled.protein).toBe(20);
        expect(scaled.carbohydrates).toBe(40);
        expect(scaled.fat).toBe(10);
      });

      it('should scale correctly with decimal ratio (1.5)', () => {
        const macros = Macronutrients.create({
          calories: 100,
          protein: 10,
          carbohydrates: 20,
          fat: 5,
        });
        const scaled = macros.calculateForQuantity(1.5);

        expect(scaled.calories).toBe(150);
        expect(scaled.protein).toBe(15);
        expect(scaled.carbohydrates).toBe(30);
        expect(scaled.fat).toBe(7.5);
      });

      it('should round to 1 decimal place', () => {
        const macros = Macronutrients.create({
          calories: 100,
          protein: 10,
          carbohydrates: 20,
          fat: 5,
        });
        // 100 * 0.333 = 33.3, protein: 10 * 0.333 = 3.33 -> 3.3
        const scaled = macros.calculateForQuantity(0.333);

        expect(scaled.calories).toBe(33.3);
        expect(scaled.protein).toBe(3.3);
        expect(scaled.carbohydrates).toBe(6.7);
        expect(scaled.fat).toBe(1.7);
      });

      it('should handle zero ratio', () => {
        const macros = createTestMacronutrients();
        const scaled = macros.calculateForQuantity(0);

        expect(scaled.calories).toBe(0);
        expect(scaled.protein).toBe(0);
        expect(scaled.carbohydrates).toBe(0);
        expect(scaled.fat).toBe(0);
      });

      it('should throw on negative ratio', () => {
        const macros = createTestMacronutrients();

        expect(() => macros.calculateForQuantity(-1)).toThrow('Ratio cannot be negative');
      });

      it('should return a new instance (immutability)', () => {
        const macros = createTestMacronutrients();
        const scaled = macros.calculateForQuantity(2.0);

        expect(scaled).not.toBe(macros);
        expect(macros.calories).toBe(DEFAULT_MACRONUTRIENTS.calories);
      });
    });

    describe('add()', () => {
      it('should combine two instances correctly', () => {
        const macros1 = Macronutrients.create({
          calories: 100,
          protein: 10,
          carbohydrates: 20,
          fat: 5,
        });
        const macros2 = Macronutrients.create({
          calories: 50,
          protein: 5,
          carbohydrates: 10,
          fat: 3,
        });

        const combined = macros1.add(macros2);

        expect(combined.calories).toBe(150);
        expect(combined.protein).toBe(15);
        expect(combined.carbohydrates).toBe(30);
        expect(combined.fat).toBe(8);
      });

      it('should handle adding zero values', () => {
        const macros = createTestMacronutrients();
        const empty = Macronutrients.empty();

        const combined = macros.add(empty);

        expect(combined.calories).toBe(macros.calories);
        expect(combined.protein).toBe(macros.protein);
        expect(combined.carbohydrates).toBe(macros.carbohydrates);
        expect(combined.fat).toBe(macros.fat);
      });

      it('should return a new instance (immutability)', () => {
        const macros1 = createTestMacronutrients();
        const macros2 = createTestMacronutrients();
        const combined = macros1.add(macros2);

        expect(combined).not.toBe(macros1);
        expect(combined).not.toBe(macros2);
      });
    });

    describe('equals()', () => {
      it('should return true for identical instances', () => {
        const macros1 = Macronutrients.create({
          calories: 100,
          protein: 10,
          carbohydrates: 20,
          fat: 5,
        });
        const macros2 = Macronutrients.create({
          calories: 100,
          protein: 10,
          carbohydrates: 20,
          fat: 5,
        });

        expect(macros1.equals(macros2)).toBe(true);
      });

      it('should return false for different calories', () => {
        const macros1 = createTestMacronutrients({ calories: 100 });
        const macros2 = createTestMacronutrients({ calories: 200 });

        expect(macros1.equals(macros2)).toBe(false);
      });

      it('should return false for different protein', () => {
        const macros1 = createTestMacronutrients({ protein: 10 });
        const macros2 = createTestMacronutrients({ protein: 20 });

        expect(macros1.equals(macros2)).toBe(false);
      });

      it('should return false for different carbohydrates', () => {
        const macros1 = createTestMacronutrients({ carbohydrates: 20 });
        const macros2 = createTestMacronutrients({ carbohydrates: 30 });

        expect(macros1.equals(macros2)).toBe(false);
      });

      it('should return false for different fat', () => {
        const macros1 = createTestMacronutrients({ fat: 5 });
        const macros2 = createTestMacronutrients({ fat: 10 });

        expect(macros1.equals(macros2)).toBe(false);
      });
    });

    describe('toObject()', () => {
      it('should return plain object with correct values', () => {
        const props: MacronutrientsProps = {
          calories: 150,
          protein: 12,
          carbohydrates: 20,
          fat: 5,
        };
        const macros = Macronutrients.create(props);
        const obj = macros.toObject();

        expect(obj).toEqual(props);
      });

      it('should return a new object (not reference)', () => {
        const macros = createTestMacronutrients();
        const obj1 = macros.toObject();
        const obj2 = macros.toObject();

        expect(obj1).not.toBe(obj2);
        expect(obj1).toEqual(obj2);
      });
    });
  });
});
