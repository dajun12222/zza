/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { WidgetStore } from '@cloudpivot-shared/ui-engine-vue';

export let widgetStore: WidgetStore;

export function init(store: WidgetStore) {
  widgetStore = store;
}
