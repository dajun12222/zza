<template>
  <div class="assist-info-popover-hint">
    <!-- :style="{
      width: hintWidth,
    }" -->
    <a-popover
      placement="bottomLeft"
      overlayClassName="assist-info-popover"
      @visibleChange="visibleChange"
    >
      <template slot="content">
        <template v-if="!loading">
          <template v-if="assistCount < 3">
            当前存在「{{ assistPerson }}」的{{ assistText }}任务
          </template>
          <template v-else>
            当前存在「{{ assistPerson }}」等{{ assistCount }}人的{{
              assistText
            }}任务
          </template>
        </template>
        <template v-else>
          <div>
            <span class="icon aufontAll h-icon-all-loading-o"></span>
            {{ $t('cloudpivot.cloudpivotCommon.pc.loading2') }}
          </div>
        </template>
      </template>
      <div class="assist-text-wrap">
        <!-- :style="{
          width: wrapWidth,
        }" -->
        <span class="assist-text">{{ assistText + '中' }}</span>
      </div>
    </a-popover>
  </div>
</template>

<script lang="ts">
import { Popover } from '@h3/antd-vue';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { workflowApi } from 'cloudpivot/api';
import { utils } from 'cloudpivot/common';
@Component({
  name: 'assist-info',
  components: {
    APopover: Popover,
  },
})
export default class AssistInfo extends Vue {
  @Prop()
  workflowOptions!: any;

  assistPerson: any = '';

  loading: boolean = true;

  get assistText() {
    // if(localStorage.getItem('locale') === 'zh') {
    return this.workflowOptions.assistInfo.assistName;
    // } else {
    //   return this.$t(`cloudpivot.form.runtime.action.assistRetrieve`);
    // }
  }

  get assistTextLength() {
    return utils.calcStrLength(this.assistText);
  }

  get hintWidth() {
    if (this.assistTextLength <= 4) {
      return '60px';
    } else if (this.assistTextLength > 4 && this.assistTextLength <= 6) {
      return '70px';
    } else {
      return '70px';
    }
  }

  get wrapWidth() {
    if (this.assistTextLength <= 4) {
      return '88px';
    } else if (this.assistTextLength > 4 && this.assistTextLength <= 6) {
      return '106px';
    } else {
      return '104px';
    }
  }

  get assistCount() {
    return this.workflowOptions.assistInfo.assistCount;
  }

  visibleChange(visible) {
    if (visible && this.loading) {
      const params = {
        workItemId: this.workflowOptions.id,
      };
      workflowApi.getAssistInfo(params).then((res: any) => {
        if (res.errcode === 0) {
          this.assistPerson = res.data
            .reduce((prev, cur) => {
              return prev + cur.participantName + '、';
            }, '')
            .slice(0, -1);
          this.loading = false;
        } else {
          this.$message.error(res.errmsg);
        }
      });
    }
  }
}
</script>

<style lang="less">
.assist-info-popover {
  padding-top: unset;
  .ant-popover-inner-content {
    max-width: 382px;
    color: #111218;
    font-size: 13px;
    padding: 5px 8px;
    line-height: 22px;
    word-break: break-all;
  }
  .h-icon-all-loading-o {
    color: #2970ff;
    font-size: 13px;
    line-height: 13px;
    padding-right: 6px;
    &::before {
      animation: spin 1s linear infinite;
      display: inline-block;
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}

.assist-info-popover-hint {
  padding: 0 8px;
  .assist-text-wrap {
    // height: 32px;
    height: 20px;
    background: rgba(163, 203, 255, 0.2);
    // border-radius: 22px;
    border-radius: 11px;
    // border: 2px solid rgba(41, 112, 255, 0.3);
    // border: 1px solid rgba(41, 112, 255, 0.3);
    // transform: scale(0.5);
    text-align: center;
    transform-origin: left;
    // padding: 0 10px;
    padding: 0 6px;
    .assist-text {
      // font-size: 20px;
      font-size: 12px;
      color: #2970ff;
      // line-height: 28px;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
