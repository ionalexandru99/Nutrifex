/**
 * FoodRepository - SQLite implementation of IFoodRepository.
 *
 * Provides persistence operations for Food entities using SQLite.
 */

import { Food, FoodId } from '@domain/entities/Food';
import { IFoodRepository } from '@domain/repositories/IFoodRepository';
import { ISpecification } from '@domain/specifications/ISpecification';
import { DatabaseConnection } from '@infrastructure/database/DatabaseConnection';
import { FoodMapper, FoodRow } from '@infrastructure/mappers/FoodMapper';

export class FoodRepository implements IFoodRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async save(food: Food): Promise<void> {
    const params = FoodMapper.getInsertParameters(food);

    await this.db.run(
      `
      INSERT INTO foods (
        ${FoodMapper.getColumnList()}
      ) VALUES (
        ${FoodMapper.getParameterPlaceholders()}
      )
    `,
      params,
    );
  }

  async findById(id: FoodId): Promise<Food> {
    const food = await this.findByIdOrNull(id);
    if (!food) {
      throw new Error(`Food with ID ${id} not found`);
    }
    return food;
  }

  async findByIdOrNull(id: FoodId): Promise<Food | null> {
    const row = await this.db.get<FoodRow>(
      `SELECT ${FoodMapper.getColumnList()} FROM foods WHERE id = ?`,
      [id],
    );

    if (!row) {
      return null;
    }

    return FoodMapper.toDomain(row);
  }

  async find(spec: ISpecification<Food>): Promise<Food[]> {
    const whereClause = spec.toWhereClause();

    const rows = await this.db.all<FoodRow>(
      `SELECT ${FoodMapper.getColumnList()} FROM foods WHERE ${whereClause.clause}`,
      Object.values(whereClause.params),
    );

    return rows.map((row) => FoodMapper.toDomain(row));
  }

  async findAll(): Promise<Food[]> {
    const rows = await this.db.all<FoodRow>(
      `SELECT ${FoodMapper.getColumnList()} FROM foods ORDER BY name ASC`,
    );

    return rows.map((row) => FoodMapper.toDomain(row));
  }

  async update(food: Food): Promise<void> {
    const params = FoodMapper.getUpdateParameters(food);

    const result = await this.db.run(
      `
      UPDATE foods SET
        name = ?,
        description = ?,
        macronutrients_calories = ?,
        macronutrients_protein = ?,
        macronutrients_carbohydrates = ?,
        macronutrients_fat = ?,
        serving_size = ?,
        state = ?,
        category = ?,
        default_quantity_type = ?,
        default_unit = ?,
        brand = ?,
        barcode = ?,
        updated_at = ?
      WHERE id = ?
    `,
      params,
    );

    if ((result.changes ?? 0) === 0) {
      throw new Error(`Food with ID ${food.id} not found for update`);
    }
  }

  async delete(id: FoodId): Promise<void> {
    await this.db.run('DELETE FROM foods WHERE id = ?', [id]);
  }

  async count(spec: ISpecification<Food>): Promise<number> {
    const whereClause = spec.toWhereClause();

    const result = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM foods WHERE ${whereClause.clause}`,
      Object.values(whereClause.params),
    );

    return result?.count ?? 0;
  }

  async exists(id: FoodId): Promise<boolean> {
    const result = await this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM foods WHERE id = ?',
      [id],
    );

    return (result?.count ?? 0) > 0;
  }

  async findWithPagination(
    spec: ISpecification<Food>,
    skip: number,
    take: number,
  ): Promise<{ items: Food[]; total: number }> {
    const whereClause = spec.toWhereClause();
    const params = Object.values(whereClause.params);

    // Get total count
    const countResult = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM foods WHERE ${whereClause.clause}`,
      params,
    );
    const total = countResult?.count ?? 0;

    // Get paginated items
    const rows = await this.db.all<FoodRow>(
      `
      SELECT ${FoodMapper.getColumnList()}
      FROM foods
      WHERE ${whereClause.clause}
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `,
      [...params, take, skip],
    );

    return {
      items: rows.map((row) => FoodMapper.toDomain(row)),
      total,
    };
  }
}
