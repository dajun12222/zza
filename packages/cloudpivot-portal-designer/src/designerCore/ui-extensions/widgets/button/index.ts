/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ElementWidgetLike,
  WidgetInfo,
  WidgetTrait,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType, ComponentGroup } from '../../enums';

import schema from './schema';

import settings from './settings';

const info: WidgetInfo = {
  title: '按钮',
  type: ComponentType.Buttons,
  group: ComponentGroup.Basic,
  icon: 'h-icon-all-symbol_Button',
  // supportDeviceTypes: [DeviceType.Pc, DeviceType.Mobile],
  traits: [WidgetTrait.FormControl],
};

export default {
  version: '0.0.1',
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "buttons" */ './button.vue'),
    mobile: () => import(/* webpackChunkName: "buttons" */ './button.vue'),
  },
} as ElementWidgetLike;
