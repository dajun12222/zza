/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  path: '/integration',
  name: 'integration',
  meta: { title: '云枢-业务集成' },
  component: () =>
    import('cloudpivot-admin-core/src/views/integration/index.vue'),
};
