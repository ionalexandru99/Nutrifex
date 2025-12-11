/**
 * CompositeSpecification - Base class for composite specifications.
 *
 * Provides default implementations of AND, OR, and NOT operations
 * for combining specifications.
 */

import { ISpecification } from './ISpecification';

export abstract class CompositeSpecification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(entity: T): boolean;

  abstract toWhereClause(): { clause: string; params: Record<string, unknown> };

  and(spec: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, spec);
  }

  or(spec: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, spec);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>,
  ) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    const leftClause = this.left.toWhereClause();
    const rightClause = this.right.toWhereClause();

    return {
      clause: `(${leftClause.clause}) AND (${rightClause.clause})`,
      params: { ...leftClause.params, ...rightClause.params },
    };
  }
}

class OrSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>,
  ) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity);
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    const leftClause = this.left.toWhereClause();
    const rightClause = this.right.toWhereClause();

    return {
      clause: `(${leftClause.clause}) OR (${rightClause.clause})`,
      params: { ...leftClause.params, ...rightClause.params },
    };
  }
}

class NotSpecification<T> extends CompositeSpecification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return !this.spec.isSatisfiedBy(entity);
  }

  toWhereClause(): { clause: string; params: Record<string, unknown> } {
    const innerClause = this.spec.toWhereClause();
    return {
      clause: `NOT (${innerClause.clause})`,
      params: innerClause.params,
    };
  }
}
