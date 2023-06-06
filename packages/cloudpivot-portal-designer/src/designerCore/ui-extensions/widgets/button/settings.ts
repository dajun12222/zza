/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  WidgetSettings,
  DocumentNodeDto,
  // PropertiesSettings,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

const properties = {
  groups: [
    {
      value: 'showPermissionControl',
      mainSwitchKey: 'showPermissionControl',
      keys: ['permissionControl'],
    },
    {
      value: 'props',
      grid: [['content', 'mode'], ['code']],
    },
    {
      value: 'showIcon',
      mainSwitchKey: 'showIcon',
      keys: ['icon'],
    },
  ],

  display: {
    content: {
      component: {
        type: ComponentType.Input,
      },
    },
    mode: {
      component: {
        type: ComponentType.Select,
      },
      selectOptions: [
        {
          value: 'default',
          label: '默认',
        },
        {
          value: 'primary',
          label: '重要',
        },
        {
          value: 'dashed',
          label: '虚线',
        },
        {
          value: 'danger',
          label: '危险',
        },
        {
          value: 'link',
          label: '链接',
        },
      ],
    },
    showIcon: {
      component: {
        type: ComponentType.Switch,
      },
    },
  },
  subscription: {
    dataChange: function (key: string, value: any, controller: any) {
      if (key === 'codeEditable') {
        const disabled = !value;
        controller.children.code.disabled = disabled;
        controller.children.content.disabled = disabled;
      }
    },
  },
};

function upgrade(dto: DocumentNodeDto) {
  const { props } = dto;
  if (props.btnKey) {
    const code = props.btnKey;
    delete props.btnKey;
    props.code = code;
    // props.codeEditable = false;
  }
}

export default {
  upgrade,
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
