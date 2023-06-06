/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Mixins } from 'vue-property-decorator';

import { DocumentNodeDto } from '@cloudpivot-shared/ui-engine-vue/document';
import { register } from '@cloudpivot-shared/ui-designer-common';
import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import { widgetStore } from './widget';

@Component
export default class ComponentVisualPanelBase extends Mixins(
  PropertyComponent,
) {
  get store() {
    return register.store;
  }

  get active() {
    return this.store.active as DocumentNodeDto;
  }

  get children() {
    const parentNode: any = this.store.get(this.active.id);

    return this.active.childIds
      .map((cid) => {
        const node = this.store.get(cid);
        if (!node || node.type === 'NewGrid') {
          return null;
        }

        const widget = widgetStore.widgets[node.type];
        const props = widgetStore.createPropsForm(
          node.type,
          node.id,
          node.props,
        ) as any;

        const parentNodeDefaultActiveKey: string =
          parentNode.props.defaultActiveKey;

        const child = {
          isActiveKey: parentNodeDefaultActiveKey === node.id,
          id: node.id,
          type: node.type,
          parentId: node.parentId,
          childIds: node.childIds,
          props,
          version: widget.version,
          fieldType: node.props.modelPropInfo?.valueType,
          dataIemCode: node.props.key || '',
          dataIemName: node.props.title || '',
        };

        return child;
      })
      .filter(Boolean);
  }
}
