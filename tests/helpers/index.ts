import { Food, CreateFoodInput } from '@domain/entities/Food';
import { PantryItem, CreatePantryItemInput } from '@domain/entities/PantryItem';
import { ExpirationType } from '@domain/enums/ExpirationType';
import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodState } from '@domain/enums/FoodState';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';
import { ExpirationDate } from '@domain/value-objects/ExpirationDate';
import { Macronutrients, MacronutrientsProps } from '@domain/value-objects/Macronutrients';
import { Quantity, QuantityProps } from '@domain/value-objects/Quantity';

/**
 * Default macronutrients for testing.
 */
export const DEFAULT_MACRONUTRIENTS = Object.freeze<MacronutrientsProps>({
  calories: 200,
  protein: 10,
  carbohydrates: 25,
  fat: 8,
});

/**
 * Creates a test Macronutrients instance with optional overrides.
 */
export function createTestMacronutrients(
  overrides: Partial<MacronutrientsProps> = {},
): Macronutrients {
  return Macronutrients.create({
    ...DEFAULT_MACRONUTRIENTS,
    ...overrides,
  });
}

/**
 * Default quantity props for testing (weight-based).
 */
export const DEFAULT_QUANTITY_PROPS = Object.freeze<QuantityProps>({
  amount: 100,
  unit: MeasurementUnit.GRAM,
  type: QuantityType.BY_WEIGHT,
});

/**
 * Creates a test Quantity instance with optional overrides.
 */
export function createTestQuantity(overrides: Partial<QuantityProps> = {}): Quantity {
  return Quantity.create({
    ...DEFAULT_QUANTITY_PROPS,
    ...overrides,
  });
}

/**
 * Creates a test ExpirationDate instance.
 * Default: 7 days from now, BEST_BEFORE type.
 */
export function createTestExpirationDate(
  offsetDays: number = 7,
  type: ExpirationType = ExpirationType.BEST_BEFORE,
): ExpirationDate {
  const date = daysFromNow(offsetDays);
  return ExpirationDate.create({ date, type });
}

/**
 * Default Food input for testing.
 */
export const DEFAULT_FOOD_INPUT = Object.freeze<CreateFoodInput>({
  id: 'food-1',
  name: 'Test Food',
  description: 'A test food item',
  macronutrients: DEFAULT_MACRONUTRIENTS,
  servingSize: 100,
  state: FoodState.SOLID,
  category: FoodCategory.OTHER,
  defaultQuantityType: QuantityType.BY_WEIGHT,
  defaultUnit: MeasurementUnit.GRAM,
  brand: 'Test Brand',
  barcode: '1234567890',
});

/**
 * Creates a test Food instance with optional overrides.
 */
export function createTestFood(overrides: Partial<CreateFoodInput> = {}): Food {
  return Food.create({
    ...DEFAULT_FOOD_INPUT,
    ...overrides,
  });
}

/**
 * Creates a test PantryItem instance with optional overrides.
 */
export function createTestPantryItem(overrides: Partial<CreatePantryItemInput> = {}): PantryItem {
  const { food, ...rest } = overrides;
  const resolvedFood = food ?? createTestFood();
  const expirationDate = daysFromNow(7);

  return PantryItem.create({
    id: 'pantry-item-1',
    food: resolvedFood,
    quantity: DEFAULT_QUANTITY_PROPS,
    expiration: {
      date: expirationDate,
      type: ExpirationType.BEST_BEFORE,
    },
    ...rest,
  });
}

/**
 * Creates a date relative to now.
 */
export function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Creates a date in the past.
 */
export function daysAgo(days: number): Date {
  return daysFromNow(-days);
}
