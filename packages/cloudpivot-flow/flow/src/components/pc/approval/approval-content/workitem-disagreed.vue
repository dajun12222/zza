<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-disagreed">
    <!--驳回到发起人-->
    <template v-if="contentData.workActionType === WorkActionType.REJECT">
      <div class="default-text middle-margin">
        {{
          $t('cloudpivot.flow.pc.approval.content.rejectTo', {
            btnName: getWorkflowActionStatus(contentData.workActionType),
            nextActivityName: contentData.nextActivityName,
          })
        }}
      </div>
    </template>
    <!--正常驳回，不同意-->
    <template
      v-else-if="contentData.workActionType === WorkActionType.DISAGREE"
    >
      <div class="default-text reject-to">
        {{ $t('cloudpivot.flow.pc.approval.content.disagree') }}
      </div>
    </template>

    <template v-if="contentData.from">
      <ApprovalForward
        :action="getWorkflowActionStatus(contentData.from.fromType)"
        :person="[contentData.from.userInfo && contentData.from.userInfo.name]"
      />
    </template>

    <ApprovalCommnet
      v-if="contentData.bizComment && contentData.bizComment.content"
      :commentRemark="$t('cloudpivot.flow.pc.approval.content.approveOpinion')"
      :commnetText="contentData.bizComment.content"
    />
    <template v-for="(file, index) in contentData.resources || []">
      <ApprovalAttachment
        v-if="file && file.file && file.file.name !== 'signsture.png'"
        :key="index"
        :file="file && file.file"
      />
      <ApprovalSignature v-else :key="index" :file="file" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApprovalAttachment from '../components/approval-attachment.vue';
import ApprovalCommnet from '../components/approval-comment.vue';
import ApprovalSignature from '../components/approval-signature.vue';
import WorkitemMixin from './workitem-mixin';
import { mixins } from 'vue-class-component';
import ApprovalForward from '../components/approval-forward.vue';

@Component({
  name: 'workitem-disagreed',
  components: {
    ApprovalAttachment,
    ApprovalCommnet,
    ApprovalSignature,
    ApprovalForward,
  },
})
export default class WorkItemDisagreed extends mixins(WorkitemMixin) {}
</script>

<style lang="less" scoped>
.workitem-disagreed {
}
</style>
