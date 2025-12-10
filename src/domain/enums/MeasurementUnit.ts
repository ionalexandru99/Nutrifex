/**
 * MeasurementUnit - Units for measuring food quantities.
 *
 * Supports weight, volume, and count-based measurements
 * to allow flexible quantity tracking.
 */
export enum MeasurementUnit {
  // Weight
  GRAM = 'GRAM',
  KILOGRAM = 'KILOGRAM',

  // Volume
  MILLILITER = 'MILLILITER',
  LITER = 'LITER',

  // Count
  PIECE = 'PIECE',
  SERVING = 'SERVING',
}
