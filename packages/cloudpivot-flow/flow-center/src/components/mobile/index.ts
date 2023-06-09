/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  InitialInstance: () => import('./initial-instance.vue'),
  BatchInfoAdd: () => import('./components/batch-info-add.vue'),
  BatchTransferInfo: () => import('./components/batch-transfer-info.vue'),
  MyInstanceItem: () => import('./my-instance/item.vue'),
  MyUnFinishedWorkItem: () => import('./my-unfinished-workItem.vue'),
  MyUnReadWorkItem: () => import('./my-unread-workitem.vue'),
  MyFinishedWorkItem: () => import('./my-finished-workitem.vue'),
  MyReadWorkItem: () => import('./my-read-workitem.vue'),
  AppTask: () => import('./app-task.vue'),
  InitialItem: () => import('./initial-instance/initial-item/index.vue'),
};
