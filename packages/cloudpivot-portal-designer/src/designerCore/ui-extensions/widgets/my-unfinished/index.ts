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
  title: '我的待办',
  type: ComponentType.MyUnfinished,
  icon: 'h-icon-all-symbol_text',
  group: ComponentGroup.Business,
  thumbnail: require('./我的待办@2x.png'),
  traits: [WidgetTrait.FormControl],
  discription: '展示待办、已办等统计及待办事项，包含预警、催办事项等。',
  cloneable: false
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "label" */ './my-unfinished.vue'),
    mobile: () => import(/* webpackChunkName: "label" */ './my-unfinished.vue'),
  },
} as ElementWidgetLike;
