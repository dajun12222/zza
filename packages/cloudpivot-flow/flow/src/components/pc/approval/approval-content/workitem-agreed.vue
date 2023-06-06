<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-agreed">
    <!--超时通过-->
    <template v-if="contentData.endRemark === ApprovalPassType.TIMEOUT_PASS">
      <div class="timeout-pass">
        {{ $t('cloudpivot.flow.pc.approval.content.timeoutPass') }}
      </div>
    </template>
    <!--发起人自动通过-->
    <template
      v-else-if="
        contentData.endRemark === ApprovalPassType.ORIGINATOR_AUTO_PASS
      "
    >
      <div class="default-text">
        {{
          $t('cloudpivot.flow.pc.approval.content.originatorAutoPass', {
            who: contentData.approvaler.name,
          })
        }}
      </div>
    </template>
    <!--周倩处理过前一活动，当前任务自动通过-->
    <template
      v-else-if="
        contentData.endRemark ===
        ApprovalPassType.PREVIOUS_PARTICIPATE_AUTO_PASS
      "
    >
      <div class="default-text">
        {{
          $t(
            'cloudpivot.flow.pc.approval.content.previousParticipantAutoPass',
            {
              who: contentData.approvaler.name,
            },
          )
        }}
      </div>
    </template>
    <!--周倩处理过流程，当前任务自动通过-->
    <template
      v-else-if="
        contentData.endRemark === ApprovalPassType.PARTICIPATED_AUTO_PASS
      "
    >
      <div class="default-text">
        {{
          $t('cloudpivot.flow.pc.approval.content.participantedAutoPass', {
            who: contentData.approvaler.name,
          })
        }}
      </div>
    </template>
    <template
      v-else-if="contentData.endRemark === ApprovalPassType.LATER_PARTICIPATE"
    >
      <div class="default-text">
        {{
          $t('cloudpivot.flow.pc.approval.content.hasNodeAfter', {
            who: contentData.approvaler.name,
          })
        }}
      </div>
    </template>
    <!--正常同意-->
    <template v-else>
      <template v-if="contentData.from">
        <ApprovalForward
          :action="getWorkflowActionStatus(contentData.from.fromType)"
          :person="[
            contentData.from.userInfo && contentData.from.userInfo.name,
          ]"
        />
      </template>

      <ApprovalCommnet
        v-if="contentData.bizComment && contentData.bizComment.content"
        :commentRemark="
          $t('cloudpivot.flow.pc.approval.content.approveOpinion')
        "
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
import { workflowEnum } from 'cloudpivot-flow/flow';
import ApprovalForward from '../components/approval-forward.vue';

@Component({
  name: 'workitem-agreed',
  components: {
    ApprovalAttachment,
    ApprovalCommnet,
    ApprovalSignature,
    ApprovalForward,
  },
})
export default class WorkItemAgreed extends mixins(WorkitemMixin) {
  get ApprovalPassType() {
    return workflowEnum.ApprovalPassType;
  }
}
</script>

<style lang="less" scoped>
.workitem-agreed {
  .timeout-pass {
    font-size: 13px;
    color: #f0353f;
    line-height: 22px;
  }
}
</style>
