<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="rule-log">
    <div class="header">
      <span class="icon left aufontAll h-icon-all-arrow-left-o"></span>
      <span class="text">执行日志</span>
    </div>
    <div class="content">
      <smart-search @reset="resetParams" @search="onSearch">
        <div slot="search">
          <div class="header__item">
            <span>规则名称</span>
            <a-input v-model="ruleName" class="w" :placeholder="'请输入'" />
          </div>

          <div class="header__item">
            <span>执行时间</span>
            <a-range-picker
              v-model="executTime"
              class="w"
              :placeholder="['开始时间', '结束时间']"
            >
              <template #suffixIcon>
                <a-icon type="calendar" />
              </template>
            </a-range-picker>
          </div>

          <div class="header__item">
            <span>执行状态</span>
            <a-select
              v-model="executState"
              showSearch
              class="w"
              placeholder="请选择"
            >
              <a-select-option
                v-for="(item, index) in executStateList"
                :key="index"
                :value="item.code"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </smart-search>
      <a-table
        :dataSource="list"
        :pagination="false"
        :rowKey="getRowKey"
        :scroll="{ y: 'calc(100vh - 214px)', x: '1087px' }"
      >
        <!-- 序号 -->
        <a-table-column key="index" dataIndex="index" :width="82">
          <span slot="title" class="resize">序号</span>
        </a-table-column>

        <!-- 规则编码 -->
        <a-table-column key="ruleCode" dataIndex="ruleCode" :width="147">
          <span slot="title" class="resize">规则编码</span>
        </a-table-column>

        <!-- 规则名称 -->
        <a-table-column key="ruleName" dataIndex="ruleName" :width="158">
          <span slot="title" class="resize">规则名称</span>
        </a-table-column>

        <!-- 触发数据 -->
        <a-table-column key="triggerData" dataIndex="triggerData" :width="263">
          <span slot="title" class="resize">触发数据</span>
        </a-table-column>

        <!-- 执行类型 -->
        <a-table-column key="runType" dataIndex="runType" :width="224">
          <span slot="title" class="resize">执行类型</span>
        </a-table-column>

        <!-- 执行时间 -->
        <a-table-column key="runTime" dataIndex="runTime" :width="268">
          <span slot="title" class="resize">执行时间</span>
        </a-table-column>

        <!-- 执行状态 -->
        <a-table-column key="runStatus" dataIndex="runStatus" :width="158">
          <span slot="title" class="resize">执行状态</span>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="operate" dataIndex="operate" :width="88">
          <span slot="title" class="resize">操作</span>
          <template slot-scope="text">
            <span class="opera-btn" @click.stop="detailVisible = true">
              {{ text }}
            </span>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <div class="footer">
      <a-pagination
        :total="total"
        :showTotal="
          (total) => $t('cloudpivot.flowCenter.pc.total', { num: total })
        "
        :pageSize="pageSize"
        :current="curPage"
        :pageSizeOptions="pageSizeOptions"
        showSizeChanger
        showQuickJumper
        @change="onPaginationChange"
        @showSizeChange="onSizeChange"
      />
    </div>
    <!--日志详情抽屉-->
    <a-drawer
      title="规则名称"
      placement="right"
      :closable="false"
      :visible="detailVisible"
      :width="850"
      :zIndex="1001"
      wrapClassName="log-detail-drawer"
      @close="detailVisible = false"
    >
      <LogDetail />
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Table,
  Pagination,
  Select,
  DatePicker,
  Input,
  Icon,
  Drawer,
} from '@h3/antd-vue';
import SmartSearch from 'cloudpivot-admin-core/src/components/global/smart-search.vue';
import LogDetail from './log-detail.vue';

interface IexecutState {
  code: number | string | boolean;
  name: string;
}
enum Estate {
  Success = 1,
  Fail = 2,
  All = 0,
}

@Component({
  name: 'biz-rule-log-list',
  components: {
    ATable: Table,
    ATableColumn: Table.Column,
    APagination: Pagination,
    SmartSearch,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARangePicker: DatePicker.RangePicker,
    AIcon: Icon,
    ADrawer: Drawer,
    LogDetail,
  },
})
export default class BizRuleLogList extends Vue {
  list = [
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
    {
      index: 1,
      ruleCode: '123',
      ruleName: '规则1',
      triggerData: '123',
      runType: '十四号',
      runTime: 'sss',
      runStatus: '失败',
      operate: '详情',
    },
  ];

  total: any = 0;

  pageSize: any = 20;

  curPage: any = 1;

  pageSizeOptions: Array<string> = ['10', '20', '50', '100'];

  ruleName: string = '';

  executTime: any[] = [];

  detailVisible: boolean = false;

  executStateList: Array<IexecutState> = [
    { code: Estate.All, name: '全部' },
    { code: Estate.Success, name: '成功' },
    { code: Estate.Fail, name: '失败' },
  ];

  onPaginationChange(value) {
    this.curPage = value;
  }

  onSizeChange(current, size) {
    this.curPage = 1;
    this.pageSize = size;
  }

  getRowKey(record) {
    return record.index;
  }
}
</script>

<style lang="less" scoped>
.rule-log {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  background: #fff;
  display: flex;
  flex-direction: column;
  .header {
    height: 58px;
    display: flex;
    align-items: center;
    box-shadow: 0px 4px 11px 0px rgba(35, 110, 235, 0.05),
      0px 1px 0px 0px #eeeeee;
    .left {
      font-size: 16px;
      padding: 0 16px;
      font-weight: bold;
    }
    .text {
      font-size: 20px;
      font-weight: bold;
      color: #111218;
      white-space: nowrap;
    }
  }
  .content {
    flex: 1;
  }
  .footer {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: thin solid #eeeeee;
  }
  /deep/.smart-search {
    height: 82px;
    padding: 15px 0;
    > div {
      background: unset;
      box-shadow: unset;
    }
    .header__item {
      display: inline-flex;
      align-items: center;
      margin-right: 24px;
      margin-bottom: 16px;
      &:last-child {
        margin-right: 0;
      }
      .ant-input,
      .ant-select {
        width: 220px;
      }
      .ant-calendar-picker {
        width: 256px;
      }
      > span {
        font-weight: bold;
        margin-right: 12px;
      }
    }
  }
  /deep/.ant-table-content {
    padding: 0 16px;
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 11px 16px;
    }
  }
}
</style>

<style lang="less">
.log-detail-drawer {
  .ant-drawer-body {
    padding: 0;
  }
}
</style>
