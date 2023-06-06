<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-aborted">
    <!--手动结束流程-->
    <template
      v-if="contentData.endRemark === ApprovalAbortedType.END_INSTANCE_ABORTED"
    >
      <div class="default-text">
        {{ getWorkflowActionStatus(contentData.workActionType) }}
      </div>
    </template>
    <!--正常结束-->
    <!--超时中止-->
    <template
      v-else-if="contentData.endRemark === ApprovalAbortedType.TIMEOUT_ABORTED"
    >
      <div class="default-text">
        {{ $t('cloudpivot.flow.pc.approval.content.timoutAbortWorkflow') }}
      </div>
    </template>

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
import { workflowEnum } from 'cloudpivot-flow/flow';
import WorkitemMixin from './workitem-mixin';
import { mixins } from 'vue-class-component';
import ApprovalForward from '../components/approval-forward.vue';
@Component({
  name: 'workitem-aborted',
  components: {
    ApprovalForward,
  },
})
export default class WorkItemAborted extends mixins(WorkitemMixin) {
  get ApprovalAbortedType() {
    return workflowEnum.ApprovalAbortedType;
  }
}
</script>

<style lang="less" scoped>
.workitem-aborted {
}
</style>
