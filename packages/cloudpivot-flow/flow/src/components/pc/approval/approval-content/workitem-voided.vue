<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-voided">
    <!--手动作废-->
    <template
      v-if="contentData.endRemark === ApprovalVoidedType.OPERATE_VOIDED"
    >
      <div class="default-text middle-margin">
        {{ getWorkflowActionStatus(contentData.workActionType) }}
      </div>
    </template>
    <!--无内容作废-->
    <!--超时作废-->
    <template
      v-else-if="contentData.endRemark === ApprovalVoidedType.TIMEOUT_VOIDED"
    >
      <div class="default-text">
        {{ getWorkflowActionStatus(contentData.workActionType) }}
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
import WorkitemMixin from './workitem-mixin';
import ApprovalForward from '../components/approval-forward.vue';
import { mixins } from 'vue-class-component';
import { workflowEnum } from 'cloudpivot-flow/flow';

@Component({
  name: 'workitem-voided',
  components: {
    ApprovalForward,
  },
})
export default class WorkItemVoided extends mixins(WorkitemMixin) {
  get ApprovalVoidedType() {
    return workflowEnum.ApprovalVoidedType;
  }
}
</script>

<style lang="less" scoped></style>
