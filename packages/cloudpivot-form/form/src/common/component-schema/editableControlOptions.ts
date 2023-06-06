/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-16 19:34:28
 * @description:
 * @LastEditors: Fan
 */
import { DataType, ObjectPropertyInfo } from '../../../typings';
import { styleControlOptions } from '.';
export const editableControlOptions = {
  $id: 'editableControlOptions',
  type: DataType.Object,
  $ref: styleControlOptions.$id,
  properties: {
    displayFormula: {
      type: DataType.String,
      title: '显示条件',
    },
    onChange: {
      type: DataType.String,
      title: '变更事件',
    },
  },
} as ObjectPropertyInfo;
