/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  ApplicationList: () => import('./application-list/application-list.vue'),
  QueryForm: () => import('./query-form/query-form.vue'),
  SearchContent: () => import('./search-content.vue'),
  FormItem: () => import('./form-item.vue'),
  newFormItem: () => import('./application-list/form-item.vue'),
};
