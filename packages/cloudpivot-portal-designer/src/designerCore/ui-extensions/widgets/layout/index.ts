/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import {
  ElementWidgetLike,
  // WidgetInfo
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType, ComponentGroup } from '../../enums';

import * as schema from './schema';

import settings from './settings';

import siderSettings from './layout-sider-settings';

const icon = 'h-icon-all-Components_layout';

export const layout = {
  info: {
    title: '布局',
    type: ComponentType.Layout,
    expectChildTypes: [ComponentType.LayoutPanel],
    icon,
    // group: ComponentGroup.Layout,//注释掉布局组件
    container: true,
    full: true,
    mainContainer: true,
    // supportDeviceTypes: [DeviceType.Pc],
  },
  schema: schema.layout,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "layout" */ './layout.vue'),
  },
} as ElementWidgetLike;

export const layoutPanel = {
  info: {
    title: '布局面板',
    type: ComponentType.LayoutPanel,
    expectParentTypes: [ComponentType.Layout],
    icon,
    container: true,
    cloneable: false,
    // full: true
  },
  schema: schema.panel,
  // settings,
  component: {
    pc: () =>
      import(/* webpackChunkName: "layout-panel" */ './layout-panel.vue'),
  },
} as ElementWidgetLike;

export const layoutSider = {
  info: {
    title: '布局面板',
    type: ComponentType.LayoutSider,
    expectParentTypes: [ComponentType.Layout],
    icon,
    container: true,
    cloneable: false,
    // full: true
  },
  schema: schema.sider,
  settings: siderSettings,
  component: {
    pc: () =>
      import(/* webpackChunkName: "layout-panel" */ './layout-panel.vue'),
  },
} as ElementWidgetLike;
