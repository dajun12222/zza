<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="timeout-strategy">
    <div class="strategy-row">
      <div class="row-title">超时时间</div>
      <timeout-time
        ref="timeoutTime"
        :isWorkflowAttr="isWorkflowAttr"
        :formDataItem="formDataItem"
        :timeoutConfig="timeoutConfig"
        :processTime="processTime"
      />
    </div>
    <div class="strategy-row">
      <div class="row-title">超时后处理</div>
      <a-select
        v-model="timeoutConfig.timeoutStrategy"
        placeholder="请选择"
        class="strategy-select"
      >
        <a-select-option v-for="item in timeoutSolution" :key="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="strategy-row">
      <div class="row-title">超时后通知</div>
      <a-select
        v-model="timeoutConfig.timeoutNotifyStrategies"
        mode="multiple"
        :showArrow="true"
        placeholder="请选择"
        class="strategy-select"
      >
        <a-select-option v-for="item in timeoutNotify" :key="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="strategy-row">
      <div class="row-title">通知渠道</div>
      <a-checkbox-group v-model="timeoutConfig.timeoutNotifyTypes">
        <a-checkbox
          v-for="item in notifyChannel"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-checkbox>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TimeoutTime from './timeoutTime.vue';
import { Select, Checkbox } from '@h3/antd-vue';
import TimeoutConifg from './type';
import {
  TimeoutStrategy,
  TimeoutNotifyStrategy,
  TimeoutNotifyType,
} from './type';

@Component({
  name: 'TimeoutStrategyC',
  components: {
    TimeoutTime,
    ASelect: Select,
    ASelectOption: Select.Option,
    ACheckboxGroup: Checkbox.Group,
    ACheckbox: Checkbox,
  },
})
export default class TimeoutStrategyC extends Vue {
  @Prop()
  isWorkflowAttr!: boolean;

  @Prop()
  timeoutConfig!: TimeoutConifg;

  @Prop()
  formDataItem: any[];

  @Prop()
  processTime!: any;

  timeoutSolution: any[] = [
    {
      label: '无动作，仅标记任务为超时',
      value: TimeoutStrategy.MARK_TIMEOUT,
    },
    {
      label: '自动审批通过，进入下一节点',
      value: TimeoutStrategy.APPROVE,
    },
    {
      label: '自动作废流程',
      value: TimeoutStrategy.CANCLE_WORKFLOW,
    },
    {
      label: '自动中止流程',
      value: TimeoutStrategy.END_WORKFLOW,
    },
  ];

  timeoutNotify: any[] = [
    {
      label: '通知处理人',
      value: TimeoutNotifyStrategy.NOTIFY_HANDLER,
    },
    {
      label: '通知发起人',
      value: TimeoutNotifyStrategy.NOTIFY_ORIGINATOR,
    },
    {
      label: '传阅处理人的上一级主管',
      value: TimeoutNotifyStrategy.CIRCULATE_MANAGER,
    },
    {
      label: '通知特权人',
      value: TimeoutNotifyStrategy.NOTIFY_WORKFLOWADMIN,
    },
  ];

  notifyChannel: any[] = [
    {
      label: '钉钉/微信',
      value: TimeoutNotifyType.DINGTALK_WECHAT,
    },
    {
      label: '邮件',
      value: TimeoutNotifyType.EMAIL,
    },
  ];

  @Watch('isWorkflowAttr', { immediate: true })
  onIsWorkflowAttrChange(value) {
    if (value) {
      this.timeoutSolution[0].label = '无动作，仅标记流程为超时';
      this.timeoutSolution.splice(1, 1);
    }
  }

  dataBack() {
    (this.$refs['timeoutTime'] as any).dataBack();
  }
}
</script>

<style lang="less" scoped>
.timeout-strategy {
  .strategy-row {
    margin-bottom: 16px;
    .row-title {
      padding-bottom: 6px;
    }
    .strategy-select {
      width: 100%;
    }
  }
}
</style>
