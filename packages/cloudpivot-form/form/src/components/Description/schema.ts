/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { DataType, ObjectPropertyInfo } from '../../../../form/typings';
export default {
  $id: 'description',
  type: DataType.Object,
  properties: {
    name: {
      type: DataType.String,
      title: '控件名称',
    },
    dataItemType: {
      type: DataType.String,
      title: '数据项类型',
    },
    displayFormula: {
      type: DataType.String,
      title: '显示条件',
    },
    showData: {
      type: DataType.Boolean,
      title: '是否自定义',
      default: false,
    },
    apiUrl: {
      type: DataType.String,
      title: '接口地址',
    },

    paramsNumber: {
      type: DataType.String,
      title: '模型编码',
    },
    style: {
      type: DataType.String,
      title: '控件样式',
      tip: {
        content: `<div>控件标题样式，css样式</div>
                  <div>例：color: red</div>`,
        icon: 'question-circle-o',
      } as any,
    },
    span: {
      type: DataType.RadioGroup,
      title: '控件宽度',
    },
  },
} as ObjectPropertyInfo;
