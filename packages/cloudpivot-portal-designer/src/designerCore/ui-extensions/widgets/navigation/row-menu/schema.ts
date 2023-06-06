/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-engine-vue/document';

export default {
  type: DataType.Object,
  properties: {
    navigator: {
      title: '导航',
      type: DataType.Array,
      default: [
        {
          icon: 'h-icon-all-workbench',
          // title: '工作台',
          title: '{"zh": "工作台","en": "Dashboard"}',
          app: undefined,
          bizModel: undefined,
          actionType: 'portalPage',
          portalPage: 'defaultPortalDashboard',
          isDefaultWorkbench: true,
          openMode: 'curPage',
        },
        {
          icon: 'h-icon-all-a-technologicalprocess',
          // title: '流程中心',
          title: '{"zh": "流程中心","en": "Workflow Center"}',
          actionType: 'portalPage',
          app: undefined,
          bizModel: undefined,
          portalPage: 'defaultWorkflowCenter',
          URL: '',
          openMode: 'curPage',
        },
        {
          icon: 'h-icon-all-application',
          // title: '应用列表',
          title: '{"zh": "应用列表","en": "Apps"}',
          actionType: 'portalPage',
          app: undefined,
          bizModel: undefined,
          portalPage: 'defaultApplicationList',
          URL: '',
          openMode: 'curPage',
        },
      ],
      items: {},
    },
  },
  events: {},
} as ObjectPropertyInfo;
