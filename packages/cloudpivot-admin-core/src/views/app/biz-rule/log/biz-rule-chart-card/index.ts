/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Vue from 'vue';
import ChartCard from './chart-card.vue';
import { BizRuleChartCardOptions } from './chart-card';

export default (options: BizRuleChartCardOptions) => {
  const Instance: Vue = new Vue({
    destroyed: () => {
      main
        ? document.getElementsByClassName('main')[0].removeChild(Instance.$el)
        : document.body.removeChild(Instance.$el);
    },
    render: (h: any) =>
      h(ChartCard, {
        props: options,
        on: {
          destroy: () => Instance.$destroy(),
        },
      }),
  } as any);
  const component = Instance.$mount();
  const main = document.getElementsByClassName('main')[0];
  if (main) {
    document.getElementsByClassName('main')[0].appendChild(component.$el);
  } else {
    document.body.appendChild(component.$el);
  }
};
