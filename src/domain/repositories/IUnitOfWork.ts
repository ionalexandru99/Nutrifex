/**
 * IUnitOfWork - Unit of Work pattern interface for transaction management.
 *
 * Coordinates multiple repositories within a transaction context.
 * Ensures atomicity of operations across multiple aggregates.
 */

import { IFoodRepository } from './IFoodRepository';
import { IPantryItemRepository } from './IPantryItemRepository';

export interface IUnitOfWork {
  /**
   * Gets the Food repository.
   */
  foods: IFoodRepository;

  /**
   * Gets the PantryItem repository.
   */
  pantryItems: IPantryItemRepository;

  /**
   * Begins a transaction.
   */
  beginTransaction(): Promise<void>;

  /**
   * Commits the current transaction.
   */
  commit(): Promise<void>;

  /**
   * Rolls back the current transaction.
   */
  rollback(): Promise<void>;

  /**
   * Executes a callback within a transaction.
   * Automatically commits on success or rolls back on error.
   */
  execute<T>(callback: (unitOfWork: IUnitOfWork) => Promise<T>): Promise<T>;
}
