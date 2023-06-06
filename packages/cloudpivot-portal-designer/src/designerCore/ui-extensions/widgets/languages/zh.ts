/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Label from '../label/languages/zh';
import Button from '../button/languages/zh';
import Img from '../img/languages/zh';
import Icon from '../icon/languages/zh';
import Page from '../page/languages/zh';
import ShortcutList from '../shortcut-list/languages/zh';
import GridNavigation from '../grid-navigation/languages/zh';
import TextList from '../text-list/languages/zh';
import Chart from '../chart/languages/zh';
import MyUnfinished from '../my-unfinished/languages/zh';
import TabTextList from '../tab-text-list/languages/zh';
import Carousel from '../carousel/languages/zh';
import MyApplication from '../my-application/languages/zh';

import RowMenu from '../navigation/row-menu/languages/zh';
import ColMenu from '../navigation/col-menu/languages/zh';

import NewGrid from '../container/new-grid/languages/zh';
import TabsGrid from '../container/tabs-grid/languages/zh';
import TabsPanelGrid from '../container/tabs-grid/languages/zh';

import Layout, { LayoutPanel, LayoutSider } from '../layout/languages/zh';

import { ComponentGroup } from '../../enums';

import extensionComponents from 'extension-template/src/ui-extension/widgets/languages/zh';

export default {
  widgets: {
    groups: {
      [ComponentGroup.Layout]: '布局组件',
      [ComponentGroup.Basic]: '基础组件',
      [ComponentGroup.Nav]: '导航组件',
      [ComponentGroup.Form]: '数据录入组件',
      [ComponentGroup.View]: '数据展示组件',
      [ComponentGroup.Feedback]: '反馈组件',
      [ComponentGroup.ModelDrive]: '视图组件',
      [ComponentGroup.AppMenu]: '应用菜单组件',
      [ComponentGroup.Frequently]: '常用组件',
      [ComponentGroup.ThridParty]: '第三方组件',
      [ComponentGroup.Business]: '业务组件',
      [ComponentGroup.FrequentlyUsed]: '常用组件',
      ...extensionComponents.widgets.groups,
    },
    NewGrid,
    TabsGrid,
    TabsPanelGrid,
    Label,
    Button,
    Img,
    Icon,
    Page,
    ShortcutList,
    GridNavigation,
    TextList,
    Chart,
    MyUnfinished,
    Carousel,
    TabTextList,
    MyApplication,
    RowMenu,
    ColMenu,
    Layout,
    LayoutPanel,
    LayoutSider,
    ...extensionComponents.widgets.components,
  },
};
