/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import { WidgetSettings } from '@cloudpivot-shared/ui-designer-common';

import { DocumentNodeDto } from '@cloudpivot-shared/ui-engine-vue/document';

const properties = {
  display: {},
};

// function upgrade(dto: DocumentNodeDto) {}

export default {
  // upgrade,
  /**
   * 属性设置
   */
  properties,

  layout: {
    grid: {}
  }
} as WidgetSettings;
