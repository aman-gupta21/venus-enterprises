import pg from 'pg';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the local migration file
const migrationPath = join(__dirname, '..', 'prisma', 'migrations', '20261113172000_init', 'migration.sql');
const migrationContent = readFileSync(migrationPath, 'utf-8');

// Prisma uses SHA-256 of the file contents (UTF-8, normalized line endings)
// Prisma normalizes to \n before hashing
const normalized = migrationContent.replace(/\r\n/g, '\n');
const localChecksum = createHash('sha256').update(normalized).digest('hex');

console.log('Local migration file checksum (normalized):', localChecksum);
console.log('Migration file length:', migrationContent.length, 'bytes');

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

try {
  const client = await pool.connect();

  // Check what's in DB
  const { rows } = await client.query(
    'SELECT migration_name, checksum, finished_at FROM _prisma_migrations ORDER BY started_at'
  );
  console.log('\nMigrations in DB:');
  for (const row of rows) {
    console.log(`  ${row.migration_name}: ${row.checksum}`);
    if (row.migration_name === '20261113172000_init') {
      console.log('  → DB checksum matches local?', row.checksum === localChecksum);
    }
  }

  // Update the checksum
  const result = await client.query(
    `UPDATE _prisma_migrations SET checksum = $1 WHERE migration_name = $2`,
    [localChecksum, '20261113172000_init']
  );
  console.log('\nUpdated rows:', result.rowCount);

  // Verify
  const verify = await client.query(
    'SELECT migration_name, checksum FROM _prisma_migrations WHERE migration_name = $1',
    ['20261113172000_init']
  );
  console.log('New checksum in DB:', verify.rows[0]?.checksum);

  client.release();
} finally {
  await pool.end();
}
