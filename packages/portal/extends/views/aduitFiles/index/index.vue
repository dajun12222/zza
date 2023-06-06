<template>
  <div class="aduitfiles">
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
              <a-col :span="6" class="elCol">
                <a-input
                  v-model="searchVal"
                  autocomplete="off"
                  style="width: 250px"
                  allowClear
                  placeholder="搜索项目名称"
                />
              </a-col>
              <a-col :span="6" class="elCol">
                <a-input
                  v-model="projectNumber"
                  autocomplete="off"
                  style="width: 250px"
                  allowClear
                  placeholder="搜索项目编号"
                />
              </a-col>
              <a-col :span="6" class="elCol">
                <a-select
                  v-model="projectNode"
                  placeholder="项目阶段"
                  allowClear
                  style="width: 250px"
                >
                  <a-select-option
                    v-for="(item, index) in projectNodeList"
                    :key="item.value + index"
                    :value="item.value"
                    >{{ item.title }}</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6" class="elCol">
                <a-select
                  v-model="queryListVal"
                  placeholder="请选择审计单位"
                  allowClear
                  style="width: 250px"
                >
                  <a-select-option
                    v-for="item in queryListData"
                    :key="item.dictionaryId"
                    :value="item.name"
                    >{{ item.name }}</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6" class="elCol">
                <a-tree-select
                  v-if="contentList[key] === 'Investment'"
                  v-model="departmentListVal"
                  class="indexSelect"
                  :treeData="departmentListData"
                  :replaceFields="replaceFields"
                  allowClear
                  style="width: 250px"
                  :dropdownMatchSelectWidth="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择送审单位"
                />
                <a-select
                  v-else
                  v-model="departmentListVal"
                  placeholder="请选择被审计单位"
                  allowClear
                  style="width: 250px"
                >
                  <a-select-option
                    v-for="item in departmentListData2"
                    :key="item.dictionaryId"
                    :value="item.name"
                    >{{ item.name }}</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6" class="elCol">
                <a-select
                  v-model="yearVal"
                  placeholder="归档年度"
                  allowClear
                  style="width: 250px"
                >
                  <a-select-option
                    v-for="(item, index) in yearList"
                    :key="item.value + index"
                    :value="item.value"
                    >{{ item.label }}</a-select-option>
                </a-select>
              </a-col>

              <a-col :span="12" class="elCol">
                <a-button class="elButton" @click="reset">重置</a-button>
                <a-button type="primary" class="elButton" @click="search">检索</a-button>
              </a-col>
            </a-row>
            <div class="content">
              <newList
                v-if="contentList[key] === 'Investment'"
                :dataContent="dataContent"
              />
              <newListOther v-else :dataContent="dataContent" :types="key" />
              <a-page
                :obj="dataContent"
                style=" margin-top: 12px;
                  display: flex;
                  justify-content: flex-end;
                "
                @searchPage="searchPage"
              />
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import questionType from '@/../extends/components/support/questionType.vue';
import problemType from '@/../extends/components/support/problemType.vue';
import newList from '@/../extends/views/aduitFiles/components/newList.vue';
import newListOther from '@/../extends/views/aduitFiles/components/newListOther.vue';
import page from '@/../extends/components/static/page.vue';
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Tabs,
  Card,
  TreeSelect,
} from '@h3/antd-vue';
import api from '@/../extends/api';

const qs = require('qs');
@Component({
  name: 'problemIndex',
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
    questionType,
    problemType,
    newList,
    newListOther,
    APage: page,
    ACard: Card,
    ATreeSelect: TreeSelect,
  },
})
export default class problemIndex extends Vue {
  queryListVal: any = [];

  queryListData: any = [];

  departmentListVal: any = [];

  departmentListData: any = [];

  departmentListData2: any = [];

  yearVal: any = '';
  
  yearList: any = [];

  projectNode: any = '';
  
  projectNodeList: any = [
    {
        title:'预算文件',
        value:'预算文件',
    },
    {
        title:'采购文件',
        value:'采购文件',
    },
    {
        title:'待签合同',
        value:'待签合同',
    },
    {
        title:'结算文件',
        value:'结算文件',
    },
  ];

