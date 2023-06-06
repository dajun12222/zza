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

// import component from './icon.vue';

const info: WidgetInfo = {
  title: '图标',
  type: ComponentType.Icon,
  group: ComponentGroup.Basic,
  icon: 'h-icon-all-symbol_icon',
  container: false,
  // supportDeviceTypes: [DeviceType.Pc, DeviceType.Mobile],
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "icon" */ './icon.vue'),
    mobile: () => import(/* webpackChunkName: "icon" */ './icon.vue'),
  },
} as ElementWidgetLike;
