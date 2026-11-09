import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand, DeleteObjectCommand, HeadBucketCommand, PutBucketPolicyCommand, PutObjectCommand, S3Client,
} from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import { dirname, join, resolve } from 'path';

export type StorageDriver = 'local' | 'minio';

/**
 * Lapisan penyimpanan file media.
 *  - local : file di folder UPLOAD_DIR, disajikan backend di /uploads/<key>
 *  - minio : file di bucket MinIO (S3 compatible), disajikan langsung dari MinIO
 *
 * Di database & konten, file selalu dirujuk sebagai "/uploads/<key>"
 * sehingga driver bisa diganti tanpa mengubah isi konten.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  readonly driver: StorageDriver;
  private readonly appUrl: string;
  private readonly localRoot: string;
  private readonly cacheControl: string;
  private readonly bucket: string;
  private readonly publicBase: string;
  private readonly autoCreate: boolean;
  private readonly s3?: S3Client;

  constructor(config: ConfigService) {
    this.driver = config.get<StorageDriver>('storage.driver') === 'minio' ? 'minio' : 'local';
    this.appUrl = config.get<string>('appUrl')!;
    this.localRoot = resolve(config.get<string>('upload.dir')!);
    this.cacheControl = config.get<string>('storage.cacheControl')!;
    this.bucket = config.get<string>('minio.bucket')!;
    this.publicBase = config.get<string>('minio.publicUrl')!;
    this.autoCreate = config.get<boolean>('minio.autoCreateBucket')!;
    if (this.driver === 'minio') {
      this.s3 = new S3Client({
        endpoint: config.get<string>('minio.endpoint'),
        region: config.get<string>('minio.region'),
        forcePathStyle: true, // wajib untuk MinIO
        credentials: { accessKeyId: config.get<string>('minio.accessKey')!, secretAccessKey: config.get<string>('minio.secretKey')! },
      });
    }
  }

  async onModuleInit() {
    if (this.driver !== 'minio') return;
    try {
      await this.s3!.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`MinIO terhubung, bucket "${this.bucket}"`);
    } catch (e) {
      if (!this.autoCreate) {
        this.logger.error(`Bucket "${this.bucket}" tidak bisa diakses: ${(e as Error).message}`);
        return;
      }
      try {
        await this.s3!.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket "${this.bucket}" dibuat`);
      } catch (err) {
        this.logger.error(`Gagal membuat bucket "${this.bucket}": ${(err as Error).message}`);
        return;
      }
    }
    if (this.autoCreate) await this.ensurePublicRead();
  }

  /** izinkan siapa pun membaca file (agar gambar bisa tampil di website) */
  private async ensurePublicRead() {
    const policy = {
      Version: '2012-10-17',
      Statement: [{ Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${this.bucket}/*`] }],
    };
    try {
      await this.s3!.send(new PutBucketPolicyCommand({ Bucket: this.bucket, Policy: JSON.stringify(policy) }));
    } catch (e) {
      this.logger.warn(`Tidak bisa set kebijakan baca publik bucket: ${(e as Error).message}`);
    }
  }

  /** "/uploads/2026/11/a.jpg" → "2026/11/a.jpg" */
  keyFromPath(path: string) {
    return path.replace(/^\/?uploads\//, '').replace(/^\/+/, '').split('?')[0];
  }

  pathFromKey(key: string) {
    return `/uploads/${key}`;
  }

  /** URL publik yang bisa dibuka browser */
  publicUrl(keyOrPath: string) {
    const key = this.keyFromPath(keyOrPath);
    const encoded = key.split('/').map(encodeURIComponent).join('/');
    return this.driver === 'minio' ? `${this.publicBase}/${this.bucket}/${encoded}` : `${this.appUrl}/uploads/${encoded}`;
  }

  /** simpan / timpa file */
  async put(key: string, body: Buffer, contentType: string) {
    if (this.driver === 'minio') {
      await this.s3!.send(
        new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType, CacheControl: this.cacheControl }),
      );
      return;
    }
    const abs = this.localPath(key);
    await fs.mkdir(dirname(abs), { recursive: true });
    await fs.writeFile(abs, body);
  }

  async remove(key: string) {
    try {
      if (this.driver === 'minio') await this.s3!.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
      else await fs.unlink(this.localPath(key));
    } catch (e) {
      this.logger.warn(`Gagal menghapus file ${key}: ${(e as Error).message}`);
    }
  }

  private localPath(key: string) {
    const abs = resolve(join(this.localRoot, key));
    if (!abs.startsWith(this.localRoot)) throw new Error('Path file tidak valid');
    return abs;
  }

  get localUploadRoot() {
    return this.localRoot;
  }

  async health() {
    if (this.driver !== 'minio') return 'local';
    try {
      await this.s3!.send(new HeadBucketCommand({ Bucket: this.bucket }));
      return 'up';
    } catch {
      return 'down';
    }
  }
}
