<template>
<div class="content">
<pad>
  <a-row class="elRowOne">
    <!-- <a-col :span="12" class="AuditType">
      <a-select v-model="category" style="width: 100%">
        <a-select-option
          v-for="(item) in auditList"
          :key="item.id"
          :value="item.id"
        >{{ isChinese ? item.name : item.name_i18n }}</a-select-option>
      </a-select>
    </a-col>
    <a-col v-if="category === 1" :span="12" class="AuditType">
      <publishingDepartment />
    </a-col>
    <a-col v-if="category === 1" :span="12" class="AuditType">

      <problemType v-model="AuditTypeValue" :getWorkflowCode="getWorkflowCode" />
    </a-col>
    <a-col v-if="category === 1" :span="12" class="AuditType">
      <queryTemplate v-model="DeptValue" :getWorkflowCode="getWorkflowCode" />
    </a-col>
    <a-col v-if="category === 2" :span="12" class="AuditType">
      <officeType v-model="DeptValue" />
    </a-col> -->
    <a-col :span="24" class="AuditType">

      <queryTree v-model="code" :AuditList="AuditTypeList" @select="select" />
      <!-- <queryTree v-model="templateType" :code="code" :selectName="selectName" @changeDictionaryId="changeDictionaryId" /> -->
    </a-col>


    <a-col :span="24" class="AuditType">
      <elSearch ref="elSearchRef" :list="searchList" showType="2" @search="search" />
    </a-col>
  </a-row>
</pad>
<pad class="newList">
  <!-- <caseSort :count="count" class="caseSort" @setSort="setSort" /> -->
  <a-spin :spinning="spinning">
    <!-- 11111111 -->
    <caseNewList :obj="dataContent" />
  </a-spin>
</pad>
<pad>
  <a-page :obj="dataContent" @searchPage="searchPage" />
</pad>
</div>

</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import pad from '@/../extends/components/static/pad.vue';
import elSearch from '@/../extends/components/static/search.vue';
import caseSort from '@/../extends/components/audit/cases/sort.vue';
import caseNewList from '@/../extends/components/audit/cases/newList.vue';
import goNew from '@/../extends/components/static/goNew.vue';
import page from '@/../extends/components/static/page.vue';
import problemType from '@/../extends/components/tree/problemType.vue';
import publishingDepartment from '@/../extends/components/tree/publishingDepartment.vue';
import officeType from '@/../extends/components/tree/officeType.vue';
import queryTree from '@/../extends/components/tree/queryTree.vue';
import queryTemplate from '@/../extends/components/tree/queryTemplate.vue';
import api  from '@/../extends/api';
const qs = require('qs');
import { message, notification, TreeSelect,Spin,Row,Col,Select } from "@h3/antd-vue";
@Component({
  name: 'templat',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    pad,
    elSearch,
    caseSort,
    caseNewList,
    goNew,
    APage:page,
    ASpin:Spin,
    problemType,
    publishingDepartment,
    officeType,
    queryTemplate,
    queryTree,
  },
})
export default class Templat extends Vue {

  @Prop({}) getWorkflowCode?:string;

  SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;

  dataContent: any  =  {};

  spinning:boolean = false;

  searchContent: any = {};

  count:number = 0;

  sort:string = 'desc';//默认降序排序

  searchList:any = [
    {
        id: 1,
        name: '标题',
        name_i18n: 'title',
    },
    {
        id: 3,
        name: '发布字号',
        name_i18n: 'Release the shop name',
    },
    {
        id: 4,
        name: '全文',
        name_i18n: 'The full text',
    },
  ];

  category:number = 1;

  templateType:any = [];

  @Watch('category')
  onChangeCategory(newVal:any){
    this.DeptValue = [];
    if(newVal === 1){
      this.getList({
        templateName: this.searchContent['word'] || '',
        templateType: this.dictionaryId ? this.dictionaryId : [],
      });
    }else{
      this.getOfficeCreated();

    }
  }


  auditList: any = [
    {
        id: 1,
        name: '项目类模板',
        name_i18n: 'Project Class Template',
    },
    {
        id: 2,
        name: '文书类模板',
        name_i18n: 'Document Type Template',
    },
  ]

