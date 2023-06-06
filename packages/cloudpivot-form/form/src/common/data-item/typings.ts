/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-13 20:13:41
 * @LastEditTime: 2020-04-13 20:15:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/common/data-item/typings.ts
 */
import { DataItemType } from '../.././schema';
import { DateItemOperatorType } from './data-item2';
export interface DataitemConditionItem {
  propertyCode: string;

  propertyType: DataItemType;

  operatorType: DateItemOperatorType;

  value: any;
}
export interface DataitemConditionValue {
  type: number;

  conditions: DataitemConditionItem[];
}
