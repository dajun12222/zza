<template>
  <div class="regulation">
    <div class="left">
      <a-tabs v-model="activeKey">
        <a-tab-pane
          v-for="item in activeKeyList"
          :key="item.id"
          :tab="item.name"
        >
          <query-list v-show="activeKey === '1'" @select="select" />

          <div v-show="activeKey === '2'">
            <agent-list @select="select" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="center"></div>
    <div class="right">
      <a-row class="header">
        <a-col :span="8">
          <a-cascader
            placeholder="人才标签"
            class="role-tree"
            :value="cascaderVal"
            :options="cascaderData"
            :fieldNames="{
              label: 'tagsName',
              value: 'id',
              children: 'children',
            }"
            allowClear
            style="width: 200px"
            @change="cascaderChange"
          />
        </a-col>
        <a-col :span="10">
          <a-input
            v-model="searchVal"
            autocomplete="off"
            style="width: 100%"
            allowClear
            placeholder="请输入人员姓名"
          />
        </a-col>
        <a-col :span="2">
          <a-button type="primary" style="width: 100%" @click="search">检索</a-button>
        </a-col>
        <a-col :span="24" style="margin-top: 10px">
          检索条件：<a-tag
            v-for="item in tabs"
            :key="item.type"
            color="#108ee9"
            closable
            @close="close(item)"
          >
            {{ item.title }} ： {{ item.name }}
          </a-tag>
        </a-col>
      </a-row>
      <div class="content">
        <newList v-show="activeKey === '1'" :dataContent="dataContent" />
        <newList1 v-show="activeKey === '2'" :dataContent="dataContent" />
        <a-page
          :obj="dataContent"
          style="margin-top: 12px; display: flex; justify-content: flex-end"
          @searchPage="searchPage"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import queryList from '@/../extends/components/support/queryList.vue';
import agentList from '@/../extends/components/support/agentList.vue';
import newList from '@/../extends/views/talentList/components/newList.vue';
import newList1 from '@/../extends/views/talentList/components/newList1.vue';
import page from '@/../extends/components/static/page.vue';
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Tabs,
  Cascader,
} from '@h3/antd-vue';

import api from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'supportIndex',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    AButton: Button,
    ATag: Tag,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ACascader: Cascader,
    queryList,
    agentList,
    newList,
    newList1,
    APage: page,
  },
})
export default class supportIndex extends Vue {
  cascaderVal: any = [];

  cascaderData: any = [];

  tabs: any = [];

  searchVal: any = '';

  dataContent: any = {};

  activeKey: any = '1';

  @Watch('activeKey', { deep: true, immediate: true })
  onChangeActiveKey(newVal: any) {
    //获取列表
    this.searchVal = '';
    this.tabs = [];
    this.search();
  }

  activeKeyList: any = [
    {
      id: '1',
      name: '内部审计人才库',
    },
    {
      id: '2',
      name: '外部审计人才库',
    },
  ];

  created() {
    //获取列表
    this.search();
    //人才标签
    this.getQueryTagsList();
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  async getList(queryPage) {
    let maps: any = {};
    maps['fieldValue'] = this.searchVal;
    if (this.cascaderVal && this.cascaderVal.length > 0) {
      maps['tagsId'] = this.cascaderVal[this.cascaderVal.length - 1];
    } else {
      maps['tagsId'] = '';
    }
    console.log('this.tabs',this.tabs)
    // debugger
    this.tabs.map((item) => {
      if (item['type'] === 'deptId') {
        maps[item['type']] = item['dictionaryId'];
      }
      if (item['type'] === 'intermediaryId') {
        maps[item['type']] = item['dictionaryId'];
      }
    });
    let queryPageStringify = qs.stringify(queryPage);
    let res: any = {};
    if (this.activeKey === '1') {
      // 内部

      console.log(queryPageStringify,maps)
      console.log('searchVal',this.searchVal)

      res = await api.talentPageQuery(maps, queryPageStringify);
    } else {
      // 外部
      console.log(queryPageStringify,maps)
      res = await api.outsidePageQuery(maps, queryPageStringify);
    }

    if (res.code === '00000') {
      let option = res.data;
      option['total'] = Number(option['total']);
      this.dataContent = res.data;
    } else {
      this.dataContent = {};
    }
  }

  async getQueryTagsList() {
    const res: any = await api.queryTagsList();
    //cascaderData
    if (res.code === '00000') {
      this.cascaderData = this.setUn(res.data);

    } else {
      this.cascaderData = [];
    }
  }

  close(selectedKeys) {
    let index = this.tabs.findIndex((item) => {
      return item['type'] === selectedKeys['type'];
    });
    if (index > -1) {
      this.tabs.splice(index, 1);
    }
    this.getList({
      page: '1',
      size: '10',
    });
  }

  select(selectedKeys) {
    if (selectedKeys && selectedKeys['type'] === 'queryList') {
      selectedKeys['type'] = 'deptId';
      delete selectedKeys['dictionaryIds'];
    }
    if (!this.tabs) {
      this.tabs.push(selectedKeys);
      return;
    }
    let index = this.tabs.findIndex((item) => {
      return item['type'] === selectedKeys['type'];
    });
    if (index > -1) {
      this.tabs.splice(index, 1, selectedKeys);
    } else {
      this.tabs.push(selectedKeys);
    }
    this.search();
  }

  searchPage(option: any) {
    this.getList(option);
  }

  cascaderChange(value) {
    this.cascaderVal = value;
    //获取列表
    this.search();
  }

  setUn(data: any) {
    data.map((item: any) => {
      if (item && item.children && item.children.length > 0) {
        item.children = this.setUn(item.children);
      } else {
        item.children = [];
      }
    });
    return data;
  }
}
</script>
<style lang="less" scoped>
.regulation {
  height: 100%;
  padding: 12px;
  display: grid;
  grid-template-columns: 300px 12px 1fr;
  overflow-y: auto;
  .left {
    padding: 12px;
    background-color: #fff;
    border-radius: 5px !important;
    box-shadow: 0 0 5px #d4e4fa;
  }
  .right {
    > div {
        border-radius: 5px !important;
        box-shadow: 0 0 5px #d4e4fa;
    }
    .header {
      padding: 24px;
      background-color: #fff;
    }
    .content {
      margin-top: 12px;
      padding: 24px;
      background-color: #fff;
    }
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab {
    margin: 0 12px 0 0;
    padding: 8px 12px;
  }
}
</style>
