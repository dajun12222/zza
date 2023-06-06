/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Vue from 'vue';
import Confirm from './confirm.vue';
import { ConfirmOptions } from './confirm';

export default (options: ConfirmOptions) => {
  const Instance: Vue = new Vue({
    // store,
    router: (Vue as any).prototype.router,
    destroyed: () => {
      document.body.removeChild(Instance.$el);
    },
    render: (h: any) => {
      const on: any = {};
      if (options.ok instanceof Function) {
        on.ok = options.ok;
      }
      if (options.cancel instanceof Function) {
        on.cancel = options.cancel;
      }
      if (options.oKCallBack instanceof Function) {
        on.oKCallBack = options.oKCallBack;
      }
      on.destroy = () => Instance.$destroy();
      return h(Confirm, {
        props: options,
        on,
      });
    },
  } as any);
  const component = Instance.$mount();
  document.body.appendChild(component.$el);
};
