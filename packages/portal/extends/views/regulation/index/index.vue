<template>
  <div class="regulation">
    <div class="left">
      <a-tabs @change="changeTabs">
        <a-tab-pane
          v-for="item in centralRegion"
          :key="item.name"
          :tab="item.name"
        >
          <adapt-question-type :type="centralRegionValue" @select="select" />
          <effectivene :type="centralRegionValue" @select="select" />
          <deptList :type="centralRegionValue" @select="select" />
          <year :type="centralRegionValue" @select="select" />
        </a-tab-pane>
      </a-tabs>
      
    </div>
    <div class="center"></div>
    <div class="right">
      <a-row class="header">
        <a-form :layout="'horizontal'" v-bind="formItemLayout">
          <!-- <a-col :span="4">
            <a-form-item label="分类">
              <a-select v-model="centralRegionValue">
                <a-select-option
                  v-for="item in centralRegion"
                  :key="item.name"
                  >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :span="18">
            <a-form-item label="关键词">
              <a-input-group compact>
                <a-select v-model="words">
                  <a-select-option
                    v-for="item in keyWords"
                    :key="item.id"
                    placeholder="请选择"
                    >{{ item.name }}</a-select-option>
                </a-select>
                <a-input
                  v-model="searchVal"
                  style="width: 70%"
                  autocomplete="off"
                  allowClear
                  placeholder="请输入关键词"
                  @keyup.enter="search"
                />
              </a-input-group>
              <!-- <a-select v-model="words" style="width:100px;">
                            <a-select-option v-for="(item) in keyWords" :key="item.id" placeholder="请选择">{{ item.name }}</a-select-option>
                        </a-select>
                        <a-input v-model="searchVal" autocomplete="off" allowClear placeholder="请输入关键词" style="width:160px;" /> -->
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item style="display: flex; justify-content: right">
              <!-- <a-space> -->
              <a-button class="elButton" @click="reset">重置</a-button>&nbsp;
              <a-button type="primary" @click="search">检索</a-button>
              <!-- </a-space> -->
            </a-form-item>
          </a-col>
          <a-col :span="24">
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
        </a-form>
      </a-row>
      <div class="content">
        <newList :dataContent="dataContent" />
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
import adaptQuestionType from '@/../extends/components/support/adaptQuestionType.vue';
import effectivene from '@/../extends/components/support/effectivene.vue';
import deptList from '@/../extends/components/support/deptList.vue';
import year from '@/../extends/components/support/year.vue';
import newList from '@/../extends/views/regulation/components/newList.vue';
import page from '@/../extends/components/static/page.vue';
import { Row, Col, Select, Input, Button, Tag, Form, Tabs } from '@h3/antd-vue';
import api from '@/../extends/api';
import { InputGroup } from '@h3/antd-vue/types/input/input-group';
const qs = require('qs');
@Component({
  name: 'regulationIndex',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    AInputGroup: Input.Group,
    AButton: Button,
    ATag: Tag,
    AForm: Form,
    AFormItem: Form.Item,
    adaptQuestionType,
    effectivene,
    deptList,
    year,
    newList,
    APage: page,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
  },
})
export default class regulationIndex extends Vue {
  formItemLayout: any = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  tabs: any = [];

  centralRegionValue: any = '全部';

  @Watch('centralRegionValue', { deep: true, immediate: true })
  onChangeCentralRegionValue(newVal: any) {
    if (newVal) {
      this.search();
    }
  }

  centralRegion: any = [
    {
      id: 1,
      name: '全部',
    },
    {
      id: 2,
      name: '中央法规',
    },
    {
      id: 3,
      name: '地方法规',
    },
  ];

  words: string = 'regulationName';

  keyWords: any = [
    {
      id: 'regulationName',
      name: '法规名称',
    },
    {
      id: 'releaseNumber',
      name: '发文字号',
    },
    {
      id: 'fullText',
      name: '全文',
    },
  ];

  searchVal: any = '';

  dataContent: any = {};

  created() {
    //this.search();
  }

  changeTabs(key){
    this.centralRegionValue = key
    this.tabs = []
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  async getList(queryPage) {
    let maps: any = {};
    if (this.words) {
      maps[this.words] = this.searchVal.trim();
    }

    maps['category'] = this.centralRegionValue || '';
    if (maps['category'] === '全部') {
      maps['category'] = '';
    }
    this.tabs.map((item) => {
      maps[item['type']] = [item['ids'],item['id']];
    });
    let queryPageStringify = qs.stringify(queryPage);
    let res: any = {};
    try {
      res = await api.queryPageQuery(maps, queryPageStringify);
    } catch (err: any) {
      console.log(err);
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
    if (!this.tabs) {
      this.tabs.push(selectedKeys);
      return;
    }
    // this.tabs.push(selectedKeys)
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
    this.centralRegionValue = '全部';
    this.searchVal = '';
    this.words = 'regulationName';
    this.tabs = [];
    this.search();
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
    .header {
      padding: 24px;
      background-color: #fff;
      border-radius: 5px !important;
      box-shadow: 0 0 5px #d4e4fa;
    }
    .content {
      margin-top: 12px;
      padding: 24px;
      background-color: #fff;
      border-radius: 5px !important;
      box-shadow: 0 0 5px #d4e4fa;
    }
  }
  .ant-tabs {
    /deep/ .ant-tabs-tab {
      padding: 8px;
      margin-right: 15px;
    }
  }
}
</style>
