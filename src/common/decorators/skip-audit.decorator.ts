import { SetMetadata } from '@nestjs/common';

export const SKIP_AUDIT_KEY = 'skipAudit';
/** Jangan catat endpoint ini ke activity log */
export const SkipAudit = () => SetMetadata(SKIP_AUDIT_KEY, true);
