/**
 * Food - Domain entity representing a food item definition/template.
 *
 * This entity defines a food's nutritional information and characteristics.
 * It serves as a template that can be referenced by PantryItem for inventory tracking.
 *
 * Domain entities contain business logic and validation rules.
 * They are independent of infrastructure concerns (database, API, UI).
 */

import { FoodCategory } from '@domain/enums/FoodCategory';
import { FoodState } from '@domain/enums/FoodState';
import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';
import { Macronutrients, MacronutrientsProps } from '@domain/value-objects/Macronutrients';

export type FoodId = string;

export interface FoodProps {
  id: FoodId;
  name: string;
  description?: string;
  macronutrients: Macronutrients;
  servingSize: number;
  state: FoodState;
  category: FoodCategory;
  defaultQuantityType: QuantityType;
  defaultUnit: MeasurementUnit;
  brand?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFoodInput {
  id: FoodId;
  name: string;
  description?: string;
  macronutrients: MacronutrientsProps;
  servingSize: number;
  state: FoodState;
  category: FoodCategory;
  defaultQuantityType: QuantityType;
  defaultUnit: MeasurementUnit;
  brand?: string;
  barcode?: string;
}

export interface FoodPersistenceData {
  id: FoodId;
  name: string;
  description?: string;
  macronutrients: MacronutrientsProps;
  servingSize: number;
  state: FoodState;
  category: FoodCategory;
  defaultQuantityType: QuantityType;
  defaultUnit: MeasurementUnit;
  brand?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Food domain entity.
 *
 * Encapsulates business rules and validation for food item definitions.
 */
export class Food {
  private constructor(private readonly props: FoodProps) {
    this.validate();
  }

  /**
   * Creates a new Food entity.
   * Use this factory method to ensure validation.
   */
  static create(input: CreateFoodInput): Food {
    const now = new Date();
    return new Food({
      id: input.id,
      name: input.name,
      description: input.description,
      macronutrients: Macronutrients.create(input.macronutrients),
      servingSize: input.servingSize,
      state: input.state,
      category: input.category,
      defaultQuantityType: input.defaultQuantityType,
      defaultUnit: input.defaultUnit,
      brand: input.brand,
      barcode: input.barcode,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a Food entity from persisted data.
   * Use this when loading from database/API.
   */
  static fromPersistence(data: FoodPersistenceData): Food {
    return new Food({
      id: data.id,
      name: data.name,
      description: data.description,
      macronutrients: Macronutrients.create(data.macronutrients),
      servingSize: data.servingSize,
      state: data.state,
      category: data.category,
      defaultQuantityType: data.defaultQuantityType,
      defaultUnit: data.defaultUnit,
      brand: data.brand,
      barcode: data.barcode,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  /**
   * Validates the food entity according to business rules.
   */
  private validate(): void {
    if (!this.props.id || this.props.id.trim().length === 0) {
      throw new Error('Food ID is required');
    }

    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Food name is required');
    }

    if (this.props.name.length > 200) {
      throw new Error('Food name must be 200 characters or less');
    }

    if (this.props.servingSize <= 0) {
      throw new Error('Serving size must be greater than 0');
    }
  }

  // Getters
  get id(): FoodId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get macronutrients(): Macronutrients {
    return this.props.macronutrients;
  }

  get servingSize(): number {
    return this.props.servingSize;
  }

  get state(): FoodState {
    return this.props.state;
  }

  get category(): FoodCategory {
    return this.props.category;
  }

  get defaultQuantityType(): QuantityType {
    return this.props.defaultQuantityType;
  }

  get defaultUnit(): MeasurementUnit {
    return this.props.defaultUnit;
  }

  get brand(): string | undefined {
    return this.props.brand;
  }

  get barcode(): string | undefined {
    return this.props.barcode;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Calculates macronutrients for a specific quantity.
   *
   * @param quantity - The quantity in the same unit as servingSize
   */
  calculateMacronutrientsForQuantity(quantity: number): Macronutrients {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const ratio = quantity / this.props.servingSize;
    return this.props.macronutrients.calculateForQuantity(ratio);
  }

  /**
   * Updates the food's name.
   */
  updateName(name: string): Food {
    if (!name || name.trim().length === 0) {
      throw new Error('Food name is required');
    }
    if (name.length > 200) {
      throw new Error('Food name must be 200 characters or less');
    }

    return new Food({
      ...this.props,
      name,
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the food's description.
   */
  updateDescription(description: string | undefined): Food {
    return new Food({
      ...this.props,
      description,
      updatedAt: new Date(),
    });
  }

  /**
   * Updates macronutrients.
   */
  updateMacronutrients(macronutrients: MacronutrientsProps): Food {
    return new Food({
      ...this.props,
      macronutrients: Macronutrients.create(macronutrients),
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the food's category.
   */
  updateCategory(category: FoodCategory): Food {
    return new Food({
      ...this.props,
      category,
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the food's state.
   */
  updateState(state: FoodState): Food {
    return new Food({
      ...this.props,
      state,
      updatedAt: new Date(),
    });
  }

  /**
   * Converts the entity to a plain object for persistence.
   */
  toPersistence(): FoodPersistenceData {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      macronutrients: this.props.macronutrients.toObject(),
      servingSize: this.props.servingSize,
      state: this.props.state,
      category: this.props.category,
      defaultQuantityType: this.props.defaultQuantityType,
      defaultUnit: this.props.defaultUnit,
      brand: this.props.brand,
      barcode: this.props.barcode,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}
