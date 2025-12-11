/**
 * Migration 001 - Initial schema for Food and PantryItem tables.
 */

import { DatabaseConnection } from '../DatabaseConnection';

import { Migration } from './Migration';

export class Migration001InitialSchema implements Migration {
  version = 1;
  name = 'initial_schema';

  async up(): Promise<void> {
    const db = DatabaseConnection.getInstance();

    // Create foods table
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

    // Create index on name for faster searches
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name)
    `);

    // Create index on category
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category)
    `);

    // Create index on state
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_foods_state ON foods(state)
    `);

    // Create index on barcode for quick lookup
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_foods_barcode ON foods(barcode)
    `);

    // Create pantry_items table
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

    // Create index on food_id for quick lookups
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_pantry_items_food_id ON pantry_items(food_id)
    `);

    // Create index on expiration_date for expiration queries
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_pantry_items_expiration_date ON pantry_items(expiration_date)
    `);

    // Create index on location for location-based queries
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_pantry_items_location ON pantry_items(location)
    `);

    // Create migrations table to track applied migrations
    await db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        executed_at TEXT NOT NULL
      )
    `);
  }

  async down(): Promise<void> {
    const db = DatabaseConnection.getInstance();

    // Drop tables in reverse order of creation (respecting foreign keys)
    await db.exec('DROP TABLE IF EXISTS migrations');
    await db.exec('DROP TABLE IF EXISTS pantry_items');
    await db.exec('DROP TABLE IF EXISTS foods');
  }
}
