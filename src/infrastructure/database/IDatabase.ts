/**
 * IDatabase - Abstract interface for database operations.
 *
 * This interface abstracts the database implementation, allowing:
 * - Production code to use expo-sqlite (React Native)
 * - Test code to use better-sqlite3 (Node.js)
 */

export interface IDatabase {
  /**
   * Executes a raw SQL statement (no result expected).
   */
  exec(sql: string): Promise<void>;

  /**
   * Runs a SQL statement and returns insert/update result.
   */
  run(
    sql: string,
    params?: unknown[] | Record<string, unknown>,
  ): Promise<{ lastID?: number; changes?: number }>;

  /**
   * Gets a single row from a query.
   */
  get<T>(sql: string, params?: unknown[] | Record<string, unknown>): Promise<T | undefined>;

  /**
   * Gets all rows from a query.
   */
  all<T>(sql: string, params?: unknown[] | Record<string, unknown>): Promise<T[]>;

  /**
   * Begins a transaction.
   */
  beginTransaction(): Promise<void>;

  /**
   * Commits the current transaction.
   */
  commit(): Promise<void>;

  /**
   * Rolls back the current transaction.
   */
  rollback(): Promise<void>;

  /**
   * Closes the database connection.
   */
  close(): Promise<void>;
}

/**
 * Database connection factory function type.
 */
export type DatabaseFactory = () => Promise<IDatabase>;
