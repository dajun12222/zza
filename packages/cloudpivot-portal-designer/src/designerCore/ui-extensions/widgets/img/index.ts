/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ElementWidgetLike,
  WidgetInfo,
  // DeviceType,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType, ComponentGroup } from '../../enums';

import schema from './schema';

import settings from './settings';

const component = () => import(/* webpackChunkName: "img" */ './img.vue');

const info: WidgetInfo = {
  title: '图片',
  type: ComponentType.Img,
  group: ComponentGroup.Basic,
  icon: 'h-icon-all-symbol_pic',
  container: false,
  // supportDeviceTypes: [DeviceType.Pc, DeviceType.Mobile],
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: component,
    mobile: component,
  },
} as ElementWidgetLike;
