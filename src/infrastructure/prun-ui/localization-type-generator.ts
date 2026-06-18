import { type MessageFormatElement, TYPE } from '@formatjs/icu-messageformat-parser';
import { isLeaf, LEAF_KEYS } from '@src/infrastructure/prun-ui/i18n';

export function emitLocalizationFile(): string {
  let result: string = 'export {};';
  result += '\n';
  result += '\ntype LL = LiteralLocalizationLeaf';
  result += '\ntype PL<T> = ParametrizedLocalizationLeaf<T>';
  result += '\n';
  result += '\ndeclare global {';
  result += `\n  interface PrunLocalization extends LocalizationTree `;
  result += emitLocalizationTree(L, 1).trimStart();
  result += `\n}`;
  return result;
}

export function generateLocalizationTemplates(): Record<string, string> {
  const i18n = window['PrUn_i18n'];
  const templates = {} as Record<string, string>;
  for (const [key, value] of Object.entries(i18n)) {
    templates[key] = emitStatic(value as MessageFormatElement[]);
  }
  return templates;
}

function emitLocalizationTree(tree: LocalizationTree, indent: number = 0): string {
  let result = ``;
  const isTreeLeaf = isLeaf(tree);
  const children = Object.entries(tree).filter(([key]) => !LEAF_KEYS.some(x => x == key));
  const format = isTreeLeaf ? (tree as LocalizationLeaf).getFormat() : undefined;
  const formatOptions = format ? emitFormatOptions(format.getAst()) : undefined;
  const append = (line: string) => (result += `\n${'  '.repeat(indent)}${line}`);
  if (isTreeLeaf) {
    if (formatOptions === 'void') {
      result += 'LL';
    } else {
      result += `PL<${formatOptions}>`;
    }
  }
  if (children.length > 0) {
    if (isTreeLeaf) {
      result += ' & ';
    }
    result += '{';
    indent++;
    for (const [key, value] of children) {
      append(`${key}: ${emitLocalizationTree(value, indent).trimStart()};`);
    }
    indent--;
    append('}');
  }
  return result;
}

// This is to create an "example" template that one can check to match in-game text with localization keys.
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
        nodeStrings.push(`<${node.value}>${emitStatic(node.children)}</${node.value}>`);
        break;
      default:
        break;
    }
  }
  // Some of the English localization keys had NBSP, which eslint did not like.
  // I replace all of these with regular spaces here.
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
          for (const option of Object.values(n.options)) {
            visit(option.value);
          }
          break;
        case TYPE.plural:
          options.set(n.value, ['number']);
          for (const option of Object.values(n.options)) {
            visit(option.value);
          }
          break;
        case TYPE.pound:
          break;
        case TYPE.tag:
          visit(n.children);
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
