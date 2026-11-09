export type FieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'image'
  | 'file'
  | 'url'
  | 'email'
  | 'select'
  | 'tags'
  | 'list';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  /** nilai berbeda per bahasa (id / en) */
  translatable?: boolean;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** sub-field untuk tipe "list" (repeater) */
  fields?: FieldDef[];
}

export interface ContentSchema {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  /** field yang dipakai sebagai judul item di daftar */
  titleField?: string;
  /** dipakai di halaman mana pada website */
  usedOn?: string;
  fields: FieldDef[];
}
