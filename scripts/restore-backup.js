/**
 * Pulihkan isi tabel dari file backup JSON buatan backup-db.js
 *   node scripts/restore-backup.js backups/backup-xxxx.json
 * Baris yang ada di backup ditulis ulang (REPLACE); file media yang ditambahkan
 * setelah backup dihapus dari tabel media (file di MinIO tidak dihapus).
 */
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

const file = process.argv[2];
if (!file) {
  console.error('Pakai: node scripts/restore-backup.js <file-backup.json>');
  process.exit(1);
}

const JSON_COLS = { projects: ['gallery'], project_translations: ['scopeOfWork'], collection_items: ['data', 'translations'], settings: ['data', 'translations'] };

(async () => {
  const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'umira_cms',
  });
  await conn.query('SET FOREIGN_KEY_CHECKS=0');
  for (const [table, rows] of Object.entries(backup.tables)) {
    if (table === 'media') {
      const ids = rows.map((r) => r.id);
      await conn.query(ids.length ? 'DELETE FROM media WHERE id NOT IN (?)' : 'DELETE FROM media', ids.length ? [ids] : []);
    }
    for (const row of rows) {
      const data = { ...row };
      for (const c of JSON_COLS[table] || []) if (data[c] !== null && typeof data[c] !== 'string') data[c] = JSON.stringify(data[c]);
      if (table === 'media' && !('updatedAt' in data)) delete data.updatedAt;
      const cols = Object.keys(data);
      await conn.query(`REPLACE INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(',')}) VALUES (?)`, [cols.map((c) => data[c])]);
    }
    console.log(`  ${table}: ${rows.length} baris dipulihkan`);
  }
  await conn.query('SET FOREIGN_KEY_CHECKS=1');
  await conn.end();
  console.log('✔ Pemulihan selesai');
})().catch((e) => {
  console.error('GAGAL restore:', e.message);
  process.exit(1);
});
