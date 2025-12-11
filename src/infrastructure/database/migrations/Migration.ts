/**
 * Migration - Interface for database migrations.
 *
 * Each migration represents a versioned change to the database schema.
 */

export interface Migration {
  /**
   * The version number of this migration.
   * Migrations are executed in ascending order of version.
   */
  version: number;

  /**
   * A descriptive name for this migration.
   */
  name: string;

  /**
   * Executes the migration (apply the schema changes).
   */
  up(): Promise<void>;

  /**
   * Reverts the migration (undo the schema changes).
   */
  down(): Promise<void>;
}
