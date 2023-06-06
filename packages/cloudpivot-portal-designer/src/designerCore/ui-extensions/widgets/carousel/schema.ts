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

    photos: {
      title: '轮播图',
      type: DataType.Array,
      items: {},
      default: [
        {
          name: '图片1', // 图片名称
          tempUrl: '', // 图片地址
          openType: '_self', // 打开方式
          fillType: 'Scale', // 填充方式
          gotoType: 3, // 点击时跳转页面类型
          app: '', // 跳转应用
          bizModel: '', // 跳转模型
          linkUrl: '', // 链接地址
          gotoPage: 'defaultPortalDashboard', // 链接页面
        },
      ],
    },

    autoplay: {
      title: '自动轮播',
      type: DataType.Boolean,
      default: true,
    },

    autoplaySpeed: {
      title: '轮播间隔',
      type: DataType.Number,
      default: 3000,
    },
  },
  events: {},
} as ObjectPropertyInfo;
