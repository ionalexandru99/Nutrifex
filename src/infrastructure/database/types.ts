/**
 * Database types and interfaces for SQLite operations.
 */

import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Represents a query result from SQLite.
 */
export interface QueryResult<T = unknown> {
  lastID?: number;
  changes?: number;
  rows: T[];
}

/**
 * Represents the raw database connection.
 */
export type Database = SQLiteDatabase;

/**
 * Database error types.
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Migration execution result.
 */
export interface MigrationResult {
  version: number;
  name: string;
  success: boolean;
  executedAt: Date;
  error?: Error;
}
