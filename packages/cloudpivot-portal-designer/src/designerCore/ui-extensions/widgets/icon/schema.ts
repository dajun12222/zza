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
    margin: {
      title: '外边距',
      $ref: ComponentType.MargingSetter,
    },
    rotate: {
      title: '旋转',
      $ref: ComponentType.RotateSetter,
    },
    border: {
      title: '边框属性',
      $ref: ComponentType.BorderSetter,
      default: {
        style: 'solid',
        color: '#e8e8e8',
      },
    },
    shadow: {
      title: '阴影',
      $ref: ComponentType.ShadowSetter,
    },
    filter: {
      title: '阴影',
      $ref: ComponentType.FilterSetter,
    },
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
    },
    sizeLimit: {
      title: '尺寸限制',
      $ref: ComponentType.SizeLimiter,
    },
    icon: {
      title: '图标',
      $ref: ComponentType.IconSetter,
      default: {
        type: 'question',
      },
    },
    visible: {
      title: '显示',
      $ref: ComponentType.VisibleSetter,
    },
  },
} as ObjectPropertyInfo;
