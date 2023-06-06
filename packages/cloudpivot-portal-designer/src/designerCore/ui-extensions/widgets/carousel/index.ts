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
  title: '轮播图',
  type: ComponentType.Carousel,
  icon: 'h-icon-all-symbol_text',
  group: ComponentGroup.FrequentlyUsed,
  thumbnail: require('./轮播图@2x.png'),
  traits: [WidgetTrait.FormControl],
  discription: '适用于制作门户banner、以图片形式传达重要通知等。',
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "label" */ './carousel.vue'),
    mobile: () => import(/* webpackChunkName: "label" */ './carousel.vue'),
  },
} as ElementWidgetLike;
