/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-designer-common';

import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

export default {
  type: DataType.Object,
  properties: {
    // TODO 暂时去掉
    // publicPage: {
    //   title: '公开页面',
    //   type: DataType.Boolean,
    //   default: false,
    //   description: '页面设置为公开时，页面不需要账号登录就可访问页面全部内容，包括页面的字段，数据、操作都不受权限限制。',
    // },
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
      default: {
        height: '100%',
      },
    },
    padding: {
      title: '内边距',
      $ref: ComponentType.PaddingSetter,
    },
    background: {
      title: '背景',
      $ref: ComponentType.BackgroundSetter,
      default: {
        color: '#ffffff',
      },
    },
    overflow: {
      title: '滚动',
      $ref: ComponentType.overflowSetter,
      default: {
        x: 'auto',
        y: 'auto',
      },
    },
    visible: {
      title: '可见',
      $ref: ComponentType.VisibleSetter,
    },
  },
  events: {
    enter: {
      title: '进入',
    },
    leave: {
      title: '离开',
    },
  },
} as ObjectPropertyInfo;
