<template>
<div class="regulation">
  <div class="left">
    <a-row>
      <a-col :span="12" class="elCol">
        <adapt-question-type v-model="typeList" @select="select" />
      </a-col>
      <a-col :span="12" class="elCol">
        <effectivene v-model="potencyList" @select="select" />
      </a-col>
      <a-col :span="12" class="elCol">
        <deptList v-model="deptList" @select="select" />
      </a-col>
      <a-col :span="12" class="elCol">
        <a-select v-model="rangeDate" allowClear style="width: 100%" dropdownClassName="rangeDate" placeholder="请选择年份">
          <a-select-option
              v-for="(item) in yearList"
              :key="item.dictionaryId"
              :value="item.dictionaryId"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="header">
        <a-col :span="12" class="elCol">
          <a-select v-model="centralRegionValue" style="width: 100%" dropdownClassName="rangeDate">
            <a-select-option
              v-for="item in centralRegion"
              :key="item.name"
              >{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="12" class="elCol">
          <a-select v-model="words" style="width: 100%" dropdownClassName="rangeDate">
            <a-select-option
              v-for="item in keyWords"
              :key="item.id"
              placeholder="请选择"
              >{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="14" class="elCol">
          <a-input
                v-model="searchVal"
                style="width: 100%"
                autocomplete="off"
                allowClear
                placeholder="请输入关键词"
                @keyup.enter="search"
              />
        </a-col>
        <a-col :span="10" class="elCol">
            <div style="width:1px;height:9px;"></div>
            <a-button class="elButton" @click="reset">重置</a-button>
            <a-button type="primary" @click="search">检索</a-button>
        </a-col>
        <!-- <a-col :span="24" class="elCol">
          检索条件：<a-tag
            v-for="item in tabs"
            :key="item.type"
            color="#108ee9"
            closable
            @close="close(item)"
          >
            {{ item.title }} ： {{ item.name }}
          </a-tag>
        </a-col> -->
    </a-row>
  </div>
  <div class="content">
      <newList :dataContent="dataContent" />
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
import adaptQuestionType from '@/../extends/components/tree/adaptQuestionTypeT.vue';
import effectivene from '@/../extends/components/tree/effectiveLevel.vue';
import deptList from '@/../extends/components/tree/publishingDepartment.vue';
import year from '@/../extends/components/support/year.vue';
import newList from '@/../extends/views/regulation/components/newList.vue';
import page from '@/../extends/components/static/page.vue';
import { Row, Col, Select, Input, Button, Tag, Form } from '@h3/antd-vue';
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
      id: '',
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

  rangeDate: any[] | any = [];

  yearList:any = [];

  typeList:any = [];

  potencyList:any = [];

  deptList:any = [];

  async getYearList(){
    const res:any = await api.queryYearList();
    if(res.code === '00000'){
        this.yearList = res.data[0]['children'];
    }else{
        this.yearList = [];
    }
  }

  created() {
    //this.search();
    this.getYearList();
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

    maps['typeList'] = this.typeList;
    maps['potencyList'] = this.potencyList;
    maps['deptList'] = this.deptList;
    maps['yearList'] = this.rangeDate && this.rangeDate.length > 0 ? [this.rangeDate] : [];
    let queryPageStringify = qs.stringify(queryPage);
    let res: any = {};
    try {
      res = await api.queryPageQuery(maps, queryPageStringify);
    }catch(err:any) {
      console.log(err);
    }
    if (res.code === '00000') {
      let option = res.data;
      
      option['total'] = Number(option['total']);
      option['size'] = Number(option['size']);
      option['page'] = Number(option['page']);
      
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
    console.log(selectedKeys);
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
    this.searchVal = '';  
    this.typeList = [];
    this.potencyList = [];
    this.deptList = [];
    this.rangeDate = [];
    this.centralRegionValue = '全部';
    this.words = 'regulationName'
    this.tabs = [];
    this.search();
  }
}
</script>
<style lang="less" scoped>
.regulation {
  height: 100%;
  padding: 12px;
  padding-bottom: 0;
  // display: grid;
  // grid-template-columns: 300px 12px 1fr;
  overflow-y: auto;
  background-color: #fff;
  
  .elCol {
    padding: 3px 3px;
    /deep/ .ant-select-tree li .ant-select-tree-node-content-wrapper {
      font-size: 10px;
    }
  }
  .content {
    margin-top: 12px;
    background-color: #fff;
    height: calc(100% - 176px - 58px);
    overflow-y: auto;
    /deep/ .ant-btn {
      line-height: 22px;
      font-size: 12px;
      border-radius: 2px;
      margin: 3px 3px;
    }
  }
  .left {
    background-color: #fff;
    /deep/ .ant-btn {
      line-height: 32px;
      font-size: 12px;
      border-radius: 2px;
      margin: 0 3px;
    }
  }
  .right {
    .header {
      background-color: #fff;
    }
    
  }
  
}
/deep/ .ant-select-search__field__placeholder,/deep/ .ant-select-selection__placeholder {
  font-size: 10px;
}
/deep/ .ant-select-arrow-icon {
  font-size: 16px;
}
/deep/ .ant-select-arrow {
  top: 71%;
}



/deep/ .ant-select-tree-title {
  font-size: 14px;
} 
/deep/ .ant-select-selection-selected-value {
  font-size: 14px;
}
/deep/ .ant-select-selection__choice__content {
  font-size: 14px;
  margin-right: 3px;
}
/deep/ .ant-select-selection__choice__remove {
  font-size: 20px !important;
}


/deep/ .ant-select-selection__clear {
  top: 13px;
  width: 20px;
  height: 20px;
}
/deep/ .ant-input {
  border-radius: 2px;
  font-size: 14px;
  ::placeholder {
    font-size: 14px;
  }
}



</style>
