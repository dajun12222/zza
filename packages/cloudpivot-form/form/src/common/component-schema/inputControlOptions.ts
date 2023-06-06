/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-16 19:44:30
 * @description:
 * @LastEditors: Fan
 */
import { DataType, ObjectPropertyInfo } from '../../../typings';
import { editableControlOptions } from '.';
export const inputControlOptions = {
  $id: 'inputControlOptions',
  type: DataType.Object,
  $ref: editableControlOptions.$id,
  properties: {
    requiredFormula: {
      type: DataType.String,
      title: '是否必填',
    },
    readonlyFormula: {
      type: DataType.Boolean,
      title: '是否只读',
      default: false,
    },
  },
} as ObjectPropertyInfo;
