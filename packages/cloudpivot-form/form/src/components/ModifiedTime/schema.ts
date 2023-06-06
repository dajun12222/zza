/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ObjectPropertyInfo, DataType } from '../../../../form/typings';
import { styleControlOptions } from '../../../../form/component-schema';
export default {
  $id: 'modifiedTime',
  type: DataType.Object,
  $ref: styleControlOptions.$id,
  properties: {
    widgetType: {
      type: DataType.String,
      title: '控件类型',
    },
    dataItemType: {
      type: DataType.String,
      title: '数据项类型',
    },
    format1: {
      type: DataType.String,
      title: '显示格式',
      default: 'YYYY-MM-DD HH:mm:ss',
    },
    format: {
      type: DataType.String,
      title: '默认格式',
      default: 'YYYY-MM-DD HH:mm:ss',
    },
    syncFormate: {
      type: DataType.Checkbox,
      title: '同步默认格式',
      default: true,
    },
    labelVisible: {
      type: DataType.Checkbox,
      title: '标题显示',
      default: true,
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
