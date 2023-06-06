<template>
  <div class="Case">
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
                <a-input v-if="qh === '1'"
                  v-model="searchVal"
                  autocomplete="off"
                  style="width: 250px"
                  allowClear
                  placeholder="搜索审计文件"
                />
                <a-input v-if="qh === '2'"
                  v-model="searchVal"
                  autocomplete="off"
                  style="width: 250px"
                  allowClear
                  placeholder="搜索审计问题"
                />
              </a-col>
              <a-col v-if="contentList[key] === '投资项目审计'" :span="6" class="elCol">
                <a-select
                  v-model="sjdw"
                  placeholder="请选择审计单位"
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
              
              <a-col
                v-if="contentList[key] === '投资项目审计'"
                :span="6"
                class="elCol"
              >
                <a-tree-select
                  v-model="departmentListVal"
                  class="indexSelect"
                  :treeData="departmentListData"
                  :replaceFields="replaceFields"
                  treeDefaultExpandAll
                  allowClear
                  style="width: 250px"
                  :dropdownMatchSelectWidth="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择送审单位"
                />
              </a-col>
              <a-col v-if="contentList[key] !== '投资项目审计'" :span="6" class="elCol">
                <a-tree-select
                  v-model="bsdw"
                  class="indexSelect"
                  :treeData="bsdwListData"
                  :replaceFields="replaceFields"
                  treeDefaultExpandAll
                  allowClear
                  style="width: 250px"
                  :dropdownMatchSelectWidth="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择被审计单位"
                />
              </a-col>
              <a-col :span="6" class="elCol"><a-select
                  v-model="gdnd"
                  placeholder="请选择归档年度"
                  allowClear
                  style="width: 250px"
                >
                  <a-select-option
                    v-for="item in gdndData"
                    :key="item.id"
                    :value="item.name"
                    >{{ item.name }}</a-select-option>
                </a-select></a-col>
                <a-col v-if="contentList[key] === '投资项目审计'" :span="6" class="elCol">
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
                <a-button class="elButton" @click="reset">重置</a-button>
                <a-button type="primary" class="elButton" @click="search">检索</a-button>
              </a-col>
            </a-row>
            <!-- 表格 -->
            <div>
              <a-tabs :activeKey="qh" @change="callback">
                <a-tab-pane key="1" tab="审计文件">
                  <newList :dataContent="dataContent" />
                  <a-page
                    :obj="dataContent"
                    style=" margin-top: 12px;
                      display: flex;
                      justify-content: flex-end;
                    "
                    :page="option.page"
                    :total="option.total"
                    :pageSize="option.size"
                    :current="option.page"
                    @searchPage="searchPage"
                  />
                </a-tab-pane>
                <a-tab-pane key="2" tab="审计问题" forceRender>
                  <newListBase :dataContent="dataContent1" :typeKey="key" />
                  <a-page
                    :obj="dataContent1"
                    style="
                      margin-top: 12px;
                      display: flex;
                      justify-content: flex-end;
                    "
                    :page="option1.page"
                    :total="option1.total"
                    :pageSize="option1.size"
                    :current="option1.page"
                  />
                </a-tab-pane>
              </a-tabs>

              <!-- 2345-1 -->
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
import newListBase from '@/../extends/views/Case1/components/newListBase.vue';
import newList from '@/../extends/views/Case1/components/newList.vue';
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
  name: 'CaseIndex1',
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
    questionType,
    problemType,
    newList,
    newListBase,
    APage: page,
  },
})
export default class CaseIndex1 extends Vue {
  key: string = '投资项目审计';

  // key: string = '财务收支审计';

  projectNode: any =  [];
  
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

  ProcessData: any = [];

  departmentListVal: any = [];

  sjdw: any = [];

  departmentListData: any = [];

  departmentListData2: any = [];

  gdnd: any = [];

  bsdw: any = [];

  qh: any = '1';

  bsdwListData: any = [];

  gdndData: any = [];

  dataContent1: any = [];

