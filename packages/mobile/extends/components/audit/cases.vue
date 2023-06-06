<template>
<div>
<pad>
  <a-row class="elRowOne">
    <a-col :span="24">
      <a-col :span="12" class="AuditType">
        <queryTree v-model="templateType" :treeCheckable="false" :isReturnName="true" :code="code" @changeObj="changeDictionaryId" />
      </a-col>
      <a-col :span="12" class="AuditType">
        <a-input 
              v-model="searchKey"
              :placeholder="$t('languages.common.form.placeholder')"
              class="input-search"
              allowClear
          />
      </a-col>
    </a-col>
    <a-col :span="24">
      <a-col :span="12" class="AuditType">
        <a-select v-model="caseVal" style="width:100%;">
            <a-select-option
                v-for="(item) in caseList"
                :key="item.id"
                :value="item.id"
            >{{ item.name }}</a-select-option>
        </a-select>
      </a-col>
      <a-col v-show="caseVal === '1'" :span="12" class="AuditType">
        <a-select v-model="dictVal" style="width:100%;" allowClear>
            <a-select-option
                v-for="(item) in dictList"
                :key="item.id"
                :value="item.id"
            >{{ item.name }}</a-select-option>
        </a-select>
      </a-col>
    </a-col>
    <a-col :span="24" class="AuditType">
      <a-button 
            type="primary"
            class="btns"
            @click="search"
            >
            {{ $t('languages.common.form.search') }}
        </a-button>
    </a-col>
  </a-row>
  <!-- <a-row>
    <elTag v-model="auditType" :list="auditList" />
  </a-row> -->
</pad>
<pad>
  <!-- <caseSort :count="count" /> -->
  <caseNewList  :obj="dataContent" />
</pad>
<pad>
  <a-page :obj="dataContent" @searchPage="searchPage" />
</pad>

</div>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import pad from '@/../extends/components/static/pad.vue';
import elTag from '@/../extends/components/static/tag.vue';
import caseSort from '@/../extends/components/audit/cases/sort.vue';
import caseNewList from '@/../extends/components/audit/cases/newList.vue';
import queryTree from '@/../extends/components/tree/queryTree.vue';
import page from '@/../extends/components/static/page.vue';

import { Row,Col,Select,Button } from "@h3/antd-vue";

import api  from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'cases',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AButton: Button,
    APage:page,
    pad,
    elTag,
    caseSort,
    caseNewList,
    queryTree
  },
})
export default class Cases extends Vue {

  count:number = 1;

  auditType:number = 1;

  auditList: any = [
      {
          id: 1,
          name: '审计方案案例',
          name_i18n: 'Audit Scheme Case',
      },
      {
          id: 2,
          name: '审计实施案例',
          name_i18n: 'Audit Implementation Cases',
      },
      {
          id: 3,
          name: '审计报告案例',
          name_i18n: 'Audit Report Cases',
      },
      {
          id: 4,
          name: '审计整改案例',
          name_i18n: 'Audit Rectification Cases',
      },
  ]

  searchList:any = [
      {
          id: 'regulationName',
          name: '标题',
          name_i18n: 'title',
      }
  ];
  
  templateType:any = [];

  code:string = 'SJMB';

  codeNew:any = {
    'bd_ysProjects': {
      'code': 'SJMB-001-001',
      'name': '投资项目审计'
    },
    'bd_zbProjects': {
      'code': 'SJMB-001-001',
      'name': '投资项目审计'
    },
    'bd_projectht': {
      'code': 'SJMB-001-001',
      'name': '投资项目审计'
    },
    'js001': {
      'code': 'SJMB-001-001',
      'name': '投资项目审计'
    },
    'project_records': {
      'code': 'SJMB-001-002',
      'name': '财务收支审计'
    },
    'project_records_ec': {
      'code': 'SJMB-001-003',
      'name': '经济责任审计'
    },
    'project_records_la': {
      'code': 'SJMB-001-004',
      'name': '执法活动审计'
    },
    'project_records_sp': {
      'code': 'SJMB-001-005',
      'name': '专项审计'
    },
    'project_records_jx': {
      'code': 'SJMB-001-005',
      'name': '绩效审计'
    },
  };
  

  created(){
    let schemaCode = (window as any).h3form.formObj.bizSchema.code;
    if(schemaCode && this.codeNew[schemaCode]){
      this.code = this.codeNew[schemaCode]['code'];
    }

    //初始化审计单位
    this.getDictList();
    //初始化列表
    this.getCreated({
      page: '1',
      size: '10',
    });

    this.keyupSubmit();
  }

  dataContent:any = {};

  async getCreated(queryPage:any){
    let queryPageStringify = qs.stringify(queryPage);
    let maps = {};
    let res:any = {};
    let schemaCode = (window as any).h3form.formObj.bizSchema.code;
    if(schemaCode && this.codeNew[schemaCode] && this.codeNew[schemaCode]['name']){
      maps['auditCategory'] = this.codeNew[schemaCode]['name'];
    }else{
      maps['auditCategory'] = '';
    }
    maps['fileName'] = this.searchKey;
    maps['processStage'] = this.templateVal;
    if(this.caseVal === '1'){
      let dictVal:any = this.dictList.find((item:any) => {
        return this.dictVal === item['id'];
      })
      maps['responsibleUnit'] = dictVal && dictVal['name'] ? dictVal['name'] : '';
      res = await api.caseFilePagingQuery(maps, queryPageStringify);
    }else{
      res = await api.basicPagingQuery(maps, queryPageStringify);
    }
    if(res.code === '00000'){
      let option:any = res.data;
      option.content.map((item:any) => {
        if(item && item['caseName']){
          item['fileName'] = item['caseName'];
        }
      })
      res.data.page = Number(option.page);
      res.data.size = Number(option.size);
      res.data.total = Number(option.total);
      this.dataContent = option;
    }else{
      this.dataContent = {};
    }
    

  }

  searchPage(option:any){
    this.getCreated(option);
  }

  dictionaryId:string = '';

  templateVal:string = '';

  changeDictionaryId(val:any){
    console.log(val);
    if(val && val['name']){
      this.templateVal = val['name'];
    }else{
      this.templateVal = '';
    }
    
    //this.dictionaryId = val;
  }


  searchKey:string = '';

  search(val:any){
    this.getCreated({
      page: '1',
      size: '10',
    });
  }

  caseVal:string = '1';

  caseList:any = [
    {
      'id': '1',
      'name':'本地案例库'
    },
    {
      'id': '2',
      'name':'基础案例库'
    },
  ];
  
  dictVal:string = '';

  dictList:any = [];

  async getDictList(){
    let queryPageStringify = qs.stringify({
        'typeCode': 'SJDW'
    });
    const res:any = await api.queryDepartmentList(queryPageStringify);
    if(res.code === '00000'){
        this.dictList = res.data[0]['children'];
    }else{
        this.dictList = [];
    }
  }

  keyupSubmit() {
      document.onkeydown = (e) => {
          let _key = (window as any).event.keyCode;
          //!this.clickState是防止用户重复点击回车
          if (_key === 13) {
            this.getCreated({
              page: '1',
              size: '10',
            });
          }
      }
  }
}
</script>
<style lang="less" scoped>
.elRowOne {
  margin-bottom: 10px;
}
.goAudit {
    cursor: pointer;
    font-size: 12px;
    color: #2970ff;
   // padding-left: 18px;
    padding-top: 2px;
}
</style>
