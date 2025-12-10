/**
 * ExpirationDate - Value object representing a typed expiration date.
 *
 * Distinguishes between 'best before' (quality) and 'use by' (safety) dates.
 * Provides methods for checking expiration status.
 */

import { ExpirationType } from '@domain/enums/ExpirationType';

export interface ExpirationDateProps {
  date: Date;
  type: ExpirationType;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class ExpirationDate {
  private constructor(private readonly props: ExpirationDateProps) {
    this.validate();
  }

  /**
   * Creates a new ExpirationDate value object.
   */
  static create(props: ExpirationDateProps): ExpirationDate {
    return new ExpirationDate({
      date: new Date(props.date),
      type: props.type,
    });
  }

  /**
   * Creates a 'best before' expiration date.
   */
  static bestBefore(date: Date): ExpirationDate {
    return new ExpirationDate({
      date: new Date(date),
      type: ExpirationType.BEST_BEFORE,
    });
  }

  /**
   * Creates a 'use by' expiration date.
   */
  static useBy(date: Date): ExpirationDate {
    return new ExpirationDate({
      date: new Date(date),
      type: ExpirationType.USE_BY,
    });
  }

  /**
   * Creates an ExpirationDate from persistence data.
   */
  static fromPersistence(props: { date: string | Date; type: ExpirationType }): ExpirationDate {
    return new ExpirationDate({
      date: typeof props.date === 'string' ? new Date(props.date) : props.date,
      type: props.type,
    });
  }

  private validate(): void {
    if (!(this.props.date instanceof Date) || isNaN(this.props.date.getTime())) {
      throw new Error('Invalid expiration date');
    }
  }

  get date(): Date {
    return new Date(this.props.date);
  }

  get type(): ExpirationType {
    return this.props.type;
  }

  /**
   * Checks if the expiration date has passed.
   *
   * @param referenceDate - The date to compare against (defaults to now)
   */
  isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.date < referenceDate;
  }

  /**
   * Calculates the number of days until expiration.
   * Returns negative value if already expired.
   *
   * @param referenceDate - The date to compare against (defaults to now)
   */
  daysUntilExpiration(referenceDate: Date = new Date()): number {
    const diffMs = this.props.date.getTime() - referenceDate.getTime();
    return Math.ceil(diffMs / MS_PER_DAY);
  }

  /**
   * Checks if the item is expiring soon (within threshold).
   *
   * @param thresholdDays - Number of days to consider as "soon" (default: 3)
   * @param referenceDate - The date to compare against (defaults to now)
   */
  isExpiringSoon(thresholdDays: number = 3, referenceDate: Date = new Date()): boolean {
    const daysLeft = this.daysUntilExpiration(referenceDate);
    return daysLeft >= 0 && daysLeft <= thresholdDays;
  }

  /**
   * Checks if this is a safety-critical expiration (use by).
   */
  isSafetyCritical(): boolean {
    return this.props.type === ExpirationType.USE_BY;
  }

  /**
   * Checks equality with another ExpirationDate instance.
   */
  equals(other: ExpirationDate): boolean {
    return this.props.date.getTime() === other.date.getTime() && this.props.type === other.type;
  }

  /**
   * Converts to a plain object for persistence.
   */
  toObject(): { date: string; type: ExpirationType } {
    return {
      date: this.props.date.toISOString(),
      type: this.props.type,
    };
  }
}
