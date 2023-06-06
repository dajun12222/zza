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
    // 背景样式
    backgroundColor: {
      title: '背景颜色',
      type: DataType.String,
      default: 'rgba(255,255,255,1)',
    },
    backgroundImg: {
      title: '背景图片',
      type: DataType.String,
    },
    borderRadius: {
      title: '圆角',
      type: DataType.String,
      enum: ['none', 'small', 'medium', 'big'],
      default: 'medium',
    },

    // 边框样式
    borderStyle: {
      title: '边框样式',
      type: DataType.String,
      enum: ['none', 'solid', 'dashed'],
      default: 'solid',
    },
    borderThickness: {
      title: '边框粗细',
      type: DataType.Number,
      default: 1,
    },
    borderColor: {
      title: '边框颜色',
      type: DataType.String,
      default: '#E4E7EE',
    },

    // 文字样式
    textColor: {
      title: '文字颜色',
      type: DataType.String,
      default: '#111218',
    },
    textThickness: {
      title: '文字粗细',
      type: DataType.String,
      enum: ['normal', 'bold'],
      default: 'normal',
    },

    // 高级配置
    title: {
      title: '组件标题',
      type: DataType.String,
      // default: '文本列表',
      default: '{"zh": "文本列表","en": "Text List"}',
    },
    icon: {
      title: '组件图标',
      type: DataType.String,
    },
    dataSource: {
      title: '数据源',
      type: DataType.String,
      enum: [
        'bizModel',
        'myUnfinished',
        'myFinished',
        'myRead',
        'myUnread',
        'myStart',
      ],
    },
    bizModel: {
      // title: '模型名称',
      type: DataType.String,
    },
    workflowType: {
      // title: '模型名称',
      type: DataType.String,
    },
    bizModelInfo: {
      // title: '模型名称',
      type: DataType.String,
    },
    displayField: {
      title: '展示字段',
      type: DataType.String,
      default: '[]',
    },
    showFieldTitle: {
      title: '显示字段标题',
      type: DataType.Boolean,
      default: false,
    },
    queryConditions: {
      title: '数据范围',
      type: DataType.String,
      default: '',
    },
    sortField: {
      title: '排序字段',
      type: DataType.String,
      default: '{}',
    },
    sortRule: {
      title: '排序规则',
      type: DataType.String,
      enum: ['ascending', 'descending'],
      default: 'ascending',
    },
    listIcon: {
      title: '列表符号',
      type: DataType.String,
      enum: ['noIcon', 'dot', 'diamond'],
      default: 'noIcon',
    },
  },
  events: {},
} as ObjectPropertyInfo;
