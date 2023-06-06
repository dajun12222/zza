import { FormControlTypeExtend } from './form-control-type-extend';

/**
 * 非数据项类型控件列表
 * 描述：该类别控件不生成controller，在创建表单时不会新增相关数据库字段，且提交表单数据时没有对应的数据值
 * 控件举例：分组标题、描述说明、数据标题、关联查询、标签页
 */
export const NotDataItemOfFormControlListExtend = [
  FormControlTypeExtend.Group2,
];

/**
 * 单行布局的控件列表
 * 描述：在表单设计时，控件宽度属性不能被修改且只能设置为整行
 * 控件举例：数据标题、审批意见、附件、图片、手写签名、分组标题、描述说明、子表、长文本、地址级联（不是地图定位）、关联查询、标签页
 */
export const IsFullRowFormControlListExtend = [FormControlTypeExtend.Group2];

/**
 * 纯布局类型控件列表
 * 描述：用于布局的非数据项类型控件
 * 控件举例：分组标题、描述说明、数据标题、标签页
 */
export const IsLayoutFormControlListExtend = [FormControlTypeExtend.Group2];

/**
 * 无控件编码属性的控件列表
 * 描述：在控件属性中没有“绑定数据项编码”属性的控件
 * 控件举例：标签页、数据标题、分组标题、描述说明、关联查询
 */
export const NoKeyAttributeFormControlListExtend = [
  FormControlTypeExtend.Group2,
];

/**
 * 无标签的控件列表
 * 描述：用于布局的非数据项类型控件
 * 控件举例：分组标题、描述说明、数据标题、标签页
 */
export const NoLabelFormControlListExtend = [FormControlTypeExtend.Group2];

/**
 * 分组标题组件列表，多级分组，必须按照组件层级排列
 * 描述：二开“分组标题”组件注册列表，该列表中的组件顺序为分组层级顺序
 */
export const GroupFormControlListExtend = [FormControlTypeExtend.Group2];
