/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { DataType, ObjectPropertyInfo } from 'cloudpivot-form/form/typings';
export default {
  $id: 'group',
  type: DataType.Object,
  properties: {
    name: {
      type: DataType.String,
      title: '控件名称',
    },
    tips: {
      type: DataType.String,
      title: '控件Tips',
    },
    expand: {
      type: DataType.Boolean,
      title: '默认展开',
      default: true,
    },
    align: {
      type: DataType.RadioGroup,
      title: '对齐',
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
