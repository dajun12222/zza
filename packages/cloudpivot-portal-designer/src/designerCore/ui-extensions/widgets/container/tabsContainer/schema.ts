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
    panels: {
      AnyValue: true,
    },
    activeKey: {
      type: DataType.String,
      hidden: true,
    },
    defaultActiveKey: {
      type: DataType.String,
      hidden: true,
    },
    tabPosition: {
      type: DataType.String,
      title: '页签位置',
      enum: ['top', 'right', 'bottom', 'left'],
      default: 'top',
      hidden: true,
    },
    type: {
      type: DataType.String,
      title: '页签类型',
      enum: ['line', 'card'],
      default: 'line',
    },
    sizeType: {
      type: DataType.String,
      title: '大小',
      enum: ['default', 'small', 'large'],
      default: 'default',
    },
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
      hidden: true,
    },
    isHeightAuto: {
      type: DataType.Boolean,
      title: '自适应高度',
      default: false,
      hidden: true,
    },
    background: {
      title: '背景',
      $ref: ComponentType.BackgroundSetter,
      hidden: true,
    },
    padding: {
      title: '内边距',
      $ref: ComponentType.PaddingSetter,
      hidden: true,
    },

    visible: {
      title: '可见',
      $ref: ComponentType.VisibleSetter,
      hidden: true,
    },
    dataSource: {
      type: DataType.Array,
      hidden: true,
      items: {
        AnyValue: true,
      },
      default: [
        {
          href: 1,
          data: [
            {
              tabNum: 1,
            },
            {
              tabNum: 2,
            },
          ],
        },
      ],
    },
  },
  events: {
    change: {
      title: '切换面板',
      parameters: [
        {
          name: 'activeKey',
          schema: {
            type: DataType.String,
          },
        },
      ],
    },
  },
} as ObjectPropertyInfo;

export const tabPanel = {
  type: DataType.Object,
  properties: {
    tab: {
      type: DataType.String,
      title: '页签文字',
    },
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
      default: {
        height: '100%',
        width: '100%',
      },
      hidden: true,
    },
    alignment: {
      title: '对齐',
      $ref: ComponentType.FlexSetter,
    },
    overflow: {
      title: '超出',
      $ref: ComponentType.overflowSetter,
    },
    visible: {
      title: '可见',
      hidden: true,
      $ref: ComponentType.VisibleSetter,
    },
  },
} as ObjectPropertyInfo;
