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
  const tabPosition = controller.children.tabPosition.value;
  return propInfo.enum
    .filter((e) => {
      if (
        key === 'sizeType' &&
        (tabPosition === 'right' || tabPosition === 'left')
      ) {
        if (e === 'small') {
          return false;
        }
      }
      return true;
    })
    .map((e) => ({
      value: e,
      label: $i18n.t(`widgets.Tabs.enum.${e}`),
    }));
};

const properties = {
  groups: [
    {
      value: 'panels',
      grid: [['panels']],
    },
    // {
    //   value: 'autoHeight',
    //   mainSwitchKey: 'isHeightAuto',
    //   hideWhenfalse: false,
    //   keys: ['size'],
    // },
  ],
  display: {
    panels: {
      component: {
        type: ComponentType.TabPanelsSetter,
      },
    },
    tabPosition: {
      selectOptions,
    },
    type: {
      selectOptions,
    },
    sizeType: {
      selectOptions,
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
    },
  },
};

const creating = (dto: DocumentNodeDto) => {
  const { TabsPanelGrid, NewGrid } = AssetComponentType;
  const panels = Array(2)
    .fill(0)
    .map((_, i) => {
      const type = TabsPanelGrid;
      const props = {
        tab: 'Tab' + (i + 1),
        size: {
          height: '180px',
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
    padding: '4px 8px',
    size: {
      width: 8,
      minWidth: 5,
      height: 30,
      minHeight: 15,
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
