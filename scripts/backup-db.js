/**
 * Backup tabel konten & media ke file JSON (tanpa perlu mysqldump).
 *   node scripts/backup-db.js            → backups/backup-<waktu>.json
 * Pulihkan dengan: node scripts/restore-backup.js backups/backup-<waktu>.json
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const TABLES = [
  'blogs', 'blog_translations', 'projects', 'project_translations', 'careers', 'career_translations',
  'collection_items', 'settings', 'users', 'media',
];

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'umira_cms',
    dateStrings: true,
  });
  const out = { database: process.env.DB_DATABASE, createdAt: new Date().toISOString(), tables: {} };
  for (const t of TABLES) {
    try {
      const [rows] = await conn.query(`SELECT * FROM \`${t}\``);
      out.tables[t] = rows;
      console.log(`  ${t}: ${rows.length} baris`);
    } catch (e) {
      if (t === 'media') { out.tables[t] = []; continue; }
      console.error(`GAGAL membaca tabel ${t}: ${e.message}`);
      console.error('Pastikan database sudah dibuat dengan "npm run seed" dan isi .env benar.');
      process.exit(1);
    }
  }
  await conn.end();
  const dir = path.join(__dirname, '..', 'backups');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const file = path.join(dir, `backup-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(out));
  console.log(`✔ Backup tersimpan: ${file}`);
})().catch((e) => {
  console.error('GAGAL backup:', e.message);
  process.exit(1);
});
