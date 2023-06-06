/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  WidgetSettings,
  EnumPropertyInfo,
  // ObjectPropertyInfo,
} from '@cloudpivot-shared/ui-engine-vue/document';

import * as forms from '@cloudpivot-shared/ui-engine-vue/schema';
import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

import VueI18n from 'vue-i18n';

import { listApi } from 'cloudpivot/api';

import { DataItemType } from 'cloudpivot-form/form/schema';

const selectOptions = (
  key: string,
  value: any,
  controller: any,
  propInfo: EnumPropertyInfo,
  $i18n: VueI18n,
) => {
  return propInfo.enum.map((e) => ({
    value: e,
    label: $i18n.t(`widgets.TextList.enums.${e}`),
  }));
};

const properties = {
  groups: [
    {
      value: 'backgroudStyle',
      grid: [['backgroundColor'], ['backgroundImg'], ['borderRadius']],
    },
    {
      value: 'borderStyle',
      grid: [['borderStyle'], ['borderThickness'], ['borderColor']],
    },
    {
      value: 'textStyle',
      grid: [['textColor'], ['textThickness']],
    },
    {
      value: 'advancedConfig',
      grid: [
        ['title'],
        ['icon'],
        ['dataSource'],
        ['bizModel'],
        ['displayField'],
        ['showFieldTitle'],
        ['queryConditions'],
        ['sortField'],
        ['sortRule'],
        ['listIcon'],
        ['workflowType'],
        ['bizModelInfo'],
      ],
    },
  ],

  display: {
    textColor: {
      component: {
        type: ComponentType.ColorPicker,
      },
    },
    backgroundColor: {
      component: {
        type: ComponentType.ColorPicker,
      },
    },
    borderColor: {
      component: {
        type: ComponentType.ColorPicker,
      },
    },

    borderRadius: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },
    borderStyle: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },

    backgroundImg: {
      component: {
        // type: ComponentType.InputUpload,
        type: 'imgUpload',
      },
    },

    borderThickness: {
      component: {
        type: ComponentType.InputNumber,
      },
    },

    textThickness: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },

    title: {
      component: {
        // type: ComponentType.Input,
        type: 'titleSetter',
      },
    },

    icon: {
      component: {
        // type: ComponentType.Input,
        type: 'iconSelect',
      },
    },

    dataSource: {
      selectOptions,
      component: {
        type: ComponentType.Select,
      },
    },

    bizModel: {
      component: {
        type: 'bizModelSelect',
      },
    },

    workflowType: {
      component: {
        type: ComponentType.Input,
      },
    },

    bizModelInfo: {
      component: {
        type: ComponentType.Input,
      },
    },

    displayField: {
      component: {
        type: 'displayField',
      },
    },

    showFieldTitle: {
      component: {
        type: ComponentType.Switch,
      },
    },

    queryConditions: {
      component: {
        type: 'QueryConditionsSetter',
      },
    },

    sortField: {
      component: {
        type: 'sortField',
      },
    },

    sortRule: {
      selectOptions,
      component: {
        type: ComponentType.RadioGroup,
      },
    },

    listIcon: {
      selectOptions,
      component: {
        type: 'listSymbol',
      },
    },
  },

  subscription: {
    dataChange: function (
      key: string,
      value: any,
      controller: forms.FormGroup,
    ) {
      if (key === 'dataSource') {
        controller.children.workflowType.display = false;
        controller.children.bizModelInfo.display = false;
        controller.children.bizModel.display = !!(value === 'bizModel');
        controller.children.queryConditions.display = !!(value === 'bizModel');
        controller.children.displayField.display = !!value;
        controller.children.showFieldTitle.display = !!value;
        controller.children.sortField.display = !!value;
        controller.children.sortRule.display = !!value;
        controller.children.listIcon.display = !!value;
        if (
          [
            'myUnfinished',
            'myFinished',
            'myRead',
            'myUnread',
            'myStart',
          ].includes(value)
        ) {
          controller.children.sortField.value =
            '{"name":"接收时间","name_i18n":null,"type":3,"value":"receiveTime"}';
          controller.children.sortField.disabled = true;
          controller.children.sortRule.value = 'descending';
          controller.children.sortRule.disabled = true;
          if (controller.children.bizModel.value) {
            controller.children.bizModel.value = '';
            controller.children.bizModelInfo.value = '';
            controller.children.displayField.value = '[]';
            controller.children.queryConditions.value = '';
            controller.children.showFieldTitle.value = false;
          }
          if (controller.children.workflowType.value !== value) {
            controller.children.workflowType.value = value;
            controller.children.displayField.value = '[]';
            controller.children.queryConditions.value = '';
            controller.children.showFieldTitle.value = false;
          }
        } else {
          controller.children.workflowType.value = '';
          if (!controller.children.bizModel.value) {
            controller.children.displayField.value = '[]';
            controller.children.sortField.value = '{}';
            controller.children.queryConditions.value = '';
            controller.children.showFieldTitle.value = false;
          } else {
            controller.children.sortField.value =
              controller.children.sortField.value || '{}';
            controller.children.queryConditions.value =
              controller.children.queryConditions.value || '';
          }
          controller.children.sortField.disabled = false;
          controller.children.sortRule.disabled = false;
        }
      }
      if (key === 'bizModel') {
        if (value) {
          if (controller.children.bizModelInfo.value !== value) {
            controller.children.bizModelInfo.value = value;
            controller.children.displayField.value = '[]';
            controller.children.queryConditions.value = '';
            controller.children.showFieldTitle.value = false;
          }
        }
      }
      if (key === 'borderStyle') {
        controller.children.borderThickness.display = !!(value !== 'none');
        controller.children.borderColor.display = !!(value !== 'none');
      }
      // if (key === 'title') {
      //   let index = 0;
      //   let realLength = 0;
      //   while (realLength <= 30 && index < value.length) {
      //     const charCode = value.charCodeAt(index);
      //     if (charCode >= 0 && charCode <= 128) {
      //       realLength += 1;
      //     } else {
      //       realLength += 2;
      //     }
      //     if (realLength > 30) {
      //       break;
      //     } else {
      //       index++;
      //     }
      //   }
      //   controller.children.title.value = (value as string).slice(0, index);
      //   // if (!value) {
      //   //   controller.children.title.value = '文本列表';
      //   // }
      // }

      if (['borderThickness'].includes(key) && value < 0) {
        controller.children[key].value = 0;
      }
    },
  },
};

export default {
  layout: {
    grid: {
      padding: '8px',
      size: {
        width: 5,
        minWidth: 3,
        height: 27,
        minHeight: 15,
        // maxHeight: 8,
      },
    },
  },
  /**
   * 属性设置
   */
  properties,
} as WidgetSettings;
