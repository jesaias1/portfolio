export function isSafeMediaReference(value: unknown, required = false) {
  if (typeof value !== 'string') return !required;
  const reference = value.trim();
  if (!reference) return !required;
  if (/[\\\u0000-\u001f\u007f]/.test(reference)) return false;

  if (reference.startsWith('/') && !reference.startsWith('//')) return true;

  try {
    return new URL(reference).protocol === 'https:';
  } catch {
    return false;
  }
}

export function cleanMediaReference(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
