/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * 表单操作
 */
export enum FormAction {
  /**
   * 加签
   */
  AdjustParticipant = 'adjustParticipant',
  /**
   * 同意
   */
  Agree = 'agree',
  /**
   * 协办
   */
  Assist = 'assist',
  /**
   * 撤回协办
   */
  AssistRetrieve = 'assistRetrieve',
  /**
   * 作废
   */
  Cancel = 'cancel',
  /**
   * 传阅
   */
  Circulate = 'circulate',
  /**
   * 删除
   */
  Delete = 'delete',
  /**
   * 不同意
   */
  DisAgree = 'disAgree',
  /**
   * 编辑
   */
  Edit = 'edit',
  /**
   * 结束
   */
  FinishInstance = 'finishInstance',
  /**
   * 转办
   */
  Forward = 'forward',
  /**
   * 打印
   */
  Print = 'print',
  /**
   * 驳回
   */
  Reject = 'showReject',

  /**
   * 是否显示审批意见输入框
   */
  showCheck = 'showCheck',
  /**
   * 撤回
   */
  Retrieve = 'retrieve',
  /**
   * 暂存
   */
  Save = 'save',
  /**
   * 提交
   */
  Submit = 'submit',
  /**
   * 催办
   */
  Urge = 'urge',

  /**
   * 评论
   */
  Comment = 'comment',

  /**
   * 修改拥有者
   */
  EditOwner = 'editOwner',
  /**
   * 选择下个节点审批人
   */
  ChangeNextNodeUser = 'changeNextNodeUser',
  /**
   * 表单留痕
   */
  FormTrack = 'formTrack',

  /**
   * 提交并继续创建
   */
  addAndCreate = 'addAndCreate',

  /**
   * 复制
   */
  Copy = 'copy',

  /**
   * 发起群聊
   */
  InitiateGroupChat = 'initiateGroupChat',
}
