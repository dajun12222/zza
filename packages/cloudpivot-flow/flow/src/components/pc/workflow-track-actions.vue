<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <!-- 流程跟踪按钮新增流程运维-2021-12-10 -->
 
  <div class="options">
    <a-button v-if="headerAction.showEditable" @click="edit">
      {{ $t('cloudpivot.flow.pc.Edit') }}
    </a-button>

    <!-- 流程运维 -->
    <template
      v-if="
        headerAction.showEditable ||
        headerAction.showAdjust ||
        headerAction.showCancel ||
        headerAction.showRemove ||
        headerAction.showEditOwner
      "
    >
      <a-button type="primary" @click="processOperationAndMaintenanceHandle">
        {{ $t('cloudpivot.flow.pc.ProcessOperationAndMaintenance') }}
      </a-button>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Button } from '@h3/antd-vue';
import { workflowApi, workflow, listApi } from 'cloudpivot/api';

@Component({
  name: 'workflow-track-actions',
  components: {
    AButton: Button,
  },
})
export default class WorkflowTrackActions extends Vue {
  @Prop({ default: () => {} }) headerAction!: workflow.HeaderAction; // 头部按键权限

  processOperationAndMaintenanceHandle() {
    this.$emit('processOperationAndMaintenanceHandle');
  }

  /**
   * 编辑事件
   */
  edit() {
    this.$emit('edit');
  }
}
</script>
<style lang="less">
@import '~cloudpivot/common/common';
.options {
  flex: 1 1;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  .edit {
    background: #ffffff;
    color: rgba(0, 0, 0, 0.6);
    border-color: #d9d9d9;
    line-height: 1.499;
    font-weight: 400;
    &:hover {
      color: rgba(0, 0, 0);
    }
  }
  button {
    margin-left: @base4-padding-xs;
  }
}
</style>
