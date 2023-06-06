import * as WorkflowCenterTypes from './workflow-center';
import { workflowEnum } from 'cloudpivot-flow/flow';

/**
 * 获取流程状态配置信息
 * @param pageVM Vue实例，目的是为了实现中英文
 * @returns
 */
export const getWorkflowStatusConfig = (pageVM) => {
  return {
    PROCESSING: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkflowState.PROCESSING') as string,
      fontColor: '#2970FF',
      backgroundColor: '#F0F7FF',
      padding: '0px 4px 1px 4px',
    },
    APPROVED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkflowState.APPROVED') as string,
      fontColor: '#00C293',
      backgroundColor: '#E6FFF4',
      padding: '0px 4px 1px 4px',
    },
    TOPPING_OFF: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkflowState.TOPPING_OFF') as string,
      fontColor: '#FAAD14',
      backgroundColor: '#FFFBE6',
      padding: '0px 4px 1px 4px',
    },
    CANCELED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkflowState.CANCELED') as string,
      fontColor: '#707481',
      backgroundColor: 'rgba(17,18,24,0.06)',
      padding: '0px 4px 1px 4px',
    },
    EXCEPTION: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkflowState.EXCEPTION') as string,
      fontColor: '#FF3640',
      backgroundColor: '#FFF1F0',
      padding: '0px 4px 1px 4px',
    },
    DRAFT: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkflowState.DRAFT') as string,
      fontColor: '#707481',
      backgroundColor: 'rgba(17,18,24,0.06)',
      padding: '0px 4px 1px 4px',
    },
  };
};

/**
 * 获取流程任务状态配置信息
 * @param pageVM
 * @returns
 */
export const getWorkitemStatusConfig = (pageVM: any) => {
  return {
    PENDING: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.PENDING') as string,
      fontColor: '#FAAD14',
      backgroundColor: '#FFFBE6',
      border: '1px solid #FFE58F',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    AGREED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.AGREED') as string,
      fontColor: '#00C293',
      backgroundColor: '#E6FFF4',
      border: '1px solid #6FE8BE',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    DISAGREED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.DISAGREED') as string,
      fontColor: '#FF3640',
      backgroundColor: '#FFF1F0',
      border: '1px solid #FFB6B3',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    TRANSFERRED: {
      text: pageVM.$t(
        'cloudpivot.flow.pc.WorkItemStatus.TRANSFERRED',
      ) as string,
      fontColor: '#2970FF',
      backgroundColor: '#F0F7FF',
      border: '1px solid #A3CBFF',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    SUBMITTED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.SUBMITTED') as string,
      fontColor: '#00C293',
      backgroundColor: '#E6FFF4',
      border: '1px solid #6FE8BE',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    ABORTED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.ABORTED') as string,
      fontColor: 'rgba(17,18,24,0.5)',
      backgroundColor: '#F5F6F9',
      border: '1px solid rgba(17,18,24,0.25)',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    CANCELED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.CANCELED') as string,
      fontColor: '#FF3640',
      backgroundColor: '#FFF1F0',
      border: '1px solid #FFB6B3',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
    VOIDED: {
      text: pageVM.$t('cloudpivot.flow.pc.WorkItemStatus.VOIDED') as string,
      fontColor: 'rgba(17,18,24,0.5)',
      backgroundColor: '#F5F6F9',
      border: '1px solid rgba(17,18,24,0.25)',
      borderRadius: '34px',
      padding: '0px 6px 1px 6px',
    },
  };
};

/**
 *
 * @param pageVM 获取流程相关的所有字段相关的配置
 * @returns
 */
export const getAllWorkflowFieldConfig = (pageVM: any) => {
  const sequenceNo: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.sequenceNo') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'sequenceNo',
  };

  const flowStatus: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.flowStatus') as string,
    type: 'status',
    valueType: 'string',
    valueMap: 'state',
    styles: {
      minTitleWidth: '60px',
    },
    statusConfig: getWorkflowStatusConfig(pageVM),
  };

  const curResolver: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.curResolver') as string,
    type: 'person',
    valueType: 'object',
    valueMap: (data) => {
      return {
        sourceId: data.participant || data.participants.id || data.originator,
        imgUrl: data.participantImgUrl,
        sourceName: data.participants
          ? data.participants.name
          : data.participantName || data.originatorName,
      };
    },
  };

  const curActivity: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.curActivity') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'activityName',
  };

  const initiationTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.initiationTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'startTime',
  };

  const usedTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.usedTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: ['stayTimeStr'],
  };

  const costTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.costTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: ['costTime'],
  };

  const finishedTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.finishedTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'finishTime',
  };

  const cancelTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.cancelTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'finishTime',
  };

  const originatorName: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.originatorName') as string,
    type: 'person',
    valueType: 'object',
    valueMap: {
      sourceId: 'originator',
      imgUrl: 'imgUrl',
      sourceName: 'originatorName',
    },
  };

  const workitemStatus: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.workitemStatus') as string,
    type: 'status',
    valueType: 'string',
    valueMap: 'instanceState',
    styles: {
      minTitleWidth: '60px',
    },
    statusConfig: getWorkitemStatusConfig(pageVM),
  };

  const resolver: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.resolver') as string,
    type: 'person',
    valueType: 'object',
    valueMap: (data) => {
      return {
        sourceId: data.participant || data.participants.id || data.originator,
        imgUrl: data.participantImgUrl,
        sourceName: data.participants
          ? data.participants.name
          : data.participantName || data.originatorName,
      };
    },
  };

  const resolveNode: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.resolveNode') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'activityName',
  };

  const receiveTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.receiveTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'receiveTime',
  };

  const resolveTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.resolveTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'finishTime',
  };

  const createdTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.createdTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'startTime',
  };

  const stayTime: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.stayTime') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'stayTimeStr',
    styles: {
      minTitleWidth: '60px',
    },
  };

  const resolveRzt: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.resolveRzt') as string,
    type: 'status',
    valueType: 'string',
    valueMap: 'state',
    statusConfig: getWorkitemStatusConfig(pageVM),
  };

  const sourceName: WorkflowCenterTypes.DisplayColumnsConfig = {
    title: pageVM.$t('cloudpivot.flowCenter.pc.sourceName') as string,
    type: 'text',
    valueType: 'string',
    valueMap: 'sourceName',
    styles: {
      minTitleWidth: '60px',
    },
  };

  return {
    sequenceNo,
    flowStatus,
    curResolver,
    curActivity,
    initiationTime,
    usedTime,
    costTime,
    finishedTime,
    cancelTime,
    originatorName,
    workitemStatus,
    resolver,
    resolveNode,
    receiveTime,
    resolveTime,
    createdTime,
    stayTime,
    resolveRzt,
    sourceName,
  };
};

