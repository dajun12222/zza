import Vue from 'vue';
import { register } from '@cloudpivot-shared/ui-property-editor/extension';

const components = {};

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key]);
});

register.registerComponents({
  LogicExpression: () =>
    import(/* webpackChunkName: "logic-expression" */ './logic-expression.vue'),

  ...components,
});
