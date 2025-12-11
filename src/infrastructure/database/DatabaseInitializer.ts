/**
 * DatabaseInitializer - Initializes the database on app startup.
 *
 * Handles:
 * - Opening database connection
 * - Running migrations
 * - Setting up pragmas and configuration
 */

import { DatabaseConnection } from './DatabaseConnection';
import { Migration001InitialSchema } from './migrations/001_initial_schema';
import { MigrationRunner } from './migrations/MigrationRunner';

export class DatabaseInitializer {
  private static initialized = false;

  /**
   * Initializes the database.
   * Should be called once at application startup.
   */
  static async initialize(): Promise<void> {
    if (DatabaseInitializer.initialized) {
      return;
    }

    try {
      // Initialize database connection
      const db = DatabaseConnection.getInstance();
      await db.initialize();

      // Set pragmas for better performance and safety
      await db.exec('PRAGMA foreign_keys = ON');
      await db.exec('PRAGMA synchronous = NORMAL');
      await db.exec('PRAGMA journal_mode = WAL');

      // Run migrations
      const migrations = [new Migration001InitialSchema()];
      const migrationRunner = new MigrationRunner();

      const results = await migrationRunner.run(migrations);

      // Log migration results in development
      if (__DEV__) {
        console.log('Database migrations completed:', results);
      }

      DatabaseInitializer.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Gets the initialization status.
   */
  static isInitialized(): boolean {
    return DatabaseInitializer.initialized;
  }

  /**
   * Closes the database connection (cleanup).
   */
  static async close(): Promise<void> {
    const db = DatabaseConnection.getInstance();
    await db.close();
    DatabaseInitializer.initialized = false;
  }
}
