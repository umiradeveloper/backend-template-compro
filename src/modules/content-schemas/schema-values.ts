import { BadRequestException } from '@nestjs/common';
import { ContentSchema, FieldDef } from './schema.types';
import { DEFAULT_LOCALE, LOCALES } from '../../common/enums';

export interface SchemaValues {
  data: Record<string, unknown>;
  translations: Record<string, Record<string, unknown>>;
}

function coerce(field: FieldDef, value: unknown): unknown {
  if (value === undefined || value === null) return null;
  switch (field.type) {
    case 'number': {
      if (value === '') return null;
      const n = Number(value);
      if (Number.isNaN(n)) throw new BadRequestException(`${field.label} harus berupa angka`);
      return n;
    }
    case 'boolean':
      return value === true || value === 'true' || value === 1 || value === '1';
    case 'tags':
      return Array.isArray(value) ? value.map(String).filter(Boolean) : String(value).split(',').map((s) => s.trim()).filter(Boolean);
    case 'list':
      if (!Array.isArray(value)) return [];
      return value.map((row) => {
        const out: Record<string, unknown> = {};
        for (const sub of field.fields ?? []) out[sub.name] = coerce(sub, (row as any)?.[sub.name]);
        return out;
      });
    default:
      return String(value);
  }
}

function isEmpty(v: unknown) {
  return v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
}

/** Bersihkan & validasi input sesuai skema. Field tak dikenal dibuang. */
export function sanitizeValues(schema: ContentSchema, input: Partial<SchemaValues>): SchemaValues {
  const data: Record<string, unknown> = {};
  const translations: Record<string, Record<string, unknown>> = {};
  for (const l of LOCALES) translations[l] = {};

  for (const field of schema.fields) {
    if (field.translatable) {
      for (const l of LOCALES) {
        translations[l][field.name] = coerce(field, input.translations?.[l]?.[field.name]);
      }
      if (field.required && isEmpty(translations[DEFAULT_LOCALE][field.name]) && isEmpty(translations.id[field.name])) {
        throw new BadRequestException(`${field.label} wajib diisi`);
      }
    } else {
      data[field.name] = coerce(field, input.data?.[field.name]);
      if (field.required && isEmpty(data[field.name])) throw new BadRequestException(`${field.label} wajib diisi`);
    }
  }
  return { data, translations };
}

/** Gabungkan nilai non-terjemahan + terjemahan sesuai locale (fallback ke en/id) */
export function resolveValues(schema: ContentSchema, values: SchemaValues, locale: string): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(values.data ?? {}) };
  for (const f of schema.fields.filter((x) => x.translatable)) {
    const order = [locale, DEFAULT_LOCALE, ...LOCALES];
    let v: unknown = null;
    for (const l of order) {
      const candidate = values.translations?.[l]?.[f.name];
      if (!isEmpty(candidate)) {
        v = candidate;
        break;
      }
    }
    out[f.name] = v;
  }
  return out;
}

export function titleOf(schema: ContentSchema, values: SchemaValues): string {
  const field = schema.titleField ?? schema.fields[0]?.name;
  const resolved = resolveValues(schema, values, DEFAULT_LOCALE);
  return String(resolved[field] ?? '');
}
