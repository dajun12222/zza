<template>
<div>
<pad>
  <a-row class="elRowOne">
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
      <a-col :span="12" class="AuditType">
        <caseTree v-model="code" :AuditList="AuditTypeList" @select="select" />
      </a-col>
    </a-col>
    <a-col :span="24">
      <!-- <elSearch ref="elSearchRef" showType="2" @search="search" /> -->
      <a-col :span="20" class="AuditType" style="padding-right: 0;">
        <a-input 
              v-model="searchKey"
              :placeholder="$t('languages.common.form.placeholder')"
              class="input-search"
              allowClear
          />
        
      </a-col>
      <a-col :span="4" class="AuditType" style="padding-left: 0;">
        <a-button 
            type="primary"
            class="btns"
            @click="search"
            >
            {{ $t('languages.common.form.search') }}
        </a-button>
       
      </a-col>
    </a-col>
  </a-row>
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
import caseNewList from '@/../extends/components/audit/cases/caseList.vue';
import caseTree from '@/../extends/components/tree/caseTree.vue';
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
    caseTree
  },
})
export default class Cases extends Vue {

  count:number = 1;
  
  templateType:any = [];

  code:any = null;

  tabs: any = [];

  AuditTypeList: any = [];

  selectName:string = '';

  schemaCode = '';

  codeNew:any = {
    'bd_ysProjects': {
      'id': '7b79f70b47ef4860a9fdb86a9380579f',
      'name': '项目审计'
    },
    'bd_zbProjects': {
      'id': '7b79f70b47ef4860a9fdb86a9380579f',
      'name': '项目审计'
    },
    'bd_projectht': {
      'id': '7b79f70b47ef4860a9fdb86a9380579f',
      'name': '项目审计'
    },
    'js001': {
      'id': '7b79f70b47ef4860a9fdb86a9380579f',
      'name': '项目审计'
    },
    'project_records': {
      'id': 'd4bd578bc63e484fb0fdc3406369223b',
      'name': '财务收支审计'
    },
    'project_records_ec': {
      'id': 'aca9e11e72014ce6badb6d376eb52ce3',
      'name': '领导干部经济责任审计'
    },
    'project_records_la': {
      'id': 'a89f5c4ff867413d8849dbab119794d6',
      'name': '执法活动财物审计'
    },
    'project_records_sp': {
      'id': '7f3497f07da047c0a7a36ce8071e4ba1',
      'name': '专项审计'
    },
    'project_records_jx': {
      'id': '0eeb8a4fb07e4e39901648553c892fbb',
      'name': '绩效审计'
    },
  };
  

  created(){

    let schemaCode = (window as any).h3form.formObj.bizSchema.code;
    this.schemaCode = schemaCode
    
    if(schemaCode && this.codeNew[schemaCode] && this.codeNew[schemaCode]['id']){
      this.code = this.codeNew[schemaCode]['id'];
      this.selectName = (window as any).h3form.workflowInfo.activityName;
    }
    this.getAuditTypeList()

    // //初始化列表
    // this.getCreated({
    //   page: '1',
    //   size: '10',
    // });

    // this.keyupSubmit();
  }

  async getAuditTypeList(){
      const res:any = await api.queryCaseDirectory();
      if(res.errmsg === 'success'){
            const List = res.data[0].children;
           
            switch (this.schemaCode) {
                case 'project_records_ec'://经济责任
                    this.AuditTypeList = [List[2]]
                    break;
                case 'project_records_la'://执法
                    this.AuditTypeList = [List[3]]
                    break;
                case 'project_records_sp'://专项
                    this.AuditTypeList = [List[4]]
                    break;
                case 'project_records_jx'://绩效
                    this.AuditTypeList = [List[5]]
                    break;
                case 'project_records'://财务
                    this.AuditTypeList = [List[1]]
                    break;
                // case 'sj0001':
                // case 'xm001':
                // case 'bd_zbProjects':
                // case 'BudgetitemRegistration':
                // case 'BiddingProject':
                // case 'ProjectSummary':
                case 'js001':
                case 'bd_ysProjects':
                case 'bd_zbProjects':
                case 'bd_projectht': //项目
                    this.AuditTypeList = [List[0]]
                    break;
                default:
                    break;
            }
            
        }else{
            this.AuditTypeList = [];
        }
    
  }

  dataContent:any = {};

  async getCreated(queryPage:any){
    let queryPageStringify = qs.stringify(queryPage);
    let maps = {};
    let res:any = {};
    maps['caseName'] = this.searchKey;
    this.tabs.map((item) => {
      if (item && item['ids']) {
        maps[item['type']] = item['ids'];
      } else {
        maps[item['type']] = [item['id']];
      }
    });

    if(this.caseVal === '1'){
      res = await api.caseFilePagingQuery(maps, queryPageStringify);
    }else{
      res = await api.basicPagingQuery(maps, queryPageStringify);
    }
    if(res.errmsg === 'success'){
      let option:any = res.data;
      option.content.map((item:any) => {
        if(item && item['caseName']){
          item['templateName'] = item['caseName'];
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
  
  

  select(selectedKeys){
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
    this.search('')
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
/deep/ .ant-btn-primary {
    min-width: 57px;
}
</style>
