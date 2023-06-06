/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Vue, { VNode } from 'vue';
import { Message } from '@h3/antd-vue/types/message';
import VueI18n, { IVueI18n } from 'vue-i18n';
import { Route, VueRouter } from 'vue-router/types/router';
import { ModalConfirm, ModalOptions } from '@h3/antd-vue/types/modal';
import { Store } from 'vuex';

declare module 'vue/types/vue' {
  // 3. 声明为 Vue 补充的东西
  interface Vue {
    // $confirm: any,
    // $warning: any,
    // $message: any,
    // $error: any,
    isDingTalk: boolean;
    $message: Message;
    $t: typeof VueI18n.prototype.t;
    $route: Route;
    $router: VueRouter;
    readonly $i18n: VueI18n & IVueI18n;
    $confirm: (modalOptios: ModalOptions) => ModalConfirm;
    $store: Store<any>;
    $h3: {
      toast: any;
      modal: any;
      datetime: any;
    };
  }
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    less: any;
    dd: any;
    Environment: any;
    $instance: any;
    valueChangeSubscriptionList: any; //存放base-control中控件监听返回值
    config?: any;
  }

  var AMap: any;
}
