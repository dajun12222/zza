/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ObjectPropertyInfo, DataType } from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

export const layout = {
  type: DataType.Object,
  properties: {
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
      default: {
        width: '100%',
        height: '100%',
      },
    },
    margin: {
      title: '外边距',
      $ref: ComponentType.MargingSetter,
    },
    background: {
      title: '背景',
      $ref: ComponentType.BackgroundSetter,
    },
  },
} as ObjectPropertyInfo;

export const panel = {
  type: DataType.Object,
  properties: {
    direction: {
      type: DataType.String,
      hidden: true,
    },
    border: {
      title: '边框',
      $ref: ComponentType.BorderSetter,
    },
    padding: {
      title: '内边距',
      $ref: ComponentType.PaddingSetter,
    },
    background: {
      title: '背景',
      $ref: ComponentType.BackgroundSetter,
    },
    overflow: {
      title: '滚动',
      $ref: ComponentType.overflowSetter,
    },
  },
};

export const sider = {
  type: DataType.Object,
  properties: Object.assign({
    basis: {
      title: '初始',
      type: DataType.Integer,
      minimum: 1,
      default: 106,
    },
    collapsible: {
      title: '可折叠',
      type: DataType.Boolean,
    },
    toggleInside: {
      title: '折叠按钮内置',
      type: DataType.Boolean,
    },
    resizable: {
      title: '可调整大小',
      type: DataType.Boolean,
    },
    min: {
      title: '最小',
      type: DataType.Integer,
      default: 48,
      minimum: 1,
      hidden: true,
    },
    max: {
      title: '最大',
      type: DataType.Integer,
      default: 500,
      minimum: 1,
      hidden: true,
    },
  }, panel.properties),
} as ObjectPropertyInfo;
