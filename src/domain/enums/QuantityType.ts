/**
 * QuantityType - How food quantity is tracked.
 *
 * Determines the measurement approach for a food item,
 * allowing flexible user-defined tracking.
 */
export enum QuantityType {
  BY_WEIGHT = 'BY_WEIGHT',
  BY_VOLUME = 'BY_VOLUME',
  BY_UNIT = 'BY_UNIT',
}
