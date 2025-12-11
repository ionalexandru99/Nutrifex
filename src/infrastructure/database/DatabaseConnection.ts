/**
 * DatabaseConnection - Singleton database connection manager for SQLite.
 *
 * Provides a centralized point for accessing the SQLite database.
 * Handles connection initialization and provides utility methods.
 */

import * as SQLite from 'expo-sqlite';

import { Database, DatabaseError } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpoBindParams = any;

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database | null = null;
  private isInitialized = false;

  private constructor() {}

  /**
   * Gets the singleton instance of DatabaseConnection.
   */
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initializes the database connection.
   * Should be called once at application startup.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync('nutrifex.db');
      this.isInitialized = true;
    } catch (error) {
      throw new DatabaseError(
        `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Gets the database connection.
   * @throws DatabaseError if not initialized
   */
  getDatabase(): Database {
    if (!this.db || !this.isInitialized) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Checks if the database is initialized.
   */
  isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * Closes the database connection.
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
    }
  }

  /**
   * Executes a raw SQL query.
   * @param sql The SQL query string
   */
  async exec(sql: string): Promise<void> {
    try {
      const db = this.getDatabase();
      await db.execAsync(sql);
    } catch (error) {
      throw new DatabaseError(
        `Failed to execute query: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Runs a single SQL statement.
   * @param sql The SQL statement
   * @param params Optional parameters
   */
  async run(sql: string, params?: unknown[]): Promise<{ lastID?: number; changes?: number }> {
    try {
      const db = this.getDatabase();
      const result = await db.runAsync(sql, (params || []) as ExpoBindParams);
      return { lastID: result.lastInsertRowId as number, changes: result.changes };
    } catch (error) {
      throw new DatabaseError(
        `Failed to run statement: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Gets a single row from a query.
   * @param sql The SQL query
   * @param params Optional parameters
   */
  async get<T>(sql: string, params?: unknown[]): Promise<T | undefined> {
    try {
      const db = this.getDatabase();
      const result = await db.getFirstAsync<T>(sql, (params || []) as ExpoBindParams);
      return result ?? undefined;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get row: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Gets all rows from a query.
   * @param sql The SQL query
   * @param params Optional parameters
   */
  async all<T>(sql: string, params?: unknown[]): Promise<T[]> {
    try {
      const db = this.getDatabase();
      const result = await db.getAllAsync<T>(sql, (params || []) as ExpoBindParams);
      return result || [];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get rows: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Begins a transaction.
   */
  async beginTransaction(): Promise<void> {
    try {
      const db = this.getDatabase();
      await db.execAsync('BEGIN TRANSACTION');
    } catch (error) {
      throw new DatabaseError(
        `Failed to begin transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Commits a transaction.
   */
  async commit(): Promise<void> {
    try {
      const db = this.getDatabase();
      await db.execAsync('COMMIT');
    } catch (error) {
      throw new DatabaseError(
        `Failed to commit transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Rolls back a transaction.
   */
  async rollback(): Promise<void> {
    try {
      const db = this.getDatabase();
      await db.execAsync('ROLLBACK');
    } catch (error) {
      throw new DatabaseError(
        `Failed to rollback transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
