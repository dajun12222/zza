<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    width="640px"
    :maskClosable="false"
    :keyboard="false"
    wrapClassName="timeout-config-modal"
    :destroyOnClose="true"
    @cancel="closeModal"
    @ok="backData"
  >
    <div class="timeout-config-wrap">
      <div class="config-group">
        <div class="config-group-title">超时策略</div>
        <timeout-strategy-c
          ref="timeoutStrategy"
          :timeoutConfig="timeoutConfig"
          :isWorkflowAttr="isWorkflowAttr"
          :formDataItem="formDataItem"
          :processTime="processTime"
        />
      </div>
      <div class="config-group">
        <div class="config-group-title">
          <span class="time-text">超时预警</span>
          <a-switch
            v-model="timeoutConfig.timeoutTime.enable"
            class="large-size"
          />
          <span v-if="!timeoutConfig.timeoutTime.enable" class="time-tip">设置预警机制，在超时前指定时间提醒相关人</span>
          <span v-else class="time-tip">预警时间不可超过已设置的超时时间</span>
        </div>
        <timeout-early-warning
          v-if="timeoutConfig.timeoutTime.enable"
          ref="earlyWarning"
          :timeoutTimeStamp="timeoutTimeStamp"
          :timeoutConfig="timeoutConfig"
          :processTime="processTime"
        />
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Modal, Button, Switch } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TimeoutEarlyWarning from './timeoutEarlyWarning.vue';
import TimeoutStrategyC from './timeoutStrategy.vue';
import TimeoutConifg from './type';
import {
  TimeoutStrategy,
  TimeoutNotifyStrategy,
  TimeoutNotifyType,
  msecToTime,
  timeSpanToMsec,
} from './type';
import { observeModal } from 'cloudpivot/common/src/utils/dom';

@Component({
  name: 'TimeoutConfigModal',
  components: {
    AModal: Modal,
    AButton: Button,
    ASwitch: Switch,
    TimeoutEarlyWarning,
    TimeoutStrategyC,
  },
})
export default class TimeoutConfigModal extends Vue {
  @Prop() value!: any;

  @Prop()
  data!: TimeoutConifg;

  @Prop()
  isWorkflowAttr!: boolean;

  @Prop()
  formDataItem!: any[];

  processTime: any = {
    dayValue: '',
    hourValue: '',
    minuteValue: '',
    secondValue: '',
  };

  visible: boolean = false;

  resizeObserver: any = null;

  timeoutConfig: any = {
    timeoutCondition: 'post_node',
    allowedTime: '0',
    timeoutTime: {
      enable: false,
      formId: '',
      timeConfig: 'after',
    },
    timeoutStrategy: TimeoutStrategy.MARK_TIMEOUT,
    timeoutNotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutNotifyTypes: [],
    timeoutWarning1: '0',
    timeoutWarning1NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutWarning2: null,
    timeoutWarning2NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutWarning3: null,
    timeoutWarning3NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutWarning4: null,
    timeoutWarning4NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    timeoutWarning5: null,
    timeoutWarning5NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
  };

  @Watch('value')
  onValueChange(v: any) {
    this.visible = v;

    if (v) {
      this.$nextTick(() => {
        observeModal('timeout-config-modal');
      });
    }
  }

  get modalTitle() {
    if (this.isWorkflowAttr) {
      return '流程超时策略及预警';
    } else {
      return '节点超时策略及预警';
    }
  }

  mounted() {
    this.timeoutConfig = JSON.parse(JSON.stringify(this.data));
    this.processTime = msecToTime(Number(this.timeoutConfig.allowedTime));
  }

  @Watch('timeoutConfig.timeoutTime.enable')
  onEnableChange(value) {
    if (value === false) {
      Object.assign(this.timeoutConfig, {
        timeoutWarning1: '0',
        timeoutWarning1NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
        timeoutWarning2: null,
        timeoutWarning2NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
        timeoutWarning3: null,
        timeoutWarning3NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
        timeoutWarning4: null,
        timeoutWarning4NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
        timeoutWarning5: null,
        timeoutWarning5NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
      });
    }
  }

  @Watch('data')
  onDataChange() {
    if (this.data) {
      this.timeoutConfig = JSON.parse(JSON.stringify(this.data));
      this.processTime = msecToTime(Number(this.timeoutConfig.allowedTime));
    }
  }

  backData() {
    if (this.timeoutConfig.timeoutTime.enable) {
      if (!(this.$refs['earlyWarning'] as any).dataBack()) {
        return;
      }
    }
    (this.$refs['timeoutStrategy'] as any).dataBack();
    this.$emit('backData', this.timeoutConfig);
    this.closeModal();
  }

  closeModal() {
    this.$emit('input', false);
  }

  get timeoutTimeStamp() {
    return timeSpanToMsec(this.processTime);
  }
}
</script>

<style lang="less" scoped></style>
<style lang="less">
.timeout-config-modal {
  .timeout-config-wrap {
    .config-group {
      &:not(:last-child) {
        padding-bottom: 16px;
      }
      &-title {
        position: relative;
        padding-left: 7px;
        font-weight: 600;
        color: #111218;
        line-height: 22px;
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        &::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 12px;
          background: #2970ff;
          border-radius: 2px;
          position: absolute;
          top: 5px;
          left: 0;
        }

        .ant-switch {
          margin-right: 12px;
          margin-left: 12px;
          margin-top: 1px;
          min-width: 36px;
        }

        .time-tip {
          color: rgba(17, 18, 24, 0.5);
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
