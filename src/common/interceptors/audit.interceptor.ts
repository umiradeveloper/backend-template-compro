import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { ActivityLogsService } from '../../modules/activity-logs/activity-logs.service';
import { SKIP_AUDIT_KEY } from '../decorators/skip-audit.decorator';

const ACTION_BY_METHOD: Record<string, string> = {
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
};

const ENTITY_LABEL: Record<string, string> = {
  blogs: 'artikel',
  projects: 'proyek',
  careers: 'lowongan',
  media: 'file media',
  users: 'pengguna',
  settings: 'pengaturan',
  collections: 'konten halaman',
  'site-texts': 'teks website',
  inquiries: 'pesan masuk',
  'activity-logs': 'log aktivitas',
};
const ACTION_LABEL: Record<string, string> = {
  create: 'menambah',
  update: 'mengubah',
  delete: 'menghapus',
  upload: 'mengupload',
  duplicate: 'menduplikat',
  bulk_status: 'mengubah status beberapa',
  bulk_delete: 'menghapus beberapa',
  reorder: 'mengurutkan ulang',
  import: 'mengimpor',
  replace: 'mengganti isi',
};

/**
 * Mencatat otomatis setiap perubahan data (POST/PUT/PATCH/DELETE) di route /admin/*
 * ke tabel activity_logs.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly logs: ActivityLogsService, private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;
    const path: string = (req.route?.path ?? req.path ?? '') as string;
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_AUDIT_KEY, [context.getHandler(), context.getClass()]);
    if (skip || !ACTION_BY_METHOD[method] || !path.includes('/admin/') || !req.user) return next.handle();

    // contoh: /api/admin/blogs/:id/publish -> entity "blogs", sub action "publish"
    const segments = path.split('/admin/')[1]?.split('/').filter(Boolean) ?? [];
    let entity = segments[0] ?? 'unknown';
    if (req.params?.key && entity !== 'site-texts') entity = `${entity}:${req.params.key}`;
    const subAction = segments.slice(1).find((s) => !s.startsWith(':'));
    let action = ACTION_BY_METHOD[method];
    if (subAction) action = subAction.replace(/-/g, '_');
    if (segments[0] === 'media' && method === 'POST' && !subAction) action = 'upload';

    return next.handle().pipe(
      tap((result: any) => {
        const entityId = req.params?.id ?? result?.id ?? null;
        const label =
          result?.title ??
          result?.name ??
          result?.originalName ??
          result?.translations?.find?.((t: any) => t.locale === 'en')?.title ??
          result?.translations?.[0]?.title ??
          (req.params?.key ? String(req.params.key) : '');
        void this.logs.log({
          userId: req.user.id,
          userName: req.user.name,
          action,
          entity,
          entityId,
          description: `${req.user.name} ${ACTION_LABEL[action] ?? action} ${ENTITY_LABEL[segments[0]] ?? segments[0]}${
            req.params?.key && !['site-texts', 'settings'].includes(segments[0]) ? ` (${req.params.key})` : ''
          }${label ? `: ${label}` : entityId ? ` #${entityId}` : ''}`,
          ip: req.ip,
        });
      }),
    );
  }
}
