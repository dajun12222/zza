/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ElementWidgetLike } from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType, ComponentGroup } from '../../../enums';

import * as schema from './schema';

import settings from './settings';

export const newGrid = {
  info: {
    title: '容器',
    type: ComponentType.NewGrid,
    icon: 'h-icon-all-symbol_Grid',
    group: ComponentGroup.Layout,
    thumbnail: require('./grid.png'),
    container: true,
    mainContainer: true,
    gridContainer: true,
    maskOptions: {
      icon: '',
      background: 'transparent',
      width: '100%',
      text: '拖拽左侧组件到容器',
      'font-size': '12px !important',
      color: 'rgba(17,18,24,0.5) !important',
      'flex-flow': 'column',
    },
    discription: '适用于对页面布局进行管理的场景，容器内可拖入多个组件。',
  },
  schema: schema.grid,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "grid" */ './grid.vue'),
  },
} as ElementWidgetLike;
