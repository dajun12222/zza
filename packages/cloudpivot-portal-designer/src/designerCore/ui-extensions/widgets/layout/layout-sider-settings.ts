/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import {
  WidgetSettings,
  // ObjectPropertyInfo
} from '@cloudpivot-shared/ui-engine-vue/document';

import * as forms from '@cloudpivot-shared/ui-engine-vue/schema';

// import * as schema from './schema';

const properties = {

  groups: [{
    label: '大小',
    value: 'sizes',
    grid: [
      ['basis', 'min', 'max'],
    ],
  }, {
    label: '开关',
    value: 'switchs',
    // mainSwitchKey: 'resizable',
    grid: [
      ['collapsible', 'toggleInside', 'resizable'],
    ],
  }],

  /**
     * 事件订阅
     * 相当于回调
     */
  subscription: {

    // dataChange: function (key: string, value: any, controller: forms.FormGroup, schemaInfo: ObjectPropertyInfo) {
    dataChange: function (key: string, value: any, controller: forms.FormGroup) {
      if (key === 'resizable') {
        controller.children.max.display = controller.children.min.display = !!value;
      }
    },

  },
};

export default {

  properties,

} as WidgetSettings;
