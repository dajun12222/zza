/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Label from '../label/languages/en';
import Button from '../button/languages/en';
import Img from '../img/languages/en';
import Icon from '../icon/languages/en';
import Page from '../page/languages/en';
import ShortcutList from '../shortcut-list/languages/en';
import GridNavigation from '../grid-navigation/languages/en';
import TextList from '../text-list/languages/en';
import MyApplication from '../my-application/languages/en';
import NewGrid from '../container/new-grid/languages/en';
import TabsGrid from '../container/tabs-grid/languages/en';
import TabsPanelGrid from '../container/tabs-grid/languages/en';
import extensionComponents from 'extension-template/src/ui-extension/widgets/languages/en';
import MyUnfinished from '../my-unfinished/languages/en';
import Chart from '../chart/languages/en';
import TabTextList from '../tab-text-list/languages/en';
import Carousel from '../carousel/languages/en';
import RowMenu from '../navigation/row-menu/languages/en';
import ColMenu from '../navigation/col-menu/languages/en';

import { ComponentGroup } from '../../enums';

export default {
  widgets: {
    groups: {
      [ComponentGroup.Basic]: 'Basic',
      [ComponentGroup.Layout]: 'Layout',
      [ComponentGroup.Nav]: 'Nav',
      [ComponentGroup.Form]: 'Data Entry',
      [ComponentGroup.View]: 'Data Display',
      [ComponentGroup.Feedback]: 'Feedback',
      [ComponentGroup.ModelDrive]: 'Model Drive',
      [ComponentGroup.AppMenu]: 'App Menu',
      [ComponentGroup.Frequently]: 'Frequently used',
      [ComponentGroup.Business]: 'Business',
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
    MyApplication,
    MyUnfinished,
    Chart,
    TabTextList,
    Carousel,
    RowMenu,
    ColMenu,
    ...extensionComponents.widgets.components,
  },
};
