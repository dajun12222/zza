<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-submitted">
    <!--被协办人，被转办人提交-->
    <template v-if="contentData.from">
      <ApprovalForward
        :action="getWorkflowActionStatus(contentData.from.fromType)"
        :person="[contentData.from.userInfo && contentData.from.userInfo.name]"
      />
      <ApprovalCommnet
        :commentRemark="
          $t('cloudpivot.flow.pc.approval.content.approveOpinion')
        "
        :commnetText="contentData.bizComment.content"
      />
    </template>

    <!--普通提交-->
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
  name: 'workitem-submitted',
  components: {
    ApprovalCommnet,
    ApprovalForward,
    CirculatePopover,
  },
})
export default class WorkItemSubmitted extends mixins(WorkitemMixin) {}
</script>

<style lang="less" scoped>
.workitem-submitted {
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
