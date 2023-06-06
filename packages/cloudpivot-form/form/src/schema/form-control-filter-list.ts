/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { FormControlType } from './form-control-type';
import {
  NotDataItemOfFormControlListExtend,
  IsFullRowFormControlListExtend,
  IsLayoutFormControlListExtend,
  NoKeyAttributeFormControlListExtend,
  NoLabelFormControlListExtend,
  GroupFormControlListExtend,
} from 'cloudpivot-form-extend/utils/form-control-filter-list-extend';

/**
 * 非数据项类型控件列表
 */
export const NotDataItemOfFormControlList = [
  FormControlType.Group,
  FormControlType.Description,
  FormControlType.Html,
  FormControlType.Title,
  FormControlType.ReverseRelevance,
  FormControlType.Tabs,
  ...NotDataItemOfFormControlListExtend,
];

/**
 * 单行布局的控件列表
 */
export const IsFullRowFormControlList = [
  FormControlType.Title,
  FormControlType.ApprovalOpinion,
  FormControlType.Attachment,
  FormControlType.Image,
  FormControlType.Group,
  FormControlType.Description,
  FormControlType.Sheet,
  FormControlType.Textarea,
  FormControlType.Address,
  FormControlType.ReverseRelevance,
  FormControlType.Tabs,
  FormControlType.Signature,
  ...IsFullRowFormControlListExtend,
];

/**
 * 纯布局类型控件列表
 */
export const IsLayoutFormControlList = [
  FormControlType.Group,
  FormControlType.Description,
  FormControlType.Title,
  FormControlType.Tabs,
  ...IsLayoutFormControlListExtend,
];

/**
 * 无控件编码属性的控件列表
 */
export const NoKeyAttributeFormControlList = [
  FormControlType.Tabs,
  FormControlType.Title,
  FormControlType.Group,
  FormControlType.Description,
  FormControlType.ReverseRelevance,
  ...NoKeyAttributeFormControlListExtend,
];

/**
 * 无标签的控件列表
 */
export const NoLabelFormControlList = [
  FormControlType.Tabs,
  FormControlType.Title,
  FormControlType.Group,
  FormControlType.Description,
  ...NoLabelFormControlListExtend,
];

/**
 * 分组标题组件列表，多级分组
 */
export const GroupFormControlList = [
  FormControlType.Group,
  ...GroupFormControlListExtend,
];
