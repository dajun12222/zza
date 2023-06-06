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
  title: '多页签文本列表',
  type: ComponentType.TabTextList,
  icon: 'h-icon-all-symbol_text',
  group: ComponentGroup.FrequentlyUsed,
  thumbnail: require('./多页签文本列表@2x.png'),
  traits: [WidgetTrait.FormControl],
  discription: '适用于展示通知、新闻、公告等。分多个页签展示。',
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "label" */ './tab-text-list.vue'),
    mobile: () => import(/* webpackChunkName: "label" */ './tab-text-list.vue'),
  },
} as ElementWidgetLike;
