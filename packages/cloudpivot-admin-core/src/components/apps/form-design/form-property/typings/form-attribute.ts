/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * 控件属性值类型
 */
export enum ControlAttributeType {
  Boolean,
  String,
  Dropdown,
  Modal,
  Date,
  SelectTree,
  Tree,
  Userpicker,
  Array,
  Logic,
  Checkbox,
  RadioGroup,
  Custom,
  CustomModal
}

/**
 * 下拉弹窗属性
 */
export enum DropdownAttributeType {
  Number,
  Summary,
  UploadSize,
  ControlType,
  Location,
}

/**
 * 弹框属性枚举
 */
export enum ModalAttributeType {
  // 单选选项框
  RadioOption = 'radioOption',
  // 多选选项框
  CheckboxOption = 'checkboxOption',

  BizRadioOption = 'bizRadioOption',

  RoleSelect = 'rolesModel',
  dropdownOption = 'dropdownOption',
  dropdownMultiOption = 'dropdownMultiOption',

  // 历史留痕树形弹窗
  FormMarking = 'formMarking',

  // 最小日期
  MinDate = 'min-yyyy-mm-dd',
  // 最大日期
  MaxDate = 'max-yyyy-mm-dd',
  // 正则弹框
  RegexpFormula = 'regularModal',
  // 必填条件
  RequiredFormula = 'requiredCondition',
  // 显示条件
  DisplayFormula = 'showRule',
  // 只读条件
  ReadonlyCondition = 'readonlyCondition',
  // 计算规则
  ComputeFormula = 'calculateRule',
  // 选人控件映射关系
  UserSelectionMap = 'userSelectionMap',
  // 查询条件
  QueryFormula = 'queryCondition',
  // 事件脚本输入
  ScriptInput = 'ScriptInput',
  // 映射子表
  SheetMappings = 'sheetMappings',
  // 表单外链接
  ExternalLink = 'ExternalLink',
  // 数值类型 校验
  VerifyFormulaNumber = 'VerifyFormulaNumber',
  // 日期类型 校验
  VerifyFormulaDate = 'VerifyFormulaDate',
  // 图片上传数量
  UpdateImgNum = 'UpdateImgNum',
  /**
   * 选人控件值设置
   */
  UserSelectValueSetting = 'UserSelectValueSetting',
  /**
   * 选人控件组织根节点设置
   */
  UserSelectOrgValueSetting = 'UserSelectOrgValueSetting',

  Print = 'Print',
  // 关联表单默认值
  RelevanceFormDefaultVal = 'RelevanceFormDefaultValue',
  // 短文本几算规则
  shortTextStitchRouls = 'ShortTextStitchRouls',
  // 短文本几算规则
  SelectReportData = 'SelectReportData',
  /**
   * 标签页头部
   */
  TabsHeadsSetting = 'TabsHeadsSetting',
  dataLinkage = 'dataLinkage',

  // 地址&定位弹窗
  LoacationModal = 'loacationModal',

  SequenceNoModal = 'sequenceNoModal',

  CustomButton = 'customButtom',
}

export interface ControlAttributeTip {
  txt?: string;
  icon?: string;
}
/**
 * 控件属性基础类
 */
export interface ControlAttribute {
  disabled?: boolean;
}

/**
 * 下拉属性
 */
export interface DropdownAttribute extends ControlAttribute {
  list: any;
}

/**
 * 弹窗属性
 */
export interface ModalAttribute extends ControlAttribute {}

export interface ControlOptions {
  dateFormat?: string; // 时间格式
  formatter?: Function; //格式化 （value, attr: ControlAttributeOptions, attrs: ControlAttributeOptions[]）
  regexps?: any; // 文本正则匹配 regexp message
  maxLength?: number; // 最长文本数量
  pickerOptions?: any; // 用户控件配置项
  disabled?: Boolean; // 当前控件是否可以交互
  dataList?: Function; // 通过函数获取下拉控件值
  list?: any; // 下拉控件值
  fieldDisplay?: Array<Array<string>>; // 针对于Bool类型 需要显示或者隐藏字段 根据当前value [ [],[] ] 0 是true是需要隐藏的字段，1 是false 需要隐藏的字段
  hideField?: Function | string[]; // 所有控件需要隐藏字段的方法 fun返回一个字符串数组 或者 字段数字
  transaction?: Function; //事务处理 { attr，attrs, displayFields, allControls}
  callback?: Function; //事件回调
  modalType?: string; // 弹窗子类型
  importModal?: Function; //弹窗输入重载  return {value:value, default:default};
  exportModal?: Function; ///弹窗输出重载 return data: any;
  allowClear?: boolean; // 下拉框鼠标移上去可删除
  valueMap?: any; //逻辑值映射
  placeholder?: any; //输入框placeholder
  tip?: any;
}

/**
 *  属性配置项
 */
export interface ControlAttributeOptions {
  value?: string; // 控件值
  tip?: ControlAttributeTip; // 是否提示
  type?: ControlAttributeType; // 控件属性的类型
  attrType?: any; // 控件属性值类型
  label?: string; //标签文本
  options?: ControlOptions; // 所有的类型配置函数
}
