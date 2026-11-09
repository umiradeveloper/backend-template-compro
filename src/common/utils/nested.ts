/** Ratakan objek bertingkat menjadi { "a.b.0": "x" } */
export function flatten(obj: unknown, prefix = '', out: Record<string, string> = {}): Record<string, string> {
  if (obj === null || obj === undefined) return out;
  if (typeof obj !== 'object') {
    out[prefix] = String(obj);
    return out;
  }
  const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v] as const) : Object.entries(obj as object);
  for (const [k, v] of entries) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  return out;
}

/** Kebalikan dari flatten. Segmen angka menjadi array. */
export function unflatten(flat: Record<string, string>): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  const keys = Object.keys(flat).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const key of keys) {
    const parts = key.split('.');
    let cur: any = root;
    parts.forEach((part, i) => {
      const last = i === parts.length - 1;
      const nextIsIndex = !last && /^\d+$/.test(parts[i + 1]);
      if (last) {
        cur[part] = flat[key];
      } else {
        if (cur[part] === undefined || typeof cur[part] !== 'object') cur[part] = nextIsIndex ? [] : {};
        cur = cur[part];
      }
    });
  }
  return compactArrays(root) as Record<string, unknown>;
}

function compactArrays(v: unknown): unknown {
  if (Array.isArray(v)) return v.filter((x) => x !== undefined).map(compactArrays);
  if (v && typeof v === 'object') {
    for (const k of Object.keys(v)) (v as any)[k] = compactArrays((v as any)[k]);
  }
  return v;
}
