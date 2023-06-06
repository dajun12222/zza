/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType } from '@cloudpivot-shared/ui-property-editor';

export default {
  type: DataType.Object,
  properties: {
    content: {
      type: DataType.String,
      minLength: 1,
      maxLength: 2000,
      title: '文本内容',
      default: 'Text',
      level: 'advanced',
    },
    textIndent: {
      type: DataType.String,
      title: '首行缩进',
    },
    letterSpacing: {
      type: DataType.String,
      title: '字符间距',
    },
    wordSpacing: {
      type: DataType.String,
      title: '词间距',
    },
    lineHeight: {
      type: DataType.String,
      title: '行间距',
    },
    userSelect: {
      type: DataType.Boolean,
      title: '允许选中',
    },
    textOverflow: {
      type: DataType.String,
      title: '文本溢出',
      enum: ['ellipsis', 'clip', 'overflow'],
      default: 'ellipsis',
    },
    lineFeed: {
      type: DataType.Boolean,
      title: '允许换行',
      default: false,
    },
    wordBreak: {
      type: DataType.String,
      title: '换行方式',
      enum: ['normal', 'break-word'],
      default: 'normal',
    },
    textAlign: {
      title: '水平对齐方式',
      type: DataType.String,
      enum: ['left', 'center', 'right'],
      default: 'left',
    },
    verticalAlign: {
      title: '垂直对齐方式',
      type: DataType.String,
      enum: ['top', 'middle', 'bottom'],
      default: 'top',
    },
    fontStyle: {
      title: '字体样式',
      type: DataType.Object,
      properties: {
        fontWeight: {
          title: '字重',
          type: DataType.String,
        },
        fontStyle: {
          title: '字体样式',
          type: DataType.String,
        },
        textDecoration: {
          title: '文字修饰',
          type: DataType.String,
        },
      },
    },
    fontFamily: {
      title: '字体',
      type: DataType.String,
      enum: ['inherit', 'Microsoft YaHei', 'SimSun', 'SimHei', 'FangSong'],
      // default: /macintosh|mac os x/i.test(navigator.userAgent) ? 'inherit' : 'Microsoft YaHei',
      default: /macintosh|mac os x/i.test(navigator.userAgent)
        ? 'inherit'
        : 'Microsoft YaHei',
    },
    fontSize: {
      title: '字号',
      type: DataType.String,
      default: '14px',
    },
    fontColor: {
      title: '字体颜色',
      type: DataType.String,
      default: 'rgba(0,0,0,0.65)',
    },
    size: {
      title: '尺寸',
      $ref: ComponentType.SizeSetter,
      default: {
        width: '100%',
        height: 'auto',
      },
    },
    sizeLimit: {
      title: '尺寸限制',
      $ref: ComponentType.SizeLimiter,
      default: {},
    },
    background: {
      title: '背景',
      $ref: ComponentType.BackgroundSetter,
    },
    border: {
      title: '边框',
      $ref: ComponentType.BorderSetter,
      default: {
        style: 'solid',
        color: '#e8e8e8',
      },
    },
    margin: {
      title: '外边距',
      $ref: ComponentType.MargingSetter,
    },
    padding: {
      title: '内边距',
      $ref: ComponentType.PaddingSetter,
    },
    rotate: {
      title: '旋转',
      $ref: ComponentType.RotateSetter,
    },
    shadow: {
      title: '阴影',
      $ref: ComponentType.ShadowSetter,
      default: {},
    },
    visible: {
      title: '可见',
      $ref: ComponentType.VisibleSetter,
    },
  },
  events: {
    click: {
      title: '单击时',
      parameters: [
        {
          name: 'text',
          schema: {
            type: DataType.String,
          },
        },
      ],
    },
  },
} as ObjectPropertyInfo;
