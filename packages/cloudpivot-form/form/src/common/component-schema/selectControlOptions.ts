/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-16 19:51:40
 * @description:
 * @LastEditors: Fan
 */
import { DataType, ObjectPropertyInfo } from '../../../typings';
import { inputControlOptions } from '.';
export const selectControlOptions = {
  $id: 'selectControlOptions',
  type: DataType.Object,
  $ref: inputControlOptions.$id,
  properties: {
    defaultValue: {
      type: DataType.String,
      title: '默认值',
    },
    options: {
      type: DataType.String,
      title: '选项',
      default: '选项1;选项2;选项3',
    },
  },
} as ObjectPropertyInfo;
