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
  title: '流程统计',
  type: ComponentType.ProcessStatistics,
  icon: 'h-icon-all-symbol_text',
  group: ComponentGroup.Business,
  thumbnail: require('./流程统计@2x.png'),
  traits: [WidgetTrait.FormControl],
  discription: '',
  cloneable: false,
};

export default {
  info,
  schema,
  settings,
  component: {
    pc: () =>
      import(/* webpackChunkName: "label" */ './process-statistics.vue'),
    mobile: () =>
      import(/* webpackChunkName: "label" */ './process-statistics.vue'),
  },
} as ElementWidgetLike;
