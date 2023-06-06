/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Descripttion:
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-09-17 17:24:01
 * @LastEditors: baidongsheng
 * @LastEditTime: 2021-12-27 12:25:48
 */
export default {
  MyUnFinishedWorkItem: () => import('./my-unfinished-workItem.vue'),
  MyUnReadWorkItem: () => import('./my-circulate.vue'),
  MyFinishedWorkItem: () => import('./my-finished-workitem.vue'),
  MyWorkflow: () => import('./my-workflow.vue'),
  QueryInstance: () => import('./query-instance.vue'),
  TaskSearch: () => import('./task-search.vue'),
  WorkflowCenterMenu: () => import('./menu/workflow-center-menu.vue'),
  StartWorkflow: () => import('./start-workflow.vue'),
  DelegationWorkflow: () => import('./delegation-workflow.vue'),
  myComments: () => import('./my-comments.vue'),
  myCirculate: () => import('./my-circulate.vue'),
};
