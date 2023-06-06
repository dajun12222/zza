<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workitem-sub-workflow">
    <span
      v-if="!mockMode"
      class="approval__link"
      @click="goToFrom(contentData.workflowInstanceId, contentData.workItemId)"
    >
      <span>{{ $t('cloudpivot.flow.pc.ViewDetails') }}</span>
      <span class="icon aufontAll h-icon-all-right"></span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import WorkitemMixin from './workitem-mixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'workitem-sub-workflow',
  components: {},
})
export default class WorkitemSubWorkflow extends mixins(WorkitemMixin) {
  @Prop()
  mockMode!: boolean;

  /**
   * 跳转到表单
   */
  goToFrom(workflowInstanceId: string, workItemId: string) {
    this.$router
      .push({
        name: 'form-detail',
        query: {
          workflowInstanceId,
          workitemId: workItemId,
          isWorkFlow: 'true',
        },
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
</script>

<style lang="less" scoped>
.workitem-sub-workflow {
  .approval__link {
    font-size: 13px;
    color: #2970ff;
    line-height: 22px;
    cursor: pointer;
    .icon {
      font-size: 12px;
      padding-left: 5px;
    }
  }
}
</style>
