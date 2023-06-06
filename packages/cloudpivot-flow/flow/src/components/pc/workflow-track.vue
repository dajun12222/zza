<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <section class="main">
    <div class="header">
      <div class="con">
        <div class="headerLeft">
          <span class="back fl" @click="back">{{
            $t('cloudpivot.flow.pc.Back')
          }}</span>
          <span class="section-title fl">{{
            $t('cloudpivot.flow.pc.WorkflowTrack')
          }}</span>
          <span 
            class="workState fl" 
            :class="
              baseInfo.status === 'PROCESSING' ? 'processing' : 
              baseInfo.status === 'DRAFT' ? 'draft' : 
              baseInfo.status === 'CANCELED' ? 'canceled' :
              baseInfo.status === 'EXCEPTION' ? 'exception' :
              baseInfo.status === 'APPROVED' ? 'approved' : 'topping_off'
            "
          >{{ workflowState }}</span>
        </div>
        <div class="headerRight">
            <div class="mr28"> 
              <span class="time">开始时间:</span>
              <span v-if="baseInfo.startTime" class="timeVal">{{ baseInfo.startTime }}</span>
              <span v-else class="timeVal">--</span>
            </div>
            <div>
              <span class="time">结束时间:</span>
              <span v-if="baseInfo.finishTime" class="timeVal">{{ baseInfo.finishTime }}</span>
              <span v-else class="timeVal">--</span>
            </div>
        </div>
      </div>
      
      <!-- <label for="" class="version">{{ $t('cloudpivot.flow.pc.Version') }}：V{{
          baseInfo.workflowVersion
        }}</label> -->
    </div>
    <div class="content">
      <a-tabs class="dark-tabs" defaultActiveKey="chart">
        <a-tab-pane key="chart" :tab="$t('cloudpivot.flow.pc.WorkflowChart')">
          <Chart
            v-show="chart && chart.activities"
            :chart="chart"
            :workflowStatus="baseInfo.status"
            @clickActivity="clickActivity"
            @overLine="overLine"
            @leaveLine="leaveLine"
          />
        </a-tab-pane>
        <a-tab-pane
          v-if="!isExternal"
          key="logs"
          :tab="$t('cloudpivot.flow.pc.ApprovalLog')"
        >
          <Log
            :logs="logs"
            :statusFn="chartCardStatus"
            :getActivityBtnConfigList="getActivityBtnConfigList"
          />
        </a-tab-pane>
        <a-tab-pane key="actionLogs" :tab="$t('cloudpivot.flow.pc.Logs')">
          <OperationList
            :workflowInstanceId="workflowInstanceId"
            @showDetail="showDetail"
          />
        </a-tab-pane>
      </a-tabs>
      <PageLoading v-model="loading" />
    </div>

    <div v-if="showLogIframeForm" class="iframe-shadow"></div>
    <transition name="fade-down">
      <div v-if="showLogIframeForm" class="iframe-form-warp">
        <div class="log-icon-close" @click="onLogIframeFormClose">
          <span class="icon aufontAll">&#xe996;</span>
        </div>
        <iframe
          ref="iframe"
          class="iframe-form-warp--page"
          :src="IframeFormUrl"
        ></iframe>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { workflow, workflowApi } from 'cloudpivot/api';
import common from 'cloudpivot/common/pc';
import { Tabs } from '@h3/antd-vue';
import { mixins } from 'vue-class-component';
import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseInfo from './base-info.vue';
import ChartCard from './chart-card';
import ChartDescribe from './chart-describe';
import Chart from './chart.vue';
import Log from './logs.vue';
import WorkflowMixin from './mixins/workflow';
import OperationList from './operation-list.vue';

@Component({
  name: 'workflow-track',
  components: {
    BaseInfo,
    Chart,
    Log,
    OperationList,
    PageLoading: common.components.PageLoading,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
  },
})
export default class FormWorkflowTrack extends mixins(WorkflowMixin) {
  @Prop({
    default: {},
  })
  baseInfo!: workflow.InstanceBaseInfo; // 流程跟踪基础信息

  @Prop({
    default: {},
  })
  chart!: workflow.Chart; // 流程图

  @Prop({
    default: [],
  })
  logs!: workflow.WorkflowTrackLog[]; // 审批日志