  tabs: any = [];

  projectNumber: any = '';

  searchVal: any = '';

  dataContent: any = {};

  activeKey: any = '';

  key: string = 'Investment';

  tabList: any = [
    {
      key: 'Investment',
      tab: '投资项目审计',
    },
    {
      key: 'Financial',
      tab: '财务收支审计',
    },
    {
      key: 'Economic',
      tab: '经济责任审计',
    },
    {
      key: 'LawsActive',
      tab: '执法活动',
    },
    {
      key: 'SpecialAudit',
      tab: '专项审计',
    },
  ];

  contentList: any = {
    Investment: 'Investment',
    Financial: 'Financial',
    Economic: 'Economic',
    LawsActive: 'LawsActive',
    SpecialAudit: 'SpecialAudit',
  };

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'name',
    value: 'name',
  };

  // @Watch('activeKey', { deep: true, immediate: true })
  onChangeActiveKey(newVal: any, type: any) {
    this[type] = newVal;
    //获取列表
    this.reset();
  }

  created() {
    //获取列表
    this.search();
    //审计单位
    this.getQueryList();
    //被审计单位/送审单位
    this.getDepartmentList();
    //归档年份
    this.getYear();
    //初始化
    this.yearVal = undefined;
    this.projectNode = undefined;
  }

  async getQueryList() {
    //
    let queryPage: any = {
      typeCode: 'SJDW',
    };
    let queryPageStringify = qs.stringify(queryPage);
    const res: any = await api.queryDepartmentList(queryPageStringify);
    if (res.code === '00000') {
      this.queryListData = this.setUn(res.data[0]['children']);
    } else {
      this.queryListData = [];
    }
  }

  async getDepartmentList() {
    let SSDWPage: any = {
      typeCode: 'SSDW',
    };
    let BSDWPage: any = {
      typeCode: 'BSDW',
    };
    let querySSDWPageStringify = qs.stringify(SSDWPage);
    let queryBSDWPageStringify = qs.stringify(BSDWPage);
    const SSDW_res: any = await api.queryDepartmentList(querySSDWPageStringify);
    const BSDW_res: any = await api.queryDepartmentList(queryBSDWPageStringify);
    if (SSDW_res.code === '00000') {
      this.departmentListData = this.setUn(SSDW_res.data[0]['children']);
    } else {
      this.departmentListData = [];
    }
    if (BSDW_res.code === '00000') {
      this.departmentListData2 = this.setUn(BSDW_res.data[0]['children']);
    } else {
      this.departmentListData2 = [];
    }
  }

  getYear() {
    const YearData: any = [];
    for (let i = 0; i < 3; i++) {
      YearData.push({
        value: (new Date().getFullYear() - i).toString(),
        label: (new Date().getFullYear() - i).toString(),
      });
    }
    this.yearList = YearData;
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  async getList(queryPage) {
    let maps: any = {};
    maps['projectName'] = this.searchVal;
    maps['projectNumber'] = this.projectNumber;
    maps['auditUnit'] = this.queryListVal.toString();
    maps['responsibleUnit'] = this.departmentListVal.toString();
    maps['filingYear'] = this.yearVal;
    maps['projectNode'] = this.projectNode;
    let queryPageStringify = qs.stringify(queryPage);
    let res: any = {};
    switch (this.key) {
      case 'Investment':
        res = await api.investmentPagingQuery(maps, queryPageStringify);
        break;
      case 'Financial':
        res = await api.financialPagingQuery(maps, queryPageStringify);
        break;
      case 'Economic':
        res = await api.economicPagingQuery(maps, queryPageStringify);
        break;
    }
    if (res.code === '00000' && res.data) {
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
    this.getList(option);
  }

  queryListChange(value) {
    this.queryListVal = value;
  }

  departmentChange(value) {
    this.departmentListVal = value;
  }

  reset() {
    this.projectNumber = '';
    this.queryListVal = [];
    this.departmentListVal = [];
    this.yearVal = undefined;
    this.projectNode = undefined;
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
.aduitfiles {
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
