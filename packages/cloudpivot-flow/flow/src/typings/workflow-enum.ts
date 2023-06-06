/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * 流程行为状态
 */
export const workflowActionStatus: { [key: string]: string } = {
  '0': 'Submit',
  '1': 'Submits',
  '2': 'Cancel',
  '3': 'Agree',
  '4': 'DisAgree',
  '5': 'AdjustParticipant',
  '6': 'Assist',
  '7': 'Forward',
  '8': 'Reject',
  '9': 'FinishInstance',
  '10': 'UnRead',
  '11': 'Read',
  '14': 'BeCanceled', // 后端标记为‘Revoke撤回’，前端显示为‘BeCanceled被取消’
  '15': 'AutoCanceled', // 多人并行节点同意或驳回其他任务显示为‘自动取消’
  '16': 'Circularize',
  '99': 'Empty',
  '18': 'ActivateActivity',
  '19': 'ADJUST_PARTICIPANT',
  '20': 'CANCELED_ACTIVITY_WORKITEM',
  '17': 'MODIFY_OWNER',
  '21': 'TIMEOUT_CANCEL',
  '22': 'TIMEOUT_PASS',
};
/**
 * 流程任务状态
 */
export const workItemStatus: { [key: string]: string } = {
  '1': 'NotStarted',
  '2': 'Processing',
  '3': 'Completed',
  '4': 'Canceled',
  '5': 'Draft',
  '6': 'BeCanceled', // 后端标记为‘Revoke撤回’，前端显示为‘BeCanceled被取消’
};
/**
 * 子流程任务状态
 */
export const subWorkItemStatus: { [key: string]: string } = {
  '0': 'NotStarted',
  '1': 'Processing',
  '2': 'Completed',
  '3': 'Canceled',
  '4': 'Exception',
  '6': 'BeCanceled', // 后端标记为‘Revoke撤回’，前端显示为‘BeCanceled被取消’
};
/**
 * 流程的节点状态
 */
export const workflowNode: { [key: string]: string } = {
  '0': '已办节点',
  '1': '进行中节点',
  '2': '异常节点',
};

/**
 * 流程状态
 */
export enum WorkflowState {
  /**
   * 进行中
   */
  PROCESSING = 'PROCESSING',
  /**
   * 流程通过
   */
  APPROVED = 'APPROVED',
  /**
   * 手动结束
   */
  TOPPING_OFF = 'TOPPING_OFF',
  /**
   * 流程作废
   */
  CANCELED = 'CANCELED',
  /**
   * 流程异常
   */
  EXCEPTION = 'EXCEPTION',
  /**
   * 草稿
   */
  DRAFT = 'DRAFT',
}

/**
 * 流程任务状态
 */
export enum WorkItemStatus {
  /**
   * 待处理
   */
  PENDING = 'PENDING',
  /**
   * 已同意
   */
  AGREED = 'AGREED',
  /**
   * 已拒绝
   */
  DISAGREED = 'DISAGREED',
  /**
   * 已转办
   */
  TRANSFERRED = 'TRANSFERRED',
  /**
   * 已提交
   */
  SUBMITTED = 'SUBMITTED',
  /**
   * 已终止
   */
  ABORTED = 'ABORTED',
  /**
   * 已取消
   */
  CANCELED = 'CANCELED',
  /**
   * 已作废
   */
  VOIDED = 'VOIDED',
}

//@workflowActionClassName: gray, green, blue, red;
/**
 * 流程行为样式
 */
export enum WorkflowAction {
  DRAFT = 'gray',
  PROCESSING = 'green',
  COMPLETED = 'blue',
  CANCELED = 'red',
}

/**
 * 参与者的类型
 */
export enum WorkflowParticipantType {
  MORMAL = 0,
  FORWARD = 1,
  ASSIST = 2,
  ADD_WORKITEM = 3,
  CIRCULATE_ITEM = 4,
}

/**
 * 审批记录中，任务状态为同意时，不同情况的枚举
 */
export enum ApprovalPassType {
  /**
   * 超时通过
   */
  TIMEOUT_PASS = 'TIMEOUT_PASS',

  /**
   * 是发起人自动通过
   */
  ORIGINATOR_AUTO_PASS = 'ORIGINATOR_AUTO_PASS',

  /**
   * 前一节点处理人自动通过
   */
  PREVIOUS_PARTICIPATE_AUTO_PASS = 'PREVIOUS_PARTICIPATE_AUTO_PASS',

  /**
   * 参与过流程自动通过
   */
  PARTICIPATED_AUTO_PASS = 'PARTICIPATED_AUTO_PASS',

  /**
   * 无参与者自动通过
   */
  NO_PARTICIPATE_AUTO_PASS = 'NO_PARTICIPATE_AUTO_PASS',

  /**
   * 后审批
   */
  LATER_PARTICIPATE = 'LATER_PARTICIPATE',
}

/**
 * 审批记录中，任务状态为取消时，不同类型的枚举
 */
export enum ApprovalCancelType {
  /**
   * 多人并签任务取消
   */
  MULTI_PARTICIPANT_CANCEL = 'MULTI_PARTICIPANT_CANCEL',

  /**
   * 并行节点任务取消
   */
  PARALLEL_ACTIVITY_CANCEL = 'PARALLEL_ACTIVITY_CANCEL',

  /**
   * 撤回任务取消
   */
  REVOKE_CANCEL = 'REVOKE_CANCEL',

  /**
   * 协办任务取消
   */
  ASSIST_CANCEL = 'ASSIST_CANCEL',

  /**
   * 加签取消
   */
  ADD_WORKITEM_CANCEL = 'ADD_WORKITEM_CANCEL',
}

export enum ApprovalAbortedType {
  /**
   * 结束流程导致中止
   */
  END_INSTANCE_ABORTED = 'END_INSTANCE_ABORTED',

  /**
   * 超时结束导致中止
   */
  TIMEOUT_ABORTED = 'TIMEOUT_ABORTED',
}

export enum ApprovalVoidedType {
  /**
   * 运维作废
   */
  OPERATE_VOIDED = 'OPERATE_VOIDED',

  /**
   * 超时作废
   */
  TIMEOUT_VOIDED = 'TIMEOUT_VOIDED',
}

/**
 * 流程操作类型
 */
export enum WorkActionType {
  //("意见", 0),
  APPROVAL = 0,
  SUBMIT, //("提交", 1),
  CANCELLED, //("作废", 2),
  AGREE, //("同意", 3),
  DISAGREE, //("不同意", 4),
  ADJUSTPARTICIPATORS, //("加签", 5),
  ASSIST, //("协办",6),
  FORWARD, //("转办", 7),
  REJECT, //("驳回", 8),
  FINISHED, //("结束流程", 9),
  UNREAD, //("待阅",10),
  READ, //("已阅",11),
  PROCESSING, //("处理中", 12),
  TEMPORYSAVE, //("暂存",13),
  REVOKE, //("撤回",14),
  PASSIVECANCELLED, //("被取消",15),
  CIRCULATE, //("传阅", 16),
  MODIFY_OWNER, //("修改拥有者", 17),
  ACTIVATE_ACTIVITY, //("激活节点", 18),
  ADJUST_PARTICIPANT, //("调整处理人", 19),
  CANCELED_ACTIVITY_WORKITEM, //("取消节点任务", 20),
  TIMEOUT_CANCELLED, //("超时作废", 21),
  TIMEOUT_PASS, //("超时通过", 22)
}
