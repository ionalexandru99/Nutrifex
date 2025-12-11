/**
 * IFoodRepository - Repository interface for Food entity operations.
 *
 * Defines the contract for persistence operations on Food entities.
 * Implementations will handle database-specific details.
 */

import { Food, FoodId } from '@domain/entities/Food';
import { ISpecification } from '@domain/specifications/ISpecification';

export interface IFoodRepository {
  /**
   * Saves a new Food entity to the repository.
   */
  save(food: Food): Promise<void>;

  /**
   * Finds a Food by its ID.
   * @throws Error if Food is not found
   */
  findById(id: FoodId): Promise<Food>;

  /**
   * Finds a Food by its ID, returning null if not found.
   */
  findByIdOrNull(id: FoodId): Promise<Food | null>;

  /**
   * Finds all Foods matching the given specification.
   */
  find(spec: ISpecification<Food>): Promise<Food[]>;

  /**
   * Finds all Foods without any filters.
   */
  findAll(): Promise<Food[]>;

  /**
   * Updates an existing Food entity.
   */
  update(food: Food): Promise<void>;

  /**
   * Deletes a Food by its ID.
   */
  delete(id: FoodId): Promise<void>;

  /**
   * Counts Foods matching the given specification.
   */
  count(spec: ISpecification<Food>): Promise<number>;

  /**
   * Checks if a Food with the given ID exists.
   */
  exists(id: FoodId): Promise<boolean>;

  /**
   * Finds Foods with pagination support.
   */
  findWithPagination(
    spec: ISpecification<Food>,
    skip: number,
    take: number,
  ): Promise<{ items: Food[]; total: number }>;
}
