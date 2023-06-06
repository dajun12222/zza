/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import Vue from 'vue';

import imgUpload from './img-upload.vue';

import navigator from './navigator/navigator.vue';
import iconSelect from './icon-select.vue';
import bizModelSelect from './biz-model-selector.vue';
import chartDataSourceSelect from './chart-datasource-select.vue';
import displayField from './display-field.vue';
import sortField from './sort-field.vue';
import listSymbol from './list-symbol.vue';

import ImageSetter from './image-setter.vue';
import tabsSetter from './tabs-setter.vue';

import gridTabsSetter from './grid-tabs-setter.vue';

import QueryConditionsSetter from './query-conditions-setter.vue';

import AutoplaySpeedSetter from './autoplay-speed-setter.vue';

import titleSetter from './title-setter.vue';

import { register } from '@cloudpivot-shared/ui-property-editor/extension';
// import { register } from '@cloudpivot-shared/ui-designer-common';

const components = {
  imgUpload,
  navigator,
  iconSelect,
  chartDataSourceSelect,
  bizModelSelect,
  displayField,
  sortField,
  listSymbol,
  ImageSetter,
  tabsSetter,
  QueryConditionsSetter,
  AutoplaySpeedSetter,
  gridTabsSetter,
  titleSetter,
};

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key]);
});

register.registerComponents({
  LogicExpression: () =>
    import(/* webpackChunkName: "logic-expression" */ './logic-expression.vue'),

  ...components,
});
