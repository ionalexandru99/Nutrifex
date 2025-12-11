/**
 * PantryItemRepository - SQLite implementation of IPantryItemRepository.
 *
 * Provides persistence operations for PantryItem entities using SQLite.
 * Handles Food relationship loading.
 */

import { FoodId } from '@domain/entities/Food';
import { PantryItem, PantryItemId, Food } from '@domain/entities/PantryItem';
import { IPantryItemRepository } from '@domain/repositories/IPantryItemRepository';
import { ISpecification } from '@domain/specifications/ISpecification';
import { DatabaseConnection } from '@infrastructure/database/DatabaseConnection';
import { FoodMapper, FoodRow } from '@infrastructure/mappers/FoodMapper';
import { PantryItemMapper, PantryItemRow } from '@infrastructure/mappers/PantryItemMapper';

export class PantryItemRepository implements IPantryItemRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async save(pantryItem: PantryItem): Promise<void> {
    const params = PantryItemMapper.getInsertParameters(pantryItem);

    await this.db.run(
      `
      INSERT INTO pantry_items (
        ${PantryItemMapper.getColumnList()}
      ) VALUES (
        ${PantryItemMapper.getParameterPlaceholders()}
      )
    `,
      params,
    );
  }

  async findById(id: PantryItemId): Promise<PantryItem> {
    const pantryItem = await this.findByIdOrNull(id);
    if (!pantryItem) {
      throw new Error(`PantryItem with ID ${id} not found`);
    }
    return pantryItem;
  }

  async findByIdOrNull(id: PantryItemId): Promise<PantryItem | null> {
    const row = await this.db.get<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE id = ?`,
      [id],
    );

    if (!row) {
      return null;
    }

    const food = await this.loadFood(row.food_id);
    return PantryItemMapper.toDomain(row, food);
  }

  async find(spec: ISpecification<PantryItem>): Promise<PantryItem[]> {
    const whereClause = spec.toWhereClause();

    const rows = await this.db.all<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE ${whereClause.clause}`,
      Object.values(whereClause.params),
    );

    return Promise.all(
      rows.map(async (row) => {
        const food = await this.loadFood(row.food_id);
        return PantryItemMapper.toDomain(row, food);
      }),
    );
  }

  async findAll(): Promise<PantryItem[]> {
    const rows = await this.db.all<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items ORDER BY created_at DESC`,
    );

    return Promise.all(
      rows.map(async (row) => {
        const food = await this.loadFood(row.food_id);
        return PantryItemMapper.toDomain(row, food);
      }),
    );
  }

  async findByFoodId(foodId: FoodId): Promise<PantryItem[]> {
    const rows = await this.db.all<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE food_id = ? ORDER BY created_at DESC`,
      [foodId],
    );

    const food = await this.loadFood(foodId);
    return rows.map((row) => PantryItemMapper.toDomain(row, food));
  }

  async update(pantryItem: PantryItem): Promise<void> {
    const params = PantryItemMapper.getUpdateParameters(pantryItem);

    const result = await this.db.run(
      `
      UPDATE pantry_items SET
        food_id = ?,
        quantity_amount = ?,
        quantity_unit = ?,
        quantity_type = ?,
        expiration_date = ?,
        expiration_type = ?,
        purchased_at = ?,
        location = ?,
        notes = ?,
        updated_at = ?
      WHERE id = ?
    `,
      params,
    );

    if ((result.changes ?? 0) === 0) {
      throw new Error(`PantryItem with ID ${pantryItem.id} not found for update`);
    }
  }

  async delete(id: PantryItemId): Promise<void> {
    await this.db.run('DELETE FROM pantry_items WHERE id = ?', [id]);
  }

  async count(spec: ISpecification<PantryItem>): Promise<number> {
    const whereClause = spec.toWhereClause();

    const result = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM pantry_items WHERE ${whereClause.clause}`,
      Object.values(whereClause.params),
    );

    return result?.count ?? 0;
  }

  async exists(id: PantryItemId): Promise<boolean> {
    const result = await this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM pantry_items WHERE id = ?',
      [id],
    );

    return (result?.count ?? 0) > 0;
  }

  async findWithPagination(
    spec: ISpecification<PantryItem>,
    skip: number,
    take: number,
  ): Promise<{ items: PantryItem[]; total: number }> {
    const whereClause = spec.toWhereClause();
    const params = Object.values(whereClause.params);

    // Get total count
    const countResult = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM pantry_items WHERE ${whereClause.clause}`,
      params,
    );
    const total = countResult?.count ?? 0;

    // Get paginated items
    const rows = await this.db.all<PantryItemRow>(
      `
      SELECT ${PantryItemMapper.getColumnList()}
      FROM pantry_items
      WHERE ${whereClause.clause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, take, skip],
    );

    const items = await Promise.all(
      rows.map(async (row) => {
        const food = await this.loadFood(row.food_id);
        return PantryItemMapper.toDomain(row, food);
      }),
    );

    return { items, total };
  }

  async deleteByFoodId(foodId: FoodId): Promise<void> {
    await this.db.run('DELETE FROM pantry_items WHERE food_id = ?', [foodId]);
  }

  /**
   * Helper method to load a Food entity by ID.
   * @throws Error if Food is not found
   */
  private async loadFood(foodId: FoodId): Promise<Food> {
    const row = await this.db.get<FoodRow>(
      `SELECT ${FoodMapper.getColumnList()} FROM foods WHERE id = ?`,
      [foodId],
    );

    if (!row) {
      throw new Error(`Food with ID ${foodId} not found`);
    }

    return FoodMapper.toDomain(row);
  }
}
