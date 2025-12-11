/**
 * PantryItemSpecifications - Reusable specifications for PantryItem entity queries.
 *
 * Encapsulates common PantryItem query patterns and business rules.
 */

import { FoodId } from '@domain/entities/Food';
import { PantryItem, PantryItemId } from '@domain/entities/PantryItem';

import { CompositeSpecification } from './CompositeSpecification';

/**
 * Specification for finding a PantryItem by ID.
 */
export class PantryItemByIdSpecification extends CompositeSpecification<PantryItem> {
  constructor(private pantryItemId: PantryItemId) {
    super();
  }

  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.id === this.pantryItemId;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'id = :id',
      params: { id: this.pantryItemId },
    };
  }
}

/**
 * Specification for finding PantryItems by Food ID.
 */
export class PantryItemByFoodIdSpecification extends CompositeSpecification<PantryItem> {
  constructor(private foodId: FoodId) {
    super();
  }

  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.food.id === this.foodId;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'food_id = :foodId',
      params: { foodId: this.foodId },
    };
  }
}

/**
 * Specification for finding expired PantryItems.
 */
export class PantryItemExpiredSpecification extends CompositeSpecification<PantryItem> {
  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.isExpired();
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'expiration_date < :referenceDate',
      params: { referenceDate: new Date().toISOString() },
    };
  }
}

/**
 * Specification for finding PantryItems that are expiring soon.
 */
export class PantryItemExpiringSpecification extends CompositeSpecification<PantryItem> {
  constructor(private thresholdDays: number = 3) {
    super();
  }

  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.isExpiringSoon(this.thresholdDays);
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    const now = new Date();
    const expirationThresholdDate = new Date(now);
    expirationThresholdDate.setDate(expirationThresholdDate.getDate() + this.thresholdDays);

    return {
      clause: 'expiration_date >= :referenceDate AND expiration_date <= :thresholdDate',
      params: {
        referenceDate: now.toISOString(),
        thresholdDate: expirationThresholdDate.toISOString(),
      },
    };
  }
}

/**
 * Specification for finding PantryItems that are not expired.
 */
export class PantryItemNotExpiredSpecification extends CompositeSpecification<PantryItem> {
  isSatisfiedBy(entity: PantryItem): boolean {
    return !entity.isExpired();
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'expiration_date >= :referenceDate',
      params: { referenceDate: new Date().toISOString() },
    };
  }
}

/**
 * Specification for finding PantryItems with low quantity.
 */
export class PantryItemLowQuantitySpecification extends CompositeSpecification<PantryItem> {
  constructor(private threshold: number) {
    super();
  }

  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.isLow(this.threshold);
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'quantity_amount <= :threshold',
      params: { threshold: this.threshold },
    };
  }
}

/**
 * Specification for finding empty PantryItems.
 */
export class PantryItemEmptySpecification extends CompositeSpecification<PantryItem> {
  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.isEmpty();
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'quantity_amount = 0',
      params: {},
    };
  }
}

/**
 * Specification for finding PantryItems by location.
 */
export class PantryItemByLocationSpecification extends CompositeSpecification<PantryItem> {
  constructor(private location: string) {
    super();
  }

  isSatisfiedBy(entity: PantryItem): boolean {
    return entity.location === this.location;
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    return {
      clause: 'location = :location',
      params: { location: this.location },
    };
  }
}

/**
 * Static factory methods for PantryItem specifications.
 */
export class PantryItemSpecifications {
  static byId(pantryItemId: PantryItemId): PantryItemByIdSpecification {
    return new PantryItemByIdSpecification(pantryItemId);
  }

  static byFoodId(foodId: FoodId): PantryItemByFoodIdSpecification {
    return new PantryItemByFoodIdSpecification(foodId);
  }

  static expired(): PantryItemExpiredSpecification {
    return new PantryItemExpiredSpecification();
  }

  static expiring(thresholdDays?: number): PantryItemExpiringSpecification {
    return new PantryItemExpiringSpecification(thresholdDays ?? 3);
  }

  static notExpired(): PantryItemNotExpiredSpecification {
    return new PantryItemNotExpiredSpecification();
  }

  static lowQuantity(threshold: number): PantryItemLowQuantitySpecification {
    return new PantryItemLowQuantitySpecification(threshold);
  }

  static empty(): PantryItemEmptySpecification {
    return new PantryItemEmptySpecification();
  }

  static byLocation(location: string): PantryItemByLocationSpecification {
    return new PantryItemByLocationSpecification(location);
  }
}