  //审计模板类别
  DeptValue:any = [];

  //
  TemplateValue:any = [];

  //审计类别
  AuditTypeValue:any = [];

  dictionaryId:string = '';

  code:string = '';

  selectName:string = '';

  schemaCode = '';

  codeNew:any = {
    'bd_ysProjects': {
      'id': 'd87f8cb2470a43d1925c104398174f4f',
      'name': '项目审计'
    },
    'bd_zbProjects': {
      'id': 'd87f8cb2470a43d1925c104398174f4f',
      'name': '项目审计'
    },
    'bd_projectht': {
      'id': 'd87f8cb2470a43d1925c104398174f4f',
      'name': '项目审计'
    },
    'js001': {
      'id': 'd87f8cb2470a43d1925c104398174f4f',
      'name': '项目审计'
    },
    'project_records': {
      'id': 'ea0860002cdf47058830f6cb549b577e',
      'name': '财务收支审计'
    },
    'project_records_ec': {
      'id': '433f04596dcd44d197b14c7d4367bc78',
      'name': '领导干部经济责任审计'
    },
    'project_records_la': {
      'id': 'ba56f54f2f724db89a22279e9782f6bd',
      'name': '执法活动财物审计'
    },
    'project_records_sp': {
      'id': 'e04ac1908e7d4cb79a8655abb19c6f79',
      'name': '专项审计'
    },
    'project_records_jx': {
      'id': 'eacb8fd3359e4d5895f04a6d1a92cb27',
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
    //获取列表数据
    // this.getCreated();

    // this.keyupSubmit();
  }

  changeDictionaryId(val:string){
    this.dictionaryId = val;
  }

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

  pageOption:any = {};

  tabs: any = [];

  AuditTypeList: any = [];


  // 判断当前是否是中文版本
  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === "en");
  }

  async mounted(){
    //templateType
    console.log('start....this.$route.....');
    //let sheetCode:string = (this.$route as any).query.sheetCode;

    let sheetCode:string = (window as any).h3form.formObj.bizSchema.code;

    switch(sheetCode){
      case 'sj0001':
        this.templateType = ['SJMB-001-001'];
      break;
      case 'project_records':
        this.templateType = ['SJMB-001-002'];
      break;
      case 'project_records_ec':
        this.templateType = ['SJMB-001-003'];
      break;
      case 'project_records_la':
        this.templateType = ['SJMB-001-004'];
      break;
    }
    this.getAuditTypeList()
    // setTimeout(()=>{
    //   //获取列表数据
    //   this.getList({
    //     templateName: this.searchContent['word'] || '',
    //     templateType: this.dictionaryId ? this.dictionaryId : [],
    //   });
    // },2000)
  }

  getOfficeCreated(){
    let option = {
      templateName: '',
      templateType: [],
    };
    this.getOfficeList(option);
  }

  async getAuditTypeList(){
        const res:any = await api.queryTemplateTypeList({ 'dictionaryId': '' });
        if(res.errmsg === 'success'){
            const List = res.data[0].children[0].children;
           
            switch (this.schemaCode) {
                case 'project_records_ec'://经济责任
                    this.AuditTypeList = [List[5]]
                    break;
                case 'project_records_la'://执法
                    this.AuditTypeList = [List[1]]
                    break;
                case 'project_records_sp'://专项
                    this.AuditTypeList = [List[0]]
                    break;
                case 'project_records_jx'://绩效
                    this.AuditTypeList = [List[2]]
                    break;
                case 'project_records'://财务
                    this.AuditTypeList = [List[3]]
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
                case 'bd_projectht': //投资
                    this.AuditTypeList = [List[4]]
                    break;
                default:
                    break;
            }
            
        }else{
            this.AuditTypeList = [];
        }
      
    }

  async getOfficeList(params?:any,option?:any){
    this.spinning = true;
    let pageOption = {
        page: "1",
        size: "10",
    };

    let maps = Object.assign(pageOption,option);
    let queryPage = qs.stringify(maps);

    const res:any = await api.queryDocumentTemplate( params,queryPage );
    this.spinning = false;
    if(res.code === '00000'){
        res.data.page = Number(res.data.page);
        res.data.size = Number(res.data.size);
        res.data.total = Number(res.data.total);
        res.data.content = this.getSort(this.sort,res.data.content);
        this.count = res.data.total;
        this.dataContent = res.data;
    }else{
        this.dataContent = {};
        this.count = 0;
    }
  }

  getCreated(){
    let option = {
      templateName: '',
      templateType: [],
    };
    this.getList(option);
  }

  async getList(params?:any,option?:any){
    this.spinning = true;
    let pageOption = {
        page: "1",
        size: "10",
    };

    let maps = Object.assign(pageOption,option);
   
    let queryPage = qs.stringify(maps);

    const res:any = await api.queryTemplate( params,queryPage );
    this.spinning = false;
    if(res.errmsg === 'success'){
        res.data.page = Number(res.data.page);
        res.data.size = Number(res.data.size);
        res.data.total = Number(res.data.total);
        res.data.content = this.getSort(this.sort,res.data.content);
        this.count = res.data.total;
        this.dataContent = res.data;
    }else{
        this.dataContent = {};
        this.count = 0;
    }
  }

  search(val:any){
    this.searchContent = val;
    let option = {};
    if(this.category === 1){
      option = {
        templateName: this.searchContent['word'] || '',
        // templateType: this.dictionaryId ? this.dictionaryId : [],
      };
      this.tabs.map((item) => {
      if (item && item['ids']) {
        option[item['type']] = item['ids'];
      } else {
        option[item['type']] = [item['id']];
      }
    });
      this.getList(option,this.pageOption);
    }else{
      option = {
        templateName: this.searchContent['word'] || '',
        templateType: this.dictionaryId ? this.dictionaryId : [],
      };
      this.getOfficeList(option,this.pageOption);
    }

  }

  searchPage(option:any){
    this.pageOption = option;
    let params = {};
    if(this.category === 1){
      params = {
        templateName: this.searchContent['word'] || '',
        // templateType: this.dictionaryId ? this.dictionaryId : [],
      };
      this.tabs.map((item) => {
        if (item && item['ids']) {
          params[item['type']] = item['ids'];
        } else {
          params[item['type']] = [item['id']];
        }
      });
      this.getList(params,option);
    }else{
      params = {
        templateName: this.searchContent['word'] || '',
        templateType: this.dictionaryId ? this.dictionaryId : [],
      };
      this.getOfficeList(params,option);
    }

  }

  getSort(type:string,list:any){
    let copy_list = JSON.parse(JSON.stringify(list));
    let data = [];
    if(type === 'desc'){
      data = copy_list.sort((a,b) => {
        return this.getTime(a.createTime) - this.getTime(b.createTime);
        //return a.createTime - b.createTime;
      })
    }else
    if(type === 'asc'){
      data = copy_list.sort((a,b) => {
        return this.getTime(b.createTime) - this.getTime(a.createTime);
      })
    }
    return data;
  }



  getTime(time){
    return new Date(time).valueOf();
  }

  setSort(type:string){
    this.sort = type;
    this.dataContent.content = this.getSort(this.sort,this.dataContent.content);
  }

  keyupSubmit() {
      document.onkeydown = (e) => {
          let _key = (window as any).event.keyCode;
          //!this.clickState是防止用户重复点击回车
          if (_key === 13) {
            let elSearchRef:any = (this.$refs as any).elSearchRef.getSearch();
            this.getList({
              templateName: elSearchRef['word'] || '',
              templateType: this.dictionaryId ? this.dictionaryId : [],
            });
          }
      }
  }

}
</script>
<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .newList {
    flex: 1;
    overflow-y: scroll;
    position: relative;
    .caseSort {
      position: static;
    }
  }
  .elRowOne {
    margin-bottom: 0;
    .elColAudit {
        display: flex;
        justify-content: flex-end;
        padding-bottom: 8px;
    }
  }
  .AuditType {
    height: 46px;
    padding: 5px;
  }
  /deep/ .ant-select-selection__rendered {
    max-height: 32px;
    overflow: hidden;
  }
}
</style>
