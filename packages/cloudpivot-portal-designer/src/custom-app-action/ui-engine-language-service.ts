/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { languages, editor, Range, IRange, Position } from 'monaco-editor';

import {
  UiEngineVue,
  PropertyInfo,
  ActionInfo,
} from '@cloudpivot-shared/ui-engine-vue';

import {
  ObjectAccessType,
  TreeItemLike,
} from '@cloudpivot-shared/ui-engine-vue/logic';

export class UiEngienLanguageService {
  language = 'javascript';

  triggerCharacters = ['.'];

  disable = false;

  // eslint-disable-next-line no-useless-constructor
  constructor(public uiEngine: UiEngineVue) {
    languages.registerHoverProvider(this.language, this);
    languages.registerCompletionItemProvider(this.language, this);
  }

  provideHover(
    model: editor.ITextModel,
    position: Position,
  ): languages.ProviderResult<languages.Hover> {
    if (this.disable) {
      return;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = parseObjectAccessExp(
          model,
          position,
          this.triggerCharacters,
        );
        if (!result) {
          resolve(undefined);
          return;
        }

        const items = this.findObjectItems(result);
        const item = items[0];
        if (!item) {
          resolve(undefined);
          return;
        }

        const { range, path } = result;
        const kind = Reflect.has(item, 'data')
          ? item.data
          : languages.CompletionItemKind.Field;
        // const desc = this.makeDescription(item, kind);
        const documentation = this.makeDocumentation(path, item, kind);
        resolve({
          range,
          contents: [documentation],
        });
      }, 0);
    });
  }

  provideCompletionItems(
    model: editor.ITextModel,
    position: Position,
  ): languages.ProviderResult<languages.CompletionList> {
    if (this.disable) {
      return;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = parseObjectAccessExp(
          model,
          position,
          this.triggerCharacters,
        );
        if (!result) {
          return;
        }
        const suggestions = this.findObjectItems(result)?.map((item) => {
          return this.toCompletionItem(result.path, item);
        });
        resolve({
          suggestions,
        });
      }, 0);
    });
  }

  resolveCompletionItem(
    model: editor.ITextModel,
    position: Position,
    item: languages.CompletionItem,
  ) {
    const path = (item as any).path;
    const isItemLabel = typeof item.label === 'object';
    const itemLabel: any = item.label;
    const filterText = isItemLabel ? itemLabel.name : (item.label as string);
    const treeItems = this.findObjectItems({
      path,
      filterText,
      range: item.range as IRange,
    });
    const treeItem = treeItems[0];
    if (treeItem) {
      item.documentation = this.makeDocumentation(path, treeItem, item.kind);
    }
    return item;
  }

  private findObjectItems(result: ObjectAccessInfo) {
    let items: TreeItemLike[] = [];
    const { path, filterText } = result;
    const objectStore = this.uiEngine.currentPage?.extensionContext.objectStore;
    if (!objectStore) {
      return items;
    }

    if (path.length === 0) {
      items = objectStore.getItems();
    } else {
      if (path.length === 2 && path[0] === 'widgets') {
        const value = 'props';
        items = [
          {
            value,
            label: value,
            isLeaf: false,
          },
        ];
      } else {
        items = objectStore.getChildren(ObjectAccessType.Props, path);
      }

      objectStore.getChildren(ObjectAccessType.Actions, path).forEach((x) => {
        x.data = languages.CompletionItemKind.Method;
        items.push(x);
      });
    }
    items = items.filter((x) =>
      filterText ? x.value.startsWith(filterText) : true,
    );
    return items;
  }

  private makeDescription(
    item: TreeItemLike,
    kind: languages.CompletionItemKind,
  ) {
    const { value, schema } = item;
    const { Field, Method, Variable } = languages.CompletionItemKind;
    let description = '';

    if (kind === Field) {
      description = `(${getKindDisplay(kind)}) `;
      if (schema) {
        const prop = schema as PropertyInfo;
        description += `${value}: ${prop.type}`;
      }
    } else if (kind === Method) {
      description = `(${getKindDisplay(kind)}) `;
      const action = schema as ActionInfo;
      if (action) {
        let params = '';
        if (action.parameters) {
          params = action.parameters
            .map((p) => `${p.name}: ${(p.schema as PropertyInfo).type}`)
            .join(', ');
        }
        description += `${value}(${params})`;
        if (action.return) {
          description += `: ${action.return}`;
        }
      }
    } else if (kind === Variable) {
      description = `${getKindDisplay(kind)} ${value}`;
    }

    return description;
  }

  private makeDocumentation(
    path: string[],
    item: TreeItemLike,
    kind: languages.CompletionItemKind,
  ) {
    const { schema, value } = item;
    let label = item.label;
    if (path.length === 0) {
      label = this.$t(`objects.${value}.title`);
    }

    let content = `${label}\n\n`;

    if (item.description) {
      content += `${item.description}\n\n`;
    }

    if (kind === languages.CompletionItemKind.Method) {
      const action = schema as ActionInfo;
      if (action.parameters) {
        content += action.parameters
          .map((p) => {
            let text = `*@param* \`${p.name}\``;
            const desc = this.$t(
              `objects.${path[0]}.actions.${item.value}.parameters.${p.name}`,
            );
            if (desc) {
              text += ` — ${desc}`;
            }
            return text;
          })
          .join('\n\n');
      }
      if (action.return) {
        content += `*@returns* ${action.return}`;
      }
    }
    return {
      value: content,
      supportHtml: true,
    };
  }

  private toCompletionItem(path: string[], item: TreeItemLike) {
    const { Variable, Field } = languages.CompletionItemKind;
    let kind = path.length === 0 ? Variable : Field;
    if (Reflect.has(item, 'data')) {
      kind = item.data;
    }

    const { value } = item;
    const detail = this.makeDescription(item, kind);
    // const filterText = value.split('').join('-');

    return {
      path,
      label: value,
      kind,
      insertText: value,
      detail,
    } as any;
  }

  private $t(path: string) {
    return this.uiEngine.app.$t(path).toString();
  }
}