export const getAllWorkflowQueryFieldConfig = (pageVm: any) => {
  const sequenceNo = {
    field: 'sequenceNo',
    label: pageVm.$t('cloudpivot.flowCenter.pc.sequenceNo'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.INPUT,
    placeholder: pageVm.$t('cloudpivot.flowCenter.pc.inputSequenceNo'),
    class: 'workflow-name-input',
  };

  const workflowName = {
    field: 'workflowName',
    label: pageVm.$t('cloudpivot.flowCenter.pc.flowName'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.INPUT,
    placeholder: pageVm.$t('cloudpivot.flowCenter.pc.pleaseEnter'),
    class: 'workflow-name-input',
  };

  const approvalNode = {
    field: 'activityName',
    label: pageVm.$t('cloudpivot.flowCenter.pc.approvalNode'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.INPUT,
    placeholder: pageVm.$t('cloudpivot.flowCenter.pc.pleaseEnter'),
    class: 'workflow-name-input',
  };

  const workflowNode = {
    field: 'activityName',
    label: pageVm.$t('cloudpivot.flowCenter.pc.workflowNode'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.INPUT,
    placeholder: pageVm.$t('cloudpivot.flowCenter.pc.inputWorkflowNode'),
    class: 'workflow-name-input',
  };

  const flowTemplate = {
    field: '',
    label: pageVm.$t('cloudpivot.flowCenter.pc.flowTemplate'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.WORKFLOW_TREE,
    class: 'workflow-name-input',
  };

  const curResolver = {
    field: 'participant',
    label: pageVm.$t('cloudpivot.flowCenter.pc.curResolver'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.STAFF_SELECTOR,
    class: 'workflow-name-input modal-input',
  };

  const originatorName = {
    field: 'originator',
    label: pageVm.$t('cloudpivot.flowCenter.pc.originatorName'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.STAFF_SELECTOR,
    class: 'workflow-name-input modal-input',
  };

  const resolver = {
    field: 'participant',
    label: pageVm.$t('cloudpivot.flowCenter.pc.resolver'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.STAFF_SELECTOR,
    class: 'workflow-name-input modal-input',
  };

  const participantId = {
    field: 'participantId',
    label: pageVm.$t('cloudpivot.flowCenter.pc.resolver'),
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.STAFF_SELECTOR,
    class: 'workflow-name-input modal-input',
  };

  const time = {
    field: 'time',
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.RANGE_PICKER,
    label: pageVm.$t('cloudpivot.flowCenter.pc.initiationTime'),
    class: 'workflow-name-input',
  };

  const timeWithoutDefault = {
    field: 'timeWithoutDefault',
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.RANGE_PICKER,
    label: pageVm.$t('cloudpivot.flowCenter.pc.initiationTime'),
    class: 'workflow-name-input',
  };

  const flowStatus = {
    field: 'instanceState',
    inputType: WorkflowCenterTypes.workflowQueryFieldInputType.SELECT,
    label: pageVm.$t('cloudpivot.flowCenter.pc.flowStatus'),
    options: Object.keys(workflowEnum.WorkflowState)
      .filter((state) => {
        return state !== workflowEnum.WorkflowState.DRAFT;
      })
      .map((state, index) => {
        return {
          label: pageVm.$t(`cloudpivot.flow.pc.WorkflowState.${state}`),
          value: state,
          key: index + 1,
        };
      }),
  };

  return {
    sequenceNo,
    workflowName,
    approvalNode,
    workflowNode,
    flowTemplate,
    curResolver,
    originatorName,
    resolver,
    time,
    flowStatus,
    participantId,
    timeWithoutDefault,
  };
};

export default {};
