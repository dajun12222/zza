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
    heads: {
      title: '页签',
      type: DataType.Array,
      items: {},
      default: [
        {
          // title: '页签1', //页签标题
          title: '{"zh": "页签1","en": "Tab1"}', //页签标题
          key: new Date().getTime(),
          icon: '', //页签图标
          dataSource: '', //数据源
          bizModel: '', //模型名称
          displayField: '', //展示字段
          showFieldTitle: false, // 显示字段标题
          queryConditions: '', // 数据范围
          sortField: '', //排序字段
          sortRule: 'ascending', //排序规则
          listIcon: 'noIcon', //列表符号
        },
        {
          // title: '页签2',
          title: '{"zh": "页签2","en": "Tab2"}', //页签标题
          key: new Date().getTime() + 1,
          icon: '',
          dataSource: '',
          bizModel: '',
          displayField: '',
          showFieldTitle: false,
          queryConditions: '',
          sortField: '',
          sortRule: 'ascending',
          listIcon: 'noIcon',
        },
      ],
    },
  },
  events: {},
} as ObjectPropertyInfo;
