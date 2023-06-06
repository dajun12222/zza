/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import { WidgetType } from '@cloudpivot-shared/ui-engine-vue';

import './property-panel';

import widgets from './widgets';
import uiEngine from '../ui-engine';

//注册二开组件
import extensionComponents from 'extension-template/src/ui-extension/widgets/index';

/**
 * 注册拓展组件
 */
widgets.concat(extensionComponents).forEach((w) => {
  w.moduleName = 'widgets';
  w.type = WidgetType.Element;
  uiEngine.widgetStore.registerWidget(w);
});

uiEngine.i18n.localeChanged.subscribe(() => {
  const locale = uiEngine.i18n.locale;
  import(
    /* webpackChunkName: "widgets-lang-[request]" */ `./widgets/languages/${locale}`
  ).then((msg) => {
    uiEngine.i18n.mergeMessage(msg.default);
  });
});

export default widgets;
