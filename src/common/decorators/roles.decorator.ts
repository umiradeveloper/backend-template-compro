import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const MIN_ROLE_KEY = 'minRole';
/** Minimal role yang dibutuhkan (hierarki: superadmin > admin > editor) */
export const MinRole = (role: Role) => SetMetadata(MIN_ROLE_KEY, role);
