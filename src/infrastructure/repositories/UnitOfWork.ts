/**
 * UnitOfWork - SQLite implementation of IUnitOfWork.
 *
 * Manages transactions and coordinates multiple repositories.
 * Ensures atomicity of operations across Food and PantryItem aggregates.
 */

import { IFoodRepository } from '@domain/repositories/IFoodRepository';
import { IPantryItemRepository } from '@domain/repositories/IPantryItemRepository';
import { IUnitOfWork } from '@domain/repositories/IUnitOfWork';
import { DatabaseConnection } from '@infrastructure/database/DatabaseConnection';

import { FoodRepository } from './FoodRepository';
import { PantryItemRepository } from './PantryItemRepository';

export class UnitOfWork implements IUnitOfWork {
  private db: DatabaseConnection;
  private _foods: IFoodRepository;
  private _pantryItems: IPantryItemRepository;
  private inTransaction = false;

  constructor() {
    this.db = DatabaseConnection.getInstance();
    this._foods = new FoodRepository();
    this._pantryItems = new PantryItemRepository();
  }

  get foods(): IFoodRepository {
    return this._foods;
  }

  get pantryItems(): IPantryItemRepository {
    return this._pantryItems;
  }

  async beginTransaction(): Promise<void> {
    if (this.inTransaction) {
      throw new Error('Transaction already in progress');
    }

    await this.db.beginTransaction();
    this.inTransaction = true;
  }

  async commit(): Promise<void> {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress');
    }

    try {
      await this.db.commit();
      this.inTransaction = false;
    } catch (error) {
      this.inTransaction = false;
      throw error;
    }
  }

  async rollback(): Promise<void> {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress');
    }

    try {
      await this.db.rollback();
      this.inTransaction = false;
    } catch (error) {
      this.inTransaction = false;
      throw error;
    }
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
