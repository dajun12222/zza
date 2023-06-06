<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <section class="main">
    <div class="content">
      <BaseInfo ref="baseInfo" />
      <div class="dashed-line"></div>
      <a-tabs class="dark-tabs" defaultActiveKey="logs">
        <a-tab-pane key="logs" :tab="$t('cloudpivot.flow.pc.ApprovalLog')">
          <NodeDetail />
        </a-tab-pane>
        <a-tab-pane key="chart" :tab="$t('cloudpivot.flow.pc.WorkflowChart')">
          <Chart
            :chart="chart"
            :workflowStatus="status"
            :fromBizRule="true"
            @clickActivity="clickActivity"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>

<script lang="ts">
import { Tabs } from '@h3/antd-vue';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import BaseInfo from './base-info.vue';
import NodeDetail from './node-detail.vue';
import Chart from 'cloudpivot-flow/flow/src/components/pc/chart.vue';
import ChartCard from './biz-rule-chart-card';

@Component({
  name: 'log-detail',
  components: {
    BaseInfo,
    NodeDetail,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    Chart,
  },
})
export default class LogDetail extends Vue {
  chart: any = {
    activityStatus: [
      {
        activityCode: 'Activity1',
        activityName: null,
        status: 0,
        checkbox: false,
        activityType: null,
      },
      {
        activityCode: 'Activity2',
        activityName: null,
        status: 0,
        checkbox: false,
        activityType: null,
      },
      {
        activityCode: 'Activity3',
        activityName: null,
        status: 2,
        checkbox: false,
        activityType: null,
      },
      {
        activityCode: 'Activity5',
        activityName: null,
        status: 0,
        checkbox: false,
        activityType: null,
      },
    ],
    rules: [
      {
        text: '',
        name_i18n: '{"en":""}',
        utilizeElse: false,
        fixedPoint: true,
        formula: '',
        preActivityCode: 'Activity1',
        postActivityCode: 'Activity2',
        points: ['406, 76', '406, 116'],
        popupType: 'FUNCTION',
        description: null,
      },
      {
        text: '',
        name_i18n: '{"en":""}',
        utilizeElse: false,
        fixedPoint: true,
        formula: '',
        preActivityCode: 'Activity3',
        postActivityCode: 'Activity4',
        points: ['406, 413', '406, 520'],
        popupType: 'FUNCTION',
        description: null,
      },
      {
        text: '',
        name_i18n: '{"en":""}',
        utilizeElse: false,
        fixedPoint: true,
        formula: '',
        preActivityCode: 'Activity2',
        postActivityCode: 'Activity5',
        points: ['404, 156', '404, 223'],
        popupType: 'FUNCTION',
        description: null,
      },
      {
        text: '',
        name_i18n: '{"en":""}',
        utilizeElse: false,
        fixedPoint: true,
        formula: '',
        preActivityCode: 'Activity5',
        postActivityCode: 'Activity3',
        points: ['402, 263', '402, 318', '405, 318', '405, 373'],
        popupType: 'FUNCTION',
        description: null,
      },
    ],
    workflowVersion: 9,
    activities: [
      {
        activityCode: 'Activity1',
        activityName: '开始',
        name_i18n: {
          en: 'Start',
        },
        beforeActivate: null,
        afterActivate: null,
        endActivity: null,
        cancelActivity: null,
        asyncEndJob: null,
        jobSubmitted: null,
        jobRejected: null,
        height: 40,
        width: 158,
        x: 327,
        y: 36,
        popupType: 'FUNCTION',
        preCondition: {
          type: 'ALL',
          rule: {},
        },
        activityType: 'START',
      },
      {
        activityCode: 'Activity2',
        activityName: '更新节点',
        name_i18n: {
          en: '更新节点',
        },
        beforeActivate: null,
        afterActivate: null,
        endActivity: null,
        cancelActivity: null,
        asyncEndJob: null,
        jobSubmitted: null,
        jobRejected: null,
        height: 40,
        width: 158,
        x: 327,
        y: 116,
        popupType: 'FUNCTION',
        preCondition: {
          type: 'ALL',
          rule: {},
        },
        activityType: 'UPDATE',
        participant: null,
        participantType: 'SINGLE_PARTICIPANT',
        submitButtonName: '同意',
        rejectButtonName: '不同意',
        finishExit: null,
        sheetCode: 'xjl_workflow_log',
        propertyPermissions: null,
        permittedAction: {
          forward: true,
          retrieve: true,
          adjustParticipant: false,
          finishInstance: false,
          rejectToStart: false,
          reject: false,
          rejectToFixded: false,
          rejectToActivityCode: null,
          assist: false,
          circulate: false,
          batchOperate: false,
          cancel: false,
        },
        btnConfigList: [
          {
            code: 'agree',
            name: '同意',
            displayName: null,
            commentPermission: {
              visible: true,
              required: false,
            },
            attachmentPermission: {
              visible: true,
              required: false,
            },
            signPermission: {
              visible: true,
              required: false,
            },
          },
          {
            code: 'rejects',
            name: '驳回',
            displayName: null,
            commentPermission: {
              visible: true,
              required: true,
            },
            attachmentPermission: {
              visible: true,
              required: false,
            },
            signPermission: {
              visible: true,
              required: false,
            },
          },
          {
            code: 'forward',
            name: '转办',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'retrieve',
            name: '撤回',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'assist',
            name: '协办',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'circulate',
            name: '传阅',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'adjustParticipant',
            name: '加签',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'finishInstance',
            name: '结束流程',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
        ],
        participationModel: 'PARALLEL',
        noParticipant: null,
        noParticipantorPopupType: 'FUNCTION',
        noParticipantorExr: null,
        originator: null,
        perviousParticipate: null,
        participated: null,
        participateLater: 'DEFAULT',
        followUpParticipate: null,
        noParticipantNextActivity: null,
        approveExit: null,
        disapproveExit: null,
        targetActivityCode: null,
        timeoutCondition: null,
        allowedTime: null,
        timeoutWarning1: null,
        timeoutWarning2: null,
        timeoutTime: null,
        timeoutStrategy: null,
        todoDataItem: null,
        todoDataItems: [
          {
            dataItemType: 0,
            belong: 'dingtalk',
            summary: [],
            title: [],
            type: 0,
            smsCode: null,
            enable: true,
          },
          {
            dataItemType: 2,
            belong: 'email',
            summary: [],
            title: [],
            type: 0,
            smsCode: null,
            enable: false,
          },
          {
            dataItemType: 0,
            belong: 'sms',
            summary: [],
            title: [],
            type: 0,
            smsCode: '',
            enable: false,
          },
        ],
        participantChoose: false,
        nextNodeParticipant: 'PARTICIPANT',
        commonSwitch: false,
        lockType: 'NONE',
      },
      {
        activityCode: 'Activity3',
        activityName: '审批',
        name_i18n: {
          en: '审批',
        },
        beforeActivate: null,
        afterActivate: null,
        endActivity: null,
        cancelActivity: null,
        asyncEndJob: null,
        jobSubmitted: null,
        jobRejected: null,
        height: 40,
        width: 158,
        x: 327,
        y: 373,
        popupType: 'FUNCTION',
        preCondition: {
          type: 'ANY',
          rule: {},
        },
        activityType: 'PARTICIPANT',
        participant: null,
        participantType: 'SINGLE_PARTICIPANT',
        submitButtonName: '同意',
        rejectButtonName: '不同意',
        finishExit: null,
        sheetCode: 'xjl_workflow_log',
        propertyPermissions: null,
        permittedAction: {
          forward: true,
          retrieve: true,
          adjustParticipant: false,
          finishInstance: false,
          rejectToStart: true,
          reject: false,
          rejectToFixded: false,
          rejectToActivityCode: null,
          assist: false,
          circulate: false,
          batchOperate: false,
          cancel: false,
        },
        btnConfigList: [
          {
            code: 'agree',
            name: '同意',
            displayName: null,
            commentPermission: {
              visible: true,
              required: false,
            },
            attachmentPermission: {
              visible: true,
              required: false,
            },
            signPermission: {
              visible: true,
              required: false,
            },
          },
          {
            code: 'rejects',
            name: '驳回',
            displayName: null,
            commentPermission: {
              visible: true,
              required: true,
            },
            attachmentPermission: {
              visible: true,
              required: false,
            },
            signPermission: {
              visible: true,
              required: false,
            },
          },
          {
            code: 'forward',
            name: '转办',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'retrieve',
            name: '撤回',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'assist',
            name: '协办',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'circulate',
            name: '传阅',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'adjustParticipant',
            name: '加签',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'finishInstance',
            name: '结束流程',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
        ],
        participationModel: 'PARALLEL',
        noParticipant: null,
        noParticipantorPopupType: 'FUNCTION',
        noParticipantorExr: null,
        originator: null,
        perviousParticipate: null,
        participated: null,
        participateLater: 'DEFAULT',
        followUpParticipate: null,
        noParticipantNextActivity: null,
        approveExit: null,
        disapproveExit: null,
        targetActivityCode: 'Activity2',
        timeoutCondition: null,
        allowedTime: null,
        timeoutWarning1: null,
        timeoutWarning2: null,
        timeoutTime: null,
        timeoutStrategy: null,
        todoDataItem: null,
        todoDataItems: [
          {
            dataItemType: 2,
            belong: 'email',
            summary: [],
            title: [],
            type: 0,
            smsCode: null,
            enable: false,
          },
          {
            dataItemType: 2,
            belong: 'dingtalk',
            summary: [],
            title: [],
            type: 0,
            smsCode: null,
            enable: true,
          },
          {
            dataItemType: 0,
            belong: 'sms',
            summary: [],
            title: [],
            type: 0,
            smsCode: '',
            enable: false,
          },
        ],
        participantChoose: false,
        nextNodeParticipant: 'PARTICIPANT',
        commonSwitch: false,
        lockType: 'NONE',
      },
      {
        activityCode: 'Activity4',
        activityName: '结束',
        name_i18n: {
          en: 'End',
        },
        beforeActivate: null,
        afterActivate: null,
        endActivity: null,
        cancelActivity: null,
        asyncEndJob: null,
        jobSubmitted: null,
        jobRejected: null,
        height: 40,
        width: 158,
        x: 327,
        y: 520,
        popupType: 'FUNCTION',
        preCondition: {
          type: 'ALL',
          rule: {},
        },
        activityType: 'END',
      },
      {
        activityCode: 'Activity5',
        activityName: '用户活动',
        name_i18n: {
          null: '用户活动',
          en: 'UserAction',
        },
        beforeActivate: null,
        afterActivate: null,
        endActivity: null,
        cancelActivity: null,
        asyncEndJob: null,
        jobSubmitted: null,
        jobRejected: null,
        height: 40,
        width: 158,
        x: 327,
        y: 223,
        popupType: 'EXPRESSION',
        preCondition: {
          type: 'ALL',
          rule: {},
        },
        activityType: 'PARTICIPANT',
        participant: null,
        participantType: 'SINGLE_PARTICIPANT',
        submitButtonName: null,
        rejectButtonName: null,
        finishExit: null,
        sheetCode: 'xjl_workflow_log',
        propertyPermissions: null,
        permittedAction: {
          forward: true,
          retrieve: true,
          adjustParticipant: false,
          finishInstance: false,
          rejectToStart: true,
          reject: false,
          rejectToFixded: false,
          rejectToActivityCode: '',
          assist: false,
          circulate: false,
          batchOperate: false,
          cancel: false,
        },
        btnConfigList: [
          {
            code: 'agree',
            name: '同意',
            displayName: null,
            commentPermission: {
              visible: true,
              required: false,
            },
            attachmentPermission: {
              visible: true,
              required: false,
            },
            signPermission: {
              visible: true,
              required: false,
            },
          },
          {
            code: 'rejects',
            name: '驳回',
            displayName: null,
            commentPermission: {
              visible: true,
              required: true,
            },
            attachmentPermission: {
              visible: true,
              required: false,
            },
            signPermission: {
              visible: true,
              required: false,
            },
          },
          {
            code: 'forward',
            name: '转办',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'retrieve',
            name: '撤回',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'assist',
            name: '协办',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'circulate',
            name: '传阅',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'adjustParticipant',
            name: '加签',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
          {
            code: 'finishInstance',
            name: '结束流程',
            displayName: null,
            commentPermission: null,
            attachmentPermission: null,
            signPermission: null,
          },
        ],
        participationModel: 'PARALLEL',
        noParticipant: null,
        noParticipantorPopupType: 'FUNCTION',
        noParticipantorExr: null,
        originator: null,
        perviousParticipate: null,
        participated: null,
        participateLater: 'DEFAULT',
        followUpParticipate: null,
        noParticipantNextActivity: null,
        approveExit: null,
        disapproveExit: null,
        targetActivityCode: 'Activity2',
        timeoutCondition: null,
        allowedTime: null,
        timeoutWarning1: null,
        timeoutWarning2: null,
        timeoutTime: {
          formId: '',
          enable: false,
          timeConfig: null,
        },
        timeoutStrategy: null,
        todoDataItem: null,
        todoDataItems: [
          {
            dataItemType: 2,
            belong: 'email',
            summary: [],
            title: [],
            type: 0,
            smsCode: null,
            enable: false,
          },
          {
            dataItemType: 2,
            belong: 'dingtalk',
            summary: [],
            title: [],
            type: 0,
            smsCode: null,
            enable: true,
          },
          {
            dataItemType: 2,
            belong: 'sms',
            summary: [],
            title: [],
            type: 0,
            smsCode: '',
            enable: false,
          },
        ],
        participantChoose: false,
        nextNodeParticipant: 'PARTICIPANT',
        commonSwitch: false,
        lockType: 'NONE',
      },
    ],
    workflowCode: 'xjl_workflow_log',
  }; // 流程图

  status: string = 'PROCESSING';

  /**
   * 流程点击回调
   * @params activity 流程原型数据
   * @params e        触发的Element Event
   */
  async clickActivity(activity: any, e: MouseEvent) {
    const rect: DOMRect = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect() as DOMRect;
    console.log(rect);
    ChartCard({
      record: {},
      rect,
    });
  }
}
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  .content {
    height: 100%;
    overflow: auto;
    padding: 24px;
  }
}
</style>

<style lang="less">
.dark-tabs .ant-tabs-bar .ant-tabs-nav {
  background: #e0e1e7;
  border-radius: 2px;
  height: 33px;
  .ant-tabs-tab:not(:last-child) {
    margin-right: 0;
  }

  .ant-tabs-tab-active {
    color: #111218 !important;
    font-weight: 600;
    background: #fff;
  }

  .ant-tabs-tab {
    margin: 3px;
    padding: 0 22px !important;
    text-align: center;
    height: 26px;
    line-height: 26px;
    border-radius: 2px;
    font-size: 12px;
    color: #111218;
  }

  .ant-tabs-ink-bar {
    display: none !important;
  }
}
</style>
