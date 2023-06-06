<template>
<div class="content">
    
    <pad>
        <a-row class="elRowOne">
            <a-col :span="24" class="elColAudit">
                <goNew url="https://covaudit.com/ZST/Area_ZST" />
            </a-col>
            <a-col :span="12" class="AuditType">
                <a-select v-model="category" style="width: 100%">
                    <a-select-option
                        v-for="(item) in auditList"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.name }}</a-select-option>
                </a-select>
            </a-col>
            <a-col :span="12" class="AuditType" style="text-align: right; cursor: pointer;">
                <span class="filter_more" @click="filterMore">更多条件<em class="icon aufontAll h-icon-all-down-o small icon-wrapper"></em></span>
            </a-col>
        </a-row>
        <a-row v-if="isShowFilterMore">
            <a-col :span="12" class="AuditType">
                <adaptQuestionTypeT :category="category" @select="select" />
            </a-col>
            <a-col :span="12" class="AuditType">
                <effectiveLevel :category="category" @select="select" />
            </a-col>
            <a-col :span="12" class="AuditType">
                <publishingDepartment :category="category" @select="select" />
            </a-col>
            <a-col :span="12" class="AuditType">
                <!-- <a-range-picker v-model="rangeDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" /> -->
                <yearTypeT :category="category" @select="select" />
            </a-col>
        </a-row>
        <a-row class="elRowOne">
            <a-col :span="24" class="AuditType">
                <elSearch ref="elSearchRef" :list="searchList" @search="search" />
            </a-col>
        </a-row>
        
    </pad>

    <div class="newList">
        <a-spin :spinning="spinning">
            <newList :obj="dataContent" @showNewInfo="showNewInfo" />
        </a-spin>
    </div>
    <pad>
        <a-page :obj="dataContent" @searchPage="searchPage" />
    </pad>
    <newInfo v-model="isShowNewInfo" :newInfo="newInfoStatic" />
</div>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import pad from '@/../extends/components/static/pad.vue';
import newList from '@/../extends/components/audit/regulations/newList.vue';
import elSearch from '@/../extends/components/static/search.vue';
import goNew from '@/../extends/components/static/goNew.vue';
import page from '@/../extends/components/static/page.vue';
import newInfo from '@/../extends/components/static/newInfo.vue';
import yearTypeT from "@/../extends/components/tree/yearTypeT.vue";
import adaptQuestionTypeT from "@/../extends/components/tree/adaptQuestionTypeT.vue";
import problemType from '@/../extends/components/tree/problemType.vue';
import effectiveLevel from '@/../extends/components/tree/effectiveLevel.vue';
import publishingDepartment from '@/../extends/components/tree/publishingDepartment.vue';
import api  from '@/../extends/api';
const qs = require('qs');
import { message, notification, TreeSelect,Spin,Row,Col,Select,DatePicker } from "@h3/antd-vue";
@Component({
  name: 'Regulations',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    pad,
    newList,
    elSearch,
    goNew,
    APage:page,
    newInfo,
    adaptQuestionTypeT,
    yearTypeT,
    ASpin:Spin,
    problemType,
    effectiveLevel,
    publishingDepartment,
    ARangePicker: DatePicker.RangePicker,
  },
})

export default class Regulations extends Vue {

    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;

    dataContent: any  =  {};

    spinning:boolean = false;

    searchContent: any = {};

    category:string = '全部';

    auditList: any = [
        {
            id: '全部',
            name: '全部'
        },
        {
            id: '中央法规',
            name: '中央法规',
            name_i18n: 'laws and regulations',
        },
        {
            id: '地方法规',
            name: '地方法规',
            name_i18n: 'Local laws',
        },
    ] 

    searchList:any = [
        {
            'id': 'regulationName',
            'name': '法规名称'
        },
        {
            'id': 'releaseNumber',
            'name': '发文字号'
        },
        {
            'id': 'fullText',
            'name': '全文'
        },
    ];

    //审计类别
    AuditTypeValue:any = [];

    //效力级别
    PotencyValue:any = [];
    
    DeptValue:any = [];
    
    rangeDate: any[] | any = [];

    isShowNewInfo:boolean = false;
    
    isShowFilterMore:boolean = false;

    newInfoStatic:any = {};

    tabs: any = [];

    @Watch('time')
    onChangeAuditType(newVal:any){

    }

    // 判断当前是否是中文版本
    get isChinese() {
        return !(this.$i18n.locale && this.$i18n.locale === "en");
    }

    async created(){
        //获取列表数据
        this.getCreated();

        //监听回车
        this.keyupSubmit();
       
    }

    getCreated(){
        //检索类型不参与搜索条件
        let option = {
            category: '',
            regulationName: '',
            //fieldValue: '',
        };
        this.getList(option);
    }

    async getList(params?:any,option?:any){
        this.spinning = true;
        let pageOption = {
            page: "1",
            size: "10",
        };
        if(params['category'] === '全部'){
            params['category'] = '';
        }
        
        let maps = Object.assign(pageOption,option);

        let queryPage = qs.stringify(maps);
   
        const res:any = await api.queryPageQuery( params,queryPage );
        this.spinning = false;
        if(res.errmsg === 'success'){
            res.data.page = Number(res.data.page);
            res.data.size = Number(res.data.size);
            res.data.total = Number(res.data.total);
            this.dataContent = res.data;
        }else{
            this.dataContent = {};
        }
    }

    search(val:any){
        this.searchContent = val;
        let option = {
            category: this.getCategoryName(this.category),
            yearList: this.rangeDate.length > 0 ? [this.rangeDate] : [],
            //fieldValue: this.searchContent['word'] || '',
        };
        this.tabs.map((item) => {
            option[item['type']] = [item['ids'],item['id']];
        });
        if(val['type']){
            option[val['type']] = val['word'];
        }
        this.getList(option);
    }

    getCategoryName(category:string){
        return this.auditList.filter((item) => {
            return item['id'] === category;
        })[0]['name'];
    }

    showNewInfo(item:any){
        this.newInfoStatic = item;
        this.isShowNewInfo = true;
    }

    filterMore(){
        console.log(this.isShowFilterMore);
        
        this.isShowFilterMore = !this.isShowFilterMore;
    }

    searchPage(option:any){
        let params = {
            category: this.getCategoryName(this.category),
            // yearList: this.rangeDate.length > 0  ? [this.rangeDate] : [],
            //fieldValue: this.searchContent['word'] || '',
        };
        this.tabs.map((item) => {
            option[item['type']] = [item['ids'],item['id']];
        });
        if(this.searchContent['type']){
            params[this.searchContent['type']] = this.searchContent['word'];
        }
        this.getList(params,option);
    }

    mounted(){

        
        
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
    }

    keyupSubmit() {
        document.onkeydown = (e) => {
            let _key = (window as any).event.keyCode;
            //!this.clickState是防止用户重复点击回车
            if (_key === 13) {
                let elSearchRef:any = (this.$refs as any).elSearchRef.getSearch();
                this.search(elSearchRef);
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
        overflow-y: auto;
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
        .filter_more {
            color: #296fff;
            em.icon-wrapper {
                font-size: 12px;
                margin-left: 5px;
            }
        }
    }
    /deep/ .ant-select-selection__rendered {
        max-height: 32px;
        overflow: hidden;
    }
}
</style>
