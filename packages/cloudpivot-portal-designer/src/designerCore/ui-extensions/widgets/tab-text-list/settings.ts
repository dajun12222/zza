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
    label: $i18n.t(`widgets.TabTextList.enums.${e}`),
  }));
};

const properties = {
  groups: [
    {
      value: 'backgroudStyle',
      grid: [['backgroundColor'], ['backgroundImg'], ['borderRadius']],
    },
    {
      value: 'borderStyle',
      grid: [['borderStyle'], ['borderThickness'], ['borderColor']],
    },
    {
      value: 'textStyle',
      grid: [['textColor'], ['textThickness']],
    },
    {
      value: 'advancedConfig',
      grid: [['heads']],
    },
  ],

  display: {
    textColor: {
      component: {
        type: ComponentType.ColorPicker,
      },
    },
    backgroundColor: {
      component: {
        type: ComponentType.ColorPicker,
      },
    },
    borderColor: {
      component: {
        type: ComponentType.ColorPicker,
      },
    },

    borderRadius: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },
    borderStyle: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },

    backgroundImg: {
      component: {
        // type: ComponentType.InputUpload,
        type: 'imgUpload',
      },
    },

    borderThickness: {
      component: {
        type: ComponentType.InputNumber,
      },
    },

    textThickness: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },

    heads: {
      component: {
        type: 'tabsSetter',
      },
    },
  },

  subscription: {
    dataChange: function (
      key: string,
      value: any,
      controller: forms.FormGroup,
    ) {
      if (key === 'borderStyle') {
        controller.children.borderThickness.display = !!(value !== 'none');
        controller.children.borderColor.display = !!(value !== 'none');
      }

      // 数值类型不能小于0
      if (['borderThickness'].includes(key) && value < 0) {
        controller.children[key].value = 0;
      }
    },
  },
};

export default {
  layout: {
    grid: {
      padding: '8px',
      size: {
        width: 5,
        minWidth: 3,
        height: 26,
        minHeight: 15,
        // maxHeight: 8,
      },
    },
  },
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