function parseExp(text: string, triggerCharacters: string[]) {
  let start = -1;
  let inString = false;
  const endChars = ['}', ',', ';', '=', ':'];
  const stringChars = ['"', "'", '`'];

  const isClosed = (char: string, i: number) =>
    text[i] === char && text[i - 1] !== '\\' && text[start] === char;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (start === -1) {
      if (/\S/.test(char) && !endChars.includes(char)) {
        inString = stringChars.includes(char);
        start = i;
      }
      continue;
    }

    if (
      isClosed('/', i) ||
      (triggerCharacters.includes(char) && text[i - 1] === char)
    ) {
      return -1;
    }

    if (inString) {
      if (stringChars.includes(char) && isClosed(text[0], i)) {
        inString = false;
        start = -1;
      }
    } else if (endChars.includes(char)) {
      start = -1;
    }
  }

  if (inString) {
    start = -1;
  }

  return start;
}

function getKindDisplay(kind: languages.CompletionItemKind) {
  const { Field, Method, Variable } = languages.CompletionItemKind;
  switch (kind) {
    case Field:
      return 'property';
    case Method:
      return 'method';
    case Variable:
      return 'var';
    default:
      return '';
  }
}

interface ObjectAccessInfo {
  path: string[];
  filterText: string;
  range: IRange;
}

function parseObjectAccessExp(
  model: editor.ITextModel,
  position: Position,
  triggerCharacters: string[],
) {
  const { lineNumber, column } = position;
  let range = new Range(lineNumber, 0, lineNumber, column);
  const content = model.getValueInRange(range);

  const start = parseExp(content, triggerCharacters);
  if (start === -1) {
    return;
  }

  const exp = content.slice(start);
  range = range.setStartPosition(lineNumber, start);

  const path: string[] = [];
  let filterText = exp;
  let prevIdx = -1;

  for (let i = exp.length - 1; i >= 0; i--) {
    if (!triggerCharacters.includes(exp[i])) {
      continue;
    }
    if (prevIdx === -1) {
      filterText = exp.slice(i + 1);
      range = range.setStartPosition(lineNumber, i + 2);
    } else {
      path.splice(0, 0, exp.slice(i + 1, prevIdx));
    }
    prevIdx = i;
  }

  if (prevIdx > 0) {
    path.splice(0, 0, exp.slice(0, prevIdx));
  }

  return {
    path,
    range,
    filterText,
  } as ObjectAccessInfo;
}
