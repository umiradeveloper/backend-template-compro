import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { absolutizeUploads } from '../../common/utils/asset-url';
import { StorageService } from '../storage/storage.service';

/** Semua path "/uploads/..." pada response publik diubah jadi URL absolut (backend atau MinIO) */
@Injectable()
export class PublicAssetInterceptor implements NestInterceptor {
  constructor(private readonly storage: StorageService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse();
    if (context.switchToHttp().getRequest().method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    }
    return next.handle().pipe(map((data) => absolutizeUploads(data, (p) => this.storage.publicUrl(p))));
  }
}
