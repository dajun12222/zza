/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import PortalDesignRuntime from 'cloudpivot-portal-designer/src/portal-design-runtime/portal-design-runtime.vue';
import AppPortalDesignRuntime from 'cloudpivot-portal-designer/src/portal-design-runtime/app-portal-design-runtime.vue';

export const portalDesign = {
  path: '/portal-design',
  name: 'portal-design',
  meta: { title: '云枢-门户设计' },
  component: () => import('../portal-design.vue'),
};

export const portalDesignInApp = {
  path: 'app-portal-design',
  name: 'app-portal-design',
  meta: { title: '云枢-应用首页设计' },
  component: () => import('../portal-design.vue'),
};

export const portalDesignPreview = {
  path: '/portal-design-preview/:pageCode',
  name: 'portal-design-preview',
  meta: { title: '云枢-门户设计预览' },
  component: PortalDesignRuntime,
};

export const appPortalDesignPreview = {
  path: '/app-portal-design-preview/:pageCode',
  name: 'app-portal-design-preview',
  meta: { title: '云枢-门户设计预览' },
  component: AppPortalDesignRuntime,
};
