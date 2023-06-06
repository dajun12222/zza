/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import common from 'cloudpivot/common';

export default common.directives.controlBack;

// export interface ControlBackConfig {

//   handler: BackEventHandler

// }

// export const config: ControlBackConfig = {} as any;

// export default {
//   bind(el: HTMLElement, bind: VNodeDirective, vm: any) {
//     const options = {
//       callback: vm.context.close
//     };
//     if (vm.context.show) {
//       const tmpShow = vm.context.show;
//       vm.context.show = function () {
//         const result = tmpShow.apply(vm.context, arguments);
//         config.handler.subscribe(options);
//         return result;
//       }
//     }
//     if (vm.context.close) {
//       const tmpClose = vm.context.close;
//       vm.context.close = () => {
//         const result = tmpClose.apply(vm.context, arguments);
//         config.handler.unsubscribe(options);
//         return result;
//       }
//     }
//   }
// };

// export interface BackOptions {
//   callback: () => void
// }

// export interface BackEventHandler {

//   subscribe(options: BackOptions): void;

//   unsubscribe(options: BackOptions): void;

// }
