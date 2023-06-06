<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-user-info">
    <div class="approval-users-wrapper">
      <template v-if="!users || users.length === 0">
        {{ noUserText }}
      </template>
      <template v-else>
        <span class="simple-text">{{ leftText }}</span>
        <span v-if="users.length > 3 && !isChinese" class="simple-text black">
          {{
            $t('cloudpivot.flow.pc.approval.component.approvalPeopleNum', {
              num: users.length,
            })
          }}
        </span>
        <template v-for="(user, index) in users">
          <span v-if="index < 3" :key="index" class="user-wrapper-outter">
            <UserPopover
              :user="user"
              :isHiddenImg="true"
              :isTrust="user.isTrust"
              :trustorVO="user.trustorProcessor"
              :trustorId="user.trustorId"
              :workItemId="user.workitemId"
            />
            <span v-if="index !== users.length - 1 && index !== 2">、</span>
          </span>
        </template>
        <span v-if="users.length > 3 && isChinese" class="simple-text black">
          {{
            $t('cloudpivot.flow.pc.approval.component.approvalPeopleNum', {
              num: users.length,
            })
          }}
        </span>
      </template>
    </div>
    <a-popover
      v-model="popoverVisible"
      overlayClassName="resolvers-popover"
      trigger="click"
      :placement="'bottomLeft'"
    >
      <span
        v-if="users.length > 3"
        class="detail-entry"
        @click="switchPopoverVisible"
        >{{ $t('cloudpivot.flow.pc.approval.component.detail') }}</span>
      <template slot="content">
        <span
          class="icon aufontAll h-icon-all-close"
          @click="switchPopoverVisible"
        ></span>
        <div class="resolvers-wrapper">
          <UserPopover
            v-for="(user, index) in users"
            :key="index"
            :user="user"
            :isHiddenImg="true"
            :isTrust="user.isTrust"
            :trustorVO="user.trustorProcessor"
            :trustorId="user.trustorId"
            :workItemId="user.workitemId"
          />
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import UserPopover from 'cloudpivot/common/src/components/pc/user/user-popover.vue';
import { Popover } from '@h3/antd-vue';

@Component({
  name: 'approval-user-info',
  components: {
    UserPopover,
    APopover: Popover,
  },
})
export default class ApprovalUserInfo extends Vue {
  @Prop()
  users!: any;

  //组件左侧是否有提示文字，如调整前处理人
  @Prop({ default: '' })
  leftText!: any;

  //用户为空时显示的缺省文字
  @Prop({ default: '' })
  noUserText!: any;

  popoverVisible: boolean = false;

  switchPopoverVisible() {
    this.popoverVisible = !this.popoverVisible;
  }

  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }
}
</script>

<style lang="less" scoped>
.approval-user-info {
  width: 100%;
  padding-right: 40px;
  position: relative;
  .approval-users-wrapper {
    .simple-text {
      &.black {
        color: #111218;
      }
    }
    .user-wrapper-outter {
      display: inline-flex;
      /deep/a {
        color: #111218;
        &:hover {
          color: #2970ff;
        }
        span {
          vertical-align: top;
        }
      }
    }
  }
  .detail-entry {
    position: absolute;
    right: 0;
    top: 0;
    color: #2970ff;
    cursor: pointer;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    white-space: nowrap;
  }
}
</style>

<style lang="less">
.resolvers-popover {
  .ant-popover-inner-content {
    padding: 12px 28px 12px 12px;
    max-width: 295px;
    position: relative;
    max-height: 144px;
    overflow: auto;
    .h-icon-all-close {
      position: absolute;
      top: 4px;
      right: 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .resolvers-wrapper {
      margin-right: -12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .user-name {
        color: #111218;
        font-size: 12px;
        line-height: 20px;
        margin-right: 12px;
        height: 20px;
        &:hover {
          color: #2970ff;
        }
      }
    }
  }
  .ant-popover-arrow {
    display: unset;
  }
}
</style>
