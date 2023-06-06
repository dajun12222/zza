/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  path: '/system',
  name: 'system',
  meta: { title: '云枢-系统管理', onlySytem: true },
  component: () => import('cloudpivot-admin-core/src/views/system/index.vue'),
  children: [
    {
      path: '/',
      redirect: { name: 'commonSetting' },
    },
    {
      path: '/system/common-setting',
      name: 'commonSetting',
      meta: { title: '云枢-常规设置' },
      component: () =>
        import(
          'cloudpivot-admin-core/src/views/system/common-setting/index.vue'
        ),
    },
    {
      path: '/system/manager-setting',
      name: 'managerSetting',
      meta: { title: '云枢-管理员设置' },
      component: () =>
        import(
          'cloudpivot-admin-core/src/views/system/manager-setting/index.vue'
        ),
    },
    {
      path: '/system/integration-setting',
      name: 'integrationSetting',
      meta: { title: '云枢-统一配置' },
      component: () =>
        import(
          'cloudpivot-admin-core/src/views/system/integration-setting/index.vue'
        ),
    },
    {
      path: '/system/log',
      name: 'log',
      meta: { title: '云枢-日志消息' },
      component: () =>
        import('cloudpivot-admin-core/src/views/system/log/index.vue'),
    },
    {
      path: '/system/cacheMagemt',
      name: 'cacheMagemt',
      meta: { title: '云枢-系统运维' },
      component: () =>
        import('cloudpivot-admin-core/src/views/system/cacheMagemt/index.vue'),
    },
    {
      path: '/system/license',
      name: 'license',
      meta: { title: '云枢-系统信息' },
      component: () =>
        import('cloudpivot-admin-core/src/views/system/license/index.vue'),
    },
    {
      path: '/system/dataDictionary',
      name: 'dataDictionary',
      meta: { title: '云枢-数据字典' },
      component: () =>
        import(
          'cloudpivot-admin-core/src/views/system/dataDictionary/index.vue'
        ),
    },
    {
      path: '/system/apiConfiguration',
      name: 'apiConfiguration',
      meta: { title: '云枢-API接口配置' },
      component: () =>
        import(
          'cloudpivot-admin-core/src/views/system/apiConfiguration/index.vue'
        ),
    },
  ],
};
