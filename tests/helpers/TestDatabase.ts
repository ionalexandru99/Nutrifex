/**
 * TestDatabase - better-sqlite3 implementation for testing.
 *
 * This implementation uses better-sqlite3 which runs in Node.js,
 * allowing integration tests to run in Jest.
 */

import Database from 'better-sqlite3';

import { IDatabase } from '@infrastructure/database/IDatabase';

export class TestDatabase implements IDatabase {
  private db: Database.Database;
  private inTransaction = false;

  constructor(filename: string = ':memory:') {
    this.db = new Database(filename);
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async run(
    sql: string,
    params?: unknown[] | Record<string, unknown>,
  ): Promise<{ lastID?: number; changes?: number }> {
    const stmt = this.db.prepare(sql);
    const result = Array.isArray(params) ? stmt.run(...params) : stmt.run(params || {});
    return {
      lastID: result.lastInsertRowid as number,
      changes: result.changes,
    };
  }

  async get<T>(sql: string, params?: unknown[] | Record<string, unknown>): Promise<T | undefined> {
    const stmt = this.db.prepare(sql);
    const result = (Array.isArray(params) ? stmt.get(...params) : stmt.get(params || {})) as
      | T
      | undefined;
    return result;
  }

  async all<T>(sql: string, params?: unknown[] | Record<string, unknown>): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    const results = (Array.isArray(params) ? stmt.all(...params) : stmt.all(params || {})) as T[];
    return results;
  }

  async beginTransaction(): Promise<void> {
    if (this.inTransaction) {
      throw new Error('Transaction already in progress');
    }
    this.db.exec('BEGIN TRANSACTION');
    this.inTransaction = true;
  }

  async commit(): Promise<void> {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress');
    }
    this.db.exec('COMMIT');
    this.inTransaction = false;
  }

  async rollback(): Promise<void> {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress');
    }
    this.db.exec('ROLLBACK');
    this.inTransaction = false;
  }

  async close(): Promise<void> {
    this.db.close();
  }

  /**
   * Checks if database is in a transaction.
   */
  isInTransaction(): boolean {
    return this.inTransaction;
  }

  /**
   * Gets the underlying better-sqlite3 database (for advanced testing).
   */
  getUnderlyingDatabase(): Database.Database {
    return this.db;
  }
}

/**
 * Creates a fresh in-memory test database with schema initialized.
 */
export async function createTestDatabase(): Promise<TestDatabase> {
  const db = new TestDatabase(':memory:');

  // Create schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      macronutrients_calories REAL NOT NULL,
      macronutrients_protein REAL NOT NULL,
      macronutrients_carbohydrates REAL NOT NULL,
      macronutrients_fat REAL NOT NULL,
      serving_size REAL NOT NULL,
      state TEXT NOT NULL,
      category TEXT NOT NULL,
      default_quantity_type TEXT NOT NULL,
      default_unit TEXT NOT NULL,
      brand TEXT,
      barcode TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name)
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category)
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS pantry_items (
      id TEXT PRIMARY KEY,
      food_id TEXT NOT NULL,
      quantity_amount REAL NOT NULL,
      quantity_unit TEXT NOT NULL,
      quantity_type TEXT NOT NULL,
      expiration_date TEXT NOT NULL,
      expiration_type TEXT NOT NULL,
      purchased_at TEXT,
      location TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pantry_items_food_id ON pantry_items(food_id)
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pantry_items_expiration_date ON pantry_items(expiration_date)
  `);

  return db;
}
