/**
 * IPantryItemRepository - Repository interface for PantryItem entity operations.
 *
 * Defines the contract for persistence operations on PantryItem entities.
 * Implementations will handle database-specific details and Food relationship loading.
 */

import { FoodId } from '@domain/entities/Food';
import { PantryItem, PantryItemId } from '@domain/entities/PantryItem';
import { ISpecification } from '@domain/specifications/ISpecification';

export interface IPantryItemRepository {
  /**
   * Saves a new PantryItem entity to the repository.
   */
  save(pantryItem: PantryItem): Promise<void>;

  /**
   * Finds a PantryItem by its ID, with associated Food loaded.
   * @throws Error if PantryItem or associated Food is not found
   */
  findById(id: PantryItemId): Promise<PantryItem>;

  /**
   * Finds a PantryItem by its ID, returning null if not found.
   */
  findByIdOrNull(id: PantryItemId): Promise<PantryItem | null>;

  /**
   * Finds all PantryItems matching the given specification.
   */
  find(spec: ISpecification<PantryItem>): Promise<PantryItem[]>;

  /**
   * Finds all PantryItems without any filters.
   */
  findAll(): Promise<PantryItem[]>;

  /**
   * Finds all PantryItems for a specific Food.
   */
  findByFoodId(foodId: FoodId): Promise<PantryItem[]>;

  /**
   * Updates an existing PantryItem entity.
   */
  update(pantryItem: PantryItem): Promise<void>;

  /**
   * Deletes a PantryItem by its ID.
   */
  delete(id: PantryItemId): Promise<void>;

  /**
   * Counts PantryItems matching the given specification.
   */
  count(spec: ISpecification<PantryItem>): Promise<number>;

  /**
   * Checks if a PantryItem with the given ID exists.
   */
  exists(id: PantryItemId): Promise<boolean>;

  /**
   * Finds PantryItems with pagination support.
   */
  findWithPagination(
    spec: ISpecification<PantryItem>,
    skip: number,
    take: number,
  ): Promise<{ items: PantryItem[]; total: number }>;

  /**
   * Deletes all PantryItems for a specific Food (cascade delete).
   */
  deleteByFoodId(foodId: FoodId): Promise<void>;
}
