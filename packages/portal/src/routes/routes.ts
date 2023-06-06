/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import site from '@/config/site';
import RouterView from '@/views/common-view/index.vue';
import common from 'cloudpivot/common/pc';
import list from 'cloudpivot-list/list/pc';

// 工作台
// import workbench from 'portal-workbench';

import PortalDesignRuntime from 'cloudpivot-portal-designer/src/portal-design-runtime/portal-design-runtime.vue';

import MessageNotification from '@/components/shared/messageNotification.vue';

export default {
  home: {
    path: '/',
    redirect: {
      name: 'defaultPortalDashboard',
    },
  },
  externalLink: {
    path: '/external-link/:formid',
    name: 'external-link',
    meta: { title: ' ' },
    component: () => import('@/views/external-link.vue'),
  },
  // empty: {
  //   path: '/empty',
  //   name: 'empty',
  //   component: () => import('@/components/global/empty.vue')
  // },
  error: {
    path: '/error',
    name: 'error',
    component: () => import('@/views/shared/error.vue'),
  },
  permission: {
    path: '/permission',
    name: 'permission',
    component: () => import('@/views/shared/permission/permission.vue'),
  },
  formUnpublished: {
    path: '/form-unpublished',
    name: 'formUnpublished',
    component: common.components.FormUnpublished,
  },
  oauth: {
    path: '/oauth',
    name: 'oauth',
    component: () => import('@/views/oauth/oauth.vue'),
  },

  print: {
    path: '/print',
    name: 'print',
    meta: { title: site.title },
    component: () => import('@/views/applications/print.vue'),
  },

  login: {
    path: '/login',
    name: 'login',
    meta: { title: site.title },
    // component: () => import('@/views/login/login.vue')
    component: () => import('@/views/login/login-new.vue'),
  },

  loginError: {
    path: '/login-error',
    name: 'loginError',
    meta: { title: site.title },
    component: () => import('@/views/loginError/index.vue'),
  },

  portalPage: {
    root: {
      path: '/portal-page',
      name: 'portalPage',
      meta: { title: site.title },
      redirect: {
        name: 'default-portal-dashboard',
      },
      component: PortalDesignRuntime,
    },
    defaultPage: {
      path: 'defaultPortalDashboard',
      name: 'defaultPortalDashboard',
      meta: { title: site.title },
    },
    page: {
      path: ':pageCode',
      name: 'portal-page',
      meta: { title: site.title },
    },
  },

  formDetail: {
    path: '/form/detail',
    name: 'form-detail',
    component: () =>
      import(
        /* webpackChunkName: "form-detail" */ '@/views/form/form-detail.vue'
      ),
  },
  // flowTrackLogs: {
  //   path: '/from/workflow-track/:workflowInstanceId/operation-logs/',
  //   name: 'flowTrackOperationLogs',
  //   meta: { title: site.title + '-操作日志' },
  //   component: flow.components.OperationLogs
  // },
  flowTrack: {
    path: '/from/workflow-track/:workflowInstanceId/:workItemId/',
    name: 'flowTrack',
    meta: { title: site.title + '-流程跟踪' },
    component: () => import('@/views/form/workflow-track/workflow-track.vue'),
  },

  operationLogsCompare: {
    path: '/from/operation-log-compare/:logid/:workflowInstanceId/:workItemId',
    name: 'operationLogsCompare',
    component: () =>
      import('@/views/form/workflow-track/operation-log-compare.vue'),
  },

  sharedSuccess: {
    path: '/shared/success',
    name: 'shared-success',
    component: () => import('@/views/shared/success.vue'),
  },
  sharedEmpty: {
    path: '/shared/empty',
    name: 'shared-empty',
    component: () => import('@/views/shared/empty.vue'),
  },

  messageNotification: {
    path: '/message-notification',
    name: 'messageNotification',
    meta: { title: site.title + '-消息通知' },
    component: MessageNotification,
  },

  myDraft: {
    path: '/my-draft',
    name: 'myDraft',
    meta: { title: site.title + '-我的草稿' },
    component: () => import('@/components/shared/draftList.vue'),
  },

  appList: {
    root: {
      path: '/app-list',
      name: 'appList',
      meta: { title: site.title + '-应用列表' },
      component: () => import('@/views/app-list/app-list-view.vue'),
      redirect: { name: 'applications' },
    },
    applications: {
      path: 'applications',
      name: 'applications',
      meta: { title: site.title + '-应用列表' },
      component: () => import('@/views/app-list/applications.vue'),
      selectedKeys: 'applications',
    },
  },

  // 应用门户
  applicationPortal: {
    root: {
      path: '/application-portal',
      name: 'applicationPortal',
      meta: { title: site.title + '-应用门户' },
      // component: workbench.workbenchView,
      component: () => import('@/views/app-list/app-list-view.vue'),
      redirect: { name: 'portal' },
    },
    workbench: {
      path: 'portal',
      name: 'portal',
      meta: { title: site.title + '-应用门户' },
      component: () =>
        import('@/views/applicationPortal/application-portal.vue'),
      selectedKeys: 'applicationPortal',
    },
  },

  application: {
    root: {
      // TODO
      path: '/application/:appCode',
      name: 'application',
      component: () => import('@/views/common-view/index.vue'),
    },
    appPortalRuntime: {
      path: 'application-portal/app-portal-runtime',
      name: 'appPortalRuntime',
      meta: { title: site.title + '-首页' },
      component: list.components.AppPortalRuntime,
    },
    applicationList: {
      path: 'application-list/:schemaCode',
      name: 'applicationList',
      component: list.components.ApplicationList,
    },
    applicationDefine: {
      path: 'application-define/:url',
      name: 'applicationDefine',
      meta: { title: site.title + '-自定义页面' },
      component: () => import('@/views/applications/application-define.vue'),
    },
    applicationReport: {
      path: 'application-report/:reportCode',
      name: 'applicationReport',
      component: () => import('@/views/applications/report.vue'),
    },
    applicationCustom: {
      path: 'application-custom',
      name: 'custom',
      component: () =>
        import('@/views/applications/custom-router-page/test.vue'),
    },
  },

  jumpReport: {
    path: '/jump-report/:appCode/:reportCode',
    name: 'jump-report',
    component: () =>
      import('@/views/applications/custom-router-page/jump-report.vue'),
  },

  workflowCenter: {
    root: {
      path: '/workflow-center',
      name: 'workflowCenter',
      component: RouterView,
      redirect: { name: 'myUnfinishedWorkItem' },
    },
    myUnfinishedWorkItem: {
      path: 'my-unfinished-workitem',
      name: 'myUnfinishedWorkItem',
      meta: { title: site.title + '-我的待办' },
      component: () =>
        import('@/views/workflow-center/myUnfinishedWorkItem.vue'),
    },
    startWorkflow: {
      path: 'start-workflow',
      name: 'startWorkflow',
      meta: { title: site.title + '-发起流程' },
      component: () => import('@/views/workflow-center/start-workflow.vue'),
    },
    myUnReadWorkItem: {
      path: 'my-unread-workitem',
      name: 'readingTask',
      meta: { title: site.title + '-传阅我的' },
      component: () => import('@/views/workflow-center/myUnReadWorkItem.vue'),
    },
    myFinishedWorkItem: {
      path: 'my-finished-workitem',
      name: 'myFinishedWorkItem',
      meta: { title: site.title + '-我的已办' },
      component: () => import('@/views/workflow-center/myFinishedWorkitem.vue'),
    },
    myWorkflow: {
      path: 'my-workflow',
      name: 'myWorkflow',
      meta: { title: site.title + '-我发起的' },
      component: () => import('@/views/workflow-center/my-workflow.vue'),
    },
    delegationWorkflow: {
      path: 'delegation-workflow',
      name: 'delegationWorkflow',
      meta: { title: site.title + '-委托流程' },
      component: () =>
        import('@/views/workflow-center/delegation-workflow.vue'),
    },
    queryInstance: {
      path: 'query-instance',
      name: 'queryInstance',
      meta: { title: site.title + '-流程实例查询' },
      component: () => import('@/views/workflow-center/query-instance.vue'),
    },
    queryParticipantWorkItem: {
      path: 'query-participant-workItem',
      name: 'queryParticipantWorkItem',
      meta: { title: site.title + '-任务查询' },
      component: () => import('@/views/workflow-center/task-search.vue'),
    },
    //常用审批意见已经移动到流程详情界面
    // myComments: {
    //   path: 'my-comments',
    //   name: 'myComments',
    //   meta: { title: site.title + '-常用审批意见' },
    //   component: () => import('@/views/workflow-center/myComments.vue')
    // }
  },

  user: {
    root: {
      path: '/user',
      name: 'user',
      component: RouterView,
      redirect: { name: 'info' },
    },
    info: {
      path: '/',
      name: 'info',
      meta: { title: site.title + '-个人信息' },
      component: () => import('@/views/user-info/user-info.vue'),
    },
  },

  singleApp: {
    root: {
      path: '/singleApp/:appCode',
      name: 'singleApp',
      component: () => import('@/views/single-app/index.vue'),
      redirect: '/app-home',
    },
    appHome: {
      path: '/app-home',
      name: 'appHome',
      component: () => import('@/views/single-app/home.vue'),
    },
    appList: {
      path: '/app-list/:appCode/:schemaCode/:displayName',
      name: 'singleAppList',
      component: () => import('@/views/single-app/list.vue'),
    },
    appToDo: {
      path: '/app-todo',
      name: 'appToDo',
      component: () => import('@/views/single-app/todo.vue'),
    },
    appDone: {
      path: '/app-done',
      name: 'appDone',
      component: () => import('@/views/single-app/done.vue'),
    },
    appToRead: {
      path: '/app-toread',
      name: 'appToRead',
      component: () => import('@/views/single-app/toread.vue'),
    },
    appReport: {
      path: '/app-report/:appCode/:reportCode',
      name: 'appReport',
      component: () => import('@/views/applications/report.vue'),
    },
    appDefine: {
      path: '/app-define/:url',
      name: 'appDefine',
      component: () => import('@/views/applications/application-define.vue'),
    },
  },
};
