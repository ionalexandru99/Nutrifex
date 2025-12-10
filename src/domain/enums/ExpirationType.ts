/**
 * ExpirationType - Type of expiration date.
 *
 * Distinguishes between quality-based and safety-based
 * expiration dates.
 */
export enum ExpirationType {
  /** Quality degrades after this date but food is still safe to consume */
  BEST_BEFORE = 'BEST_BEFORE',

  /** Safety deadline - food should not be consumed after this date */
  USE_BY = 'USE_BY',
}
