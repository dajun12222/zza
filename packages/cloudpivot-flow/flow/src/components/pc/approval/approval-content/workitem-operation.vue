<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-operation">
    <!--结束流程-->
    <div
      v-if="contentData.workActionType === WorkActionType.FINISHED"
      class="default-text"
    >
      {{ $t('cloudpivot.flow.pc.approval.content.finishWorkflow') }}
    </div>
    <!--作废流程-->
    <div
      v-else-if="contentData.workActionType === WorkActionType.CANCELLED"
      class="default-text"
    >
      {{ $t('cloudpivot.flow.pc.approval.content.cancelWorkflow') }}
    </div>
    <!--激活其他节点-->
    <div
      v-else-if="
        contentData.workActionType === WorkActionType.ACTIVATE_ACTIVITY
      "
      class="default-text"
    >
      {{ $t('cloudpivot.flow.pc.approval.content.activateActivity') }}
      <span>{{ otherNode }}</span>
    </div>
    <!--调整处理人-->
    <template
      v-else-if="
        contentData.workActionType === WorkActionType.ADJUST_PARTICIPANT
      "
    >
      <div class="default-text">
        <ApprovalUserInfo
          :users="
            contentData.bizComment && contentData.bizComment.sourceUserInfos
          "
          :leftText="$t('cloudpivot.flow.pc.approval.content.modifyBefore')"
        />
        <ApprovalUserInfo
          :users="contentData.bizComment && contentData.bizComment.userInfos"
          :leftText="$t('cloudpivot.flow.pc.approval.content.modifyAfter')"
        />
      </div>
    </template>
    <!--取消当前节点所有任务-->
    <div
      v-else-if="
        contentData.workActionType === WorkActionType.CANCELED_ACTIVITY_WORKITEM
      "
      class="default-text"
    >
      {{ $t('cloudpivot.flow.pc.approval.content.cancelActivityWorkitem') }}
    </div>
    <!--修改拥有者-->
    <template
      v-else-if="contentData.workActionType === WorkActionType.MODIFY_OWNER"
    >
      <div class="default-text">
        <div class="default-text">
          {{ $t('cloudpivot.flow.pc.approval.content.modifyOwner') }}
        </div>
        <div>
          <span>{{ $t('cloudpivot.flow.pc.approval.content.newOwner') }}</span><span class="black-text">{{ toUsers.join('、') }}</span>
        </div>
        <div>
          <span>{{
            $t('cloudpivot.flow.pc.approval.content.newOwnerDept')
          }}</span><span class="black-text">{{ newOwnerDept }}</span>
        </div>
      </div>
    </template>

    <ApprovalCommnet
      v-if="contentData.bizComment && contentData.bizComment.content"
      :commentRemark="$t('cloudpivot.flow.pc.approval.content.solveOpinion')"
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
import ApprovalForward from '../components/approval-forward.vue';
import ApprovalAttachment from '../components/approval-attachment.vue';
import ApprovalCommnet from '../components/approval-comment.vue';
import ApprovalSignature from '../components/approval-signature.vue';
import WorkitemMixin from './workitem-mixin';
import ApprovalUserInfo from '../components/approval-user-info.vue';
import { mixins } from 'vue-class-component';

@Component({
  name: 'workitem-operation',
  components: {
    ApprovalForward,
    ApprovalAttachment,
    ApprovalCommnet,
    ApprovalSignature,
    ApprovalUserInfo,
  },
})
export default class WorkItemOperation extends mixins(WorkitemMixin) {
  /**
   * 其他节点
   */
  get otherNode() {
    return (
      (this.contentData.bizComment &&
        this.contentData.bizComment.activityName) ||
      ''
    );
  }

  /**
   * 调整前处理人
   */
  get beforeResolver() {
    return (
      (this.contentData.approvaler && this.contentData.approvaler.name) || ''
    );
  }

  /**
   * 新拥有者部门
   */
  get newOwnerDept() {
    return (
      (this.contentData.bizComment &&
        this.contentData.bizComment.userInfos &&
        this.contentData.bizComment.userInfos[0] &&
        this.contentData.bizComment.userInfos[0].departmentName) ||
      ''
    );
  }
}
</script>

<style lang="less" scoped>
.workitem-operation {
  /deep/.approval-users-wrapper {
    .user-wrapper-outter {
      height: 22px;
    }
  }
}
</style>
