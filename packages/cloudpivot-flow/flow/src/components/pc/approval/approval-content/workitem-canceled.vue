<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-canceled">
    <!--多人并签，其他人已处理，当前任务取消-->
    <template
      v-if="
        contentData.endRemark === ApprovalCancelType.MULTI_PARTICIPANT_CANCEL
      "
    >
      <div class="default-text">
        {{ $t('cloudpivot.flow.pc.approval.content.multiParticipantCancel') }}
      </div>
    </template>
    <!--并行节点已处理，当前任务取消-->
    <template
      v-else-if="
        contentData.endRemark === ApprovalCancelType.PARALLEL_ACTIVITY_CANCEL
      "
    >
      <div class="default-text">
        {{ $t('cloudpivot.flow.pc.approval.content.parallelActivityCancel') }}
      </div>
    </template>
    <!--前一活动撤回，当前任务取消-->
    <template
      v-else-if="contentData.endRemark === ApprovalCancelType.REVOKE_CANCEL"
    >
      <div class="default-text">
        {{ $t('cloudpivot.flow.pc.approval.content.revokeCancel') }}
      </div>
    </template>
    <!--审批人已处理，被协办人任务取消备份-->
    <template
      v-else-if="contentData.endRemark === ApprovalCancelType.ASSIST_CANCEL"
    >
      <div class="default-text">
        {{ $t('cloudpivot.flow.pc.approval.content.assistCancel') }}
      </div>
    </template>
    <!--审批人已处理，被加签人任务取消-->
    <!--普通取消-->

    <template v-if="contentData.from">
      <ApprovalForward
        :action="getWorkflowActionStatus(contentData.from.fromType)"
        :person="[contentData.from.userInfo && contentData.from.userInfo.name]"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApprovalForward from '../components/approval-forward.vue';
import WorkitemMixin from './workitem-mixin';
import { mixins } from 'vue-class-component';
import { workflowEnum } from 'cloudpivot-flow/flow';

@Component({
  name: 'workitem-canceled',
  components: {
    ApprovalForward,
  },
})
export default class WorkItemCanceled extends mixins(WorkitemMixin) {
  get ApprovalCancelType() {
    return workflowEnum.ApprovalCancelType;
  }
}
</script>

<style lang="less" scoped></style>
