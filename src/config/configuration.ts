export default () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  appUrl: (process.env.APP_URL ?? 'http://localhost:4000').replace(/\/$/, ''),
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
  storage: {
    /** local = simpan di folder UPLOAD_DIR, minio = simpan di MinIO / S3 */
    driver: (process.env.STORAGE_DRIVER ?? 'local') as 'local' | 'minio',
    cacheControl: process.env.STORAGE_CACHE_CONTROL ?? 'public, max-age=300',
  },
  minio: {
    endpoint: (process.env.MINIO_ENDPOINT ?? 'http://localhost:9000').replace(/\/$/, ''),
    region: process.env.MINIO_REGION ?? 'us-east-1',
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    bucket: process.env.MINIO_BUCKET ?? 'umira-cms',
    /** URL yang diakses browser, mis. https://cdn.umiraglobal.com — default = endpoint */
    publicUrl: (process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT ?? 'http://localhost:9000').replace(/\/$/, ''),
    /** buat bucket + kebijakan baca publik otomatis saat backend start */
    autoCreateBucket: (process.env.MINIO_AUTO_CREATE_BUCKET ?? 'true') === 'true',
  },
});
