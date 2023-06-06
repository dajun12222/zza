<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-approval">
    <ApprovalNotHappen
      v-if="showUnHappened"
      :workflowInstanceId="workflowInstanceId"
      :lastActivityCode="lastActivityCode"
    />
    <ApprovalHappened :approvalsData="approvalsData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import common from 'cloudpivot/common';

import { workflow, workflowApi, user } from 'cloudpivot/api';

import ApprovalHappened from './approval-happened.vue';

import ApprovalNotHappen from './approval-not-happen.vue';

import { utils } from 'cloudpivot/common';

import { workflowEnum } from 'cloudpivot-flow/flow';

@Component({
  name: 'form-approval',
  components: {
    ApprovalHappened,
    ApprovalNotHappen,
  },
})
export default class FormApproval extends Vue {
  approvals: workflow.ApprovalInstance[] = []; // 流程实例

  @Prop({
    default: '',
  })
  workflowInstanceId!: string;

  @Prop()
  workflowBaseInfo!: any;

  @Prop()
  getFileUrlFn!: (file: any) => string;

  @Watch('approvals')
  onApprovalsChange(arr: any[]) {
    const res: any = {};
    arr.forEach((el) => {
      if (el.nodes) {
        el.nodes.forEach((el) => {
          if (!res[el['approvaler']['id']]) {
            res[el['approvaler']['id']] = el['approvaler'];
          }
        });
      }
    });

    this.$emit('setApprovals', Object.values(res));
  }

  @Watch('workflowInstanceId', {
    immediate: true,
  })
  onWorkflowInstanceIdChange(id: string) {
    if (id) {
      workflowApi
        .getApproval({
          workflowInstanceId: id,
        })
        .then((res) => {
          if (res.errcode === 0) {
            if (Array.isArray(res.data)) {
              res.data.forEach((d: any) => {
                common.utils.compatible(d, 'activityName');
              });
            }
            this.approvals = res.data || [];
          } else {
            this.approvals = [];
          }
        });
    } else {
      this.approvals = [];
    }
  }

  get approvalsData() {
    const approvals = Object.assign([], this.approvals);
    approvals.forEach((item: workflow.ApprovalInstance) => {
      if (!item.subInstanceActivity) {
        if (item.nodes && item.nodes.length) {
          item.nodes = item.nodes
            .map((node: any) => {
              if (node.resources && node.resources.length) {
                node.resources = node.resources.map((signatrue: any) => {
                  const s: any = {
                    img: '',
                    file: signatrue,
                    hover: false,
                  };
                  if (this.getFileUrlFn && signatrue.name === 'signsture.png') {
                    s.img = this.getFileUrlFn(signatrue);
                  }
                  return s;
                });
              }

              // 过滤 1 未启动 和 2 进行中的节点, 进行数据重组
              if (node.workItemStatus === 1 || node.workItemStatus === 2) {
                node.approvaler.trustor = node.trustor;
                node.approvaler.circulations = node.circulations;
                node.approvaler.from = node.from;
                node.approvaler.bizComment = node.bizComment;
                node.approvaler.workActionType = node.workActionType;
              }
              // 如果是加签，协办，传阅操作，任务类型置为空
              if ([5, 6, 16].includes(node.workActionType)) {
                node.displayStatus = '';
              }
              return node;
            })
            .filter(Boolean);
        }
      }
    });
    return approvals.reverse();
  }

  get lastActivityCode() {
    if (!this.approvalsData || this.approvalsData.length === 0) {
      return '';
    } else {
      return this.approvalsData[0].activityCode;
    }
  }

  get showUnHappened() {
    if (!this.workflowBaseInfo.status) {
      return false;
    }
    return (
      this.workflowBaseInfo.status === workflowEnum.WorkflowState.PROCESSING
    );
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
@import '../../style';
</style>
