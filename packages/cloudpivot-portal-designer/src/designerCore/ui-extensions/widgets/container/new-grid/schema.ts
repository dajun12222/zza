/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

export const grid = {
  type: DataType.Object,
  properties: {
    // 背景样式
    backgroundColor: {
      title: '背景颜色',
      type: DataType.String,
      default: 'rgba(255,255,255,1)',
    },
    backgroundImg: {
      title: '背景图片',
      type: DataType.String,
    },
    borderRadius: {
      title: '圆角',
      type: DataType.String,
      enum: ['none', 'small', 'medium', 'big'],
      default: 'medium',
    },

    // 边框样式
    borderStyle: {
      title: '边框样式',
      type: DataType.String,
      enum: ['none', 'solid', 'dashed'],
      default: 'solid',
    },
    borderThickness: {
      title: '边框粗细',
      type: DataType.Number,
      default: 1,
    },
    borderColor: {
      title: '边框颜色',
      type: DataType.String,
      default: '#E4E7EE',
    },
    // direction: { // 解决栅格作为布局边栏的问题
    //   type: DataType.String,
    //   hidden: true,
    // },
    maskOptions: {
      // 解决栅格的拖拽提示要特殊设置的问题
      title: '遮罩层选项',
      hidden: true,
      AnyValue: true,
    },
  },
} as ObjectPropertyInfo;
