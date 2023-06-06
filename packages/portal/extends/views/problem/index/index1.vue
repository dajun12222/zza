<template>
  <div class="problemList" @click="showList = false">
    <div class="content">
      <a-row class="header">
        <a-form :layout="'horizontal'" v-bind="formItemLayout">
          <a-col :span="9" style="position:relative">
            <a-form-item label="关键词">
              <a-input-group compact>
                <a-select v-model="field" style="width: 30%">
                  <a-select-option
                    v-for="item in fieldList"
                    :key="item.id"
                    placeholder="请选择"
                    >{{ item.name }}</a-select-option>
                </a-select>
                <div style="width: 70%; position: relative">
                  <a-input
                    v-model="keyWord"
                    autocomplete="off"
                    allowClear
                    placeholder="请输入关键词"
                    @change="getAssociate"
                    @keyup.enter="nextSerach"
                  />
                  <a-list
                    v-show="AssociateWords.length > 0 && showList"
                    ref="showList"
                    class="loadmore-list"
                    :data-source="AssociateWords"
                    itemLayout="horizontal"
                  >
                    <a-list-item
                      slot="renderItem"
                      slot-scope="item"
                      class="associate-item"
                      style="padding: 8px 16px"
                      @click="keyWord = item.replace(/<.*?>/gi, '')"
                    >
                      <span v-html="item"></span>
                    </a-list-item>
                  </a-list>
                </div>
              </a-input-group>
            </a-form-item>
            <span class="Disclaimer">*检索结果仅供参考，审计人员应根据实际情况编写问题定性</span>
          </a-col>
          <a-col :span="4">
            <a-form-item label="来源">
              <a-select v-model="source">
                <a-select-option v-for="item in sourceList" :key="item.value">{{
                  item.label
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="问题目录">
              <a-tree-select
                v-model="dictionaryId"
                class="indexSelect"
                :treeData="queryList"
                :replaceFields="replaceFields"
                allowClear
                :dropdownMatchSelectWidth="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择问题目录"
              />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item style="display: flex; justify-content: right">
              <a-button class="elButton" @click="reset">重置</a-button>
              <a-button type="primary" @click="search">检索</a-button>
            </a-form-item>
          </a-col>
        </a-form>
        
      </a-row>
      <div class="content">
        <newList1 :dataContent="dataContent" />
        <div style="text-align: center;">
          <a-divider style="margin-top: 0;" />
          <a-button class="elButton" @click="searchPage">加载更多</a-button>
        </div>
        <!-- <a-page
          :obj="dataContent"
          style="margin-top: 12px; display: flex; justify-content: flex-end"
          @searchPage="searchPage"
        /> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import newList1 from '@/../extends/views/problem/components/newList1.vue';
import page from '@/../extends/components/static/page.vue';
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Form,
  TreeSelect,
  List,
  Divider
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
    AInputGroup: Input.Group,
    AButton: Button,
    ATag: Tag,
    ATreeSelect: TreeSelect,
    AForm: Form,
    AFormItem: Form.Item,
    AList: List,
    AListItem: List.Item,
    newList1,
    APage: page,
    ADivider: Divider,
  },
})
export default class problemIndex extends Vue {
  formItemLayout: any = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  @Watch('centralRegionValue', { deep: true, immediate: true })
  onChangeCentralRegionValue(newVal: any) {
    // if(newVal){
    this.search();
    // }
  }

  centralRegionValue: any = '问题定性';

  sourceList: any = [
    { label: '基础问题库', value: '基础问题库' },
    { label: '本地问题库', value: '本地问题库' },
    { label: '新增问题库', value: '新增问题库' },
  ];

  field: string = 'qualitative_problem';

  fieldList: any = [
    {
      id: 'qualitative_problem',
      name: '问题定性',
    },
    {
      id: 'qualitative_basis',
      name: '定性依据',
    },
  ];

  showList: boolean = false;

  keyWord: any = '';

  source: any = null;

  queryList: any = [];

  dictionaryId: string = '';

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'id',
    value: 'id',
  };

  dataContent: any = {};

  AssociateWords: any = [];

  dataPage: number = 0;

  created() {
    this.search();
    //目录分类
    this.queryQuestionTypeList();
  }

  nextSerach() {
    this.showList = false;
    this.search()
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }
  

  async getAssociate(val) {
    this.dictionaryId = '';
    const res: any = await api.keywordSuggest(
      this.field === 'qualitative_problem' ? 'qualitative_tag' : 'basis_name',
      10,
      this.keyWord.trim(),
    );
    if (res.code === '00000') {
      this.showList = !this.showList;
      this.AssociateWords = res.data;
    } else {
      this.AssociateWords = [];
    }
  }

  async queryQuestionTypeList() {
    const res: any = await api.queryQuestionTypeList();
    if (res.errmsg === 'success') {
      this.queryList = res.data;
      // res.data[0]['children'].forEach((element) => {
      //   var param: any = {};
      //   param['text'] = element.name;
      //   param['value'] = element.name;
      // });
    } else {
      this.queryList = [];
    }
  }

  async getList(queryPage) {
    let maps: any = {};
    maps['field'] = this.field;
    maps['keyWord'] = this.keyWord;
    maps['source'] = this.source;
    maps['dictionaryId'] = this.dictionaryId;
    let queryPageStringify = qs.stringify(queryPage);

    const res: any = await api.search(maps, queryPageStringify);
    if (res.errmsg === 'success') {
      let option = res.data;
      // option['total'] = Number(option['total']);
      if(res.page === 1) {
        this.dataContent = res.data;
      } else {
        this.dataContent = this.dataContent.concat(res.data);
      }
      this.dataPage = res.page;
    } else {
      this.dataContent = {};
    }
  }

  searchPage() {
    let option = {
      page: this.dataPage + 1,size:10
    }
    this.getList(option);
  }

  reset() {
    this.dictionaryId = '';
    this.source = undefined;
    this.keyWord = '';
    this.field = 'qualitative_problem';
    this.search();
  }
}
</script>
<style lang="less" scoped>
.problemList {
  height: 100%;
  padding: 12px;
  overflow-y: auto;
  .content {
    .header {
      padding: 24px;
      background-color: #fff;
      border-radius: 5px !important;
      box-shadow: 0 0 5px #d4e4fa;
    }
    .ant-form-item {
      margin-bottom: 10px;
    }
    .Disclaimer {
      color: #f41e1e;
      font-family: serif;
      position: absolute;
      top: 38px;
      left: 14%;
      font-size: 12px;
    }
    .loadmore-list {
      position: absolute;
      top: 32px;
      z-index: 2;
      width: 100%;
      background: #fff;
      border: 0;
      border-radius: 5px;
      box-shadow: 0 10px 12px #d5d5d5;
      cursor: pointer;
    }
    .content {
      margin-top: 12px;
      padding: 24px;
      background-color: #fff;
      border-radius: 5px !important;
      box-shadow: 0 0 5px #d4e4fa;
    }
  }
}
</style>
