/**
 * Quantity - Value object representing an amount with a unit.
 *
 * Immutable value object for tracking food quantities.
 * Supports weight, volume, and count-based measurements.
 */

import { MeasurementUnit } from '@domain/enums/MeasurementUnit';
import { QuantityType } from '@domain/enums/QuantityType';

export interface QuantityProps {
  amount: number;
  unit: MeasurementUnit;
  type: QuantityType;
}

const WEIGHT_UNITS = [MeasurementUnit.GRAM, MeasurementUnit.KILOGRAM];
const VOLUME_UNITS = [MeasurementUnit.MILLILITER, MeasurementUnit.LITER];
const COUNT_UNITS = [MeasurementUnit.PIECE, MeasurementUnit.SERVING];

export class Quantity {
  private constructor(private readonly props: QuantityProps) {
    this.validate();
  }

  /**
   * Creates a new Quantity value object.
   */
  static create(props: QuantityProps): Quantity {
    return new Quantity({ ...props });
  }

  /**
   * Creates a zero quantity with the specified unit and type.
   */
  static zero(unit: MeasurementUnit, type: QuantityType): Quantity {
    return new Quantity({ amount: 0, unit, type });
  }

  /**
   * Convenience factory for weight-based quantity.
   */
  static byWeight(amount: number, unit: MeasurementUnit.GRAM | MeasurementUnit.KILOGRAM): Quantity {
    return new Quantity({
      amount,
      unit,
      type: QuantityType.BY_WEIGHT,
    });
  }

  /**
   * Convenience factory for volume-based quantity.
   */
  static byVolume(
    amount: number,
    unit: MeasurementUnit.MILLILITER | MeasurementUnit.LITER,
  ): Quantity {
    return new Quantity({
      amount,
      unit,
      type: QuantityType.BY_VOLUME,
    });
  }

  /**
   * Convenience factory for count-based quantity.
   */
  static byUnit(amount: number, unit: MeasurementUnit.PIECE | MeasurementUnit.SERVING): Quantity {
    return new Quantity({
      amount,
      unit,
      type: QuantityType.BY_UNIT,
    });
  }

  private validate(): void {
    if (this.props.amount < 0) {
      throw new Error('Quantity amount cannot be negative');
    }

    if (!this.isUnitCompatibleWithType(this.props.unit, this.props.type)) {
      throw new Error(`Unit ${this.props.unit} is not compatible with type ${this.props.type}`);
    }
  }

  private isUnitCompatibleWithType(unit: MeasurementUnit, type: QuantityType): boolean {
    switch (type) {
      case QuantityType.BY_WEIGHT:
        return WEIGHT_UNITS.includes(unit);
      case QuantityType.BY_VOLUME:
        return VOLUME_UNITS.includes(unit);
      case QuantityType.BY_UNIT:
        return COUNT_UNITS.includes(unit);
      default:
        return false;
    }
  }

  get amount(): number {
    return this.props.amount;
  }

  get unit(): MeasurementUnit {
    return this.props.unit;
  }

  get type(): QuantityType {
    return this.props.type;
  }

  /**
   * Checks if the quantity is zero or empty.
   */
  isEmpty(): boolean {
    return this.props.amount === 0;
  }

  /**
   * Adds another quantity to this one.
   * Both quantities must have the same unit.
   *
   * @param other - The Quantity to add
   * @returns A new Quantity instance with the combined amount
   */
  add(other: Quantity): Quantity {
    if (this.props.unit !== other.unit) {
      throw new Error('Cannot add quantities with different units');
    }

    return new Quantity({
      amount: this.props.amount + other.amount,
      unit: this.props.unit,
      type: this.props.type,
    });
  }

  /**
   * Subtracts another quantity from this one.
   * Both quantities must have the same unit.
   * Result cannot be negative.
   *
   * @param other - The Quantity to subtract
   * @returns A new Quantity instance with the reduced amount
   */
  subtract(other: Quantity): Quantity {
    if (this.props.unit !== other.unit) {
      throw new Error('Cannot subtract quantities with different units');
    }

    const newAmount = this.props.amount - other.amount;
    if (newAmount < 0) {
      throw new Error('Cannot subtract: result would be negative');
    }

    return new Quantity({
      amount: newAmount,
      unit: this.props.unit,
      type: this.props.type,
    });
  }

  /**
   * Checks equality with another Quantity instance.
   */
  equals(other: Quantity): boolean {
    return (
      this.props.amount === other.amount &&
      this.props.unit === other.unit &&
      this.props.type === other.type
    );
  }

  /**
   * Converts to a plain object for persistence.
   */
  toObject(): QuantityProps {
    return { ...this.props };
  }
}
