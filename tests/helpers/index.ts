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
export const DEFAULT_MACRONUTRIENTS: MacronutrientsProps = {
  calories: 200,
  protein: 10,
  carbohydrates: 25,
  fat: 8,
};

/**
 * Creates a test macronutrients object by merging default macronutrients with provided overrides.
 *
 * @param overrides - Partial properties to override the defaults
 * @returns A Macronutrients instance constructed from the merged properties
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
export const DEFAULT_QUANTITY_PROPS: QuantityProps = {
  amount: 100,
  unit: MeasurementUnit.GRAM,
  type: QuantityType.BY_WEIGHT,
};

/**
 * Create a Quantity test fixture, applying any provided property overrides.
 *
 * @param overrides - Partial properties to merge with the default quantity props
 * @returns A `Quantity` instance built from the defaults merged with `overrides`
 */
export function createTestQuantity(overrides: Partial<QuantityProps> = {}): Quantity {
  return Quantity.create({
    ...DEFAULT_QUANTITY_PROPS,
    ...overrides,
  });
}

/**
 * Creates a test ExpirationDate for a date offset from now with the specified expiration type.
 *
 * @param daysFromNow - Number of days from the current date to set the expiration (defaults to 7)
 * @param type - Expiration type to assign to the date (defaults to `ExpirationType.BEST_BEFORE`)
 * @returns The created ExpirationDate with the computed date and specified type
 */
export function createTestExpirationDate(
  daysFromNow: number = 7,
  type: ExpirationType = ExpirationType.BEST_BEFORE,
): ExpirationDate {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return ExpirationDate.create({ date, type });
}

/**
 * Default Food input for testing.
 */
export const DEFAULT_FOOD_INPUT: CreateFoodInput = {
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
};

/**
 * Create a test Food using default values merged with any provided overrides.
 *
 * @param overrides - Partial fields to override the default test `CreateFoodInput`
 * @returns A `Food` constructed from the default test input merged with `overrides`
 */
export function createTestFood(overrides: Partial<CreateFoodInput> = {}): Food {
  return Food.create({
    ...DEFAULT_FOOD_INPUT,
    ...overrides,
  });
}

/**
 * Create a PantryItem pre-populated with sensible test defaults and optional overrides.
 *
 * The created item uses `id` "pantry-item-1", a quantity from DEFAULT_QUANTITY_PROPS,
 * an expiration date 7 days from now with type `ExpirationType.BEST_BEFORE`, and either
 * the supplied `overrides.food` or a newly created test Food when `food` is omitted.
 *
 * @param overrides - Partial properties to override on the created PantryItem. May include a `food` instance to use instead of creating a test Food.
 * @returns The newly created PantryItem instance.
 */
export function createTestPantryItem(
  overrides: Partial<Omit<CreatePantryItemInput, 'food'>> & { food?: Food } = {},
): PantryItem {
  const food = overrides.food ?? createTestFood();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  return PantryItem.create({
    id: 'pantry-item-1',
    food,
    quantity: DEFAULT_QUANTITY_PROPS,
    expiration: {
      date: expirationDate,
      type: ExpirationType.BEST_BEFORE,
    },
    ...overrides,
  });
}

/**
 * Create a Date offset by the given number of days from now.
 *
 * @param days - Number of days to offset; positive for future dates, negative for past dates
 * @returns A Date representing the current date and time shifted by `days` days
 */
export function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Produce a Date representing the specified number of days before now.
 *
 * @param days - Number of days in the past
 * @returns A Date representing the time `days` days before the current date/time
 */
export function daysAgo(days: number): Date {
  return daysFromNow(-days);
}