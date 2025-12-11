/**
 * Test repository implementations that use IDatabase interface.
 *
 * These are lightweight wrappers that allow integration testing
 * with better-sqlite3 in Node.js/Jest.
 */

import { Food, FoodId } from '@domain/entities/Food';
import { PantryItem, PantryItemId } from '@domain/entities/PantryItem';
import { IFoodRepository } from '@domain/repositories/IFoodRepository';
import { IPantryItemRepository } from '@domain/repositories/IPantryItemRepository';
import { IUnitOfWork } from '@domain/repositories/IUnitOfWork';
import { ISpecification } from '@domain/specifications/ISpecification';
import { IDatabase } from '@infrastructure/database/IDatabase';
import { FoodMapper, FoodRow } from '@infrastructure/mappers/FoodMapper';
import { PantryItemMapper, PantryItemRow } from '@infrastructure/mappers/PantryItemMapper';

/**
 * Test implementation of FoodRepository using IDatabase.
 */
export class TestFoodRepository implements IFoodRepository {
  constructor(private db: IDatabase) {}

  async save(food: Food): Promise<void> {
    const params = FoodMapper.getInsertParameters(food);
    await this.db.run(
      `INSERT INTO foods (${FoodMapper.getColumnList()}) VALUES (${FoodMapper.getParameterPlaceholders()})`,
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
    if (!row) return null;
    return FoodMapper.toDomain(row);
  }

  async find(spec: ISpecification<Food>): Promise<Food[]> {
    const whereClause = spec.toWhereClause();
    const rows = await this.db.all<FoodRow>(
      `SELECT ${FoodMapper.getColumnList()} FROM foods WHERE ${whereClause.clause}`,
      whereClause.params,
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
      `UPDATE foods SET
        name = ?, description = ?, macronutrients_calories = ?, macronutrients_protein = ?,
        macronutrients_carbohydrates = ?, macronutrients_fat = ?, serving_size = ?,
        state = ?, category = ?, default_quantity_type = ?, default_unit = ?,
        brand = ?, barcode = ?, updated_at = ?
      WHERE id = ?`,
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
      whereClause.params,
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

    const countResult = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM foods WHERE ${whereClause.clause}`,
      whereClause.params,
    );
    const total = countResult?.count ?? 0;

    const rows = await this.db.all<FoodRow>(
      `SELECT ${FoodMapper.getColumnList()} FROM foods WHERE ${whereClause.clause} ORDER BY name ASC LIMIT :take OFFSET :skip`,
      { ...whereClause.params, take, skip },
    );

    return {
      items: rows.map((row) => FoodMapper.toDomain(row)),
      total,
    };
  }
}

/**
 * Test implementation of PantryItemRepository using IDatabase.
 */
export class TestPantryItemRepository implements IPantryItemRepository {
  constructor(
    private db: IDatabase,
    private foodRepository: IFoodRepository,
  ) {}

  async save(pantryItem: PantryItem): Promise<void> {
    const params = PantryItemMapper.getInsertParameters(pantryItem);
    await this.db.run(
      `INSERT INTO pantry_items (${PantryItemMapper.getColumnList()}) VALUES (${PantryItemMapper.getParameterPlaceholders()})`,
      params,
    );
  }

  async findById(id: PantryItemId): Promise<PantryItem> {
    const item = await this.findByIdOrNull(id);
    if (!item) {
      throw new Error(`PantryItem with ID ${id} not found`);
    }
    return item;
  }

  async findByIdOrNull(id: PantryItemId): Promise<PantryItem | null> {
    const row = await this.db.get<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE id = ?`,
      [id],
    );
    if (!row) return null;
    const food = await this.foodRepository.findById(row.food_id);
    return PantryItemMapper.toDomain(row, food);
  }

  async find(spec: ISpecification<PantryItem>): Promise<PantryItem[]> {
    const whereClause = spec.toWhereClause();
    const rows = await this.db.all<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE ${whereClause.clause}`,
      whereClause.params,
    );
    return Promise.all(
      rows.map(async (row) => {
        const food = await this.foodRepository.findById(row.food_id);
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
        const food = await this.foodRepository.findById(row.food_id);
        return PantryItemMapper.toDomain(row, food);
      }),
    );
  }

  async findByFoodId(foodId: FoodId): Promise<PantryItem[]> {
    const rows = await this.db.all<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE food_id = ? ORDER BY created_at DESC`,
      [foodId],
    );
    if (rows.length === 0) return [];
    const food = await this.foodRepository.findById(foodId);
    return rows.map((row) => PantryItemMapper.toDomain(row, food));
  }

  async update(pantryItem: PantryItem): Promise<void> {
    const params = PantryItemMapper.getUpdateParameters(pantryItem);
    const result = await this.db.run(
      `UPDATE pantry_items SET
        food_id = ?, quantity_amount = ?, quantity_unit = ?, quantity_type = ?,
        expiration_date = ?, expiration_type = ?, purchased_at = ?,
        location = ?, notes = ?, updated_at = ?
      WHERE id = ?`,
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
      whereClause.params,
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

    const countResult = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM pantry_items WHERE ${whereClause.clause}`,
      whereClause.params,
    );
    const total = countResult?.count ?? 0;

    const rows = await this.db.all<PantryItemRow>(
      `SELECT ${PantryItemMapper.getColumnList()} FROM pantry_items WHERE ${whereClause.clause} ORDER BY created_at DESC LIMIT :take OFFSET :skip`,
      { ...whereClause.params, take, skip },
    );

    const items = await Promise.all(
      rows.map(async (row) => {
        const food = await this.foodRepository.findById(row.food_id);
        return PantryItemMapper.toDomain(row, food);
      }),
    );

    return { items, total };
  }

  async deleteByFoodId(foodId: FoodId): Promise<void> {
    await this.db.run('DELETE FROM pantry_items WHERE food_id = ?', [foodId]);
  }
}

/**
 * Test implementation of UnitOfWork using IDatabase.
 */
export class TestUnitOfWork implements IUnitOfWork {
  private _foods: IFoodRepository;
  private _pantryItems: IPantryItemRepository;

  constructor(private db: IDatabase) {
    this._foods = new TestFoodRepository(db);
    this._pantryItems = new TestPantryItemRepository(db, this._foods);
  }

  get foods(): IFoodRepository {
    return this._foods;
  }

  get pantryItems(): IPantryItemRepository {
    return this._pantryItems;
  }

  async beginTransaction(): Promise<void> {
    await this.db.beginTransaction();
  }

  async commit(): Promise<void> {
    await this.db.commit();
  }

  async rollback(): Promise<void> {
    await this.db.rollback();
  }

  async execute<T>(callback: (unitOfWork: IUnitOfWork) => Promise<T>): Promise<T> {
    await this.beginTransaction();
    try {
      const result = await callback(this);
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}
