/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

export default {
  type: DataType.Object,
  properties: {
    showPermissionControl: {
      type: DataType.Boolean,
      title: '控制按钮权限',
      default: false,
    },
    content: {
      type: DataType.String,
      title: '按钮文本',
      default: '默认',
    },
    code: {
      type: DataType.String,
      title: '按钮编码',
    },
    codeEditable: {
      type: DataType.Boolean,
      title: '编码属性是否可编辑',
      default: true,
      hidden: true,
    },
    disabled: {
      type: DataType.Boolean,
      title: '禁用',
    },
    loading: {
      type: DataType.Boolean,
      title: '加载中',
      hidden: true,
    },
    mode: {
      title: '按钮类型',
      type: DataType.String,
      enum: ['default', 'primary', 'dashed', 'danger', 'link'],
      default: 'default',
    },
    showIcon: {
      type: DataType.Boolean,
      title: '是否显示图标',
      default: false,
    },
    icon: {
      title: '显示图标',
      $ref: ComponentType.IconSetter,
    },
    margin: {
      title: '外边距',
      $ref: ComponentType.MargingSetter,
    },
    rotate: {
      title: '旋转',
      $ref: ComponentType.RotateSetter,
    },
    border: {
      title: '边框',
      $ref: ComponentType.BorderSetter,
      default: {
        style: 'solid',
        color: '#e8e8e8',
        topLeftRadius: '4px',
        topRightRadius: '4px',
        bottomLeftRadius: '4px',
        bottomRightRadius: '4px',
      },
    },
    shadow: {
      title: '阴影',
      $ref: ComponentType.ShadowSetter,
      default: {},
    },
    filter: {
      title: '滤镜属性',
      $ref: ComponentType.FilterSetter,
      default: {},
    },
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
      default: {
        width: 'auto',
        height: '32px',
      },
    },
    sizeLimit: {
      title: '尺寸限制',
      $ref: ComponentType.SizeLimiter,
      default: {},
    },
    visible: {
      title: '可见',
      $ref: ComponentType.VisibleSetter,
    },
    background: {
      title: '背景',
      $ref: ComponentType.BackgroundSetter,
    },
    font: {
      title: '字体',
      $ref: ComponentType.FontSetter,
      default: {
        color: '',
      },
    },
  },
  actions: {
    focus: {},
  },
  events: {
    click: {
      title: '单击时',
      parameters: [
        {
          name: 'code',
          schema: {
            type: DataType.String,
          },
        },
        {
          name: 'name',
          schema: {
            type: DataType.String,
          },
        },
      ],
    },
  },
} as ObjectPropertyInfo;