  record: workflow.WorkflowTrackLog[] = [];

  @Prop({
    default: true,
  })
  loading!: boolean;

  @Prop({
    default: '',
  })
  workflowInstanceId!: string; // 流程实例Id

  @Prop({
    default: new Map(),
  })
  buttonDisplayNameMap!: Map<string, string>; //流程按钮新名称

  // @Prop({
  //   default: ""
  // })
  // workItemId!: string; // 流程Id

  i18n: any = {};

  showLogIframeForm: boolean = false;

  IframeFormUrl: string = '';

  // 是否为外部用户
  get isExternal() {
    if ((window as any).isExternal) {
      return true;
    }
    return false;
  }

  param: any = null;

  currentLine: any = null;

  currentRect: any = null;

  //监听模态框状态

  @Watch('$store.state.motalflag')
  getPiedata(newVal: any, oldVal: any) {
    console.log(newVal, oldVal);
    const flag = newVal;
    if (typeof flag === 'boolean' && flag) {
      if (!this.param) {
        return;
      }
      clearTimeout(this.param); //清除定时器
      this.param = null;
      return flag;
    }
    if (flag === false && this.currentRect && this.currentLine) {
      const rect = this.currentRect;
      const line = this.currentLine;
      ChartDescribe({ rect, type: 'leave', line, estimate: true });
    }
  }

  mounted() {
    this.i18n = {
      receiverTime: `${this.$t('cloudpivot.flow.pc.ReceiveTime')}:`,
      finishTime: `${this.$t('cloudpivot.flow.pc.FinishTimes')}:`,
      predictor: `${this.$t('cloudpivot.flow.pc.Predictor')}`,
      assist: `${this.$t('cloudpivot.flow.pc.Assist')}`,
      addWorkitem: `${this.$t('cloudpivot.flow.pc.AddWorkitem')}`,
      circulate: `${this.$t('cloudpivot.flow.pc.Circulate')}`,
      forward: `${this.$t('cloudpivot.flow.pc.Forward')}`,
      nothing: `${this.$t('cloudpivot.flow.pc.Nothing')}`,
      trust: `${this.$t('cloudpivot.flow.pc.trust2')}`,
    };
  }

  /**
   * 返回点击事件
   */
  back() {
    if (this.workflowInstanceId !== '') {
      // this.$router.go(-1);
      let { href } = this.$router.resolve({
        path: '/form/detail',
        query: {
          workitemId: this.$route.params.workItemId,
          workflowInstanceId: this.$route.params.workflowInstanceId,
          return:this.$route.query.return,
        }
      });
      window.location.href = href;
    } else {
      this.closePage();
    }
  }

  /**
   * 关闭当前页面
   */
  closePage() {
    window.opener = null;
    window.open('', '_self');
    window.close();
  }

  /**
   * 流程点击回调
   * @params activity 流程原型数据
   * @params e        触发的Element Event
   */
  async clickActivity(activity: any, e: MouseEvent) {
    // 系统活动、开始、结束节点暂不生成chartCard
    if (
      activity.activityType === 'SYSTEM_ACTIVITY' ||
      activity.activityType === 'START' ||
      activity.activityType === 'END'
    ) {
      return;
    }
    this.record = [];
    const rect: DOMRect = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect() as DOMRect;
    this.record = this.logs.filter(
      (log: workflow.WorkflowTrackLog) =>
        log.activityCode === activity.activityCode,
    );
    if (this.record && this.record.length) {
      ChartCard({
        record: this.record.reverse(),
        rect,
        fn: this.goSubWorkflowForm,
        i18n: this.i18n,
        statusFn: this.chartCardStatus,
      });
    }
  }

  async overLine(line: any, e: MouseEvent) {
    const rect: DOMRect = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect() as DOMRect;
    ChartDescribe({ rect, type: 'over', line, estimate: true });
  }

  async leaveLine(line: any, e: MouseEvent) {
    const rect: DOMRect = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect() as DOMRect;
    if (!this.param) {
      this.currentLine = line;
      this.currentRect = rect;
    }
    this.param = setTimeout(() => {
      ChartDescribe({ rect, type: 'leave', line, estimate: true });
    }, 750);
  }

