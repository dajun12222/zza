/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ComponentType } from 'cloudpivot-admin-core/src/typings/component-type';
import {
  ComponentSettings,
  ObjectPropertyInfo,
} from 'cloudpivot-designer/designer-core';
import * as forms from 'cloudpivot-forms';

const properties = {
  /**
   * 属性的分组
   */
  groups: [
    {
      value: 'base',
      label: '基础属性',
      keys: ['nodeCode', 'nodeName'],
    },
    {
      value: 'control',
      label: '控件属性',
      keys: ['dataSourceType', 'methodMapping'],
    },
  ],

  /**
   * 属性的显示控制
   * 定制属性在属性栏如何显示
   * string默认显示为input:text
   * string format:date、date-time、time默认显示为input:date
   * string format:binary默认显示为input:file
   * boolean默认显示为switch
   * integer默认显示为无小数点input:number
   * number默认显示为带小数点input:number
   */
  display: {
    dataSourceType: {
      component: {
        type: ComponentType.Select,
      },
      selectOptions: [
        {
          value: 'GET_LIST',
          label: '本地获取',
        },
        {
          value: 'BIZ_SERVICE',
          label: '业务服务方法',
        },
      ],
    },
    methodMapping: {
      component: {
        type: 'BindBizMethod',
        options: {
          dataItems: [],
          actionType: 'GetList',
        },
      },
    },
  },

  /**
   * 事件订阅
   * 相当于回调
   */
  subscription: {
    /**
     * 属性数据发生变化时
     * 可以在这个函数中改变其他属性的属性数据，比如说将其他属性设为不可见
     * @param key 属性Key
     * @param propertyKey 属性的属性Key
     * @param propertyData 属性的属性数据对象
     * @param schemaInfo 组件的纲要信息
     * @param schemaData 组件的纲要数据
     */
    dataChange: function (
      key: string,
      value: any,
      controller: forms.FormGroup,
      schemaInfo: ObjectPropertyInfo,
      initial: boolean,
    ) {
      if (key === 'dataSourceType' && value) {
        controller.children.methodMapping.display = value === 'BIZ_SERVICE';
      }
    },
  },
};
export default {
  /**
   * 属性设置
   */
  properties,
} as unknown as ComponentSettings;
