import { type MessageFormatElement, TYPE } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat, { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat';

const LeafKeys = ['format', 'imf'] as const;

const RESERVED = new Set(
  [
    // Javascript
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'implements',
    'interface',
    'let',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'yield',
    'enum',
    'await',
    'constructor',
    // Utility
    LeafKeys,
  ].flat(),
);

export type LocalizationTree = {
  [p: string]: LocalizationTree;
};

// I don't want to deal with the type argument in format just for the shortcut, so I am assuming it's a string.
// This means the return type can also be assumed to be a simple string.
// If the full format functionality is necessary it can be accessed through imf.
export type LocalizationLeaf = LocalizationTree & {
  imf: IntlMessageFormat;
  format: typeof IntlMessageFormat.prototype.format<string>;
};

export type LiteralLocalizationLeaf = LocalizationTree & {
  format: (options: void) => string;
  imf: IntlMessageFormat;
};

function isLeaf(input: LocalizationTree): boolean {
  return LeafKeys.every(x => x in input);
}

export function generateLocalizationTree(
  localizationDict: Record<string, MessageFormatElement[]>,
): LocalizationTree {
  const tree = {} as LocalizationTree;
  for (const [key, value] of Object.entries(localizationDict)) {
    let cursor: LocalizationTree = tree;
    const pathParts = key.split('.');
    for (const pathPart of pathParts) {
      const sanitizedPathPart = sanitizeKey(pathPart);
      if (sanitizedPathPart in cursor) {
        cursor = cursor[sanitizedPathPart] as LocalizationTree;
      } else {
        cursor[sanitizedPathPart] = {};
        cursor = cursor[sanitizedPathPart];
      }
    }
    if (LeafKeys.some(x => x in cursor)) {
      throw new Error(`Duplicate key: ${key}`);
    }
    const messageFormat = new IntlMessageFormat(value);
    for (const leafKey of LeafKeys) {
      switch (leafKey) {
        case 'imf':
          (cursor as Partial<LocalizationLeaf>)['imf'] = messageFormat;
          break;
        case 'format':
          (cursor as Partial<LocalizationLeaf>)['format'] = messageFormat.format;
          break;
      }
    }
  }
  return tree;
}

export function emitLocalizationFile(tree: LocalizationTree): string {
  let result: string = 'export {};';
  result += '\n';
  result += '\ndeclare global {';
  result += `\n\tinterface PrunLocalization ${emitLocalizationTree(tree, 1).trimStart()}`;
  result += `\n}`;
  return result;
}

function emitLocalizationTree(
  tree: LocalizationTree,
  indent: number = 0,
): `LiteralLocalizationLeaf` | `{${string}}` {
  let result: string = ``;
  const isTreeLeaf = isLeaf(tree);
  const children = Object.entries(tree).filter(([key]) => !LeafKeys.some(x => x == key));
  const append = (line: string) => (result += `\n${'\t'.repeat(indent)}${line}`);
  const format = isTreeLeaf ? (tree as LocalizationLeaf).imf : undefined;
  const formatOptions = format ? emitFormatOptions(format.getAst()) : undefined;
  if (isTreeLeaf && format && formatOptions == 'void') {
    return `LiteralLocalizationLeaf`;
  }
  result += `{`;
  indent++;
  for (const [key, value] of children) {
    if (isLeaf(value as LocalizationTree)) {
      append(`// Template: ${emitStatic((value as LocalizationLeaf).imf.getAst())}`);
    }
    append(`${key}: ${emitLocalizationTree(value as LocalizationTree, indent).trimStart()};`);
  }
  if (isTreeLeaf) {
    for (const leafKey of LeafKeys) {
      switch (leafKey) {
        case 'imf':
          append(`imf: IntlMessageFormat;`);
          break;
        case 'format':
          append(`format: (options: ${formatOptions}) => string;`);
          break;
      }
    }
  }
  indent--;
  append('}');
  return result as `{${string}}`;
}

function emitStatic(ast: MessageFormatElement[]): string {
  const nodeStrings: string[] = [];
  for (const node of ast) {
    switch (node.type) {
      case TYPE.literal:
        nodeStrings.push(node.value);
        break;
      case TYPE.argument:
        nodeStrings.push(`{${node.value}}`);
        break;
      case TYPE.number:
        if (node.style !== undefined && node.style !== null) {
          nodeStrings.push(`{${node.value}, number, style: '${node.style}'}`);
        } else {
          nodeStrings.push(`{${node.value}, number}`);
        }
        break;
      case TYPE.date:
        if (node.style !== undefined && node.style !== null) {
          nodeStrings.push(`{${node.value}, date, style: '${node.style}'}`);
        } else {
          nodeStrings.push(`{${node.value}, date}`);
        }
        break;
      case TYPE.time:
        if (node.style !== undefined && node.style !== null) {
          nodeStrings.push(`{${node.value}, time, style: '${node.style}'}`);
        } else {
          nodeStrings.push(`{${node.value}, time}`);
        }
        break;
      case TYPE.select:
        nodeStrings.push(
          `{${node.value}, select, ${Object.entries(node.options)
            .map(([key, option]) => `${key} ${emitStatic(option.value)}`)
            .join(' ')}`,
        );
        break;
      case TYPE.plural:
        nodeStrings.push(
          `{${node.value}, ${
            node.pluralType === 'ordinal' ? 'selectordinal' : 'plural'
          }, ${Object.entries(node.options)
            .map(([key, option]) => `${key} {${emitStatic(option.value)}}`)
            .join(' ')}}`,
        );
        break;
      case TYPE.pound:
        nodeStrings.push('#');
        break;
      case TYPE.tag:
        break;
      default:
        break;
    }
  }
  return nodeStrings.join('').replaceAll('\u00A0', ' ');
}

function emitFormatOptions(ast: MessageFormatElement[]): `void` | `{${string}}` {
  const options: Map<string, string[]> = new Map();
  function visit(nodes: MessageFormatElement[]) {
    for (const n of nodes) {
      switch (n.type) {
        case TYPE.literal:
          break;
        case TYPE.argument:
          options.set(n.value, ['string']);
          break;
        case TYPE.number:
          options.set(n.value, ['string', 'number']);
          break;
        case TYPE.date:
        case TYPE.time:
          options.set(n.value, ['string', 'Date', 'number']);
          break;
        case TYPE.select:
          options.set(n.value, ['string']);
          for (const key in n.options) {
            visit(n.options[key].value);
          }
          break;
        case TYPE.plural:
          options.set(n.value, ['number']);
          for (const key in n.options) {
            visit(n.options[key].value);
          }
          break;
        case TYPE.pound:
          break;
        case TYPE.tag:
          break;
        default:
          break;
      }
    }
  }
  visit(ast);
  if (options.size == 0) {
    return `void`;
  }
  return `{ ${options
    .entries()
    .map(x => `${x[0]}: ${x[1].join(' | ')}`)
    .toArray()
    .join('; ')} }`;
}

export function sanitizeKey(s: string): string {
  // Replace invalid chars with _
  s = s.replace(/[^a-zA-Z0-9_$]/g, '_');
  // Cannot start with number
  if (/^[0-9]/.test(s)) {
    s = '_' + s;
  }
  // Empty fallback
  if (!s) {
    s = '_';
  }
  // Avoid reserved words
  if (RESERVED.has(s)) {
    s = `_${s}`;
  }
  return s;
}
