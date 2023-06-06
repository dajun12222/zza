/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import store from 'cloudpivot-admin-core/src/store';

import { formDesignRouter } from 'cloudpivot-admin-core/src/components/apps/form-design/form-design.router';
import { formPreviewRouter } from 'cloudpivot-admin-core/src/components/apps/form-preview/form-preview.router';
import { listDesignRouter } from 'cloudpivot-admin-core/src/components/apps/list-design/list-design.router';
import { listPreviewRouter } from 'cloudpivot-admin-core/src/components/apps/list-preview/list-preview.router';

import {
  portalDesignRouter,
  portalDesignInAppRouter,
  portalDesignPreviewRouter,
  appPortalDesignPreviewRouter,
} from 'cloudpivot-portal-designer';

import reports from 'cloudpivot-admin-core/src/components/apps/report-design/report-design.router';

import system from 'cloudpivot-admin-core/src/router/system';
import print from 'cloudpivot-admin-core/src/router/print';
import intergration from 'cloudpivot-admin-core/src/router/integration';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/apps',
    },

    {
      path: '/error',
      name: 'error',
      meta: { title: '云枢-出错了' },
      component: () =>
        import('cloudpivot-admin-core/src/views/error/error.vue'),
    },
    {
      path: '/success',
      name: 'shared-success',
      component: () =>
        import('cloudpivot-admin-core/src/views/error/success.vue'),
    },
    {
      path: '/empty',
      name: 'shared-empty',
      component: () =>
        import('cloudpivot-admin-core/src/views/error/empty.vue'),
    },
    {
      path: '/form-unpublished',
      name: 'formUnpublished',
      component: () =>
        import('cloudpivot-admin-core/src/views/error/form-unpublished.vue'),
    },
    {
      path: '/permission',
      name: 'permission',
      meta: { title: '云枢-没有权限' },
      component: () =>
        import('cloudpivot-admin-core/src/views/error/permission.vue'),
    },
    portalDesignRouter,
    portalDesignPreviewRouter,
    appPortalDesignPreviewRouter,
    {
      path: '/organization',
      component: () => import('../views/organization/index.vue'),
      children: [
        {
          path: '/',
          redirect: { name: 'orguser' },
        },
        {
          path: 'orguser',
          name: 'orguser',
          meta: { title: '云枢-组织机构' },
          component: () => import('../views/organization/orguser.vue'),
        },
        {
          path: 'orgrole',
          name: 'orgrole',
          meta: { title: '云枢-组织角色' },
          component: () => import('../views/organization/orgrole.vue'),
        },
        {
          path: 'orgsync',
          name: 'orgsync',
          meta: { title: '云枢-组织同步' },
          component: () => import('../views/organization/orgsync.vue'),
        },
        {
          path: 'userInfoExt',
          name: 'userInfoExt',
          meta: { title: '云枢-用户信息拓展' },
          component: () => import('../views/organization/userinfo-ext.vue'),
        },
        {
          path: 'workHandover',
          name: 'workHandover',
          meta: { title: '云枢-工作交接' },
          component: () => import('../views/organization/work-handover.vue'),
        },
      ],
    },
    {
      path: '/apps',
      name: 'apps',
      component: () => import('../views/routerview.vue'),
      children: [
        {
          path: '/',
          name: 'appcenter',
          meta: { title: '云枢-应用管理' },
          component: () => import('../views/app/center-new/index.vue'),
        },
        {
          path: 'recycle',
          name: 'recycle',
          props: true,
          component: () => import('../views/app/center/recycle.vue'),
        },

        {
          path: 'appitem/:appCode',
          name: 'appitem',
          meta: { title: '云枢-应用管理' },
          props: true,
          component: () => import('../views/app/center/appitem.vue'),
        },

        // 应用设置
        {
          path: 'appsettings/:appCode',
          name: 'appsettings',
          meta: { title: '云枢-应用设置' },
          props: true,
          component: () => import('../views/app/center/appsettings.vue'),
        },
        {
          path: 'recycle',
          name: 'recycle',
          meta: { title: '云枢-回收站' },
          props: true,
          component: () => import('../views/app/center/recycle.vue'),
        },
        {
          path: 'recycleitem/:appCode',
          name: 'recycleitem',
          meta: { title: '云枢-回收站应用管理' },
          props: true,
          component: () => import('../views/app/center/recycleitem.vue'),
        },
        // NOTE: 暂时隐藏应用设置独立路由
        // settings,

        ...reports,
        {
          path: 'noBizModel/:appCode',
          name: 'noBizModel',
          props: true,
          component: () => import('../views/appRouterview.vue'),
          children: [
            {
              path: '/',
              redirect: { name: 'noBizModelpage' },
            },
            {
              path: 'noBizModelpage',
              name: 'noBizModelpage',
              props: true,
              component: () =>
                import('../components/apps/model/noBizModel.vue'),
            },
          ],
        },
        {
          path: 'model/:appCode/:bizSchemaCode/workflowSetting/:workflowCode',
          name: 'workflowSetting',
          meta: { title: '云枢-流程设置' },
          props: true,
          component: () => import('../views/app/model/workflowSetting.vue'),
        },
        {
          path: 'model/:appCode/:bizSchemaCode/workflowHistoryDetail/:workflowCode',
          name: 'workflowHistoryDetail',
          // meta: { title: '云枢-流程设计' },
          props: true,
          component: () => import('../views/app/model/workflow.vue'),
        },
        {
          path: 'model/:appCode/:bizSchemaCode/mockDetail/:workflowCode',
          name: 'mockDetail',
          meta: { title: '云枢-流程模拟' },
          props: true,
          component: () => import('../views/app/workflow-mock/mock-detail.vue'),
        },
        {
          path: 'model/:appCode/:bizSchemaCode/mockForm/:workflowCode',
          name: 'mockForm',
          meta: { title: '云枢-流程模拟' },
          props: true,
          component: () => import('../views/app/workflow-mock/mock-form.vue'),
        },
        {
          path: 'model/:appCode/:bizSchemaCode/mockHistory/:workflowCode',
          name: 'mockHistory',
          meta: { title: '云枢-流程模拟' },
          props: true,
          component: () =>
            import('../views/app/workflow-mock/mock-history.vue'),
        },
        print[0],
        print[1],
        {
          path: 'model/:appCode/:bizSchemaCode/biz-rule/:bizRuleCode',
          name: 'biz-rule',
          meta: { title: '云枢-业务规则' },
          props: true,
          component: () => import('../views/app/biz-rule/biz-rule-design.vue'),
        },
        {
          path: 'model/:appCode/:bizSchemaCode/biz-rule-coding/:bizRuleCode',
          name: 'biz-rule-coding',
          meta: { title: '云枢-业务规则' },
          props: true,
          component: () =>
            import('cloudpivot-web-ide/src/views/biz-rule/index.vue'),
        },
        {
          path: 'model/:appCode/:bizSchemaCode',
          name: 'bizmodel',
          props: true,
          component: () => import('../views/appRouterview.vue'),
          children: [
            {
              path: '/',
              redirect: { name: 'datamodel' },
            },
            {
              path: 'dispatcher',
              name: 'dispatcher',
              props: true,
              component: () => import('../components/apps/dispatcher.vue'),
            },

            {
              path: 'customPage',
              name: 'customPage',
              meta: { title: '云枢-自定义页面' },
              props: true,
              component: () =>
                import('../views/app/center-new/components/customPage.vue'),
            },

            portalDesignInAppRouter,

            {
              path: 'data',
              name: 'datamodel',
              // meta: { title: '云枢-数据模型设计' },
              props: true,
              component: () => import('../views/app/model/dataModelRouter.vue'),
              children: [
                {
                  path: '/',
                  redirect: { name: 'dataModel' },
                },
                {
                  path: 'dataModel',
                  name: 'dataModel',
                  props: true,
                  component: () =>
                    import('../components/apps/model/dataitem.vue'),
                },
                {
                  path: 'busRules',
                  name: 'busRules',
                  props: true,
                  component: () =>
                    import('../views/app/model/biz-rule-list.vue'),
                },
                {
                  path: 'dataPermission',
                  name: 'dataPermission',
                  props: true,
                  component: () =>
                    import('../views/app/data-permission/index.vue'),
                },
                {
                  path: 'dataRuleCalculation',
                  name: 'dataRuleCalculation',
                  props: true,
                  component: () =>
                    import('../views/app/data-rule-calculation/index.vue'),
                },
              ],
            },

            formDesignRouter,
            formPreviewRouter,
            listDesignRouter,
            listPreviewRouter,
            {
              path: 'workflowDesign/:workflowCode',
              name: 'workflowDesign',
              // meta: { title: '云枢-流程设计' },
              props: true,
              component: () => import('../views/app/model/workflow.vue'),
            },
            {
              path: 'workflowEmpty',
              name: 'workflowEmpty',
              // meta: { title: '云枢-流程设计' },
              props: true,
              component: () => import('../views/app/model/workflowEmpty.vue'),
            },
          ],
        },
        {
          path: 'noBizModel/:appCode',
          name: 'noBizModel',
          props: true,
          component: () => import('../views/appRouterview.vue'),
          children: [
            {
              path: '/',
              redirect: { name: 'datamodel' },
            },
            {
              path: 'noBizModelpage',
              name: 'noBizModelpage',
              props: true,
              component: () =>
                import('../components/apps/model/noBizModel.vue'),
            },
          ],
        },
        {
          path: 'versionList/:appCode/:bizSchemaCode/:sheetCode',
          name: 'versionList',
          meta: { title: '云枢-应用管理' },
          props: true,
          component: () => import('../views/app/historyVersion/index.vue'),
        },
        {
          path: 'versionDetail/:appCode/:bizSchemaCode/:sheetCode/:version/:id',
          name: 'versionDetail',
          meta: { title: '云枢-应用管理' },
          props: true,
          component: () => import('../views/app/historyVersion/detail.vue'),
        },
      ],
    },
    system,
    intergration,
    {
      path: '*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { isOnlyAppAdmin, isAdmin } = (store.state as any).System.User;

  if (isAdmin) {
    if (
      isOnlyAppAdmin &&
      ![
        '/apps',
        '/organization',
        '/manager-setting',
        '/system',
        '/integration',
      ].includes(to.matched[0].path)
    ) {
      router.push({
        path: '/apps',
      });
    }
  } else if (to.matched[0].name !== 'permission') {
    router.push({
      name: 'permission',
      query: {
        T: `${new Date().getTime()}`,
      },
    });
  } else {
    //Else Empty block statement
  }

  if (
    to.name &&
    [
      'appitem',
      'dataModel',
      'busRules',
      'dataPermission',
      'dataRuleCalculation',
      'form-design',
      'list-design',
      'workflowDesign',
      'report-design',
      'dispatcher',
    ].includes(to.name)
  ) {
    document.title = document.title || '加载中...';
  } else {
    document.title = to.meta.title || '云枢-admin';
  }

  // @ts-ignore
  const shortName: string = store.state.themsConfig.name;
  if (shortName && document.title.indexOf('云枢-') !== -1) {
    document.title = document.title.replace('云枢-', shortName + '-');
  }

  next();
});

export default router;
