/**
 * ISpecification - Base interface for the Specification pattern.
 *
 * Specifications encapsulate business rules and can be used for:
 * - Building complex queries in repositories
 * - Validating domain objects
 * - Expressing reusable domain logic
 *
 * @template T The type of entity this specification operates on
 */

export interface ISpecification<T> {
  /**
   * Checks if an entity satisfies this specification.
   */
  isSatisfiedBy(entity: T): boolean;

  /**
   * Gets the SQL WHERE clause representation of this specification.
   * Used by repository implementations for database queries.
   *
   * @returns Object with 'clause' (SQL fragment) and 'params' (bound parameters)
   */
  toWhereClause(): { clause: string; params: Record<string, unknown> };

  /**
   * Combines this specification with another using AND logic.
   */
  and(spec: ISpecification<T>): ISpecification<T>;

  /**
   * Combines this specification with another using OR logic.
   */
  or(spec: ISpecification<T>): ISpecification<T>;

  /**
   * Negates this specification (NOT logic).
   */
  not(): ISpecification<T>;
}
