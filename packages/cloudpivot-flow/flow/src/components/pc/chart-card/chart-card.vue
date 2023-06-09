<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="outer-wrapper">
    <!-- 遮罩 -->
    <div class="chart-card-mask" @click="destroy"></div>
    <!-- 动态窗 -->
    <div
      ref="chartCard"
      :style="positionStyle"
      :class="flowTrackChartCardPrefixCls"
    >
      <template v-if="!estimate">
        <div
          v-for="(log, i) in record"
          :key="i"
          class="item"
          :class="{ 'sub-item': log.subInstanceActivity }"
          @click="goSubWorkflowForm(log)"
        >
          <a-avatar
            class="avatar"
            :size="32"
            icon="user"
            :src="getImageUrl(log.originator)"
          />
          <div class="content">
            <div v-if="log.subInstanceActivity" class="user">
              <Participants
                slot="originator"
                class="name"
                :i18nData="i18n"
                :participants="[log.originator]"
                :trustor="log.trustor && log.trustor.id ? log.trustor : ''"
                :showTitle="true"
                :isHiddenImg="true"
              />
              <label
                v-if="
                  !!statusFn(
                    log.subInstanceStatus,
                    'subInstance',
                    log.activityCode,
                  )
                "
                :class="`workflow-action ${getSubWorkflowActionStatusColorClass(
                  log.subInstanceStatus,
                )}`"
                ><span>{{
                  statusFn(
                    log.subInstanceStatus,
                    'subInstance',
                    log.activityCode,
                  )
                }}</span></label>
            </div>
            <div v-else class="user">
              <Participants
                slot="originator"
                class="name"
                :i18nData="i18n"
                :participants="[log.originator]"
                :trustor="log.trustor && log.trustor.id ? log.trustor : ''"
                :showTitle="true"
                :isHiddenImg="true"
                :btnConfigList="{
                  assist: statusFn(6, 'workflow', log.activityCode),
                  adjust: statusFn(19, 'workflow', log.activityCode),
                  forward: statusFn(7, 'workflow', log.activityCode),
                  circulate: statusFn(16, 'workflow', log.activityCode),
                }"
              />
              <label
                v-if="
                  !!statusFn(
                    log.approvalActionStatus,
                    'workflow',
                    log.activityCode,
                  )
                "
                :class="`workflow-action ${getWorkflowActionStatusColorClass(
                  log.approvalActionStatus,
                )}`"
                ><span>{{
                  statusFn(
                    log.approvalActionStatus,
                    'workflow',
                    log.activityCode,
                  )
                }}</span></label>
            </div>
            <div class="timers">
              <label class="timer">{{
                `${receiverTime} ${workItemLogTimeFormat(
                  log.receiveTime,
                  log,
                  'YYYY-MM-DD',
                )}`
              }}</label>
              <label class="timer">{{
                `${finishTime} ${workItemLogTimeFormat(
                  log.finishTime,
                  log,
                  'YYYY-MM-DD',
                )}`
              }}</label>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Avatar } from '@h3/antd-vue';
import WorkflowMixin from '../mixins/workflow';
import Participants from '../participants.vue';
// 不兼容ie
// import { closest } from 'cloudpivot/common/src/utils/dom';

import { workflow } from 'cloudpivot/api';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
@Component({
  name: 'flow-track-chart-card',
  components: {
    AAvatar: Avatar,
    Participants,
  },
})
export default class FormWorkflowTrackChartCard extends mixins(WorkflowMixin) {
  @Prop({ default: () => [] }) record!: workflow.WorkflowTrackLog | any;

  @Prop({ default: () => ({}) }) rect?: DOMRect;

  @Prop({ default: false }) estimate?: Boolean;

  @Prop() fn?: any;

  @Prop() i18n?: any;

  @Prop() statusFn!: any;

  receiverTime: any = '接收时间:';

  finishTime: any = '完成时间:';

  predictor: any = '预估处理人';

  nothing: any = '无';

  /**
   * 获取
   */
  get flowTrackChartCardPrefixCls() {
    return {
      'flow-track-chart-card': true,
      'flow-track-chart-card--estimate': this.estimate,
    };
  }

  /**
   * 获取元素位置
   */
  get positionStyle() {
    const windowWidth: number = document.documentElement
      ? document.documentElement.clientWidth
      : 0;
    const mainScrollTop: number = document.getElementsByClassName('main')[0]
      ? document.getElementsByClassName('main')[0].scrollTop - 64
      : 0;

    const rect: any = this.rect;
    let pageX: number = 0;
    let pageY: number = 0;
    const boxWidth: number = this.record.length > 1 ? 278 : 154;

    if (rect && rect.right && rect.left) {
      pageX =
        windowWidth / 2 < rect.right
          ? rect.left - (this.estimate ? boxWidth : 310)
          : rect.right + 30;
      // 在 ie 上只有 rect.top, 没有 rect.y
      pageY = mainScrollTop
        ? mainScrollTop + (rect.y || rect.top)
        : rect.y || rect.top;
    }
    return `top:${pageY}px;left:${pageX}px`;
  }

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  getImageUrl(user: any) {
    if (user.imgUrl && user.imgUrl.includes('http')) {
      return user.imgUrl;
    } else if (user.imgUrl) {
      return this.getDownloadUrlNew(user.imgUrl);
    } else {
      //Else Empty block statement
    }
    const userImg = require('./../image/user.png');
    return userImg || '';
  }

  destroy() {
    this.$emit('destroy');
  }

  /**
   * 文本区域点击事件
   * @param e
   */
  // documentClick(e: any) {
  //   // this.$emit('destroy');
  //   let target = ((e || window.event) as any).target;
  //   if (!this.closest(target)) {
  //     this.$emit('destroy');
  //   }
  // }

  // outerModal:any;
  // closest(el) {
  //   let modal:any = document.getElementsByClassName('flow-track-chart-card')[0];
  //   if ( !modal ) {return false;}
  //   while(el) {
  //     if ( el===modal ) {return true;}
  //     el = el.parentNode;
  //   }
  //   return false;
  // }

  mounted() {
    this.$nextTick(() => {
      if (this.i18n && this.i18n.receiverTime) {
        this.receiverTime = this.i18n.receiverTime;
        this.finishTime = this.i18n.finishTime;
        this.predictor = this.i18n.predictor;
        this.nothing = this.i18n.nothing;
      }
      (this.$refs.chartCard as HTMLElement).classList.add(
        'flow-track-chart-card--show',
      );

      // 卡片展示高度不够时，向上对齐展示
      const curDom = document.querySelector('.outer-wrapper') as HTMLElement;
      if (!curDom || !curDom.parentElement) {
        return;
      }
      const clientHeight: number = curDom.parentElement.clientHeight;
      const scrollTop: number = curDom.parentElement.scrollTop;
      const card: any = this.$refs.chartCard as HTMLElement;
      if (!card || !card.clientHeight) {
        return;
      }
      const pageY: number = card.style.top ? parseInt(card.style.top) : 0;
      if (clientHeight - pageY < card.clientHeight + 20) {
        const height = this.rect && this.rect.height ? this.rect.height : 0;
        card.style.top = `${pageY - card.clientHeight + height}px`;
      }
      // 延时注册事件，防止流程节点点击事件的干扰
      // setTimeout(() => {
      //   document.addEventListener('click', this.documentClick, false);
      // }, 300);
    });
  }

  /**
   * 销毁周期
   */
  // destroyed() {
  //   document.removeEventListener('click', this.documentClick, false);
  // }

  /**
   * 打开子流程表单
   */
  goSubWorkflowForm(log: any) {
    if (log.subInstanceActivity) {
      this.fn(log);
      this.$emit('destroy');
    }
  }
}
</script>
<style lang="less">
@import '~cloudpivot/common/common';
@chartCardZIndex: 1001;
.flow-track-chart-card {
  position: absolute;
  transition: all 0.25s;
  transform: scale(0.7);
  opacity: 0;
  top: 0;
  padding: @base4-padding-md;
  margin-bottom: @base4-padding-md;
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  width: 268px;
  max-height: 280px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: @chartCardZIndex;
  &--estimate {
    // width: inherit;
    max-width: 356px;
    padding: 16px 0;
  }
  .item {
    display: flex;
    padding: @base4-padding-sm 0;
    border-bottom: 1px solid rgba(234, 237, 243, 1);
    .avatar {
      flex: 0 0 32px;
      margin-right: @base4-padding-md;
    }
    .content {
      flex: 1 1;
      .user::before {
        content: '';
      }
      .name {
        display: inline-block;
        margin-right: @base4-padding-md;
        font-weight: @font-weight-md;
        max-width: 118px;
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        a {
          display: inline-block;
          vertical-align: middle;
          color: @light-color-1;
        }
      }
      .approval {
        padding: 0 8px;
        background: rgba(50, 182, 131, 1);
        border-radius: 9px;
        color: #ffffff;
        line-height: 18px;
        span {
          display: inline-block;
          vertical-align: text-top;
          font-size: @font-size-12;
          transform: scale(0.8);
        }
      }
      .timers {
        margin-top: 6px;
        .timer {
          display: block;
          color: @light-color-3;
          line-height: 22px;
          margin-bottom: 8px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .item:first-child {
    padding-top: 0;
  }
  .item:last-child {
    padding-bottom: 0;
    border: 0;
  }
  .sub-item {
    cursor: pointer !important;
    .timer {
      cursor: pointer;
    }
  }

  .title {
    display: block;
    color: @light-color-1;
    font-size: @font-size-14;
    padding: 0 16px;
    margin-bottom: 16px;
  }
  .estimate-item {
    display: inline-flex;
    align-items: center;
    padding: 0 0 0 16px;
    margin-bottom: 12px;
    min-width: 110px;
    .img-wrapper {
      line-height: 1;
      width: unset;
      height: unset;
      background-color: unset;
      margin-right: 0;
    }
    .avatar {
      margin-right: 16px;
      height: 32px;
      width: 32px;
      i > svg {
        margin: 9px;
      }
    }
    a {
      color: #111218;
    }
    .workflow-participants {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: flex;
      a {
        display: flex;
        align-items: center;
      }
    }
  }
}
.flow-track-chart-card--show {
  opacity: 1;
  transform: scale(1);
}
.chart-card-mask {
  position: fixed;
  left: 0;
  top: 0;
  z-index: @chartCardZIndex - 1;
  width: 100%;
  height: 100%;
}

.workflow-action {
  background-color: transparent !important;
  border-radius: 20px;
  color: rgba(17, 18, 24, 0.5);
  border: 1px solid rgba(17, 18, 24, 0.5);
}
.workflow-action span {
  color: rgba(17, 18, 24, 0.5);
  transform: none;
  font-size: 12px;
}
.workflow-action.gray {
  border: 1px solid rgba(17, 18, 24, 0.5);
  span {
    color: rgba(17, 18, 24, 0.5);
  }
}

.workflow-action.blue {
  border: 1px solid #faad14;
  span {
    color: #faad14;
  }
}

.workflow-action.green {
  border: 1px solid #0dd1a2;
  span {
    color: #0dd1a2;
  }
}

.workflow-action.red {
  border: 1px solid #ff3640;
  span {
    color: #ff3640;
  }
}
</style>