  /**
   * 打开子流程表单
   */
  goSubWorkflowForm(log: any) {
    this.$router
      .push({
        name: 'form-detail',
        query: {
          workflowInstanceId: log.subWorkflowInstanceId,
          workitemId: log.subWorkItemId,
          return: `${location.pathname + location.search}`,
        },
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  // ChartCard状态多语言
  chartCardStatus(value: any, type: string, activityCode: any) {
    console.log(value, activityCode);
    if (type === 'subInstance') {
      return this.getSubWorkflowActionStatus(value);
    } else {
      const btnConfigMap: Map<string, string> =
        this.getActivityBtnConfigList(activityCode);
      return this.getWorkflowActionStatus(value, btnConfigMap);
    }
  }

  showDetail(data) {
    this.showLogIframeForm = true;
    const id: string = data.id;
    this.IframeFormUrl =
      '/from/operation-log-compare/' +
      id +
      '/' +
      this.workflowInstanceId +
      '/' +
      this.$route.params.workItemId;

    const iframeFormWarpClose = window.parent.document.getElementById(
      'iframeFormWarpClose',
    );
    if (iframeFormWarpClose) {
      iframeFormWarpClose.style.display = 'none';
    }

    window.addEventListener('message', this.hideDetail, false);
  }

  hideDetail(event: any) {
    if (event.data === 'closeIfr') {
      this.showLogIframeForm = false;
      window.removeEventListener('message', this.hideDetail);
    }
  }

  onLogIframeFormClose() {
    this.showLogIframeForm = false;
    const iframeFormWarpClose = window.parent.document.getElementById(
      'iframeFormWarpClose',
    );
    if (iframeFormWarpClose) {
      iframeFormWarpClose.style.display = 'block';
    }
  }

  getActivityBtnConfigList(activityCode) {
    const btnConfigMap: Map<string, string> = new Map();
    if (activityCode) {
      Array.of(...this.buttonDisplayNameMap.keys())
        .filter((key: string) => {
          const btnActivityCode = key.split('_$$_')[0];
          return btnActivityCode === activityCode;
        })
        .forEach((key: string) => {
          const btnCode = key.split('_$$_')[1];
          btnConfigMap.set(btnCode, this.buttonDisplayNameMap.get(key));
        });
    }
    return btnConfigMap;
  }

  MAP: any = {
    DRAFT: {
      zh: '草稿',
      cn: 'Draft',
      fontFace: 'h-icon-all-highlight',
    },
    PROCESSING: {
      zh: '进行中',
      cn: 'Pending',
      fontFace: 'h-icon-all-reloadtime',
    },
    CANCELED: {
      zh: '已作废',
      cn: 'Canceled',
      fontFace: 'h-icon-all-file-exception',
    },
    EXCEPTION: {
      zh: '异常',
      cn: 'Exception',
      fontFace: 'h-icon-all-abnormal',
    },
    APPROVED: {
      zh: '已完成',
      cn: 'Approved',
      fontFace: 'h-icon-all-check-circle1',
    },
    TOPPING_OFF: {
      zh: '手动结束',
      cn: 'Topping-off',
      fontFace: 'h-icon-all-close-circle-o',
    },
  };

  // 判断当前是否是中文版本
  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  /**
   * 获取流程状态
   */
  get workflowState() {
    return this.isChinese
      ? this.MAP[this.baseInfo.status as any] &&
          this.MAP[this.baseInfo.status as any]['zh']
      : this.MAP[this.baseInfo.status as any] &&
          this.MAP[this.baseInfo.status as any]['cn'];
  }
}
</script>
<style lang="less">
.ant-popover-inner {
  box-shadow: 0 2px 8px 0 rgba(30, 85, 255, 0.15);
}

.iframe-form-warp {
  position: fixed;
  top: 0;
  bottom: 0;
  // left: 0;
  // right: 83px;
  left: 50%;
  transform: translateX(-50%);
  margin: auto;
  min-width: 1024px;
  max-width: 1440px;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  z-index: 1020;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  &--page {
    width: 100%;
    height: 100%;
    overflow: auto;
    border: none;
  }
  .log-icon-close {
    position: absolute;
    right: 24px;
    cursor: pointer;
    top: 13px;
    font-size: 20px;
    color: #000;
    vertical-align: baseline;
  }
}
.iframe-shadow {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1010;
}
</style>
<style lang="less">
@import '../style.less';
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';

.form-track {
  .main {
    flex: none !important;
    display: flex;
    flex-direction: column;
    position: relative;
    height: calc(100vh - 64px);
    background-color: #fff !important;
    .header {
        width:100%;
        // padding:25px 5px 25px 10px;
        border-radius: 4px;
        height: 76px;
        background: #F1F2F6;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        .con{
          width: 1067px;
          height: 76px;
          position: relative;
          left: 50%;
          margin-left: -567px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .back {
          display: inline-block;
          margin-right: 16px;
          padding-right: 16px;
          border-right: 1px solid #ccc;
          font-size: 18px;
          margin-top:4px;
          color: @highlightColor;
          line-height: 18px;
          cursor: pointer;
        }
        .fl{
          float: left;
        }
        .section-title {
          margin-right: 8px;
          color: #111218;
          font-size: 18px;
          line-height: 26px;
          font-weight: 600;
        }
        .workState{
          display: inline-block;
          font-size: 12px;
          font-weight: 400;
          border-radius: 11px;
          height: 20px;
          line-height: 20px;
          margin-top: 3px;
          padding:0 8px;
          &.processing{
            color: #008EFF;
            background: rgba(122,209,255,0.2);
            border: 1px solid rgba(0,142,255,0.3);
          }
          &.draft{
            color: #F66320;
            background: rgba(255,197,156,0.2);
            border: 1px solid rgba(246,99,32,0.3);
          }
          &.canceled{
            color:  #111218;
            background: rgba(17,18,24,0.05);
            border: 1px solid rgba(17,18,24,0.1);
          }
          &.exception{
            color: #F0353F;
            background: rgba(255,182,179,0.2);
            border: 1px solid rgba(240,53,63,0.3);
          }
          &.approved{
            color:  #111218;
            background: rgba(17,18,24,0.05);
            border: 1px solid rgba(17,18,24,0.1);
          }
          &.topping_off{
            color:  #111218;
            background: rgba(17,18,24,0.05);
            border: 1px solid rgba(17,18,24,0.1);
          }
        }
        .headerRight{
          display: flex;
          justify-content: center;
        }
        .mr28{
          margin-right: 28px;
        }
        .time{
          font-size: 12px;
          font-weight: 400;
          color: rgba(17,18,24,0.5);
          margin-right: 8px;
        }
        .timeVal{
          font-size: 14px;
          font-weight: 400;
          color: #111218;
        }
        .version {
          padding: 3px 8px;
          font-size: 12px;
          color: #111218;
          background: rgba(17, 18, 24, 0.05);
          border-radius: 4px;
          border: 1px solid rgba(17, 18, 24, 0.1);
        }
      }
    > .content {
      padding: 39px 0 38px 0;
      align-self: center;
      height: auto;
      width: 1000px !important;
      .dashed-line {
        margin-top: 48px;
        margin-bottom: 48px;
        width: 100%;
        border-bottom: 1px dashed #eee;
      }
    }
  }
  &__tabs {
    margin-top: @base4-padding-sm;
  }
  .dark-tabs {
    .flow-track-chart {
      margin-top: 8px;
      .workflow-designer {
        .activity-instance {
          color: #111218;
          border: none !important;
          background: rgba(17, 18, 24, 0.06);
          .activity-content i {
            vertical-align: middle;
          }
          &:hover {
            background: rgba(17, 18, 24, 0.2);
          }
        }
        .finish {
          background: #e6fffb;
          &:hover {
            background: #b5f5ec;
          }
        }
        .processing {
          background: #f0f7ff;
          &:hover {
            background: #cce4ff;
          }
        }
        .wrong {
          background: #ffdedb;
          &:hover {
            background: #ffb6b3;
          }
        }
      }
      .flow-track-chart__explain-item {
        > i {
          border: none !important;
        }
        span {
          color: #111218;
        }
        .flow-track-chart__finish {
          background: #e6fffb;
        }
        .flow-track-chart__processing {
          background: #f0f7ff;
        }
        .flow-track-chart__wrong {
          background-color: #ffdedb;
        }
        .flow-track-chart__default {
          background: rgba(17, 18, 24, 6%);
          border-radius: 2px;
        }
      }
    }
  }
}
</style>

