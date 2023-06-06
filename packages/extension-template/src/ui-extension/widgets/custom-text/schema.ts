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
      default: '自定义文本',
    },
    icon: {
      title: '组件图标',
      type: DataType.String,
    },
    textValue: {
      title: '文本内容',
      type: DataType.String,
      default: '这里是文本内容',
    },
  },
  events: {},
} as ObjectPropertyInfo;
