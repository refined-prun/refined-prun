const sanitizeCache = new Map<string, string>();

export function clearSanitizeCache() {
  sanitizeCache.clear();
}

export function sanitizeKey(key: string): string {
  const cached = sanitizeCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  let s = key;
  // Replace invalid chars with _
  s = s.replace(/[^a-zA-Z0-9_$]/g, '_');
  // Empty fallback
  if (!s) {
    s = '_';
  }
  // Cannot start with number
  else if (isDigit(s.charCodeAt(0))) {
    s = '_' + s;
  }
  // Avoid reserved words
  else if (RESERVED_KEYS.has(s)) {
    s = `_${s}`;
  }

  sanitizeCache.set(key, s);
  return s;
}

function isDigit(c: number) {
  return c >= 48 && c <= 57;
}

const RESERVED_KEYS = new Set([
  // Javascript
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words
  'abstract',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
  // LocalizationLeaf
  'getFormat',
]);
