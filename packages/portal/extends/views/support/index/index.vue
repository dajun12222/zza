<template>
  <div class="regulation">
    <div class="left">
      <template-type @select="select" />
      <!-- <a-tabs v-model="activeKey">
        <a-tab-pane
          v-for="item in activeKeyList"
          :key="item.id"
          :tab="item.name"
        >
          
          <div v-show="activeKey === '2'">
            <document-template-type-list @select="select" />
          </div>
        </a-tab-pane>
      </a-tabs> -->
    </div>
    <div class="center"></div>
    <div class="right">
      <a-row class="header">
        <a-col :span="10">
          <a-input
            v-model="searchVal"
            autocomplete="off"
            style="width: 100%"
            allowClear
            placeholder="请输入关键词"
            @keyup.enter="search"
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
        <!-- <newList1 v-show="activeKey === '2'" :dataContent="dataContent" /> -->
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
import templateType from '@/../extends/components/support/templateType.vue'; //
// import documentTemplateTypeList from '@/../extends/components/support/documentTemplateTypeList.vue';
import newList from '@/../extends/views/support/components/newList.vue';
import newList1 from '@/../extends/views/support/components/newList1.vue';
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
    templateType,
    newList,
    newList1,
    APage: page,
  },
})
export default class supportIndex extends Vue {
  tabs: any = [];

  searchVal: any = '';

  dataContent: any = {};

  activeKey: any = '1';

  // @Watch('activeKey', { deep: true, immediate: true })
  // onChangeActiveKey(newVal: any) {
  //   //获取列表
  //   this.searchVal = '';
  //   this.tabs = [];
  //   this.search();
  // }

  // activeKeyList: any = [
  //   {
  //     id: '1',
  //     name: '项目类模版',
  //   },
  //   // {
  //   //     id: '2',
  //   //     name: '文书类模版'
  //   // }
  // ];

  created() {
    //获取列表
    this.search();
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  async getList(queryPage) {
    let maps: any = {};
    maps['templateName'] = this.searchVal.trim();
    this.tabs.map((item) => {
      if (item && item['ids']) {
        maps[item['type']] = item['ids'];
      } else {
        maps[item['type']] = [item['id']];
      }
    });
    let queryPageStringify = qs.stringify(queryPage);
    let res: any = {};
    if (this.activeKey === '1') {
      res = await api.queryTemplate(maps, queryPageStringify);
    } else {
      res = await api.queryDocumentTemplate(maps, queryPageStringify);
    }

    if (res.errmsg === 'success') {
      let option = res.data;
      option['total'] = Number(option['total']);
      this.dataContent = res.data;
    } else {
      this.dataContent = {};
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
    if (selectedKeys && selectedKeys['type'] === 'typeList') {
      selectedKeys['type'] = 'auditType';
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
    console.log(option);
    
    this.getList(option);
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
}
</style>
