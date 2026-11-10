export default () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  appUrl: (process.env.APP_URL ?? 'http://localhost:4000').replace(/\/$/, ''),
  /**
   * URL publik folder upload (pengganti awalan "/uploads" pada alamat file).
   * Isi bila file disajikan Nginx/CDN terpisah dari API, mis. https://files.umiraglobal.com/uploads
   * Kosong = <APP_URL>/uploads (disajikan backend).
   */
  assetUrl: (process.env.ASSET_URL || `${(process.env.APP_URL ?? 'http://localhost:4000').replace(/\/$/, '')}/uploads`).replace(/\/$/, ''),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:3005')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'umira_cms',
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? 'uploads',
    maxMb: parseInt(process.env.MAX_UPLOAD_MB ?? '20', 10),
  },
});
