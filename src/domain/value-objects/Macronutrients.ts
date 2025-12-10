/**
 * Macronutrients - Value object representing nutritional macronutrients.
 *
 * Immutable value object containing the four main macronutrients.
 * Operations return new instances to maintain immutability.
 */

export interface MacronutrientsProps {
  calories: number; // kcal
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
}

export class Macronutrients {
  private constructor(private readonly props: MacronutrientsProps) {
    this.validate();
  }

  /**
   * Creates a new Macronutrients value object.
   */
  static create(props: MacronutrientsProps): Macronutrients {
    return new Macronutrients({ ...props });
  }

  /**
   * Creates an empty Macronutrients instance (all zeros).
   */
  static empty(): Macronutrients {
    return new Macronutrients({
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    });
  }

  private validate(): void {
    if (this.props.calories < 0) {
      throw new Error('Calories cannot be negative');
    }
    if (this.props.protein < 0) {
      throw new Error('Protein cannot be negative');
    }
    if (this.props.carbohydrates < 0) {
      throw new Error('Carbohydrates cannot be negative');
    }
    if (this.props.fat < 0) {
      throw new Error('Fat cannot be negative');
    }
  }

  get calories(): number {
    return this.props.calories;
  }

  get protein(): number {
    return this.props.protein;
  }

  get carbohydrates(): number {
    return this.props.carbohydrates;
  }

  get fat(): number {
    return this.props.fat;
  }

  /**
   * Calculates macronutrients scaled by a ratio.
   * Useful for calculating nutrition for different serving sizes.
   *
   * @param ratio - The multiplier (e.g., 2 for double serving)
   * @returns A new Macronutrients instance with scaled values
   */
  calculateForQuantity(ratio: number): Macronutrients {
    if (ratio < 0) {
      throw new Error('Ratio cannot be negative');
    }

    return new Macronutrients({
      calories: Math.round(this.props.calories * ratio * 10) / 10,
      protein: Math.round(this.props.protein * ratio * 10) / 10,
      carbohydrates: Math.round(this.props.carbohydrates * ratio * 10) / 10,
      fat: Math.round(this.props.fat * ratio * 10) / 10,
    });
  }

  /**
   * Adds another Macronutrients instance to this one.
   *
   * @param other - The Macronutrients to add
   * @returns A new Macronutrients instance with combined values
   */
  add(other: Macronutrients): Macronutrients {
    return new Macronutrients({
      calories: this.props.calories + other.calories,
      protein: this.props.protein + other.protein,
      carbohydrates: this.props.carbohydrates + other.carbohydrates,
      fat: this.props.fat + other.fat,
    });
  }

  /**
   * Checks equality with another Macronutrients instance.
   */
  equals(other: Macronutrients): boolean {
    return (
      this.props.calories === other.calories &&
      this.props.protein === other.protein &&
      this.props.carbohydrates === other.carbohydrates &&
      this.props.fat === other.fat
    );
  }

  /**
   * Converts to a plain object for persistence.
   */
  toObject(): MacronutrientsProps {
    return { ...this.props };
  }
}
