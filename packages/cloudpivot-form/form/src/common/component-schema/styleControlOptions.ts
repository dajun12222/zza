/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-16 19:22:11
 * @description:
 * @LastEditors: Fan
 */
import { DataType, ObjectPropertyInfo } from '../../../typings';
export const styleControlOptions = {
  $id: 'styleControlOptions',
  type: DataType.Object,
  properties: {
    name: {
      type: DataType.String,
      title: '控件名称',
      default: '',
    },
    name_i18n: {
      type: DataType.Object,
      title: '多语言',
    },
    visible: {
      type: DataType.Boolean,
      title: '是否可见',
      default: true,
    },
    style: {
      type: DataType.String,
      title: '控件样式',
    },
    tips: {
      type: DataType.String,
      title: '控件Tips',
      options: {
        placeholder: 'css样式',
      },
    },
    dataItemName: {
      type: DataType.String,
      title: '绑定数据项编码',
    },
    span: {
      type: DataType.RadioGroup,
      title: '控件宽度',
    },
  },
} as ObjectPropertyInfo;
