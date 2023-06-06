<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="unfinished-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="list-item"
      @click="openDetail(item)"
    >
      <div class="left">
        <img src="../icon@2x.png" alt="" />
        <!-- <em class="icon aufontAll h-icon-all-catalogue-o"></em> -->
        <span :title="item.instanceName" class="name" :style="customStyle">{{
          item.instanceName
        }}</span>
        <urge-info v-if="item.urgeCount > 0" :workflowOptions="item" />
        <span v-if="item.workItemTimeoutStatus === 'TIMEOUT'" class="type">{{
          $t('languages.common.workBenchInfo.Timeout')
        }}</span>
      </div>
      <div class="right" :style="customStyle">
        <span>{{ $t('languages.common.workBenchInfo.Duration') }}</span>{{ item.stayTimeStr }}
      </div>
    </div>

    <template v-if="!list.length">
      <p class="empty">
        {{ $t('languages.common.noData') }}
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import toolMixin from 'cloudpivot-flow/flow-center/src/components/pc/common/toolMixin'; //公共处理模块
import { mixins } from 'vue-class-component';
import { Component, Prop, Inject } from 'vue-property-decorator';
import UrgeInfo from 'cloudpivot/common/src/components/pc/page-data/info-display/urge-info.vue';
@Component({
  name: 'unfinishedList',
  components: {
    UrgeInfo,
  },
})
export default class unfinishedList extends mixins(toolMixin) {
  @Prop() list!: any[];

  @Prop() customStyle!: any;

  @Inject({
    default: () => {},
  })
  showFormDetail: Function;

  /**
   * 打开表单详情
   */
  openDetail(obj) {
    const url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${
      obj.instanceId
    }&return=${
      location.pathname + location.search
    }&workitemType=finishedWorkitem`;
    if (this.isDingtalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      this.showFormDetail(url, () => {
        // 关闭弹窗重新请求数据
        this.$emit('refreshData');
      });
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.unfinished-list {
  // margin-top: 4px;
  .empty {
    font-size: 14px;
    font-weight: 400;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
    text-align: center;
    margin-top: 94px;
  }
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 24px;
  margin-top: 0px;
  margin-bottom: 12px;
  cursor: pointer;
  &:hover {
    background-color: @activeBGColor;
    .name {
      color: @highlightColor;
    }
  }
  .left {
    display: flex;
    align-items: center;
    max-width: calc(100% - 15em);
    img {
      width: 16px;
      margin-right: 8px;
    }
    em {
      font-size: 15px;
      margin-right: 5px;
      color: @highlightColor;
    }
    span {
      display: inline-block;
      &.name {
        max-width: 377px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        line-height: 22px;
      }
      &.type {
        // width: 32px;
        height: 16px;
        line-height: 16px;
        background: #fdeae9;
        border-radius: 2px;
        text-align: center;
        font-size: 10px;
        margin-left: 16px;
        color: #f0353f;
        white-space: nowrap;
      }
    }
  }
  .right {
    font-size: 12px;
    color: #111218;
    span {
      color: #111218;
      opacity: 0.5;
      line-height: 22px;
    }
  }
}
</style>
