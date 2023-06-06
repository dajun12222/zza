import { styleControlOptions } from 'cloudpivot-form/form/component-schema';
import { DataType, ObjectPropertyInfo } from 'cloudpivot-form/form/typings';

export default {
  $id: 'exRate',
  type: DataType.Object,
  $ref: styleControlOptions.$id,
  properties: {
    count: {
      type: DataType.Number,
      title: 'star总数',
      default: 5,
    },
    allowHalf: {
      type: DataType.Boolean,
      title: '是否允许半选',
      default: true,
    },
    span: {
      ...styleControlOptions.properties.span,
    },
  },
} as ObjectPropertyInfo;
