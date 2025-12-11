/**
 * FoodSpecifications - Reusable specifications for Food entity queries.
 *
 * Encapsulates common Food query patterns and business rules.
 */

import { Food, FoodId } from '@domain/entities/Food';
import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodState } from '@domain/enums/FoodState';

import { CompositeSpecification } from './CompositeSpecification';

/**
 * Specification for finding a Food by ID.
 */
export class FoodByIdSpecification extends CompositeSpecification<Food> {
  constructor(private foodId: FoodId) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.id === this.foodId;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'id = :id',
      params: { id: this.foodId },
    };
  }
}

/**
 * Specification for finding Foods by category.
 */
export class FoodByCategorySpecification extends CompositeSpecification<Food> {
  constructor(private category: FoodCategory) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.category === this.category;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'category = :category',
      params: { category: this.category },
    };
  }
}

/**
 * Specification for finding Foods by state.
 */
export class FoodByStateSpecification extends CompositeSpecification<Food> {
  constructor(private state: FoodState) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.state === this.state;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'state = :state',
      params: { state: this.state },
    };
  }
}

/**
 * Specification for searching Foods by name (case-insensitive substring match).
 */
export class FoodByNameSearchSpecification extends CompositeSpecification<Food> {
  constructor(private searchTerm: string) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'LOWER(name) LIKE :searchTerm',
      params: { searchTerm: `%${this.searchTerm.toLowerCase()}%` },
    };
  }
}

/**
 * Specification for finding Foods with a minimum calorie count.
 */
export class FoodWithMinCaloriesSpecification extends CompositeSpecification<Food> {
  constructor(private minCalories: number) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.macronutrients.calories >= this.minCalories;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'macronutrients_calories >= :minCalories',
      params: { minCalories: this.minCalories },
    };
  }
}

/**
 * Specification for finding Foods with a maximum calorie count.
 */
export class FoodWithMaxCaloriesSpecification extends CompositeSpecification<Food> {
  constructor(private maxCalories: number) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.macronutrients.calories <= this.maxCalories;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'macronutrients_calories <= :maxCalories',
      params: { maxCalories: this.maxCalories },
    };
  }
}

/**
 * Specification for finding Foods by brand.
 */
export class FoodByBrandSpecification extends CompositeSpecification<Food> {
  constructor(private brand: string) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.brand === this.brand;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'brand = :brand',
      params: { brand: this.brand },
    };
  }
}

/**
 * Specification for finding Foods with a barcode.
 */
export class FoodByBarcodeSpecification extends CompositeSpecification<Food> {
  constructor(private barcode: string) {
    super();
  }

  isSatisfiedBy(entity: Food): boolean {
    return entity.barcode === this.barcode;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'barcode = :barcode',
      params: { barcode: this.barcode },
    };
  }
}

/**
 * Static factory methods for Food specifications.
 */
export class FoodSpecifications {
  static byId(foodId: FoodId): FoodByIdSpecification {
    return new FoodByIdSpecification(foodId);
  }

  static byCategory(category: FoodCategory): FoodByCategorySpecification {
    return new FoodByCategorySpecification(category);
  }

  static byState(state: FoodState): FoodByStateSpecification {
    return new FoodByStateSpecification(state);
  }

  static byNameSearch(searchTerm: string): FoodByNameSearchSpecification {
    return new FoodByNameSearchSpecification(searchTerm);
  }

  static withMinCalories(minCalories: number): FoodWithMinCaloriesSpecification {
    return new FoodWithMinCaloriesSpecification(minCalories);
  }

  static withMaxCalories(maxCalories: number): FoodWithMaxCaloriesSpecification {
    return new FoodWithMaxCaloriesSpecification(maxCalories);
  }

  static byBrand(brand: string): FoodByBrandSpecification {
    return new FoodByBrandSpecification(brand);
  }

  static byBarcode(barcode: string): FoodByBarcodeSpecification {
    return new FoodByBarcodeSpecification(barcode);
  }
}
