import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { absolutizeUploads } from '../../common/utils/asset-url';

/** Semua path "/uploads/..." pada response publik diubah jadi URL publik file (ASSET_URL) */
@Injectable()
export class PublicAssetInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const assetUrl = this.config.get<string>('assetUrl')!;
    const res = context.switchToHttp().getResponse();
    if (context.switchToHttp().getRequest().method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    }
    return next.handle().pipe(map((data) => absolutizeUploads(data, assetUrl)));
  }
}
