<!--
 * @Descripttion: portal共用table-header
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-03 14:49:32
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-01-19 19:09:58
-->

<template>
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-header-left-title">
        <h2>{{ subTitle }}</h2>
        <span>
          {{ $t('cloudpivot.flowCenter.pc.total2') }}
          <span class="num">
            {{ headerData.total }}
          </span>
          {{ $t('cloudpivot.flowCenter.pc.strip') }}，
          {{ $t('cloudpivot.flowCenter.pc.currentDisplay') }}
          <span class="num">{{ headerData.showTotal }}</span>
          {{ $t('cloudpivot.flowCenter.pc.strip') }}
        </span>
      </div>

      <a-tabs
        v-if="tabsList.length > 0"
        v-model="current"
        type="card"
        class="page-header-left-tab"
        @change="changeTabs"
      >
        <a-tab-pane
          v-for="item in tabsList"
          :key="item.key"
          :tab="item.label"
        />
      </a-tabs>
    </div>

    <div
      class="page-header-right"
      :class="{
        'page-header-bottom':
          headerData.type === 5 ||
          headerData.type === 7 ||
          headerData.type === 8,
        'page-header-right-tab': tabsList.length > 0,
      }"
    >
      <!-- 搜索结果展示 -->
      <!-- <div class="page-header-right-li">
        <filterCard @clear="clearKeyword" :source="queryConditionSource" />
      </div> -->

      <div
        class="page-header-right-li page-filter"
        :class="queryActive || isOpen ? 'active' : ''"
      >
        <div class="page-right-li-box" @click="onSearch">
          <i class="icon aufontAll h-icon-all-screen"></i>
          <span>{{ $t('cloudpivot.flowCenter.pc.filter') }}</span>
        </div>
      </div>

      <div
        v-if="headerData.type === 1 && !headerData.batch"
        class="page-header-right-li"
        @click="batchProcess('approve')"
      >
        <i class="icon aufontAll h-icon-all-batch-approval"></i>
        <span>{{ $t('cloudpivot.flowCenter.pc.batchApproval') }}</span>
      </div>

      <div
        v-show="headerData.type === 1 && headerData.batch"
        class="page-header-right-li"
      >
        <a-button @click="batchProcess('cancel')">{{
          $t('cloudpivot.flowCenter.pc.cancel')
        }}</a-button>

        <a-button
          v-if="isShowBatchTransfer"
          :disabled="headerData.showTotal < 1 || disabled"
          @click="batchProcess('transfer')"
        >
          {{ $t('cloudpivot.flowCenter.pc.batchTransfer') }}
        </a-button>

        <a-button
          v-if="isShowBatchTransfer"
          :disabled="headerData.showTotal < 1 || disabled"
          @click="batchProcess('agree')"
        >
          {{ $t('cloudpivot.flowCenter.pc.batchAgree') }}
        </a-button>
        <a-button
          v-else
          :disabled="headerData.showTotal < 1 || disabled"
          type="primary"
          @click="batchProcess('agree')"
        >
          {{ $t('cloudpivot.flowCenter.pc.batchAgree') }}
        </a-button>
      </div>
      <div v-if="headerData.type === 2" class="page-header-right-li">
        <a-button
          :disabled="disabled"
          type="primary"
          @click="batchProcess('read')"
        >
          {{ $t('cloudpivot.flowCenter.pc.circulated') }}
        </a-button>
      </div>
      <div
        v-if="headerData.type === 7 && current === 4"
        class="page-header-right-li"
      >
        <a-button
          :disabled="disabled"
          type="primary"
          @click="batchProcess('delete')"
        >
          {{ $t('cloudpivot.flowCenter.pc.delete') }}
        </a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import PageSelectMotail from '../page-select-motail/page-select-motail.vue';
import filterCard from 'cloudpivot-list/list/src/components/pc/components/filter-card/filter-card.vue';
import { Button, Tooltip, Popover, Tabs } from '@h3/antd-vue';

@Component({
  name: 'page-header',
  components: {
    AButton: Button,
    PageSelectMotail,
    filterCard,
    ATooltip: Tooltip,
    APopover: Popover,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
  },
})
export default class PageHeader extends Vue {
  @Prop({
    default: {
      total: 0,
      showTotal: 0,
      type: 1, //1.我的待办、 2.我的待阅 3.我的已办 4.我的已阅 5.流程委托 6.流程查询 7.任务查询
      batch: false,
      queryConditionSource: [],
    },
  })
  headerData!: any;

