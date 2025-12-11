/**
 * PantryItemMapper - Maps between PantryItem domain entity and database representation.
 *
 * Handles conversion from/to database format, serialization of complex types.
 */

import { Food } from '@domain/entities/Food';
import { PantryItem, PantryItemPersistenceData } from '@domain/entities/PantryItem';
import { ExpirationType } from '@domain/enums/ExpirationType';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';

/**
 * Database row representation of a PantryItem.
 */
export interface PantryItemRow {
  id: string;
  food_id: string;
  quantity_amount: number;
  quantity_unit: string;
  quantity_type: string;
  expiration_date: string;
  expiration_type: string;
  purchased_at?: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class PantryItemMapper {
  /**
   * Converts a PantryItem entity to a database row.
   */
  static toPersistence(pantryItem: PantryItem): PantryItemRow {
    const persistenceData = pantryItem.toPersistence();
    return {
      id: persistenceData.id,
      food_id: persistenceData.foodId,
      quantity_amount: persistenceData.quantity.amount,
      quantity_unit: persistenceData.quantity.unit,
      quantity_type: persistenceData.quantity.type,
      expiration_date: persistenceData.expiration.date,
      expiration_type: persistenceData.expiration.type,
      purchased_at: persistenceData.purchasedAt,
      location: persistenceData.location,
      notes: persistenceData.notes,
      created_at: persistenceData.createdAt,
      updated_at: persistenceData.updatedAt,
    };
  }

  /**
   * Converts a database row to a PantryItem entity.
   * Requires the associated Food entity.
   */
  static toDomain(row: PantryItemRow, food: Food): PantryItem {
    const persistenceData: PantryItemPersistenceData = {
      id: row.id,
      foodId: row.food_id,
      quantity: {
        amount: row.quantity_amount,
        unit: row.quantity_unit as MeasurementUnit,
        type: row.quantity_type as QuantityType,
      },
      expiration: {
        date: row.expiration_date,
        type: row.expiration_type as ExpirationType,
      },
      purchasedAt: row.purchased_at,
      location: row.location,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return PantryItem.fromPersistence(persistenceData, food);
  }

  /**
   * Gets the SQL column list for a PantryItem table.
   */
  static getColumnList(): string {
    return `
      id,
      food_id,
      quantity_amount,
      quantity_unit,
      quantity_type,
      expiration_date,
      expiration_type,
      purchased_at,
      location,
      notes,
      created_at,
      updated_at
    `;
  }

  /**
   * Gets the SQL parameter placeholders for a PantryItem insert/update.
   */
  static getParameterPlaceholders(): string {
    return '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
  }

  /**
   * Gets the parameters array for a PantryItem insert/update in order.
   */
  static getInsertParameters(pantryItem: PantryItem): unknown[] {
    const row = this.toPersistence(pantryItem);
    return [
      row.id,
      row.food_id,
      row.quantity_amount,
      row.quantity_unit,
      row.quantity_type,
      row.expiration_date,
      row.expiration_type,
      row.purchased_at,
      row.location,
      row.notes,
      row.created_at,
      row.updated_at,
    ];
  }

  /**
   * Gets update parameters for a PantryItem, excluding the ID.
   */
  static getUpdateParameters(pantryItem: PantryItem): unknown[] {
    const row = this.toPersistence(pantryItem);
    return [
      row.food_id,
      row.quantity_amount,
      row.quantity_unit,
      row.quantity_type,
      row.expiration_date,
      row.expiration_type,
      row.purchased_at,
      row.location,
      row.notes,
      row.updated_at,
      row.id,
    ];
  }
}
