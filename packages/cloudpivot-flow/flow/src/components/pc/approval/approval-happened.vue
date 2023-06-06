<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-happened">
    <div
      v-for="(approval, i) in approvalsData"
      :key="i"
      class="approval-activity"
    >
      <a-collapse :activeKey="'activeKey'" :bordered="false">
        <a-collapse-panel
          key="activeKey"
          :showArrow="false"
          class="activity-collapse"
        >
          <template v-slot:header="props">
            <span>{{
              isChinese
                ? approval.activityName
                : approval.name_i18n[$i18n.locale]
            }}</span>
            <span
              :class="[
                'icon',
                'aufontAll',
                props.isActive ? 'h-icon-all-up' : 'h-icon-all-down',
              ]"
            ></span>
          </template>
          <template v-for="(node, index) in approval.nodes">
            <div :key="index" class="approval-item">
              <approval-item-title
                v-if="showTitle(node)"
                :approval="approval"
                :titleData="node"
              />
              <approval-item-content :approval="approval" :contentData="node" />
            </div>
          </template>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApprovalItemTitle from './approval-item-title.vue';
import ApprovalItemContent from './approval-content/index.vue';
import { Collapse } from '@h3/antd-vue';
import { workflowEnum } from 'cloudpivot-flow/flow';

@Component({
  name: 'approval-happened',
  components: {
    ApprovalItemTitle,
    ApprovalItemContent,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
  },
})
export default class ApprovalHappened extends Vue {
  @Prop() approvalsData!: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  get admin() {
    return this.$store && this.$store.state.System.System.admin; // 引入系统store的字段
  }

  //是否子管理员
  get isAppAdmin() {
    return this.$store && this.$store.state.System.System.isAppAdmin; // 引入系统store的字段
  }

  get rootAdmin() {
    return this.$store && this.$store.state.System.System.isRootAdmin;
  }

  showTitle(node) {
    if (
      !(node.approvaler && node.approvaler.id) &&
      node.displayStatus !== workflowEnum.WorkItemStatus.AGREED
    ) {
      return false;
    }

    return true;
  }
}
</script>
<style lang="less" scoped>
.approval-activity:last-child {
  /deep/.approval-line {
    height: 0;
  }
}
/deep/.ant-collapse-borderless {
  background: none;
  .ant-collapse-item {
    border-bottom: none;
    margin-bottom: 32px;
    .ant-collapse-header {
      padding: 0 !important;
      font-size: 13px;
      font-weight: bold;
      color: rgba(17, 18, 24, 0.5);
      line-height: 22px;
      .icon {
        font-size: 13px;
        margin-left: 9px;
        font-weight: normal;
      }
    }
    .ant-collapse-content {
      overflow: unset;
    }
    .ant-collapse-content-box {
      padding: 12px 0 0 0 !important;

      .approval-item:not(:last-child) {
        margin-bottom: 32px;
      }
    }
  }
}
</style>
