<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-not-happened">
    <div v-if="hasMore" class="loading-predict">
      <img src="./assets/scroll.png" alt="" />
      <span>{{ $t('cloudpivot.flow.pc.approval.scrollUpToLoadMore') }}</span>
    </div>
    <WorkflowPredictTree
      :treeData="workflowEstimateTree"
      @changeParallelNode="changeParallelNode"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { utils } from 'cloudpivot/common';
import ApprovalItemTitle from './approval-item-title.vue';
import { Popover } from '@h3/antd-vue';
import { workflowApi, workflow } from 'cloudpivot/api';
import WorkflowPredictTree from './workflowPredictTree.vue';

@Component({
  name: 'approval-not-happened',
  components: {
    ApprovalItemTitle,
    APopover: Popover,
    WorkflowPredictTree,
  },
})
export default class ApprovalNotHappened extends Vue {
  @Prop()
  workflowInstanceId!: string;

  @Prop()
  lastActivityCode!: string;

  //流程预估 树形数据
  workflowEstimateTree: any = {};

  //正在调用接口中
  isLoading: boolean = false;

  @Watch('lastActivityCode', { immediate: true })
  onActivityCodeChange(code) {
    if (code) {
      const params: workflow.WorkflowPredictParam = {
        instanceId: this.workflowInstanceId,
        activityCode: this.lastActivityCode,
        level: 2,
        buildCurrentActivityParticipant: false,
      };
      this.isLoading = true;
      workflowApi.workflowPredict(params).then((res: any) => {
        if (res.errcode === 0) {
          this.workflowEstimateTree = utils.Tree.TreeNode.initTreeNode(
            res.data,
            this.generateTreeData,
            'activityCode',
            'childActivityList',
          );
          this.changeFirstChildSelected(this.workflowEstimateTree, true);
        } else {
          this.$message.error(res.errmsg);
        }
        this.isLoading = false;
      });
    }
  }

  mounted() {
    const tabpaneDom = document.querySelector(
      '.tabpane.approval-tabpane.ant-tabs-tabpane',
    );
    tabpaneDom.addEventListener('mousewheel', this.onScroll);
  }

  async onScroll(evt) {
    const up = evt.wheelDelta ? evt.wheelDelta > 0 : evt.detail < 0;
    const tabpaneDom = document.querySelector(
      '.tabpane.approval-tabpane.ant-tabs-tabpane',
    );
    if (up && tabpaneDom.scrollTop === 0) {
      //获取需要调接口获取参与者数据的节点
      if (!this.lastLevelSelectedNode) {
        return;
      }
      if (
        !this.lastLevelSelectedNode.getData().participants &&
        !this.isLoading
      ) {
        this.isLoading = true;
        await this.refreshTreeNode(this.lastLevelSelectedNode, 10);
        this.lastLevelSelectedNode.refreshData(
          Object.assign(this.lastLevelSelectedNode.getData(), {
            isSelected: true,
          }),
        );
        this.changeFirstChildSelected(this.lastLevelSelectedNode, true);
        this.isLoading = false;
      }
    }
  }

  generateTreeData(res) {
    return {
      activityName: res.activityName,
      activityCode: res.activityCode,
      participants: res.participants,
      isSelected: false,
      approvaler: (res.participants && res.participants[0]) || {},
    };
  }

  changeFirstChildSelected(node: any, value: boolean) {
    let curChildren = node && node.children;
    while (curChildren && curChildren.length > 0) {
      //所有子节点的选中状态都重置为false
      curChildren.forEach((item) => {
        item.refreshData(Object.assign(item.getData(), { isSelected: false }));
      });
      curChildren[0].refreshData(
        Object.assign(curChildren[0].getData(), { isSelected: value }),
      );
      curChildren = curChildren[0].children;
    }
  }

  /**
   * 切换至并行节点
   * 切换节点时调用接口采取只更新需要更新节点的原则
   */
  async changeParallelNode(parentNode, childNode) {
    let curLevel = 10;
    let curChildNode = childNode;
    let curParentNode = parentNode;
    while (
      curChildNode.children &&
      curChildNode.children[0] &&
      curChildNode.children[0].getData().participants
    ) {
      curLevel--;
      curParentNode = curChildNode;
      curChildNode = curChildNode.children[0];
    }
    await this.refreshTreeNode(curChildNode, curLevel);
    this.changeFirstChildSelected(parentNode, false);
    childNode.refreshData(
      Object.assign(childNode.getData(), { isSelected: true }),
    );
    this.changeFirstChildSelected(childNode, true);
  }

  /**
   * 对某个节点调用接口
   * 动态刷新树内的数据
   */
  async refreshTreeNode(targetNode, level) {
    if (level > 0) {
      const params: workflow.WorkflowPredictParam = {
        instanceId: this.workflowInstanceId,
        activityCode: targetNode.getData().activityCode,
        level: level,
        buildCurrentActivityParticipant: true,
      };
      const res: any = await workflowApi.workflowPredict(params);
      if (res.errcode === 0) {
        const temp = utils.Tree.TreeNode.initTreeNode(
          res.data,
          this.generateTreeData,
          'activityCode',
          'childActivityList',
        );
        targetNode.refreshData(temp.getData());
        targetNode.setChildren(temp.getChildren());
      } else {
        this.$message.error(res.errmsg);
      }
    }
  }

  get hasMore() {
    if (
      !this.workflowEstimateTree ||
      !this.workflowEstimateTree.getChildren ||
      this.workflowEstimateTree.getChildren().length === 0
    ) {
      return false;
    }

    if (!this.lastLevelSelectedNode) {
      return false;
    }

    return !this.lastLevelSelectedNode.getData().participants;
  }

  /**
   * 获取最后一个选中的节点
   * 没有展示出来
   * 因为没有参与者
   */
  get lastLevelSelectedNode() {
    if (!this.workflowEstimateTree || !this.workflowEstimateTree.getChildren) {
      return false;
    }
    let targetNode = this.workflowEstimateTree;
    let selectedNode = targetNode
      .getChildren()
      .find((item) => item.getData().isSelected);
    while (selectedNode) {
      targetNode = selectedNode;
      selectedNode = targetNode
        .getChildren()
        .find((item) => item.getData().isSelected);
    }
    return targetNode;
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
@import '../../style';
.approval-not-happened {
  .loading-predict {
    height: 22px;
    font-size: 14px;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      padding-right: 6px;
    }
  }
  .estimate-class {
    padding-bottom: 32px;
    position: relative;
    .node-name {
      font-size: 13px;
      font-weight: 500;
      color: rgba(17, 18, 24, 0.5);
      line-height: 22px;
      padding-bottom: 12px;
      .icon {
        font-size: 12px;
        color: #2970ff;
        padding-left: 8px;
      }
    }
    .approval-line {
      position: absolute;
      height: 20px;
      left: 20px;
      bottom: 6px;
      border-left: 1.5px dashed #e4e7ec;
    }
  }
}
</style>

<style lang="less">
.node-switch-popover {
  .ant-popover-inner {
    background-color: transparent;
    box-shadow: none;
  }
  .ant-popover-inner-content {
    padding: 4px 0;
    width: 112px;
    background: #fff;
    .node-content {
      margin-top: 0px;
      padding: 4px 0 4px 12px;
      &:hover {
        background: rgba(0, 30, 116, 0.06);
      }
    }
  }

  .ant-popover-arrow {
    display: none;
  }
}
</style>
