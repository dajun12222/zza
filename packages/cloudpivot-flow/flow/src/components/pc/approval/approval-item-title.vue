<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-item-title">
    <template v-if="approval.isCirculate">
      <CirculateTitle :approval="approval" :contentData="titleData" />
    </template>
    <template v-else-if="titleData.approvaler && titleData.approvaler.id">
      <div class="title-left">
        <AuthorAvatarInfo
          :item="{
            sourceId: titleData.approvaler.id,
            imgUrl: titleData.approvaler.imgUrl,
            sourceName: titleData.approvaler.name,
            onlyImg: true,
            trigger: 'hover',
          }"
          style="overflow: hidden"
        />
      </div>

      <div class="title-right">
        <template v-if="!isEstimate">
          <div class="middle-content">
            <span class="approvaler-name">{{ titleData.approvaler.name }}</span>
            <template v-if="!isWorkflowOperation">
              <StatusDisplay
                v-if="approval.subInstanceActivity"
                :value="titleData.subInstanceStatus"
                :statusConfig="workflowStatusConfig"
              />
              <StatusDisplay
                v-if="!isWorkflowOperation"
                :value="titleData.displayStatus"
                :statusConfig="workitemStatusConfig"
              />
            </template>

            <div v-else class="workflow-operate-tag">
              <span class="icon aufontAll h-icon-all-wrench"></span>
              <span class="operate">{{
                $t('cloudpivot.flow.pc.approval.title.operation')
              }}</span>
            </div>
          </div>

          <div class="resolveTime">
            {{ approvalTime }}
          </div>
        </template>
        <template v-else>
          <ApprovalUserInfo
            :users="titleData.participants"
            :noUserText="$t('cloudpivot.flow.pc.approval.title.noParticipant')"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div class="title-left">
        <span class="icon aufontAll h-icon-all-flow-pass"></span>
      </div>
      <div class="title-right">
        <div class="middle-content no-participant">
          {{ $t('cloudpivot.flow.pc.approval.title.noParticipantAutoPass') }}
        </div>
        <div class="resolveTime">
          {{ titleData.approvalTime }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import AuthorAvatarInfo from 'cloudpivot/common/src/components/pc/author-avatar-info/author-avatar-info.vue';
import {
  getWorkitemStatusConfig,
  getWorkflowStatusConfig,
} from 'cloudpivot-flow/flow-center/src/components/pc/typings/workflow-list-config';
import common from 'cloudpivot/common/pc';
import { Popover } from '@h3/antd-vue';
import UserPopover from 'cloudpivot/common/src/components/pc/user/user-popover.vue';
import CirculateTitle from './components/circulate-title.vue';
import { workflowEnum } from 'cloudpivot-flow/flow';
import ApprovalUserInfo from './components/approval-user-info.vue';

@Component({
  name: 'approval-item-title',
  components: {
    AuthorAvatarInfo,
    StatusDisplay: common.components.StatusDisplay,
    APopover: Popover,
    UserPopover,
    CirculateTitle,
    ApprovalUserInfo,
  },
})
export default class ApprovalItemTitle extends Vue {
  @Prop()
  titleData!: any;

  @Prop()
  approval!: any;

  @Prop({ default: false })
  isEstimate!: any;

  workflowStatusConfig: any = null;

  workitemStatusConfig: any = null;

  mounted() {}

  @Watch('$i18n.locale', { immediate: true })
  onLanguageChange() {
    this.workitemStatusConfig = getWorkitemStatusConfig(this);
    this.workflowStatusConfig = getWorkflowStatusConfig(this);
  }

  /**
   * 判断是流程运维操作
   */
  get isWorkflowOperation() {
    return (
      [
        workflowEnum.WorkActionType.CANCELLED,
        workflowEnum.WorkActionType.FINISHED,
        workflowEnum.WorkActionType.MODIFY_OWNER,
        workflowEnum.WorkActionType.ACTIVATE_ACTIVITY,
        workflowEnum.WorkActionType.ADJUST_PARTICIPANT,
        workflowEnum.WorkActionType.CANCELED_ACTIVITY_WORKITEM,
      ].includes(this.titleData.workActionType) &&
      this.titleData.workItemId === 'ADMIN'
    );
  }

  get approvalTime() {
    if (this.titleData.displayStatus === workflowEnum.WorkItemStatus.PENDING) {
      return '';
    } else {
      return this.titleData.approvalTime || '';
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
@import '../../style';
.approval-item-title {
  display: flex;
  height: 40px;
  line-height: 40px;
  align-items: center;
  .title-left {
    /deep/.author {
      height: 40px;
      background-color: transparent;
      .avatar-wrapper {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin-right: 16px;
        border: 1px solid #e4e7ec;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .h-icon-all-user-o {
          font-size: 20px;
        }
      }
    }
    .h-icon-all-flow-pass {
      color: #00c293;
      padding-left: 12px;
    }
  }
  .title-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .middle-content {
      display: flex;
      align-items: center;
      &.no-participant {
        font-size: 14px;
        padding-left: 8px;
      }
      .operate,
      .icon {
        font-size: 12px;
        color: #008eff;
        &.operate {
          padding-left: 4px;
        }
      }
      .workflow-operate-tag {
        height: 20px;
        background: #f0f7ff;
        border-radius: 2px;
        padding-left: 4px;
        line-height: 20px;
      }
    }
    /deep/.status-display {
      height: 20px;
    }
    /deep/.approval-user-info {
      .approval-users-wrapper {
        opacity: 0.5;
      }
    }
    .approvaler-name {
      max-width: 150px;
      margin-right: 8px;
      font-size: 14px;
      font-weight: bold;
      color: #111218;
    }
  }
  .resolveTime {
    font-size: 12px;
    font-weight: normal;
    color: rgba(17, 18, 24, 0.5);
  }
}
</style>
