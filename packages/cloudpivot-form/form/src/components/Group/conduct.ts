/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import baseAttribute from '../../../../form/src/common/component-base-attribute';
import {
  ControlAttributeType,
  ControllerConduct,
} from '../../../../form/typings';

export default {
  groups: {
    base: {
      label: '基础信息',
      keys: ['name', 'style', 'tips'],
    },
    controller: {
      label: '控制属性',
      keys: ['align', 'expand', 'span'],
    },
  },
  properties: {
    name: {
      ...baseAttribute.name,
    },
    style: {
      ...baseAttribute.style,
    },
    align: {
      inputMethod: ControlAttributeType.RadioGroup,
      value: 'left',
      options: {
        list: [
          {
            value: 'left',
            label: '左',
          },
          {
            value: 'center',
            label: '中',
          },
          {
            value: 'right',
            label: '右',
          },
        ],
      },
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
