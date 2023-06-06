/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import {
  Direction,
  DocumentNodeDto,
  WidgetSettings,
} from '@cloudpivot-shared/ui-engine-vue/document';
// import { register } from '@cloudpivot-shared/ui-property-editor/extension';
import { register } from '@cloudpivot-shared/ui-designer-common';

import { ComponentType as AssetComponentType } from '../../enums';

const properties = {};

const creating = (dto: DocumentNodeDto) => {
  const cmds = Object.keys(Direction)
    .map((key) => (Direction as any)[key])
    .filter((direction) => direction !== Direction.None)
    .map((direction) => {
      const isCenter = direction === Direction.Center;
      const type = isCenter
        ? AssetComponentType.LayoutPanel
        : AssetComponentType.LayoutSider;
      const props = {
        direction,
      };
      // @ts-ignore
      const panel = register.store.app.createNodeDto(type, dto.id, {
        props,
      });
      panel.cloneable = false;
      panel.removable = !isCenter;
      return panel;
    });

  return cmds;
};

export default {
  creating,

  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
