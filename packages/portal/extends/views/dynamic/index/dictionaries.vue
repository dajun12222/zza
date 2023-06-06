<template>
  <div class="dictionaries">
    <div class="scrollY">
      <a-table
        v-if="data && data.length"
        :columns="columns"
        :data-source="data"
        class="indexTable"
        :pagination="false"
        :rowKey="(record) => record.id"
        :defaultExpandAllRows="true"
      >
        <div
          slot="filterDropdown"
          slot-scope="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column,
          }"
          style="padding: 8px"
        >
          <a-input
            v-ant-ref="(c) => (searchInput = c)"
            :placeholder="`请输入内容`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="
              () => handleSearch(selectedKeys, confirm, column.dataIndex)
            "
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            搜索
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="() => handleReset(clearFilters)"
          >
            重置
          </a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="search" slot-scope="text, record, index, column">
          <span v-if="searchText && searchedColumn === column.dataIndex">
            <template
              v-for="(fragment, i) in text
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                :key="i"
                class="highlight"
                >{{ fragment }}</mark>
              <template v-else>{{ fragment }}</template>
            </template>
          </span>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <!-- <template slot="operation" slot-scope="text, record">
          <a @click="showInfo(record.id)">详情</a>
        </template> -->
      </a-table>
    </div>
    <modalList ref="child" :modalData="modalData" />
  </div>
</template>
<script lang="ts">
import { Table, Modal, Input, Button, Icon } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import modalList from '@/../extends/components/audit/dynamic/modal.vue';
import api from '@/../extends/api';
const qs = require('qs');

@Component({
  name: 'dictionaries',
  components: {
    ATable: Table,
    AModal: Modal,
    AButton: Button,
    AInput: Input,
    AIcon: Icon,
    modalList,
  },
})
export default class dictionaries extends Vue {
  [x: string]: any;

  searchText: any = '';

  searchInput: null;

  searchedColumn: '';

  //列表
  columns = [
    {
      title: '审计名词',
      dataIndex: 'name',
      key: 'name',
      width: '250px',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '名词解释',
      dataIndex: 'details',
      key: 'details',
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'search',
      },
      ellipsis: true,
      // customRender: (value, row, index) => {
      //   let obj = '';
      //   if (value) {
      //     obj = value;
      //   } else {
      //     obj = '-';
      //   }
      //   return obj;
      // },
      onFilter: (value, record) => {
        return record.details
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   scopedSlots: { customRender: 'operation' },
    //   width: '90px',
    // },
  ];

  data: any = [];

  //详情弹窗
  modalData: any = []; //详情数据

  child: any = null; // 存储子组件

  created() {
    //获取列表
    this.queryDictList();
  }

  handleSearch(selectedKeys, confirm, dataIndex) {
    confirm();
    console.log('aaaaaaaa', selectedKeys, dataIndex);
    this.searchText = selectedKeys[0];
    this.searchedColumn = dataIndex;
  }

  handleReset(clearFilters) {
    clearFilters();
    this.searchText = '';
  }

  //显示详情
  async showInfo(id) {
    await this.queryInfoDetails(id);
    this.child = this.$refs.child;
    this.child.showModal();
  }

  async queryDictList() {
    const res: any = await api.queryDictList();
    if (res.code === '00000') {
      this.data = res.data;
    }
  }

  async queryInfoDetails(params?: any) {
    let option = qs.stringify({
      id: params,
    });
    const res: any = await api.queryInfoDetails(option);
    if (res.code === '00000') {
      this.modalData = [
        [
          {
            name: '审计字典',
            con: res.data.name,
            cols: '',
          },
          {
            name: '名词解释',
            con: res.data.details,
            cols: '',
          },
          {
            name: '状态',
            con: res.data.enabled ? '启用' : '未启用',
            cols: '',
          },
        ],
        [
          {
            name: '数据来源',
            con: res.data.source,
            cols: '',
          },
          {
            name: '创建时间',
            con: res.data.createTime,
            cols: '',
          },
          {
            name: '修改时间',
            con: res.data.updateTime,
            cols: '',
          },
        ],
        [
          {
            name: '主题库标识',
            con: res.data.subjectCode,
            cols: 5,
          },
        ],
      ];
      return this.modalData;
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  border-bottom: 1px solid #F0F0F0;
}
.dictionaries {
  height: 100%;
  overflow: hidden;
  background: #fff;
  padding: 12px;
  margin: 8px 8px 0 20px;
  border-radius: 2px;
  .scrollY {
    height: 100%;
    overflow-y: scroll;
    > div {
        border-radius: 5px !important;
        box-shadow: 0 0 5px #d4e4fa;
    }
  }
  .indexTable {
    /deep/.ant-table-thead > tr > th,
    /deep/.ant-table-tbody > tr > td {
      padding: 8px;
    }
    /deep/.ant-table-thead > tr > th {
      position: relative;
    }
    /deep/.ant-table-thead > tr > th:not(:last-child):before {
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 1.6em;
      background-color: rgba(0, 0, 0, 0.06);
      transform: translateY(-50%);
      transition: background-color 0.3s;
      content: '';
    }
  }
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
  color: red;
}
</style>
