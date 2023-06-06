/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import {
  ElementWidgetLike,
  WidgetInfo,
} from '@cloudpivot-shared/ui-designer-common';

import { ComponentType } from '../../enums';
import schema from './schema';
import settings from './settings';

const info: WidgetInfo = {
  title: '页面',
  type: ComponentType.Page,
  icon: 'h-icon-all-symbol_Footer',
  container: true,
  maskOptions: {
    // display: 'none',
    'flex-flow': 'column',
    icon: '',
    text: '请从左侧面板拖入组件到画布',
    color: 'rgba(17,18,24,0.5) !important',
  },
};

export default {
  version: '0.0.1',
  info,
  schema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "page" */ './page.vue'),
    design: () =>
      import(/* webpackChunkName: "page-design" */ './design/page.vue'),
  },
} as ElementWidgetLike;
