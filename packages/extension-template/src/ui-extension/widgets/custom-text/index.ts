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
  title: '自定义文本',
  type: ComponentType.CustomText,
  icon: 'h-icon-all-symbol_text',
  group: ComponentGroup.CustomGroup,
  thumbnail: require('./文本列表@2x.png'),
  traits: [WidgetTrait.FormControl],
  discription: '适用于展示通知、新闻、公告等内容。',
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "label" */ './custom-text.vue'),
    mobile: () => import(/* webpackChunkName: "label" */ './custom-text.vue'),
  },
} as ElementWidgetLike;
