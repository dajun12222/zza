/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-13 17:06:58
 * @LastEditTime: 2020-04-27 22:06:41
 * @LastEditors: Fan
 * @Description:
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/ShortText/setting.ts
 */
import baseAttribute from '../../../../form/src/common/component-base-attribute';
import {
  ControlAttributeType,
  ControllerConduct,
} from '../../../../form/typings';
import {
  formatterRequiredFormula,
  formatterValueToSetStatus,
} from '../../../../form/utils';
export default {
  groups: {
    base: {
      label: '基础信息',
      keys: [
        'widgetType',
        'name',
        'labelVisible',
        'style',
        'tips',
        'dataItemType',
        'dataItemName',
      ],
    },

    controller: {
      label: '控件属性',
      keys: [
        'defaultValue',
        'placeholder',
        'isScan',
        'dataLinkage',
        'readonlyFormula',
        'visible',
        'span',
      ],
    },

    // rules: {
    //   label: "数据规则",
    //   keys: ['maxLength']
    // }
  },
  properties: {
    name: {
      ...baseAttribute.name,
    },
    dataItemName: {
      ...baseAttribute.dataItemName,
    },
    style: {
      ...baseAttribute.style,
    },
    widgetType: {
      ...baseAttribute.widgetType,
      value: '单行文本',
    },
    dataItemType: {
      ...baseAttribute.dataItemType,
      value: '单行文本',
    },
    dictionaryData: {
      inputMethod: ControlAttributeType.Modal,
      inputComponent: () =>
        import('../../../../form/src/common/components/dictionary-setting.vue'),
      options: {
        formatter: (val) => {
          if (val) {
            return (val && val.options && val.options.valueText) || '数据异常';
          }
          return '未设置';
        },
      },
    },
    // 显示条件
    displayFormula: {
      ...baseAttribute.displayFormula,
    },
    // 是否必填
    requiredFormula: {
      ...baseAttribute.requiredFormula,
    },
    // 只读条件
    readonlyCondition: {
      ...baseAttribute.readonlyCondition,
    },
    // 默认值
    defaultValue: {
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: '长度不能超过200字节',
          },
        },
        placeholder: '请输入',
      },
    },
    // 正则校验
    regexp: {
      inputMethod: ControlAttributeType.Modal,
      attrType: 'regularModal',
      inputComponent: () =>
        import('../../../../form/src/common/components/regular-modal2.vue'),
      options: {
        formatter: formatterValueToSetStatus,
      },
    },
    //正则错误提示
    regexpText: {
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: '长度不能超过200字节',
          },
        },
      },
    },
    // 提示文字
    placeholder: {
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: '长度不能超过200字节',
          },
        },
        placeholder: '请输入',
      },
    },
    // 文本最大长度
    maxLength: {
      options: {
        regexps: {
          required: '最大长度不能为空',
          regexps: [
            {
              regexp: /^[1-9]\d*$/,
              message: '只能输入正整数',
            },
            {
              regexp: (value: string) => parseFloat(value) <= 200,
              message: '最大长度不能超过200',
            },
          ],
        },
        max: 200,
      },
    },
    dataLinkage: {
      ...baseAttribute.dataLinkage,
    },
    shortTextStitch: {
      inputMethod: ControlAttributeType.Modal,
      inputComponent: () =>
        import('../../../../form/src/common/components/short-text-rouls.vue'),
      options: {
        formatter: formatterValueToSetStatus,
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
