<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="search">
    <div class="search-header">
      <div
        v-for="(searchItem, index) in searchWays"
        :key="index"
        :class="[
          'search-header-inner',
          searchItem.name === currentWay && 'selectActive',
        ]"
        @click="switchWay(searchItem)"
      >
        <span>{{
          searchItem.name === $t('languages.common.sequenceNo')
            ? currentStatusName
            : searchItem.name
        }}</span>
        <i
          :class="[
            'icon aufontAll',
            searchItem.icon,
            searchItem.name === currentWay && (searchItem.activeIcon || ''),
          ]"
        ></i>
      </div>
    </div>
    <div v-show="currentWay" class="search-content">
      <div
        v-show="currentWay === searchWays[0].name"
        class="search-content-status"
      >
        <ul>
          <li
            v-for="(item, index) in formStatus"
            :key="index"
            :class="{ checked: currentStatus === item.status }"
            @click="formSatusChange(item)"
          >
            <span>{{ item.name }}</span>
            <check-box
              :defaultChecked="currentStatus === item.status"
              :radio="true"
              @change="formSatusChange(item)"
            />
          </li>
        </ul>
      </div>
      <common-search
        v-show="currentWay === searchWays[1].name"
        class="search-content-status-input"
        @commit="submitQueryValue"
      />
    </div>
  </div>
</template>
<script lang="ts">
import common from 'cloudpivot/common/mobile';
import { H3Button, H3Input } from 'h3-mobile-vue';
import { Component, Vue } from 'vue-property-decorator';
import commonSearch from './common-search.vue';
import { workflowEnum } from 'cloudpivot-flow/flow';

@Component({
  name: 'search',
  components: {
    H3Input,
    H3Button,
    CheckBox: common.components.Checkbox,
    commonSearch,
  },
})
export default class Search extends Vue {
  searchWays: Array<any> = [];

  currentWay: string = '';

  currentStatus: string = 'PROCESSING';

  currentStatusName: string = '';

  formStatus: Array<any> = [];

  beforeMount() {
    this.currentStatusName = `${this.$t('languages.common.process')}`;
    this.searchWays = [
      {
        name: this.$t('languages.common.sequenceNo'),
        icon: 'h-icon-all-down-o',
        activeIcon: 'h-icon-all-up-o',
      },
      {
        name: this.$t('languages.common.filter'),
        icon: 'h-icon-all-filter-o',
      },
    ];

    this.formStatus = Object.keys(workflowEnum.WorkflowState).map(
      (state, index) => {
        return {
          name: this.$t(`cloudpivot.flow.pc.WorkflowState.${state}`),
          status: state,
        };
      },
    );
  }

  switchWay(item: any) {
    if (this.currentWay === item.name) {
      this.currentWay = '';
    } else {
      this.currentWay = item.name;
    }
  }

  submitQueryValue(val: any) {
    this.currentWay = '';
    val.instanceState = this.currentStatus;
    this.$emit('filter', val);
  }

  formSatusChange(statusItem: any) {
    this.currentStatus = statusItem.status;
    this.currentStatusName = statusItem.name;
    const params = {
      instanceState: statusItem.status,
    };
    this.$emit('filter', params);
    this.currentWay = '';
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/mixins.less';
@search-head: 87px;
@search-has-border: 89px;
@li-line-height: 90px;
.search {
  overflow: hidden;
  background: @white-background;
  &-header {
    display: flex;
    align-items: center;
    .px2rem(height, @search-head);
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    border-bottom: 1px solid @base-border-color;
    span {
      .px2rem(font-size, @font-size-base);
    }
    &-inner {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      line-height: 0.7rem;
      &:last-child {
        justify-content: flex-end;
      }
      span {
        .px2rem(padding-right, 10px);
      }
      .icon {
        font-size: 10px;
        &.h-icon-all-filter-o {
          font-size: 16px;
        }
      }
    }
    .selectActive {
      font-weight: 500;
      color: @primary-color;
      i {
        color: @primary-color;
      }
    }
  }
  &-content {
    /*background: white;*/
    background: @light-color-3;
    position: absolute;
    right: 0;
    left: 0;
    .px2rem(top, @search-has-border);
    bottom: 0;
    z-index: 100;
    overflow: hidden;
    .search-content-status {
      background: @text-color-white;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      .px2rem(padding-left, @horizontal-padding-lg);
      .px2rem(padding-right, @horizontal-padding-lg);
      .px2rem(line-height, @li-line-height);
      &.checked {
        span:first-child {
          font-weight: 500;
          color: @text-color-main;
        }
      }
      span:first-child {
        .px2rem(font-size, @font-size-base);
      }
      /deep/.home-checkbox-item {
        float: right;
        .px2rem(width, 36px);
        .px2rem(height, 36px);
        .px2rem(line-height, 36px);
      }
    }
    .search-content-status-input {
      height: 100%;
    }
  }
}
</style>
