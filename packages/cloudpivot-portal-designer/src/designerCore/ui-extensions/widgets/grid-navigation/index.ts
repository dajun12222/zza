/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ElementWidgetLike,
  WidgetInfo,
  WidgetTrait,
  // DeviceType,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType, ComponentGroup } from '../../enums';

import schema from './schema';

import settings from './settings';

const info: WidgetInfo = {
  title: '宫格导航',
  type: ComponentType.GridNavigation,
  icon: 'h-icon-all-symbol_text',
  group: ComponentGroup.Nav,
  thumbnail: require('./宫格导航@2x.png'),
  traits: [WidgetTrait.FormControl],
  discription: '适用于搭建应用、模型的快捷入口。',
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "label" */ './grid-navigation.vue'),
    mobile: () =>
      import(/* webpackChunkName: "label" */ './grid-navigation.vue'),
  },
} as ElementWidgetLike;
