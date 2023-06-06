<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="timeout-time-wrap">
    <a-select
      v-if="!isWorkflowAttr"
      v-model="timeoutConfig.timeoutCondition"
      placeholder="请选择"
      class="timeout-condition"
      @change="conditionChange"
    >
      <a-select-option :key="'post_node'"> 流程到达该节点后 </a-select-option>
      <a-select-option :key="'in_form'"> 根据表单字段触发 </a-select-option>
    </a-select>
    <div v-if="!isWorkflowAttr" class="time-text">
      {{ timeoutConfig.timeoutCondition === 'in_form' ? '流程会在' : '' }}
    </div>
    <template v-if="timeoutConfig.timeoutCondition === 'in_form'">
      <a-select
        v-model="timeoutConfig.timeoutTime.formId"
        placeholder="请选择表单内日期字段"
        allowClear
        class="form-item-select"
        :class="{
          'workflow-attr': isWorkflowAttr,
        }"
        @select="handleOnFromChange"
      >
        <a-select-option
          v-for="(item, index) in formDataItem"
          :key="index"
          :value="item.code"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-select
        v-model="timeoutConfig.timeoutTime.timeConfig"
        placeholder="请选择"
        class="time-config-select"
        :class="{
          'workflow-attr':
            isWorkflowAttr && timeoutConfig.timeoutTime.timeConfig !== 'then',
        }"
        @select="handleOnCinfigChange"
      >
        <a-select-option
          v-for="(item, index) in timeConfig"
          :key="index"
          :value="item.type"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </template>

    <template
      v-if="
        !(
          timeoutConfig.timeoutCondition === 'in_form' &&
          timeoutConfig.timeoutTime.timeConfig === 'then'
        )
      "
    >
      <a-input-number
        v-model="processTime.dayValue"
        :min="0"
        :precision="0"
        class="timeout-input-number"
      />
      <div class="time-text">天</div>
      <a-input-number
        v-model="processTime.hourValue"
        :min="0"
        :max="23"
        :precision="0"
        class="timeout-input-number"
      />
      <div class="time-text">时</div>
      <a-input-number
        v-model="processTime.minuteValue"
        :min="0"
        :max="59"
        :precision="0"
        class="timeout-input-number"
      />
      <div class="time-text">分</div>
      <a-input-number
        v-model="processTime.secondValue"
        :min="0"
        :max="59"
        :precision="0"
        class="timeout-input-number"
      />
      <div class="time-text">秒</div>
    </template>
    <div class="time-text time-text-left">超时</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { InputNumber, Select } from '@h3/antd-vue';
import TimeoutConifg from './type';
import {
  TimeoutStrategy,
  TimeoutNotifyStrategy,
  TimeoutNotifyType,
  timeSpanToMsec,
  msecToTime,
} from './type';
@Component({
  name: 'TimeoutTime',
  components: {
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class TimeoutTime extends Vue {
  @Prop()
  isWorkflowAttr!: boolean;

  @Prop()
  formDataItem!: any[];

  @Prop()
  timeoutConfig!: TimeoutConifg;

  @Prop()
  processTime!: any;

  timeConfig: any[] = [
    {
      type: 'then',
      name: '当时',
    },
    {
      type: 'after',
      name: '之后',
    },
  ];

  handleOnFromChange() {}

  handleOnCinfigChange() {}

  conditionChange() {
    /**
     * 根据选择的超时条件不同，将对应的存储属性值置为初始值，下一次切换回来
     * 时就不会带出旧数据了
     */
    if (this.timeoutConfig.timeoutCondition === 'in_form') {
      this.timeoutConfig.allowedTime = '0';
    } else {
      this.timeoutConfig.timeoutTime.formId = undefined;
      this.timeoutConfig.timeoutTime.timeConfig = 'after';
    }
  }

  dataBack() {
    this.timeoutConfig.allowedTime = '' + timeSpanToMsec(this.processTime);
  }
}
</script>

<style lang="less" scoped>
.timeout-time-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: -12px;
  > div {
    margin-bottom: 12px;
  }
  .timeout-condition {
    width: 176px;
  }
  .time-text {
    margin: 4px 8px 4px 8px;
    height: 32px;
    &-left {
      margin-right: 0px;
    }
  }

  .form-item-select {
    width: 220px;
    margin-right: 8px;
    &.workflow-attr {
      width: 280px;
    }
  }

  .time-config-select {
    width: 80px;
    &.workflow-attr {
      margin-right: 210px;
    }
  }

  .timeout-input-number {
    width: 50px;
    border-radius: 2px;
    border: 1px solid #d4d5d6;
    vertical-align: top;
  }
}
</style>
