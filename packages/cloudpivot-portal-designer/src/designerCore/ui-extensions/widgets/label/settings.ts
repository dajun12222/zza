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
    label: $i18n.t(`widgets.Label.enums.${e}`),
  }));
};

const pxInput = {
  type: ComponentType.InputCssSize,
  options: {
    unit: 'px',
  },
};

const properties = {
  groups: [
    {
      value: 'props',
      grid: [['userSelect'], ['textOverflow']],
    },
    {
      value: 'lineFeed',
      mainSwitchKey: 'lineFeed',
      keys: ['wordBreak'],
    },
    {
      value: 'text',
      grid: [
        ['fontFamily', 'fontSize'],
        ['fontStyle', 'fontColor'],
        ['textIndent', 'letterSpacing'],
        ['lineHeight', 'wordSpacing'],
        ['textAlign', 'verticalAlign'],
      ],
    },
  ],

  display: {
    content: {
      component: {
        type: ComponentType.Textarea,
      },
    },
    wordBreak: {
      selectOptions,
    },
    lineFeed: {
      component: {
        type: ComponentType.Switch,
      },
    },
    textIndent: {
      component: {
        type: ComponentType.InputCssSize,
        options: {
          unit: 'px',
          icon: 'h-icon-all-First-line-indent_o',
          title: '首行缩进',
          tooltip: '首行缩进',
        },
      },
    },
    letterSpacing: {
      component: {
        type: ComponentType.InputCssSize,
        options: {
          unit: 'px',
          icon: 'h-icon-all-word-spacing_o',
          title: '字间距',
          tooltip: '字间距',
        },
      },
    },
    wordSpacing: {
      component: {
        type: ComponentType.InputCssSize,
        options: {
          unit: 'px',
          icon: 'h-icon-all-Words-spacing_o',
          title: '词间距',
          tooltip: '词间距',
        },
      },
    },
    lineHeight: {
      component: {
        type: ComponentType.InputCssSize,
        options: {
          unit: 'px',
          icon: 'h-icon-all-Line-spacing_o',
          title: '行间距',
          tooltip: '行间距',
        },
      },
    },
    textAlign: {
      component: {
        type: ComponentType.TextAlignRadio,
      },
    },
    verticalAlign: {
      component: {
        type: ComponentType.VerticalAlignRadio,
      },
    },
    fontStyle: {
      component: {
        type: ComponentType.TextDecoration,
      },
    },
    fontFamily: {
      selectOptions,
    },
    textOverflow: {
      component: {
        type: ComponentType.RadioButtonGroup,
      },
      selectOptions,
    },
    fontSize: {
      component: pxInput,
    },
    fontColor: {
      component: {
        type: ComponentType.ColorPicker,
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
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
