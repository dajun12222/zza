<template>
  <div class="dataCollection">
    <div class="right">
      <a-row class="header">
        <a-col :span="6" class="elCol">
          <a-input
            v-model="searchVal"
            autocomplete="off"
            style="width: 200px"
            allowClear
            placeholder="搜索报告名称"
          />
        </a-col>
        <a-col :span="6" class="elCol">
          <a-select
            v-model="s1"
            defaultValue="yue"
            style="width: 200px"
            placeholder="请选择报告纬度"
            @change="handleChange"
          >
            <a-select-option value="yue"> 月度 </a-select-option>
            <a-select-option value="nian"> 年度 </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="8" class="elCol">
          <a-button class="elButton" @click="reset">重置</a-button>
          <a-button type="primary" class="elButton">检索</a-button>
        </a-col>
      </a-row>
      <div class="content">
        <p>数据资源数据质量报告看板</p>
        <div class="elTable">
          <a-table
            :columns="columns"
            :data-source="dataContent.content"
            :defaultExpandAllRows="true"
            bordered
            :pagination="true"
            :rowKey="(record) => record.a"
          >
            <div slot="action">
              <span class="action">
                <a>数据下载</a>
              </span>
            </div>
            <div slot="filterDetail" slot-scope="text, record">
              <span class="filterDetail">
                <a @click="details(record)">查看</a>
              </span>
            </div>
          </a-table>
        </div>
        <a-page
          :obj="dataContent"
          style="margin-top: 12px; display: flex; justify-content: flex-end"
        />
      </div>
    </div>
    <modalList ref="child" :modalData="modalData" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import modalList from '@/../extends/components/audit/dynamic/modal.vue';
import {
  Row,
  Col,
  Button,
  Table,
  Tooltip,
  Select,
  Input,
  DatePicker,
} from '@h3/antd-vue';
import page from '@/../extends/components/static/page.vue';
@Component({
  name: 'zl',
  components: {
    ATable: Table,
    ATooltip: Tooltip,
    AButton: Button,
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    ADatePicker: DatePicker,
    modalList,
    APage: page,
  },
})
export default class zl extends Vue {
  selectIndex: number = 0;

  defaultExpandAllRows = true;

  selectData: any = {};

  pagination: {
    size: 'small';
    current: 1;
    pageSize: 5;
    total: 0;
  };

  //详情弹窗
  modalData: any = [];

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 80,
      customRender: (text, record, index) => `${index + 1}`,
    },
    {
      title: '报告纬度',
      dataIndex: 'b',
      key: 'b',
      width: 100,
    },
    {
      title: '报告名称',
      dataIndex: 'a',
      key: 'a',
    },

    {
      title: '报告生成日期',
      dataIndex: 'c',
      key: 'c',
      width: 200,
    },

    {
      title: '数据质量情况',
      dataIndex: '查看',
      key: 'filterDetail',
      scopedSlots: { customRender: 'filterDetail' },
      width: 150,
    },

    {
      title: '报告下载',
      dataIndex: '导出',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 100,
    },
  ];

  cascaderVal: any = [];

  cascaderData: any = [];

  value: any = '';

  searchVal: any = '';

  s1: any = [];

  dataContent: any = {
    content: [
      {
        a: '黑龙江省公安厅督察审计总队_数据资源_数据质量报告_月度报告_2023年3月',
        b: '月度报告',
        c: '2023/4/1 5:00:30',
        d: '100%',
        e: '98%',
        f: '97%',
      },
      {
        a: '黑龙江省公安厅督察审计总队_数据资源_数据质量报告_月度报告_2023年2月',
        b: '月度报告',
        c: '2023/3/1 5:00:30',
        d: '98%',
        e: '99%',
        f: '98%',
      },
      {
        a: '黑龙江省公安厅督察审计总队_数据资源_数据质量报告_月度报告_2023年1月',
        b: '月度报告',
        c: '2023/2/1 5:00:30',
        d: '99.99%',
        e: '99.99%',
        f: '97%',
      },
      {
        a: '黑龙江省公安厅督察审计总队_数据资源_数据质量报告_年度报告_2022年',
        b: '年度报告',
        c: '2023/1/1 5:00:30',
        d: '100%',
        e: '98%',
        f: '97%',
      },
      {
        a: '黑龙江省公安厅督察审计总队_数据资源_数据质量报告_月度报告_2022年12月',
        b: '月度报告',
        c: '2023/1/1 5:00:30',
        d: '100%',
        e: '98%',
        f: '97%',
      },
    ],
  };

  child: any = null; // 存储子组件

  onChange(date, dateString) {
    console.log(date, dateString);
  }

  reset() {
    this.searchVal = '';
    this.s1 = '';
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  details(record) {
    this.child = this.$refs.child;
    this.child.showModal();
    console.log(record);
    this.modalData = [
      [
        {
          name: '及时性',
          con: record.d,
          cols: '',
        },
        {
          name: '完整性',
          con: record.e,
          cols: '',
        },
        {
          name: '准确性',
          con: record.f,
          cols: '',
        },
      ],
    ];
  }
}
</script>
<style lang="less" scoped>
.dataCollection {
  height: 100%;
  padding: 12px;
  overflow-y: auto;
  .left {
    padding: 12px;
    background-color: #fff;
  }
  .right {
    .header {
      padding: 24px;
      background-color: #fff;
      .elCol {
        padding: 12px 20px;
        .elButton {
          width: 100px;
          margin-right: 10px;
        }
      }
    }
    .content {
      margin-top: 12px;
      padding: 24px;
      background-color: #fff;
      p {
        padding: 0 0 12px 0;
      }
    }
  }
}
</style>
