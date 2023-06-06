<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workflow-predict-tree">
    <template v-for="child in treeData.children">
      <template
        v-if="child.getData().isSelected && child.getData().participants"
      >
        <div :key="child.getData().activityCode" class="tree-wrapper">
          <workflow-predict-tree
            :treeData="child"
            @changeParallelNode="changeParallelNode"
          />
          <div class="estimate-class">
            <div class="node-name">
              <span class="node-name-text">{{
                child.getData().activityName
              }}</span>
              <a-popover
                v-if="treeData.children.length > 1"
                overlayClassName="node-switch-popover"
                trigger="click"
                :placement="'bottom'"
              >
                <span class="icon aufontAll h-icon-all-retweet-o"></span>
                <template slot="content">
                  <template v-for="(item, seq) in treeData.children">
                    <div
                      v-if="!item.getData().isSelected"
                      :key="seq"
                      class="node-content"
                      @click="changeParallelNode(treeData, item)"
                    >
                      {{ item.getData().activityName }}
                    </div>
                  </template>
                </template>
              </a-popover>
            </div>
            <ApprovalItemTitle
              :titleData="child.getData()"
              :approval="{}"
              :isEstimate="true"
            />
            <div class="approval-line"></div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { utils } from 'cloudpivot/common';
import ApprovalItemTitle from './approval-item-title.vue';
import { Popover } from '@h3/antd-vue';

@Component({
  name: 'workflow-predict-tree',
  components: {
    ApprovalItemTitle,
    APopover: Popover,
  },
})
export default class WorkflowPredictTree extends Vue {
  //流程预估 树形数据
  @Prop()
  treeData!: any;

  changeParallelNode(parent, child) {
    this.$emit('changeParallelNode', parent, child);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
@import '../../style';
.workflow-predict-tree {
  .estimate-class {
    padding-bottom: 32px;
    position: relative;
    .node-name {
      font-size: 13px;
      font-weight: 500;
      color: rgba(17, 18, 24, 0.5);
      line-height: 22px;
      padding-bottom: 12px;
      &-text {
        opacity: 0.5;
      }
      .icon {
        font-size: 12px;
        color: #2970ff;
        padding-left: 8px;
        opacity: 1;
      }
    }
    /deep/.approval-item-title {
      height: unset;
      line-height: unset;
      align-items: flex-start;
      .title-right {
        line-height: 22px;
        padding-top: 9px;
      }
    }
    .approval-line {
      position: absolute;
      height: calc(100% - 86px);
      left: 20px;
      bottom: 6px;
      border-left: 1.5px dashed #e4e7ec;
    }
    /deep/.approval-item-title {
      .title-left {
        opacity: 0.5;
      }
      .title-right {
        .estimateResolvers {
          opacity: 0.5;
        }
      }
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
