<template>
<div class="problemList" @click="showList = false">
  <a-row class="header">
    <a-col :span="12" class="elCol">
      <a-select v-model="field" style="width: 100%" dropdownClassName="rangeDate">
        <a-select-option
          v-for="item in fieldList"
          :key="item.id"
          placeholder="请选择"
          >{{ item.name }}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="12" class="elCol">
      <a-input
        v-model="keyWord"
        autocomplete="off"
        allowClear
        placeholder="请输入关键词"
        @change="getAssociate"
        @keyup.enter="nextSerach"
      />
    </a-col>
    <a-col :span="12" class="elCol">
      <a-select v-model="source" style="width: 100%" allowClear dropdownClassName="rangeDate" placeholder="来源">
        <a-select-option v-for="item in sourceList" :key="item.value">{{
          item.label
        }}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="12" class="elCol">
      <a-tree-select
        v-model="dictionaryId"
        class="indexSelect"
        :treeData="queryList"
        :replaceFields="replaceFields"
        style="width: 100%"
        allowClear
        :dropdownMatchSelectWidth="true"
        dropdownClassName="rangeDate"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择目录分类"
      />
    </a-col>
    <a-col :span="24" class="elCol">
      <a-button class="elButton" @click="reset">重置</a-button>
      <a-button type="primary" @click="search">检索</a-button>
    </a-col>
  </a-row>
  <div class="content">
      <newList1 :dataContent="dataContent" />
  </div>
  <div class="page">
      <a-page
        :obj="dataContent"
        style="display: flex; justify-content: center"
        @searchPage="searchPage"
      />
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
    { label: '基础数据库', value: 1 },
    { label: '本地数据库', value: 2 },
    { label: '新增问题库', value: 3 },
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

  source: any = [];

  queryList: any = [];

  dictionaryId: any = [];

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'dictionaryId',
    value: 'dictionaryId',
  };

  dataContent: any = {};

  AssociateWords: any = [];

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
    if (res.code === '00000') {
      this.queryList = res.data[0]['children'];
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
    if(typeof this.source === 'number'){
      maps['source'] = this.source;
    }else{
      maps['source'] =  this.source && this.source.length > 0  ? this.source : '';
    }
    maps['dictionaryId'] = this.dictionaryId && this.dictionaryId.length > 0  ? this.dictionaryId : '';
    let queryPageStringify = qs.stringify(queryPage);

    const res: any = await api.search(maps, queryPageStringify);
    if (res.code === '00000') {
      let option = res.data;
      option['total'] = Number(option['total']);
      this.dataContent = res.data;
    } else {
      this.dataContent = {};
    }
  }

  searchPage(option: any) {
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
  overflow-y: auto;
  .header {
    padding: 8px;
    background-color: #fff;
    /deep/ .anticon {
      font-size: 20px !important;
    }
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
    padding: 8px;
    background-color: #fff;
    height: calc(100% - 160px - 30px);
    overflow-y: auto;
  }

}
/deep/ .ant-select-selection-selected-value {
  font-size: 14px;
}

/deep/ .ant-select-arrow {
  top: 71%;
}
/deep/ .ant-input-affix-wrapper {
  line-height: 32px;
  font-size: 14px;
}
/deep/ .ant-input {
  line-height: 32px;
  font-size: 14px;
  border-radius: 2px;
}

.elCol {
  padding: 3px 3px;
  /deep/.ant-btn {
    border-radius: 2px;
    font-size: 14px;
    line-height: 32px;
    margin: 0 3px;
  }
}
/deep/ .ant-select-selection__placeholder {
  font-size: 14px;
}
</style>
