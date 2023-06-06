/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  WidgetSettings,
  // PropertiesSettings,
} from '@cloudpivot-shared/ui-engine-vue/document';

// import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

const properties = {
  display: {
    displayType: {
      component: {
        options: {
          showContent: false,
        },
      },
    },
    border: {
      component: {
        options: {
          hideBorderSides: false,
        },
      },
    },
  },
};

export default {
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
