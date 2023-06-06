/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { register } from '@cloudpivot-shared/ui-property-editor/extension';

register.components.TabPanelsSetter = () =>
  import(/* webpackChunkName: "panels-setter" */ './panels-setter.vue');
