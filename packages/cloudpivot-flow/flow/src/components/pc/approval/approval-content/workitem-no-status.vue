<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-no-status">
    <!--协办人协办给某某某提交-->
    <!--加签给某某某提交-->
    <template
      v-if="
        [WorkActionType.ASSIST, WorkActionType.ADJUSTPARTICIPATORS].includes(
          contentData.workActionType,
        )
      "
    >
      <ApprovalForward
        :action="getWorkflowActionStatus(contentData.workActionType)"
        :person="toUsers"
        :type="'to'"
      />
      <ApprovalCommnet
        v-if="contentData.bizComment && contentData.bizComment.content"
        :commentRemark="
          $t('cloudpivot.flow.pc.approval.content.customOpinion', {
            custom: getWorkflowActionStatus(contentData.workActionType),
          })
        "
        :commnetText="contentData.bizComment.content"
      />
    </template>

    <!--传阅提交-->
    <template
      v-else-if="contentData.workActionType === WorkActionType.CIRCULATE"
    >
      <div class="circulate-approve-item">
        <span class="left">{{ getWorkflowActionStatus(contentData.workActionType)
          }}<span class="num">{{ circulateNum }}</span>{{ $t('cloudpivot.flow.pc.approval.content.person') }}</span>
        <CirculatePopover :node="contentData" />
      </div>
    </template>

    <!--撤回操作-->
    <template v-else-if="contentData.workActionType === WorkActionType.REVOKE">
      <div class="default-text">
        {{ $t('cloudpivot.flow.pc.approval.content.revoke') }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import CirculatePopover from '../components/circulatePopover.vue';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApprovalCommnet from '../components/approval-comment.vue';
import ApprovalForward from '../components/approval-forward.vue';
import WorkitemMixin from './workitem-mixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'workitem-no-status',
  components: {
    ApprovalCommnet,
    ApprovalForward,
    CirculatePopover,
  },
})
export default class WorkitemNoStatus extends mixins(WorkitemMixin) {
  get circulateNum() {
    return (
      (this.contentData.circulations && this.contentData.circulations.length) ||
      ''
    );
  }

  /**
   * 传阅操作
   */
  get isCirculate() {
    return (
      this.contentData.circulations && this.contentData.circulations.length > 0
    );
  }
}
</script>

<style lang="less" scoped>
.workitem-no-status {
  .circulate-approve-item {
    .left {
      font-size: 13px;
      color: #707481;
      line-height: 22px;
      padding-right: 26px;
    }
    .right {
      font-size: 13px;
      color: #2970ff;
      line-height: 22px;
    }
    .num {
      padding: 0 2px;
    }
  }
}
</style>
