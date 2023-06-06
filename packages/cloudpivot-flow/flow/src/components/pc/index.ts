/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  WorkflowInfo: () => import('./workflow-info.vue'),
  WorkflowTrack: () => import('./workflow-track.vue'),
  WorkflowTrackActions: () => import('./workflow-track-actions.vue'),
  WorkflowChart: () => import('./chart.vue'),
  WorkflowLogs: () => import('./logs.vue'),
  Approval: () => import('./approval/approval.vue'),
  OperationLogs: () => import('./operation-logs.vue'),
};
