export enum Role {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  EDITOR = 'editor',
}

/** Urutan hak akses: superadmin > admin > editor */
export const ROLE_LEVEL: Record<Role, number> = {
  [Role.SUPERADMIN]: 3,
  [Role.ADMIN]: 2,
  [Role.EDITOR]: 1,
};

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export const LOCALES = ['id', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export enum InquiryStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived',
}
