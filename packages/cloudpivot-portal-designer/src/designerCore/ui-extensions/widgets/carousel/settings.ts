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
      value: 'backgroudStyle',
      grid: [['backgroundColor'], ['borderRadius']],
    },
    {
      value: 'borderStyle',
      grid: [['borderStyle'], ['borderThickness'], ['borderColor']],
    },
    {
      value: 'advancedConfig',
      grid: [['photos'], ['autoplay'], ['autoplaySpeed']],
    },
  ],

  display: {
    photos: {
      component: {
        type: 'ImageSetter',
      },
    },
    autoplay: {
      component: {
        type: ComponentType.Switch,
      },
    },
    autoplaySpeed: {
      component: {
        type: 'AutoplaySpeedSetter',
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

    borderThickness: {
      component: {
        type: ComponentType.InputNumber,
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
      if (key === 'borderStyle') {
        controller.children.borderThickness.display = !!(value !== 'none');
        controller.children.borderColor.display = !!(value !== 'none');
      }
      if (key === 'autoplay') {
        controller.children.autoplaySpeed.display = !!value;
      }
    },
  },
};

export default {
  layout: {
    grid: {
      padding: '8px',
      size: {
        width: 6,
        minWidth: 1,
        height: 23,
        minHeight: 16,
        // maxHeight: 8,
      },
    },
  },
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
