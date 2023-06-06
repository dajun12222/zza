/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default interface timeoutConfig {
  timeoutCondition: 'post_node' | 'in_form';
  allowedTime: string;
  timeoutTime: TimeoutTime;
  timeoutStrategy: TimeoutStrategy[];
  timeoutNotifyStrategies: TimeoutNotifyStrategy[];
  timeoutNotifyTypes: TimeoutNotifyType[];
  timeoutWarning1: string;
  timeoutWarning1NotifyStrategies: TimeoutNotifyStrategy[];
  timeoutWarning2: string;
  timeoutWarning2NotifyStrategies: TimeoutNotifyStrategy[];
  timeoutWarning3: string;
  timeoutWarning3NotifyStrategies: TimeoutNotifyStrategy[];
  timeoutWarning4: string;
  timeoutWarning4NotifyStrategies: TimeoutNotifyStrategy[];
  timeoutWarning5: string;
  timeoutWarning5NotifyStrategies: TimeoutNotifyStrategy[];
}

interface TimeoutTime {
  enable: boolean;
  formId: string;
  timeConfig: 'then' | 'after';
}

export enum TimeoutStrategy {
  NOTIFY_HANDLER = 'NOTIFY_HANDLER', //("通知处理人", 0)
  APPROVE = 'APPROVE', //("自动通过", 1)
  CIRCULATE_MANAGER = 'CIRCULATE_MANAGER', //("传阅上级主管", 2)
  FORWARD_MANAGER = 'FORWARD_MANAGER', //("转交上级主管", 3)
  MARK_TIMEOUT = 'MARK_TIMEOUT', //("无动作仅标记任务为超时",4)
  CANCLE_WORKFLOW = 'CANCLE_WORKFLOW', //("自动作废流程",5)
  END_WORKFLOW = 'END_WORKFLOW', //("自动中止流程",6)
}

export enum TimeoutNotifyStrategy {
  NOTIFY_HANDLER = 'NOTIFY_HANDLER', //("通知处理人", 0)
  NOTIFY_ORIGINATOR = 'NOTIFY_ORIGINATOR', //("通知发起人", 1)
  CIRCULATE_MANAGER = 'CIRCULATE_MANAGER', //("传阅处理人的上一级主管", 2)
  NOTIFY_WORKFLOWADMIN = 'NOTIFY_WORKFLOWADMIN', //("通知特权人", 3)
}

export enum TimeoutNotifyType {
  DINGTALK_WECHAT = 'DINGTALK_WECHAT', //("钉钉/微信",0)
  EMAIL = 'EMAIL', //("邮件",1)
}

// 时间段对象转毫秒数
export function timeSpanToMsec(time: any) {
  if (time) {
    const days =
      parseInt(time.dayValue ? time.dayValue : 0, 10) * 1000 * 60 * 60 * 24;
    const hours =
      parseInt(time.hourValue ? time.hourValue : 0, 10) * 1000 * 60 * 60;
    const minutes =
      parseInt(time.minuteValue ? time.minuteValue : 0, 10) * 1000 * 60;
    const seconds =
      parseInt(time.secondValue ? time.secondValue : 0, 10) * 1000;
    return days + hours + minutes + seconds;
  }
  return 0;
}

// 毫秒数转为时间对象
export function msecToTime(msec: number) {
  let timeObj = {
    dayValue: 0,
    hourValue: 0,
    minuteValue: 0,
    secondValue: 0,
  };
  if (msec) {
    const days = Math.floor(msec / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((msec % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((msec % (1000 * 60)) / 1000);
    timeObj = {
      dayValue: days,
      hourValue: hours,
      minuteValue: minutes,
      secondValue: seconds,
    };
  }
  return timeObj;
}

export function getDefaultWorkflowTimeoutConfig() {
  return {
    timeoutCondition: 'in_form',
    allowedTime: '0',
    timeoutTime: {
      enable: false,
      formId: undefined,
      timeConfig: 'after',
    },
    timeoutStrategy: TimeoutStrategy.MARK_TIMEOUT,
    timeoutNotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutNotifyTypes: [],
    timeoutWarning1: '0',
    timeoutWarning1NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutWarning2: null,
    timeoutWarning2NotifyStrategies: [],
    timeoutWarning3: null,
    timeoutWarning3NotifyStrategies: [],
    timeoutWarning4: null,
    timeoutWarning4NotifyStrategies: [],
    timeoutWarning5: null,
    timeoutWarning5NotifyStrategies: [],
  };
}

export function getDefaultActivityTimeoutConfig() {
  return {
    timeoutCondition: 'post_node',
    allowedTime: '0',
    timeoutTime: {
      enable: false,
      formId: undefined,
      timeConfig: 'after',
    },
    timeoutStrategy: TimeoutStrategy.MARK_TIMEOUT,
    timeoutNotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutNotifyTypes: [
      TimeoutNotifyType.DINGTALK_WECHAT,
      TimeoutNotifyType.EMAIL,
    ],
    timeoutWarning1: '0',
    timeoutWarning1NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutWarning2: null,
    timeoutWarning2NotifyStrategies: [],
    timeoutWarning3: null,
    timeoutWarning3NotifyStrategies: [],
    timeoutWarning4: null,
    timeoutWarning4NotifyStrategies: [],
    timeoutWarning5: null,
    timeoutWarning5NotifyStrategies: [],
  };
}
