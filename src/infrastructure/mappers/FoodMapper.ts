/**
 * FoodMapper - Maps between Food domain entity and database representation.
 *
 * Handles conversion from/to database format, serialization of complex types.
 */

import { Food, FoodPersistenceData } from '@domain/entities/Food';
import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodState } from '@domain/enums/FoodState';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';

/**
 * Database row representation of a Food.
 */
export interface FoodRow {
  id: string;
  name: string;
  description?: string;
  macronutrients_calories: number;
  macronutrients_protein: number;
  macronutrients_carbohydrates: number;
  macronutrients_fat: number;
  serving_size: number;
  state: string;
  category: string;
  default_quantity_type: string;
  default_unit: string;
  brand?: string;
  barcode?: string;
  created_at: string;
  updated_at: string;
}

export class FoodMapper {
  /**
   * Converts a Food entity to a database row.
   */
  static toPersistence(food: Food): FoodRow {
    const persistenceData = food.toPersistence();
    return {
      id: persistenceData.id,
      name: persistenceData.name,
      description: persistenceData.description,
      macronutrients_calories: persistenceData.macronutrients.calories,
      macronutrients_protein: persistenceData.macronutrients.protein,
      macronutrients_carbohydrates: persistenceData.macronutrients.carbohydrates,
      macronutrients_fat: persistenceData.macronutrients.fat,
      serving_size: persistenceData.servingSize,
      state: persistenceData.state,
      category: persistenceData.category,
      default_quantity_type: persistenceData.defaultQuantityType,
      default_unit: persistenceData.defaultUnit,
      brand: persistenceData.brand,
      barcode: persistenceData.barcode,
      created_at: persistenceData.createdAt,
      updated_at: persistenceData.updatedAt,
    };
  }

  /**
   * Converts a database row to a Food entity.
   */
  static toDomain(row: FoodRow): Food {
    const persistenceData: FoodPersistenceData = {
      id: row.id,
      name: row.name,
      description: row.description,
      macronutrients: {
        calories: row.macronutrients_calories,
        protein: row.macronutrients_protein,
        carbohydrates: row.macronutrients_carbohydrates,
        fat: row.macronutrients_fat,
      },
      servingSize: row.serving_size,
      state: row.state as FoodState,
      category: row.category as FoodCategory,
      defaultQuantityType: row.default_quantity_type as QuantityType,
      defaultUnit: row.default_unit as MeasurementUnit,
      brand: row.brand,
      barcode: row.barcode,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return Food.fromPersistence(persistenceData);
  }

  /**
   * Gets the SQL column list for a Food table.
   */
  static getColumnList(): string {
    return `
      id,
      name,
      description,
      macronutrients_calories,
      macronutrients_protein,
      macronutrients_carbohydrates,
      macronutrients_fat,
      serving_size,
      state,
      category,
      default_quantity_type,
      default_unit,
      brand,
      barcode,
      created_at,
      updated_at
    `;
  }

  /**
   * Gets the SQL parameter placeholders for a Food insert/update.
   */
  static getParameterPlaceholders(): string {
    return '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
  }

  /**
   * Gets the parameters array for a Food insert/update in order.
   */
  static getInsertParameters(food: Food): unknown[] {
    const row = this.toPersistence(food);
    return [
      row.id,
      row.name,
      row.description,
      row.macronutrients_calories,
      row.macronutrients_protein,
      row.macronutrients_carbohydrates,
      row.macronutrients_fat,
      row.serving_size,
      row.state,
      row.category,
      row.default_quantity_type,
      row.default_unit,
      row.brand,
      row.barcode,
      row.created_at,
      row.updated_at,
    ];
  }

  /**
   * Gets update parameters for a Food, excluding the ID.
   */
  static getUpdateParameters(food: Food): unknown[] {
    const row = this.toPersistence(food);
    return [
      row.name,
      row.description,
      row.macronutrients_calories,
      row.macronutrients_protein,
      row.macronutrients_carbohydrates,
      row.macronutrients_fat,
      row.serving_size,
      row.state,
      row.category,
      row.default_quantity_type,
      row.default_unit,
      row.brand,
      row.barcode,
      row.updated_at,
      row.id,
    ];
  }
}
