/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  Version: 'Workflow Version',
  FinishTime: 'Finish Time: {time}',
  CancelTime: 'Cancel Time: {time}',
  CurNode: 'Current Activity',
  CurHandler: 'Current Approvers',
  UsedTime: 'Used Time {time}',
  WorkflowTrack: 'Workflow track',
  Edit: 'Edit',
  AdjustNode: 'Activities Adjustment',
  ProcessOperationAndMaintenance: 'Process Operation And Maintenance',
  Nullify: 'Cancel',
  Delete: 'Delete',
  Logs: 'Operate Log',
  Finish: 'Finish',
  EditOwner: 'Modify owner',
  NullifyTips:
    'The workflow will be stuck after cancel,are you sure to cancel?',
  NullifyTips1: 'Sure to void?',
  NullifyTips2: 'The process will stop circulating after it is invalidated',
  DeleteTips1:
    'All workflow data will be delete after workflow instance be deleted, ',
  DeleteTips2: 'and it can not restore after delete',
  DeleteTips3: 'Are you sure to delete?',
  Total: 'Total {num}',
  WorkHandover: 'Work handover',
  organization: 'Organization',
  organizationTips1:
    'Incumbents and ex-employees conduct job handovers through personnel and department search',
  organizationRole: 'Organization Role',
  organizationTips2: 'Job handover through role search',
  SelectAction: 'Select Process Action',
  FinishWorkflow: 'End the Workflow ahead of schedule',
  FinishWorkflowTips: 'Are you sure to end the workflow right now？',
  WorkflowChart: 'WorkFlow diagram',
  SmallScreen: 'Exit fullScreen',
  ApprovalLog: 'Approve Log',
  Describe: 'Describe',
  Back: 'Back',
  OperationLogs: 'User Operation Log',
  NoOperationLogs: 'No User Operation Log',
  View: 'Check',
  DetailInfo: 'Details',
  Number: 'NO.',
  OperationType: 'Operation Type',
  OperationTime: 'Operation Time',
  User: 'User',
  Operations: 'Operation with',
  Platform: 'Platform',
  Detail: 'Details',
  Assist: ' assist]',
  AddWorkitem: ' add-approver]',
  Circulate: ' circulate]',
  Forward: ' transfer]',
  ActivityName: 'Activity Name',
  ReceiveTime: 'Received Time',
  FinishTimes: 'Finish Time',
  CostTime: 'Used Time',
  Originator: 'Paticipants',
  ApprovalAction: 'Action',
  consignor: 'Consignor',
  resolver: 'Resolver',
  FinishNode: 'Ended Activity',
  ProcessNode: 'Processing Activity',
  ExceptionNode: 'Abnormal Activity',
  UnstartNode: 'Unstarted Activity',
  WorkflowName: 'Workflow Name',
  Status: 'Status',
  StartTime: 'Start Time',
  FinishedTime: 'End Time',
  BaseInfo: 'Basic Information',
  NoFinishOriginator: 'Unfinished Approver',
  ViewDetails: 'Details',
  ChooseAdjustType: 'Choose a type',
  AdjustOriginator: 'Current Approver Adjustment',
  CancelAllTask: 'Cancel all task of the activity',
  ActivateNodes: 'Activate another activity',
  AdjustNodeTips:
    'Tips:Workflow will keep stuck,and administrator need to activate another activity.',
  notNodeTips: 'No nodes currently available',
  ChooseNode: 'Adjust Activity',
  ChooseHandler: 'Choose the approver',
  ClickChoose: 'Click and choose',
  Null: 'Empty',
  Nothing: 'Nothing',
  Cancel: 'Cancel',
  OK: 'OK',
  'Ok&Del': 'Ok & Delete',
  Predictor: 'Predict approver',
  NoDetail: 'There is no details',
  trust: '【{name} entrust】',
  trust2: ' entrust',
  Person: ' person ',
  Give: ' give ',
  giveYou: ' give you',
  Of: ' of ',
  WorkflowState: {
    DRAFT: 'Draft',
    PROCESSING: 'Processing',
    APPROVED: 'Approved',
    TOPPING_OFF: 'Topping off',
    CANCELED: 'Canceled',
    EXCEPTION: 'Exception',
    COMPLETED: 'Completed',
    Draft: 'Draft',
    Processing: 'Processing',
    Completed: 'Completed',
    Canceled: 'Canceled',
    Exception: 'Exception',
  },
  WorkflowActionStatus: {
    Submit: 'Submit',
    Submits: 'Submit',
    Cancel: 'Cancel-workflow',
    Agree: 'Agree',
    DisAgree: 'Disagree',
    AdjustParticipant: 'Add-approver',
    Assist: 'Assist',
    Forward: 'Transfer',
    Reject: 'Reject',
    FinishInstance: 'End-workflow',
    UnRead: 'Unread',
    Read: 'Read',
    Circularize: 'Circularize',
    Empty: '',
    Revoke: 'Revoke',
    BeCanceled: 'Be Canceled',
    AutoCanceled: 'Auto Cancel',
    ActivateActivity: 'Activate Other Nodes',
    ADJUST_PARTICIPANT: 'Adjust Current Processor',
    CANCELED_ACTIVITY_WORKITEM: 'Cancel All Tasks Of The Node',
    MODIFY_OWNER: 'Modify Owner',
    TIMEOUT_CANCEL: 'Timeout Cancel',
    TIMEOUT_PASS: 'Timeout Pass',
  },
  WorkItemStatus: {
    NotStarted: 'Not Started',
    Processing: 'Processing',
    Completed: 'Completed',
    Canceled: 'Canceled',
    Draft: 'Draft',
    BeCanceled: 'Be Canceled',
    //改版后流程任务状态
    PENDING: 'Pending',
    AGREED: 'Agreed',
    DISAGREED: 'Disagreed',
    TRANSFERRED: 'Transferred',
    SUBMITTED: 'Submitted',
    ABORTED: 'Aborted',
    CANCELED: 'Canceled',
    VOIDED: 'Voided',
  },
  SubWorkItemStatus: {
    NotStarted: 'Not Started',
    Processing: 'Processing',
    Completed: 'Completed',
    Canceled: 'Canceled',
    Exception: 'Exception',
    BeCanceled: 'Be Canceled',
  },
  approvalLog: {
    circulateNum: 'Ciruation {num} persons',
    circulatedNum: 'Read {num}',
    uncirculateNum: 'Unread {num}',
    turnover: 'Turnover',
    newOwner: 'New Owner',
    handlingSuggestion: 'Handling Suggestion',
    operator: 'Operator',
    newHandler: 'New Handler',
    workflowAdjust: 'WorkflowAdjust',
    nodeAdjust: 'NodeAdjust',
    whoseAdjustParticipant: "{who}'s Add-approver",
    whoseTransfer: "{who}'s Transfer",
  },
  approval: {
    scrollUpToLoadMore: 'Slide up to see more follow-up processors',
    title: {
      operation: 'Maintenance actions',
      noParticipant: 'No participant',
      noParticipantAutoPass: 'Approved without participants',
    },
    content: {
      timoutAbortWorkflow: 'Topping off due to timeout',
      timeoutPass: 'Approved due to timeout',
      originatorAutoPass: 'Task approved due to {who} is the creator',
      previousParticipantAutoPass:
        'Task approved due to {who} participated in the previous activity',
      participantedAutoPass: 'Task approved due to {who} handled the workflow',
      hasNodeAfter: 'Task approved due to {who} has a follow-up task',
      approveOpinion: 'Approve opinion',
      customOpinion: '{custom} opinion',
      multiParticipantCancel:
        'Task canceled due to multiple processing by others',
      parallelActivityCancel: 'Task canceled due to parallel node finished',
      revokeCancel: 'Task canceled due to previous activity withdraw',
      assistCancel: 'Task canceled due to the approver has processed',
      rejectTo: '{btnName} to {nextActivityName}',
      disagree: 'Disagree',
      person: ' person',
      revoke: 'reooke',
      finishWorkflow: 'End-workflow',
      cancelWorkflow: 'Cancel workflow',
      activateActivity: 'Activate other nodes',
      modifyBefore: 'Old Handler：',
      modifyAfter: 'New Handler：',
      cancelActivityWorkitem: 'Cancel all task of the activity',
      modifyOwner: 'Modify owner',
      newOwner: 'New Owner：',
      newOwnerDept: 'Owner department：',
      solveOpinion: 'Handling Suggestion',
    },
    component: {
      approvalPeopleNum: 'Waiting for approval by {num} people including ',
      detail: 'detail',
      circulate: 'circulate',
    },
  },
};