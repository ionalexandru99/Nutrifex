/**
 * PantryItem - Domain entity representing a food item in inventory.
 *
 * This entity tracks what the user has in their house, including
 * quantity, expiration dates, and storage information.
 * It references a Food entity for nutritional information.
 *
 * Domain entities contain business logic and validation rules.
 * They are independent of infrastructure concerns (database, API, UI).
 */

import { ExpirationType } from '@domain/enums/ExpirationType';
import { ExpirationDate } from '@domain/value-objects/ExpirationDate';
import { Macronutrients } from '@domain/value-objects/Macronutrients';
import { Quantity, QuantityProps } from '@domain/value-objects/Quantity';

import { Food, FoodId } from './Food';

export type PantryItemId = string;

export interface PantryItemProps {
  id: PantryItemId;
  food: Food;
  quantity: Quantity;
  expiration: ExpirationDate;
  purchasedAt?: Date;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePantryItemInput {
  id: PantryItemId;
  food: Food;
  quantity: QuantityProps;
  expiration: {
    date: Date;
    type: ExpirationType;
  };
  purchasedAt?: Date;
  location?: string;
  notes?: string;
}

export interface PantryItemPersistenceData {
  id: PantryItemId;
  foodId: FoodId;
  quantity: QuantityProps;
  expiration: {
    date: string;
    type: ExpirationType;
  };
  purchasedAt?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * PantryItem domain entity.
 *
 * Encapsulates business rules and validation for inventory items.
 */
export class PantryItem {
  private constructor(private readonly props: PantryItemProps) {
    this.validate();
  }

  /**
   * Creates a new PantryItem entity.
   * Use this factory method to ensure validation.
   */
  static create(input: CreatePantryItemInput): PantryItem {
    const now = new Date();
    return new PantryItem({
      id: input.id,
      food: input.food,
      quantity: Quantity.create(input.quantity),
      expiration: ExpirationDate.create(input.expiration),
      purchasedAt: input.purchasedAt,
      location: input.location,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a PantryItem entity from persisted data.
   * Use this when loading from database/API.
   *
   * @param data - The persisted data
   * @param food - The associated Food entity (must be loaded separately)
   */
  static fromPersistence(data: PantryItemPersistenceData, food: Food): PantryItem {
    if (data.foodId !== food.id) {
      throw new Error('Food ID mismatch: provided food does not match persisted foodId');
    }

    return new PantryItem({
      id: data.id,
      food,
      quantity: Quantity.create(data.quantity),
      expiration: ExpirationDate.fromPersistence(data.expiration),
      purchasedAt: data.purchasedAt ? new Date(data.purchasedAt) : undefined,
      location: data.location,
      notes: data.notes,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  /**
   * Validates the pantry item entity according to business rules.
   */
  private validate(): void {
    if (!this.props.id || this.props.id.trim().length === 0) {
      throw new Error('PantryItem ID is required');
    }

    if (!this.props.food) {
      throw new Error('Food reference is required');
    }
  }

  // Getters
  get id(): PantryItemId {
    return this.props.id;
  }

  get food(): Food {
    return this.props.food;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get expiration(): ExpirationDate {
    return this.props.expiration;
  }

  get purchasedAt(): Date | undefined {
    return this.props.purchasedAt ? new Date(this.props.purchasedAt) : undefined;
  }

  get location(): string | undefined {
    return this.props.location;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  /**
   * Checks if the item has expired.
   */
  isExpired(): boolean {
    return this.props.expiration.isExpired();
  }

  /**
   * Checks if the item is expiring soon.
   *
   * @param thresholdDays - Number of days to consider as "soon" (default: 3)
   */
  isExpiringSoon(thresholdDays: number = 3): boolean {
    return this.props.expiration.isExpiringSoon(thresholdDays);
  }

  /**
   * Gets the number of days until expiration.
   */
  daysUntilExpiration(): number {
    return this.props.expiration.daysUntilExpiration();
  }

  /**
   * Checks if the quantity is below a threshold.
   *
   * @param threshold - The minimum amount to consider as "low"
   */
  isLow(threshold: number): boolean {
    return this.props.quantity.amount <= threshold;
  }

  /**
   * Checks if the item is empty (quantity is zero).
   */
  isEmpty(): boolean {
    return this.props.quantity.isEmpty();
  }

  /**
   * Calculates the macronutrients for the current quantity.
   * Note: Assumes quantity is in the same unit as the food's servingSize.
   */
  calculateCurrentMacronutrients(): Macronutrients {
    const ratio = this.props.quantity.amount / this.props.food.servingSize;
    return this.props.food.macronutrients.calculateForQuantity(ratio);
  }

  /**
   * Consumes a portion of this item, reducing the quantity.
   *
   * @param amount - The amount to consume (in the same unit as current quantity)
   */
  consume(amount: number): PantryItem {
    if (amount <= 0) {
      throw new Error('Consume amount must be greater than 0');
    }

    const consumeQuantity = Quantity.create({
      amount,
      unit: this.props.quantity.unit,
      type: this.props.quantity.type,
    });

    return new PantryItem({
      ...this.props,
      quantity: this.props.quantity.subtract(consumeQuantity),
      updatedAt: new Date(),
    });
  }

  /**
   * Adds more quantity to this item.
   *
   * @param amount - The amount to add (in the same unit as current quantity)
   */
  addQuantity(amount: number): PantryItem {
    if (amount <= 0) {
      throw new Error('Add amount must be greater than 0');
    }

    const addQuantity = Quantity.create({
      amount,
      unit: this.props.quantity.unit,
      type: this.props.quantity.type,
    });

    return new PantryItem({
      ...this.props,
      quantity: this.props.quantity.add(addQuantity),
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the quantity directly.
   */
  updateQuantity(quantity: QuantityProps): PantryItem {
    return new PantryItem({
      ...this.props,
      quantity: Quantity.create(quantity),
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the expiration date.
   */
  updateExpiration(expiration: { date: Date; type: ExpirationType }): PantryItem {
    return new PantryItem({
      ...this.props,
      expiration: ExpirationDate.create(expiration),
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the storage location.
   */
  updateLocation(location: string | undefined): PantryItem {
    return new PantryItem({
      ...this.props,
      location,
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the notes.
   */
  updateNotes(notes: string | undefined): PantryItem {
    return new PantryItem({
      ...this.props,
      notes,
      updatedAt: new Date(),
    });
  }

  /**
   * Converts the entity to a plain object for persistence.
   * Note: Food is stored as a reference (foodId) only.
   */
  toPersistence(): PantryItemPersistenceData {
    return {
      id: this.props.id,
      foodId: this.props.food.id,
      quantity: this.props.quantity.toObject(),
      expiration: this.props.expiration.toObject(),
      purchasedAt: this.props.purchasedAt?.toISOString(),
      location: this.props.location,
      notes: this.props.notes,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}
