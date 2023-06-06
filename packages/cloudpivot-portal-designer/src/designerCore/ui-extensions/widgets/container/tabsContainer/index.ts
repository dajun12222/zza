/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  DeviceType,
  ElementWidgetLike,
} from '@cloudpivot-shared/ui-engine-vue/document';

import './panels-setter';

import { ComponentGroup, ComponentType } from '../../../enums';

import * as schema from './schema';

import settings from './settings';
import tabPanelSettings from './tabPanelSettings';

export const horizTabs = {
  version: '0.0.1',
  info: {
    title: '横向标签页容器',
    type: ComponentType.HorizTabs,
    group: ComponentGroup.Layout,
    thumbnail: require('./tab-grid.png'),
    expectChildTypes: [ComponentType.Layout, ComponentType.TabsPanelGrid],
    icon: 'h-icon-all-symbol_tab2',
    container: true,
    hiddenMask: true,
  },
  schema: schema.default,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "tabs" */ './tabs.vue'),
  },
} as ElementWidgetLike;

const verticalSchema = JSON.parse(JSON.stringify(schema.default));
verticalSchema.properties.tabPosition.default = 'left';
export const verticalTabs = {
  version: '0.0.1',
  info: {
    title: '纵向标签页容器',
    type: ComponentType.VerticalTabs,
    group: ComponentGroup.Layout,
    thumbnail: require('./tab-grid.png'),
    expectChildTypes: [ComponentType.Layout, ComponentType.TabsPanelGrid],
    icon: 'h-icon-all-symbol_tab2',
    container: true,
    hiddenMask: true,
  },
  schema: verticalSchema,
  settings,
  component: {
    pc: () => import(/* webpackChunkName: "tabs" */ './tabs.vue'),
  },
} as ElementWidgetLike;

export const tabsPanelGrid = {
  version: '0.0.1',
  info: {
    title: '标签页面板(栅格）',
    type: ComponentType.TabsPanelGrid,
    // group: ComponentGroup.View,
    thumbnail: require('./tab-grid.png'),
    icon: 'h-icon-all-symbol_tab2',
    container: true,
    gridContainer: true,
    supportDeviceTypes: [DeviceType.Pc, DeviceType.Mobile],
    maskOptions: {
      icon: 'h-icon-all-move-o1',
      background: '#f6f7f9',
      width: '100%',
    },
  },
  schema: schema.tabPanel,
  settings: tabPanelSettings,
  component: {
    pc: () => import(/* webpackChunkName: "tab-panel" */ './tab-panel.vue'),
  },
} as ElementWidgetLike;
