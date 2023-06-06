<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="content-wrapper">
    <component
      :is="workitemStatus"
      v-if="!hiddenContent"
      class="approval-item-content"
      :contentData="contentData"
      :approval="approval"
    />
    <div class="approval-line"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import WorkitemAborted from './workitem-aborted.vue';
import WorkitemAgreed from './workitem-agreed.vue';
import WorkitemCanceled from './workitem-canceled.vue';
import WorkitemDisagreed from './workitem-disagreed.vue';
import WorkitemSubmitted from './workitem-submitted.vue';
import WorkitemTransferred from './workitem-transferred.vue';
import WorkitemVoided from './workitem-voided.vue';
import WorkitemOperation from './workitem-operation.vue';
import WorkitemSubWorkflow from './workitem-sub-workflow.vue';
import WorkitemNoStatus from './workitem-no-status.vue';
import WorkitemPending from './workitem-pending.vue';
import { workflowEnum } from 'cloudpivot-flow/flow';

@Component({
  name: 'approval-item-content',
  components: {
    WorkitemAborted,
    WorkitemAgreed,
    WorkitemCanceled,
    WorkitemDisagreed,
    WorkitemSubmitted,
    WorkitemTransferred,
    WorkitemVoided,
    WorkitemOperation,
    WorkitemSubWorkflow,
    WorkitemNoStatus,
    WorkitemPending,
  },
})
export default class ApprovalItemContent extends Vue {
  @Prop()
  contentData!: any;

  @Prop()
  approval!: any;

  get workitemStatus() {
    if (this.approval.subInstanceActivity) {
      return 'WorkitemSubWorkflow';
    }

    if (
      [
        workflowEnum.WorkActionType.CANCELLED,
        workflowEnum.WorkActionType.FINISHED,
        workflowEnum.WorkActionType.MODIFY_OWNER,
        workflowEnum.WorkActionType.ACTIVATE_ACTIVITY,
        workflowEnum.WorkActionType.ADJUST_PARTICIPANT,
        workflowEnum.WorkActionType.CANCELED_ACTIVITY_WORKITEM,
      ].includes(this.contentData.workActionType) &&
      this.contentData.workItemId === 'ADMIN'
    ) {
      return 'WorkitemOperation';
    }

    //加签，协办，传阅操作
    if (!this.contentData.displayStatus) {
      return 'WorkitemNoStatus';
    }

    switch (this.contentData.displayStatus) {
      case workflowEnum.WorkItemStatus.AGREED:
        return 'WorkitemAgreed';
      case workflowEnum.WorkItemStatus.ABORTED:
        return 'WorkitemAborted';
      case workflowEnum.WorkItemStatus.CANCELED:
        return 'WorkitemCanceled';
      case workflowEnum.WorkItemStatus.DISAGREED:
        return 'WorkitemDisagreed';
      case workflowEnum.WorkItemStatus.TRANSFERRED:
        return 'WorkitemTransferred';
      case workflowEnum.WorkItemStatus.VOIDED:
        return 'WorkitemVoided';
      case workflowEnum.WorkItemStatus.SUBMITTED:
        return 'WorkitemSubmitted';
      case workflowEnum.WorkItemStatus.PENDING:
        return 'WorkitemPending';
    }
  }

  get hiddenContent() {
    return !this.workitemStatus || !this.contentData.approvaler;
  }
}
</script>

<style lang="less" scoped>
.approval-item-content {
  padding-left: 56px;
  font-size: 13px;

  line-height: 22px;
  /deep/.default-text {
    color: rgba(17, 18, 24, 0.5);
  }
  /deep/.black-text {
    color: #111218;
  }
}
.content-wrapper {
  position: relative;
  .approval-line {
    position: absolute;
    height: calc(100% + 20px);
    left: 20px;
    top: 6px;
    border-left: 1.5px solid #e4e7ec;
  }
}
</style>

<style lang="less">
.approval-item-content > div {
  &:first-child {
    margin-top: -3px;
  }
  margin-bottom: 4px;
  &.approval-comment,
  &.approval-attachment {
    margin-bottom: 8px;
  }
}
</style>
