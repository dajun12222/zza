/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  DeviceType,
  ElementWidgetLike,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentGroup, ComponentType } from '../../../enums';

import * as schema from './schema';

import settings from './settings';
import tabPanelSettings from './tabPanelSettings';

export const TabsGrid = {
  version: '0.0.1',
  info: {
    title: '页签布局',
    type: ComponentType.TabsGrid,
    group: ComponentGroup.Layout,
    thumbnail: require('./tab-grid.png'),
    expectChildTypes: [ComponentType.Layout, ComponentType.TabsPanelGrid],
    icon: 'h-icon-all-symbol_tab2',
    container: true,
    hiddenMask: true,
    discription: '适用于多个页签切换的布局场景。',
  },
  schema: schema.default,
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
      icon: '',
      background: 'transparent',
      width: '100%',
      text: '拖拽左侧组件到页签布局',
      'font-size': '12px !important',
      color: 'rgba(17,18,24,0.5) !important',
      'flex-flow': 'column',
    },
    removable: false,
  },
  schema: schema.tabPanel,
  settings: tabPanelSettings,
  component: {
    pc: () => import(/* webpackChunkName: "tab-panel" */ './tab-panel.vue'),
  },
} as ElementWidgetLike;
