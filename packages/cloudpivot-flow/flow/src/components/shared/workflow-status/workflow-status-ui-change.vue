<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion:
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-18 18:07:55
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-04 15:47:05
-->

<template>
  <div class="workflow-status" :class="statusClass">
    <i :class="'icon aufontAll ' + fontFace"></i>
    {{ statusText }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'workflow-status',
})
export default class WorkflowStatus extends Vue {
  @Prop()
  status!: string;

  get statusText() {
    return this.MAP[this.status]['text'];
  }

  get statusClass() {
    return this.MAP[this.status]['class'];
  }

  get fontFace() {
    return this.MAP[this.status]['fontFace'];
  }

  get MAP() {
    return {
      DRAFT: {
        text: this.$t('cloudpivot.flow.pc.WorkflowState.DRAFT'),
        class: 'Draft',
        fontFace: 'h-icon-all-highlight',
      },
      PROCESSING: {
        text: this.$t('cloudpivot.flow.pc.WorkflowState.PROCESSING'),
        class: 'Pending',
        fontFace: 'h-icon-all-reloadtime',
      },
      /**
       * 流程通过
       */
      APPROVED: {
        text: this.$t('cloudpivot.flow.pc.WorkflowState.APPROVED'),
        class: 'Approved',
        fontFace: 'h-icon-all-check-circle1',
      },
      /**
       * 手动结束
       */
      TOPPING_OFF: {
        text: this.$t('cloudpivot.flow.pc.WorkflowState.TOPPING_OFF'),
        class: 'Topping-off',
        fontFace: 'h-icon-all-close-circle-o',
      },
      CANCELED: {
        text: this.$t('cloudpivot.flow.pc.WorkflowState.CANCELED'),
        class: 'Canceled',
        fontFace: 'h-icon-all-file-exception',
      },
      EXCEPTION: {
        text: this.$t('cloudpivot.flow.pc.WorkflowState.EXCEPTION'),
        class: 'Exception',
        fontFace: 'h-icon-all-abnormal',
      },
    };
  }
}
</script>

<style lang="less" scoped>
.workflow-status {
  font-size: 16px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
  &.Draft {
    color: #707481;
  }
  &.Pending {
    color: #2970ff;
  }
  &.Approved {
    color: #00c293;
  }
  &.Topping-off {
    color: #faad14;
  }
  &.Canceled {
    color: rgba(17, 18, 24, 0.5);
  }
  &.Exception {
    color: #ff3640;
  }
  > i {
    overflow: inherit;
    vertical-align: baseline;
    width: auto;
    margin-right: 10px;
    font-size: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    padding-top: 2px;
  }
}
</style>
