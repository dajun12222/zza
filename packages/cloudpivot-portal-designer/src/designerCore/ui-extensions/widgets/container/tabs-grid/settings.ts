/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  WidgetSettings,
  DocumentNodeDto,
  EnumPropertyInfo,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { register } from '@cloudpivot-shared/ui-designer-common';
import { ComponentType } from '@cloudpivot-shared/ui-property-editor';
import { ComponentType as AssetComponentType } from '../../../enums';

import VueI18n from 'vue-i18n';

const selectOptions = (
  key: string,
  value: any,
  controller: any,
  propInfo: EnumPropertyInfo,
  $i18n: VueI18n,
) => {
  // const tabPosition = controller.children.tabPosition.value;
  return propInfo.enum.map((e) => ({
    value: e,
    label: $i18n.t(`widgets.TabsGrid.enums.${e}`),
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
      grid: [['heads'], ['tabDirection'], ['tabTitlePosition']],
    },
  ],
  display: {
    // panels: {
    //   component: {
    //     type: ComponentType.TabPanelsSetter,
    //   },
    // },
    // tabPosition: {
    //   selectOptions,
    // },
    // type: {
    //   selectOptions,
    // },
    // sizeType: {
    //   selectOptions,
    // },

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

    textColor: {
      component: {
        type: ComponentType.ColorPicker,
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
        type: 'gridTabsSetter',
      },
    },

    tabDirection: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },

    tabTitlePosition: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
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

      if (key === 'tabDirection') {
        controller.children.tabTitlePosition.display = !!(value === 'row');
      }
    },
  },
};

const creating = (dto: DocumentNodeDto) => {
  const { TabsPanelGrid, NewGrid } = AssetComponentType;
  const heads = dto.props.heads;
  const panels = Array(2)
    .fill(0)
    .map((_, i) => {
      const type = TabsPanelGrid;
      const props = {
        tab: heads[i].key.toString(),
        size: {
          height: '100%',
        },
      };
      const panel = register.store.app.createNodeDto(type, dto.id, {
        props,
      });
      return panel;
    });

  const isMobile = register.store?.currentPage?.support === 'mobile';
  if (isMobile) {
    (dto as any).layout = {
      width: 9,
      height: 30,
    };
  }

  return [...panels];
};

const layoutSettings = {
  grid: {
    padding: '8px',
    size: {
      width: 6,
      minWidth: 3,
      height: 41,
      minHeight: 23,
      // maxHeight: 8,
    },
  },
};

export default {
  creating,
  layout: layoutSettings,
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
