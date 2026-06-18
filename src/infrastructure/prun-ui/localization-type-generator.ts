import { type MessageFormatElement, TYPE } from '@formatjs/icu-messageformat-parser';
import {
  isLeaf,
  LEAF_KEYS,
  LocalizationLeaf,
  LocalizationTree,
} from '@src/infrastructure/prun-ui/i18n';

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
  const children = Object.entries(tree).filter(([key]) => !LEAF_KEYS.some(x => x == key));
  const format = isTreeLeaf ? (tree as LocalizationLeaf).getFormat() : undefined;
  const formatOptions = format ? emitFormatOptions(format.getAst()) : undefined;
  if (children.length === 0 && isTreeLeaf && format && formatOptions == 'void') {
    return `LiteralLocalizationLeaf`;
  }
  const append = (line: string) => (result += `\n${'\t'.repeat(indent)}${line}`);
  result += `{`;
  indent++;
  for (const [key, value] of children) {
    if (isLeaf(value as LocalizationTree)) {
      append(`// Template: ${emitStatic((value as LocalizationLeaf).getFormat().getAst())}`);
    }
    append(`${key}: ${emitLocalizationTree(value as LocalizationTree, indent).trimStart()};`);
  }
  if (isTreeLeaf) {
    for (const leafKey of LEAF_KEYS) {
      switch (leafKey) {
        case 'getFormat':
          append(`getFormat: () => IntlMessageFormat;`);
          break;
        case 'message':
          append(`message: (options: ${formatOptions}) => string;`);
          break;
      }
    }
  }
  indent--;
  append('}');
  return result as `{${string}}`;
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
  // Some of the english localization keys had NBSP, which eslint did not like.
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
