/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  ApplicationList: () => import('./application-list.vue'),
  ApplicationCustomIframe: () => import('./application-custom-iframe.vue'),
  ListSelector: () => import('./list-selector.vue'),
  QueryForm: () => import('./components/query-form.vue'),
  DataUpload: () => import('./components/import/data-upload.vue'),
  DataImport: () => import('./components/import/data-import.vue'),
  DataImportStatus: () => import('./components/import/data-import-status.vue'),
  DataExport: () => import('./components/data-export.vue'),
  PrintQrcode: () => import('./components/print-qrcode.vue'),
  AppPortalRuntime: () => import('./app-portal-runtime.vue')
};
