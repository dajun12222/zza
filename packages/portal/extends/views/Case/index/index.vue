<template>
  <div class="Case">
    <div class="left">
      <case-type @select="select" />
    </div>
    <div class="center"></div>
    <div class="right">
      <a-card
        style="width: 100%"
        :tabList="tabList"
        :activeTabKey="key"
        @tabChange="(key) => onChangeActiveKey(key, 'key')"
      >
        <div>
          <div>
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
              <newListBase
                v-if="contentList[key] === '基础案例库'"
                :dataContent="dataContent"
              />
              <newList v-else :dataContent="dataContent" :typeKey="key" />
              <a-page
                :obj="dataContent"
                style="
                  margin-top: 12px;
                  display: flex;
                  justify-content: flex-end;
                "
                @searchPage="searchPage"
              />
            </div>
          </div>
          <!-- <a-empty v-if="contentList[key] === '执法活动'" />
          <a-empty v-if="contentList[key] === '专项审计'" /> -->
        </div>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import caseType from '@/../extends/components/support/caseType.vue';
import newListBase from '@/../extends/views/Case/components/newListBase.vue';
import newList from '@/../extends/views/Case/components/newList.vue';
import page from '@/../extends/components/static/page.vue';
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Tabs,
  TreeSelect,
  Card,
  Empty,
  Cascader,
} from '@h3/antd-vue';

import api from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'CaseIndex',
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
    ATreeSelect: TreeSelect,
    ACascader: Cascader,
    ACard: Card,
    AEmpty: Empty,
    caseType,
    newList,
    newListBase,
    APage: page,
  },
})
export default class CaseIndex extends Vue {
  key: string = '本地案例库';

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'dictionaryId',
    value: 'name',
  };

  tabList: any = [
    // {
    //   key: '投资项目审计',
    //   tab: '投资项目审计',
    // },
    // {
    //   key: '财务收支审计',
    //   tab: '财务收支审计',
    // },
    // {
    //   key: '经济责任审计',
    //   tab: '经济责任审计',
    // },
    // {
    //   key: '执法活动',
    //   tab: '执法活动',
    // },
    // {
    //   key: '专项审计',
    //   tab: '专项审计',
    // },
    {
      key: '本地案例库',
      tab: '本地案例库',
    },
    {
      key: '基础案例库',
      tab: '基础案例库',
    },
  ];

  contentList: any = {
    // 投资项目审计: '投资项目审计',
    // 财务收支审计: '财务收支审计',
    // 经济责任审计: '经济责任审计',
    // 执法活动: '执法活动',
    // 专项审计: '专项审计',
    本地案例库: '本地案例库',
    基础案例库: '基础案例库',
  };

  tabs: any = [];

  searchVal: any = '';

  dataContent: any = {};

  // @Watch('key', { deep: true, immediate: true })
  onChangeActiveKey(newVal: any, type: any) {
    this[type] = newVal;
    //获取列表
    this.tabs = []
    this.reset();
  }

  created() {
    //获取列表
    this.search();
    //审计类型
    // this.getTree();
  }


  // async getTree() {
  //   const res: any = await api.queryAuditTypeList();
  //   //auditCategoryData
  //   if (res.code === '00000') {
  //     this.auditCategoryData = res.data[0]['children'];
  //   } else {
  //     this.auditCategoryData = [];
  //   }
  // }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  async getList(queryPage) {
    let queryPageStringify = qs.stringify(queryPage);
    let maps: any = {};
    let res: any = {};
    maps['caseName'] = this.searchVal;
    this.tabs.map((item) => {
      if (item && item['ids']) {
        maps[item['type']] = item['ids'];
      } else {
        maps[item['type']] = [item['id']];
      }
    });
    if (this.key === '基础案例库') {
      res = await api.basicPagingQuery(maps, queryPageStringify);
    } else {
      res = await api.caseFilePagingQuery(maps, queryPageStringify);
    }
    if (res.errmsg === 'success' && res.data) {
      let option = res.data;
      option.content = option.content.map(({caseName, ...rest}) => ({ ...rest, templateName : caseName}));
      // option['total'] = Number(option['total']);
      this.dataContent = option;
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
    if (selectedKeys && selectedKeys['type'] === 'caseDirectoryId') {
      selectedKeys['type'] = 'caseDirectoryId';
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

  reset() {
    // this.auditCategoryVal = [];
    // this.ProcessVal = [];
    // this.departmentListVal = [];
    this.searchVal = '';
    this.search();
  }

  setUn(data: any) {
    data.map((item: any) => {
      if (item && item.children && item.children.length > 0) {
        item.children = this.setUn(item.children);
      } else {
        item.children = null;
      }
    });
    return data;
  }
}
</script>
<style lang="less" scoped>
.Case {
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
