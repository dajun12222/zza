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
    label: $i18n.t(`widgets.CustomText.enums.${e}`),
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
      grid: [['title'], ['icon'], ['textValue']],
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

    title: {
      component: {
        type: ComponentType.Input,
      },
    },

    icon: {
      component: {
        // type: ComponentType.Input,
        type: 'iconSelect',
      },
    },

    textValue: {
      component: {
        type: ComponentType.Textarea,
      },
    },
  },

  subscription: {
    dataChange: function (
      key: string,
      value: any,
      controller: forms.FormGroup,
    ) {},
  },
};

export default {
  layout: {
    grid: {
      padding: '8px',
      size: {
        width: 5,
        minWidth: 3,
        height: 27,
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
