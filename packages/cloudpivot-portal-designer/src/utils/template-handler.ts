/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  NodeEventHandler,
  DocumentSnapshot,
} from '@cloudpivot-shared/ui-engine-vue';
import { ComponentType } from '@cloudpivot-shared/ui-designer-widgets';
import { DocumentNodeDto } from '@cloudpivot-shared/ui-designer-common';

/**
 * 递归删除某个目标组件
 * @param id 要移除的组件ID
 * @param doc 页面文档
 * @returns void
 */
function removeNode(id: string, doc: DocumentSnapshot) {
  const node = doc[id];
  if (!node) {
    return;
  }
  deepRemove(id, doc);
  if (!node.parentId) {
    return;
  }
  const parent = doc[node.parentId];
  if (parent) {
    const idx = parent.childIds.indexOf(id);
    if (idx > -1) {
      parent.childIds.splice(idx, 1);
    }
  }
}

function deepRemove(id: string, doc: DocumentSnapshot) {
  const node = doc[id];
  if (Array.isArray(node.childIds)) {
    node.childIds.forEach((cid) => {
      deepRemove(cid, doc);
    });
  }
  Reflect.deleteProperty(doc, id);
}

// 清理模型绑定信息
function removeSchemaInfo(node: any) {
  const emptyBinding: any = {
    bindingModel: {
      domainCode: '',
      schemaCode: '',
      primaryKey: '',
    },
  };

  if (node.type === 'FormSheet') {
    node.name = '子表';
    emptyBinding.title = '子表';
    emptyBinding.code = '';
    emptyBinding.colsStatus = {};
    // eslint-disable-next-line max-len
    const perseveKeys: string[] = [
      'id',
      'createdBy',
      'createdDept',
      'createdTime',
      'owner',
      'ownerDept',
      'modifiedBy',
      'modifiedTime',
      'document',
      'status',
    ];

    if (node.props.colsStatus) {
      Object.keys(node.props.colsStatus).forEach((key: string) => {
        if (perseveKeys.includes(key)) {
          emptyBinding.colsStatus[key] = node.props.colsStatus[key];
        }
      });
    }
  }

  if (node.type === 'FormList') {
    // NOTE: 列表的绑定事件只保留行单击事件
    const { rowClick } = node.eventHandlers;
    node.eventHandlers = { rowClick };
  }

  node.props = Object.assign(node.props, emptyBinding);
  node.bindings = {};
}

// 清除页面事件模型绑定信息
function removePageSchema(node: any) {
  let entry = node.eventHandlers.entry;
  if (entry) {
    entry = entry.filter((evt: any) => evt.type !== 'system');
    node.eventHandlers.entry = entry;
  }
}

// 清除应用菜单信息
function removeAppMenuSchema(node: any) {
  node.props = Object.assign(node.props, {
    appCode: '',
    menuCode: '',
    dataSource: [],
  });
}

/**
 * 净化模板的绑定信息
 * @param data 原始的模板数据
 * @returns 净化结果
 */
const cleanTemplateCore = (payload: any, isPageTemplate?: boolean) => {
  const _data = JSON.parse(JSON.stringify(payload));
  // 清理模型表单项控件
  Object.entries(_data.document).forEach(([controlId, control]: any[]) => {
    switch (control.type) {
      case 'FormModel':
      case 'FormList':
        // 清理模型绑定信息
        removeSchemaInfo(control);
        break;

      case ComponentType.ModelTable:
      case ComponentType.ChildTable:
      case 'ModelQueryForm':
        const ids = [...control.childIds];
        // 清理控件
        ids.forEach((id: string) => {
          removeNode(id, _data.document);
        });
        break;

      case ComponentType.FormModelItem:
      case ComponentType.DataSource:
      case ComponentType.ModelCardItemText:
      case ComponentType.ModelCardItemImage:
      case ComponentType.QueryFormModelItem:
      case ComponentType.ModelTableColumn:
      case 'FormSheet':
        removeNode(controlId, _data.document);
        break;

      case ComponentType.Page:
        removePageSchema(control);
        break;

      case ComponentType.AppMenu:
        removeAppMenuSchema(control);
        break;

      default:
        break;
    }

    control.bindings = {};

    if (control.props.boundModelCode) {
      control.props.boundModelCode = '';
    }

    if (control.props.boundPropCode) {
      control.props.boundPropCode = '';
    }

    cleanAppEventHandler(control);
  });
  return _data;
};

