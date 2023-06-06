/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  WidgetSettings,
  EnumPropertyInfo,
  // ObjectPropertyInfo,
} from '@cloudpivot-shared/ui-engine-vue/document';

import * as forms from '@cloudpivot-shared/ui-engine-vue/schema';
import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

import VueI18n from 'vue-i18n';

const selectOptions = (
  key: string,
  value: any,
  controller: any,
  propInfo: EnumPropertyInfo,
  $i18n: VueI18n,
) => {
  return propInfo.enum.map((e) => ({
    value: e,
    label: $i18n.t(`widgets.Carousel.enums.${e}`),
  }));
};

const properties = {
  groups: [
    {
      value: 'advancedConfig',
      grid: [['navigator']],
    },
  ],

  display: {
    navigator: {
      selectOptions,
      component: {
        type: 'navigator',
      },
    },
  },

  subscription: {
    dataChange: function (
      key: string,
      value: any,
      controller: forms.FormGroup,
    ) {
      if (key === 'lineFeed') {
        controller.children.wordBreak.display = value;
      }
    },
  },
};

export default {
  layout: {
    grid: {
      padding: '0 0 8px 0',
      size: {
        width: 12,
        minWidth: 3,
        height: 9,
        minHeight: 9,
        maxHeight: 9,
      },
    },
  },
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
