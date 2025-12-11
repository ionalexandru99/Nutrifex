/**
 * MigrationRunner - Executes and tracks database migrations.
 *
 * Handles:
 * - Tracking applied migrations
 * - Executing pending migrations in order
 * - Rolling back migrations if needed
 */

import { DatabaseConnection } from '../DatabaseConnection';
import { MigrationResult } from '../types';

import { Migration } from './Migration';

export class MigrationRunner {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  /**
   * Gets all applied migrations from the database.
   */
  private async getAppliedMigrations(): Promise<Set<number>> {
    const rows = await this.db.all<{ version: number }>('SELECT version FROM migrations');
    return new Set(rows.map((row) => row.version));
  }

  /**
   * Records a migration as applied.
   */
  private async recordMigration(migration: Migration): Promise<void> {
    const now = new Date().toISOString();
    await this.db.run('INSERT INTO migrations (version, name, executed_at) VALUES (?, ?, ?)', [
      migration.version,
      migration.name,
      now,
    ]);
  }

  /**
   * Removes a migration record.
   */
  private async removeMigrationRecord(version: number): Promise<void> {
    await this.db.run('DELETE FROM migrations WHERE version = ?', [version]);
  }

  /**
   * Runs all pending migrations in order.
   */
  async run(migrations: Migration[]): Promise<MigrationResult[]> {
    const results: MigrationResult[] = [];
    const appliedMigrations = await this.getAppliedMigrations();

    // Sort migrations by version
    const sortedMigrations = [...migrations].sort((a, b) => a.version - b.version);

    for (const migration of sortedMigrations) {
      if (appliedMigrations.has(migration.version)) {
        continue;
      }

      try {
        await migration.up();
        await this.recordMigration(migration);

        results.push({
          version: migration.version,
          name: migration.name,
          success: true,
          executedAt: new Date(),
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        results.push({
          version: migration.version,
          name: migration.name,
          success: false,
          executedAt: new Date(),
          error: err,
        });

        // Stop on first error
        throw new Error(
          `Migration ${migration.version} (${migration.name}) failed: ${err.message}`,
        );
      }
    }

    return results;
  }

  /**
   * Rolls back migrations down to (but not including) the specified version.
   */
  async rollback(migrations: Migration[], toVersion: number): Promise<MigrationResult[]> {
    const results: MigrationResult[] = [];
    const appliedMigrations = await this.getAppliedMigrations();

    // Sort migrations by version descending (rollback in reverse order)
    const sortedMigrations = [...migrations].sort((a, b) => b.version - a.version);

    for (const migration of sortedMigrations) {
      if (!appliedMigrations.has(migration.version) || migration.version <= toVersion) {
        continue;
      }

      try {
        await migration.down();
        await this.removeMigrationRecord(migration.version);

        results.push({
          version: migration.version,
          name: migration.name,
          success: true,
          executedAt: new Date(),
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        results.push({
          version: migration.version,
          name: migration.name,
          success: false,
          executedAt: new Date(),
          error: err,
        });

        // Stop on first error
        throw new Error(
          `Migration rollback for ${migration.version} (${migration.name}) failed: ${err.message}`,
        );
      }
    }

    return results;
  }

  /**
   * Gets information about all migrations.
   */
  async getStatus(migrations: Migration[]): Promise<
    {
      version: number;
      name: string;
      applied: boolean;
    }[]
  > {
    const appliedMigrations = await this.getAppliedMigrations();

    return migrations
      .sort((a, b) => a.version - b.version)
      .map((migration) => ({
        version: migration.version,
        name: migration.name,
        applied: appliedMigrations.has(migration.version),
      }));
  }
}