  @Prop({ default: '我的待办' })
  subTitle!: string;

  @Prop({ default: [] })
  queryConditionSource!: any[];

  @Prop({ default: true })
  disabled?: boolean;

  @Prop({ default: false })
  isShowBatchTransfer?: boolean;

  @Prop({ default: () => [] })
  tabsList?: any[];

  @Prop({ default: false })
  queryActive?: boolean;

  @Prop({ default: false })
  isOpen?: boolean;

  @Prop({ default: false })
  noData?: boolean;

  @Prop({ default: 0 })
  activeKey?: number;

  isShow: boolean = false;

  current: number = 0;

  // @Watch('headerData')
  // getDataType(val) {
  //   switch (val.type) {
  //     case 5:
  //       break;
  //     case 7:
  //       // this.current = val.isChange?this.current:1;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  @Watch('activeKey', { immediate: true })
  activeKeyChange(val) {
    this.current = val;
  }

  onSearch() {
    this.$emit('search');
  }

  changeTabs(key) {
    this.current = key;
    console.log(key);
    const curTabsValue = this.tabsList && this.tabsList[key];
    const obj = {
      instanceState: curTabsValue && curTabsValue.value,
    };
    this.$emit('changeTabs', obj);
  }

  searchWorkitems(obj) {
    /**
     * 我的流程
     */

    if (this.headerData.type === 5) {
      // @ts-ignore
      obj.instanceState = this.tabsList[this.current];
    }
    this.$emit('search', obj);
    this.isShow = false;
  }

  /**
   * 清空关键字
   */
  clearKeyword() {
    // @ts-ignore
    this.$refs.child.clearKeyword();
  }

  /**
   * 批量处理
   */
  batchProcess(type: string) {
    this.$emit('batch', { type: type });
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.page-header {
  height: auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  &-left-title {
    display: flex;
    align-items: flex-end;
    > h2 {
      font-weight: 700;
      font-size: 16px;
      color: #111218;
      margin: 0;
    }
    > span {
      font-size: 12px;
      color: #111218;
      margin-left: 8px;
      margin-bottom: 2px;
      > .num {
        color: @highlightColor;
        margin: 0 4px;
      }
    }
  }
  &-left-tab {
    width: auto;
    height: auto;
    padding: 3px;
    margin-top: 16px;
    display: inline-block;
    background: #e0e1e7;
    border-radius: 3px;
    /deep/.ant-tabs-bar {
      border-bottom: unset;
      margin-bottom: 0px;
      .ant-tabs-nav-container {
        height: 31px;
      }
      .ant-tabs-nav {
        > div {
          display: flex;
        }
      }
      .ant-tabs-tab {
        padding: 0px;
        margin-right: 0px;
        font-size: 12px;
        width:90px;
        height:30px;
        line-height: 30px;
        text-align: center;
        display: block;
        border: 0;
        border-radius: 4px;
        background: #e0e1e7;
        &-active {
          font-weight: bold;
          background: #fff;
          // border-radius: 2px;
        }
      }
    }
  }
  &-right {
    display: flex;
    align-items: center;
    position: relative;
    height: 24px;
    line-height: 24px;
    &.page-header-right-tab {
      height: 32px;
      line-height: 32px;
    }
    &-li {
      font-size: 12px;
      color: rgba(17, 18, 24, 0.5);
      font-weight: 400;
      margin-left: 16px;
      cursor: pointer;
      i {
        margin-right: 4px;
        font-size: 14px;
      }
      &:active,
      &:hover,
      &.active {
        color: @highlightColor;
        i {
          color: @highlightColor;
        }
      }
      .ant-btn {
        margin-left: 8px;
        padding: 0;
        padding: 0 16px;
        &:first-child {
          margin-left: 0;
        }
        &-primary {
          // background: #2970FF;
          &:hover {
            // background: #5291FF;
          }
          &:active {
            // background: #1852D9;
          }
        }
      }
      &.page-filter {
        .page-select-motail {
          right: 0;
        }
      }
    }
  }
}

.page-header-bottom {
  align-items: flex-end;
}
</style>