  option1: any = {
    page: 1,
    size: 10,
    total: 0,
  };

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'name',
    value: 'name',
  };

  tabList: any = [
    {
      key: '投资项目审计',
      tab: '投资项目审计',
    },
    {
      key: '财务收支审计',
      tab: '财务收支审计',
    },
    {
      key: '经济责任审计',
      tab: '经济责任审计',
    },
    {
      key: '执法活动',
      tab: '执法活动',
    },
    {
      key: '专项审计',
      tab: '专项审计',
    },
  ];

  contentList: any = {
    投资项目审计: '投资项目审计',
    财务收支审计: '财务收支审计',
    经济责任审计: '经济责任审计',
    执法活动: '执法活动',
    专项审计: '专项审计',
  };

  tabs: any = [];

  searchVal: any = '';

  dataContent: any = {};

  option: any = {};

  // @Watch('key', { deep: true, immediate: true })
  onChangeActiveKey(newVal: any, type: any) {
    this[type] = newVal;
    console.log(newVal);
    console.log(type);
    //获取列表
    this.qh = '1';
    this.option = this.option1;
    this.reset();
  }

  callback(key) {
    console.log(key);
    this.qh = key;
    this.reset();
  }

  created() {
    //获取列表
    this.search();
    //归档年度
    this.getgd();
    //被审计单位/送审单位
    this.getDepartmentList();
  }

  getgd() {
    const gdndData: any = [{}];
    for (let i = 0; i < 3; i++) {
      gdndData.push({
        name: new Date().getFullYear() - i,
        id: new Date().getFullYear() - i,
        type: '归档年度',
        children: null,
      });
    }
    this.gdndData = gdndData;
  }

  async getDepartmentList() {
    let SSDWPage: any = {
      typeCode: 'SSDW',
    };
    let SJDWPage: any = {
      typeCode: 'SJDW',
    };
    let BSDWPage: any = {
      typeCode: 'BSDW',
    };
    let querySSDWPageStringify = qs.stringify(SSDWPage);
    let querySJDWPageStringify = qs.stringify(SJDWPage);
    let queryBSDWPageStringify = qs.stringify(BSDWPage);
    const SSDW_res: any = await api.queryDepartmentList(querySSDWPageStringify);
    const SJDW_res: any = await api.queryDepartmentList(querySJDWPageStringify);
    const BSDW_res: any = await api.queryDepartmentList(queryBSDWPageStringify);
    if (SSDW_res.code === '00000') {
      let dw = this.setUn(SSDW_res.data[0]['children']);
      this.departmentListData = [];
      dw.map((item) => {
        delete item.children;
        this.departmentListData.push(item);
      });
    } else {
      this.departmentListData = [];
    }
    if (SJDW_res.code === '00000') {
      this.departmentListData2 = this.setUn(SJDW_res.data[0]['children']);
    }
    if (BSDW_res.code === '00000') {
      this.bsdwListData = this.setUn(BSDW_res.data[0]['children']);
    } else {
      this.departmentListData2 = [];
    }
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  // 列表
  async getList(queryPage) {
    let queryPageStringify = qs.stringify(queryPage);
    let maps: any = {};
    let res: any = {};
    if (this.qh === '1') {
      maps['fileName'] = this.searchVal;
      
    } else {
      maps['auditProblemName'] = this.searchVal;
    }
    maps['auditCategory'] = this.key;
    maps['isShare'] = 1;
    maps['filingYear'] = this.gdnd.toString();
    // maps['responsibleUnit'] = this.departmentListVal.toString();
    if (this.key === '投资项目审计') {
      maps['projectNode'] = this.projectNode.toString();
      maps['auditUnit'] = this.sjdw.toString();
      maps['responsibleUnit'] = this.departmentListVal.toString();
    } else if (this.key === '财务收支审计') {
      maps['responsibleUnit'] = this.bsdw.toString();
    } else {
      this.dataContent = {};
      this.option = this.option1;
      return false;
    }
    if (this.qh === '1') {
      res = await api.localAuditReportQuery(maps, queryPageStringify);
      if (res.code === '00000') {
        this.option = res.data;
        this.option['total'] = Number(this.option['total']);
        this.option['page'] = Number(this.option['page']);
        this.option['size'] = Number(this.option['size']);
        this.dataContent = res.data;
      } else {
        this.dataContent = {};
        this.option = this.option1;
      }
      
    } else {
      res = await api.localAuditQuestionQuery(maps, queryPageStringify);
      if (res.code === '00000') {
        this.option = res.data;
        this.option['total'] = Number(this.option['total']);
        this.option['page'] = Number(this.option['page']);
        this.option['size'] = Number(this.option['size']);
        this.dataContent1 = res.data;
      } else {
        this.dataContent1 = {};
        this.option1 = this.option1;
      }
    }
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

  cascaderChange(value) {
    this.gdnd = value;
  }

  departmentChange(value) {
    this.departmentListVal = value;
  }

  reset() {
    this.gdnd = [];
    this.departmentListVal = [];
    this.searchVal = '';
    this.sjdw = [];
    this.bsdw = [];
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
