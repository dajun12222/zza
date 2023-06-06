/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Vue from 'vue';

import {
  UiEngineVue,
  DataSourcePlugin,
} from '@cloudpivot-shared/ui-engine-vue';
import { PropertyEditorPlugin } from '@cloudpivot-shared/ui-property-editor';

Vue.use(UiEngineVue);

const appEnv = 'design';

const uiEngine = new UiEngineVue({
  appEnv,
});

uiEngine.use(new PropertyEditorPlugin());
uiEngine.use(new DataSourcePlugin());

export default uiEngine;
