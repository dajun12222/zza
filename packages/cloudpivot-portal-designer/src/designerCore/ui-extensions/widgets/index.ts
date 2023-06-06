/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
// import text from './label';
// import button from './button';
// import icon from './icon';
// import img from './img';
import page from './page';
import shortcutList from './shortcut-list';
import gridNavigation from './grid-navigation';
import textList from './text-list';
import chart from './chart';
import myUnfinished from './my-unfinished';
import tabTextList from './tab-text-list';
import carousel from './carousel';
import myApplication from './my-application';

import RowMenu from './navigation/row-menu';
import ColMenu from './navigation/col-menu';

// import { layout, layoutPanel, layoutSider } from './layout';
import layout from './container';

export default [
  // text,
  // button,
  // icon,
  // img,
  ...layout,
  gridNavigation,
  RowMenu,
  ColMenu,
  carousel,
  textList,
  tabTextList,
  chart,
  myUnfinished,
  shortcutList,
  myApplication,
  page,
];