export const cleanTemplate = (payload: any, isPageTemplate?: boolean) => {
  return new Promise((resolve) => {
    const result = cleanTemplateCore(payload, isPageTemplate);
    setTimeout(() => {
      resolve(result);
    }, 100);
  });
};

function cleanAppEventHandler(node: DocumentNodeDto) {
  if (!node.eventHandlers) {
    return;
  }

  for (const type in node.eventHandlers) {
    if (!Reflect.has(node.eventHandlers, type)) {
      continue;
    }
    const handlers = node.eventHandlers[type] as any[];
    if (!Array.isArray(handlers)) {
      continue;
    }
    for (const handler of handlers) {
      cleanAppServiceCall(handler);
    }
  }
}

function cleanAppServiceCall(handler: NodeEventHandler) {
  const { type, argu } = handler;
  if (type !== 'system' || !argu) {
    return;
  }
  const doc = argu as DocumentSnapshot;
  for (const id in doc) {
    if (!Reflect.has(doc, id)) {
      continue;
    }
    const node = doc[id];
    if (node.type !== 'CallExpression') {
      continue;
    }
    const { callee } = node.props;
    if (!Array.isArray(callee)) {
      return;
    }
    if (
      callee.includes('modelServices') ||
      callee.includes('openPage') ||
      callee.includes('openPageAddData') ||
      callee.includes('print')
    ) {
      removeNode(id, doc);
    }
  }
}

/**
 * 是否有应用环境下才有的内容
 * @param payload
 * @returns
 */
export function hasAppContent(payload: any) {
  for (const key in payload.document) {
    if (payload.document.hasOwnProperty(key)) {
      const control = payload.document[key] as DocumentNodeDto;

      if (control.type === ComponentType.DataSource) {
        return true;
      }

      if (control.type === ComponentType.AppMenu && control.props.menuCode) {
        return true;
      }

      if (hasDataBinding(control) || hasAppEventHandler(control)) {
        return true;
      }
    }
  }

  return false;
}

function hasDataBinding(node: DocumentNodeDto) {
  const keys = Object.keys(node.bindings);
  if (keys.length > 0) {
    return true;
  }
}

function hasAppEventHandler(node: DocumentNodeDto) {
  if (!node.eventHandlers) {
    return;
  }

  for (const type in node.eventHandlers) {
    if (!Reflect.has(node.eventHandlers, type)) {
      continue;
    }
    const handlers = node.eventHandlers[type] as any[];
    if (!Array.isArray(handlers)) {
      continue;
    }
    for (const handler of handlers) {
      if (hasCallAppService(handler)) {
        return true;
      }
    }
  }
}

function hasCallAppService(handler: NodeEventHandler) {
  const { type, argu } = handler;
  if (type !== 'system' || !argu) {
    return;
  }
  const doc = argu as DocumentSnapshot;
  for (const id in doc) {
    if (!Reflect.has(doc, id)) {
      continue;
    }
    const node = doc[id];
    if (node.type !== 'CallExpression') {
      continue;
    }
    const { callee } = node.props;
    if (!Array.isArray(callee)) {
      continue;
    }

    if (
      callee.includes('modelServices') ||
      callee.includes('openPage') ||
      callee.includes('openPageAddData') ||
      callee.includes('print')
    ) {
      return true;
    }
  }
}
