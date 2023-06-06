/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ControllerConduct,
  ControlAttributeType,
} from '../../../../form/typings';
import { formatterValueToSetStatus } from '../../../../form/utils';
import baseAttribute from '../../../../form/src/common/component-base-attribute';

export default {
  groups: {
    base: {
      label: '基础信息',
      keys: ['name'],
    },
    controller: {
      label: '控制属性',
      keys: ['displayFormula', 'showData', 'apiUrl', 'paramsNumber', 'span'],
    },
  },
  properties: {
    name: {
      ...baseAttribute.name,
    },
    dataItemType: {
      ...baseAttribute.dataItemType,
      value: '描述',
    },

    // 显示条件
    displayFormula: {
      ...baseAttribute.displayFormula,
    },
    tips: {
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: '长度不能超过200字节',
          },
        },
        placeholder: '控件提示',
      },
    },
    span: {
      ...baseAttribute.span,
    },
  },
} as ControllerConduct;
