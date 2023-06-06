<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-transferred">
    <!--转办给-->
    <template>
      <ApprovalForward
        :action="getWorkflowActionStatus(contentData.workActionType)"
        :person="toUsers"
        :type="'to'"
      />
      <template v-if="contentData.from">
        <ApprovalForward
          :action="getWorkflowActionStatus(contentData.from.fromType)"
          :person="[
            contentData.from.userInfo && contentData.from.userInfo.name,
          ]"
        />
      </template>
      <ApprovalCommnet
        :commentRemark="
          $t('cloudpivot.flow.pc.approval.content.customOpinion', {
            custom: getWorkflowActionStatus(contentData.workActionType),
          })
        "
        :commnetText="contentData.bizComment.content"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApprovalCommnet from '../components/approval-comment.vue';
import ApprovalForward from '../components/approval-forward.vue';
import WorkitemMixin from './workitem-mixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'workitem-transferred',
  components: {
    ApprovalCommnet,
    ApprovalForward,
  },
})
export default class WorkItemTransferred extends mixins(WorkitemMixin) {}
</script>

<style lang="less" scoped></style>
