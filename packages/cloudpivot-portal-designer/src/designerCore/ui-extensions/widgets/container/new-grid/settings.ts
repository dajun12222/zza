/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  WidgetSettings,
  EnumPropertyInfo,
  // ObjectPropertyInfo,
} from '@cloudpivot-shared/ui-engine-vue/document';
import { register } from '@cloudpivot-shared/ui-designer-common';
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
    label: $i18n.t(`widgets.NewGrid.enums.${e}`),
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
  ],

  display: {
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
  },

  subscription: {
    dataChange: function (key: string, value: any, controller: any) {
      if (key === 'isHeightAuto') {
        const sizeHeight = (controller.children.size as any).children.height;
        if (sizeHeight) {
          sizeHeight.disabled = value;
          sizeHeight.readonly = value;
          sizeHeight.options.disabled = value;
        }
      }
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
const layoutSettings = {
  grid: {
    padding: '8px',
    size: {
      width: 5,
      minWidth: 3,
      height: 35,
      minHeight: 17,
      // maxHeight: 8,
    },
  },
};

const creating = (dto) => {
  // 移动端:creating 时设置节点的layout数据取代通过setting定义
  const isMobile = register.store?.currentPage?.support === 'mobile';
  if (isMobile) {
    dto.layout = {
      width: 12,
      height: 15,
    };
  }
  return [];
};

export default {
  creating,
  layout: layoutSettings,
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
