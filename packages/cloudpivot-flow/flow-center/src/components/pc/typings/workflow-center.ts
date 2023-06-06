/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * 流程中心
 */

export enum SelectKeysMapping {
  MyUnfinishedWorkItem = 1,
  StartWorkflow = 2,
  MyFinishedWorkItem = 3,
  ReadingTask = 4,
  MyWorkflow = 5,
  QueryInstance = 6,
  QueryParticipantWorkItem = 7,
  MyComments = 8,
  DelegationWorkflow = 9,
}

// 超时
export enum WorkItemTimeoutStatus {
  TIMEOUT = 'TIMEOUT',
  RED = 'RED',
  ORANGE = 'ORANGE',
  NORMAL = 'NORMAL',
}

// 已读标识
export enum WorkItemStatus {
  NOTSTART = 1,
  INPROGESS = 2,
}

export enum WorkflowInstanceState {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  EXCEPTION = 'EXCEPTION',
}

export enum ApprovalState {
  AGREE = 1,
  REJECT = 2,
  FORWARD = 3,
  CANCELLED = 4,
  UNDO = 5,
}

export interface TableHeaderFix {
  vm: any;
  type: string;
}

/**
 * 路由名称
 */
export enum WorkflowCenterRouter {
  MyUnfinishedWorkItem = 'myUnfinishedWorkItem',
  StartWorkflow = 'startWorkflow',
  MyUnReadWorkItem = 'myUnReadWorkItem',
  MyFinishedWorkItem = 'myFinishedWorkItem',
  MyReadWorkItem = 'myReadWorkItem',
  MyWorkflow = 'myWorkflow',
  QueryInstance = 'queryInstance',
  QueryParticipantWorkItem = 'queryParticipantWorkItem',
}

/**
 * 计算表格最大高度的类型
 */
export enum CalculateMaxHeightTypes {
  OnlyTable = 'onlyTable', // 只有表格
  HasBtns = 'hasBtns', // 有操作按钮
  HasFilters = 'hasFilters', // 有过滤条件
  HasTabsAndFilters = 'hasTabsAndFilters', // 有过滤条件和tab切换
}

/**
 * 列表展示配置
 */
export interface DisplayColumnsConfig {
  title: string;
  type: 'text' | 'person' | 'status';
  valueType: 'string' | 'object';
  valueMap: any;
  styles?: any;
  statusConfig?: { [key: string]: StatusConfig };
}

/**
 * 状态字段字体颜色，边框颜色，背景颜色配置
 */
interface StatusConfig {
  text?: string;
  fontColor: string;
  backgroundColor: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
}

/**
 * 流程筛选条件字段枚举
 */
export enum workflowQueryFieldInputType {
  INPUT = 0,
  WORKFLOW_TREE,
  STAFF_SELECTOR,
  RANGE_PICKER,
  SELECT,
}
