<template>
<div class="dataContent">
    <a-row class="elRow">
        <!-- <a-col :span="2" class="elColLabel">关键词：</a-col> -->
        <a-col :span="7" class="elColPadding">
            <a-select v-model="field" dropdownClassName="rangeDate" style="width: 100%" placeholder="请选择">
                <a-select-option
                    v-for="(item) in fieldList"
                    :key="item.id"
                    :value="item.id"
                >{{ item.name }}</a-select-option>
            </a-select>
        </a-col>
        <a-col :span="17" class="elColPadding">
            <a-input
                v-model="keyWord"
                autocomplete="off"
                allowClear
                placeholder="请输入关键词"
                class="input-getlist"
            />
        </a-col>
        <!-- <a-col :span="2" class="elColLabel">来源：</a-col>
        <a-col :span="4" class="elColPadding">
            <a-select v-model="source" style="width: 100%" placeholder="请选择">
                <a-select-option
                    v-for="(item) in sourceList"
                    :key="item.id"
                    :value="item.id"
                >{{ item.name }}</a-select-option>
            </a-select>
        </a-col> -->
        <!-- <a-col :span="2" class="elColLabel ">目录分类：</a-col> -->
        <a-col :span="18" class="elColPadding">
            <questionType v-model="AuditTypeValue" :treeCheckable="false" />
        </a-col>
        
        <a-col :span="6" class="elColPadding">
            <a-button type="primary" @click="search">查询</a-button>
        </a-col>
    </a-row>
    <div class="elTable">
        <quesList :dataContent="treeData" @quote="quote" />
        <a-button class="quote" size="small" @click="addPage">查看更多</a-button>
        <!-- <a-table :columns="columns" :data-source="treeData" :scroll="{ y: '100%' }" bordered :pagination="false" class="aTable"
        :rowKey="(record,index) => { return index }"
        >
            <div
                slot="qualitativeProblem"
                slot-scope="text"
            >
                <div v-html="text"></div>
            </div>
            <div
                slot="action"
                slot-scope="text,record"
            >
                <a-button class="quote" type="primary" size="small" @click="quote(record)">引用</a-button>
            </div>
        </a-table> -->
    </div>
    <!-- <div class="APageion">
        <a-page :obj="dataContent" @searchPage="searchPage" />
    </div> -->
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,Row,Col,Input,Table,Select } from "@h3/antd-vue";
import queryTree from '@/../extends/components/tree/queryTree.vue';
import questionType from '@/../extends/components/tree/questionType.vue';
import quesList from './quesList.vue';
import api  from '@/../extends/api';
import page from '@/../extends/components/static/page.vue';
const qs = require('qs');
@Component({
    name: 'quoteData',
    components: {
        AModal: Modal,
        ARow: Row,
        ACol: Col,
        AInput: Input,
        queryTree,
        questionType,
        quesList,
        ATable: Table,
        AButton: Button,
        ASelect: Select,
        ASelectOption: Select.Option,
        APage:page,
    },
})
export default class quoteData extends Vue {

    field:string | string[] = 'qualitative_problem';

    fieldList:any = [
        {
            'id': 'qualitative_problem',
            'name': '问题定性'
        },
        {
            'id': 'qualitative_basis',
            'name': '定性依据'
        },
    ];

    keyWord:string = '';

    AuditTypeValue:any = [];

    source:number | string = '';

    sourceList:any = [
        {
            'id': 1,
            'name': '基础数据库'
        },
        {
            'id': 2,
            'name': '本地数据库'
        },
        {
            'id': 3,
            'name': '新增数据库'
        },
    ];

    // @Watch('AuditTypeValue',{ deep: true, immediate: true })
    // onChangeAuditTypeValue(newVal:any){

    // }

     QuestionTypeValue:any = [];
    // @Watch('QuestionTypeValue',{ deep: true, immediate: true })
    // onChangeQuestionTypeValue(newVal:any){

    // }

    columns:any = [
        // {
        //     title: '问题类型',
        //     dataIndex: 'questionType',
        //     key: 'questionType',
        //     align: 'center',
        //     scopedSlots: { customRender: 'questionType' },
        //     width: 140,
        // },
        // {
        //     title: '问题名称',
        //     dataIndex: 'performanceForm',
        //     key: 'performanceForm',
        //     align: 'center',
        //     width: 300,
        // },
        {
            title: '定性',
            dataIndex: 'qualitativeProblem',
            key: 'qualitativeProblem',
            align: 'center',
            width: 300,
            scopedSlots: { customRender: 'qualitativeProblem' },
        },
        {
            title: '依据',
            dataIndex: 'qualitativeBasis',
            key: 'qualitativeBasis',
            align: 'center',
            width: 300,
        },
        {
            title: '建议',
            dataIndex: 'suggestionsProblem',
            key: 'suggestionsProblem',
            align: 'center',
            width: 300,
        },
        // {
        //     title: '审计类别',
        //     dataIndex: 'auditType',
        //     key: 'auditType',
        //     align: 'center',
        //     width: 140,
        //     scopedSlots: { customRender: 'auditType' },
        // },
        {
            title: '引用',
            dataIndex: 'useCount',
            key: 'useCount',
            align: 'center',
            width: 80,
            scopedSlots: { customRender: 'useCount' },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'action' },
        }
    ]

    treeData: any = [];

    dataContent: any  =  {};

    REQUIRE: boolean = true;

    loading: boolean = false;

    tips: any = '努力加载中...';

    created(){
        let params = {
            keyWord: '',
            field: this.field,
            dictionaryId: '',
            source: '',
        }
        this.getlist(params);
    }

    search(){
        let params = {
            keyWord: this.keyWord || '',
            field: this.field && this.field.length > 0 ? this.field : '',
            dictionaryId: this.AuditTypeValue && this.AuditTypeValue.length > 0 ? this.AuditTypeValue : '',
            source: this.source > 0 ? this.source : '',
        }
        this.treeData = [];
        this.getlist(params);
    }

    async getlist(params?:any,option?:any){
        let pageOption = {
            page: "1",
            size: "10",
        };
        let maps = Object.assign(pageOption,option);
        let queryPage = qs.stringify(maps);
       
        const res:any = await api.search(params,queryPage);

        if(res.code === '00000'){
            res.data.page = Number(res.data.page);
            res.data.size = Number(res.data.size);
            res.data.total = Number(res.data.total);
            //res.data.content = this.getSort(this.sort,res.data.content);
            //this.count = res.data.total;
            this.treeData = this.treeData.concat(res.data.content);
            this.dataContent = res.data;
        }else{
            this.treeData = [];
            this.dataContent  = {};
            //this.count = 0;
        }
    }

    searchPage(option: any){
        
        let params = {
            keyWord: this.keyWord || '',
            field: this.field && this.field.length > 0 ? this.field : '',
            dictionaryId: this.AuditTypeValue && this.AuditTypeValue.length > 0 ? this.AuditTypeValue : '',
            source: this.source > 0 ? this.source : '',
        }
        this.getlist(params,option);
        
    }

    addPage() {
        const option = {page:this.dataContent.page + 1,size:10}
        this.searchPage(option)
    }

    quote(item:any){
        console.log(item);
        
        // let obj = JSON.parse(JSON.stringify(item));
        // let questionTypeContent:any = [];
        // obj['quoteID'] = obj['id'];

        // if(obj && !obj['questionTypeId']){
        //     obj['questionTypeId'] = [];
        // }else{
        //     let questionType = obj['questionType'].split(',');
        //     let questionTypeId = obj['questionTypeId'].split(',');
            
         
        //     questionTypeId.map((c:any,index:number) => {
        //         questionTypeContent.push({
        //             'label': questionType[index],
        //             'value': c,
        //         })
        //     })
        // }
        // obj.questionTypeContent = questionTypeContent;
        // obj['qualitativeProblem'] = this.setUpHtml(obj['qualitativeProblem']);
        // console.log(obj);
        this.$emit('quote',item);
    }

    handleScroll(e) {
        const scrollTop = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const clientHeight = e.target.clientHeight;
        debugger
      if (scrollTop + clientHeight >= scrollHeight) {
        // 到达底部，加载下一页数据
        // this.page += 1;
        const ad = {page:this.dataContent.page + 1,size:10}
        console.log(ad);
        
        // this.searchPage();
      }
    }

    
}
</script>
<style lang="less" scoped>
.dataContent {
    height: 100%;
    overflow-y: auto;
    .elRow {
        padding: 8px;
        background-color: #fff;
        /deep/ .anticon {
            font-size: 14px !important;
        }
        /deep/ .ant-input {
            line-height: 32px;
            font-size: 14px;
            border-radius: 2px;
        }
        .elColLabel {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 24px;
        }
        .elColPadding {
            padding: 3px;
            
        }
    }
    .elTable {
        height: calc(100% - 100px);
        overflow-y: auto;
        padding: 10px;
        // padding-top: 0;
        .aTable {
            margin-top: 10px;
        }
        .quote {
            cursor: pointer;
            min-width: auto;
        }
    }
    .APageion {
        display: flex;
        align-items: center;
        padding: 0 10px;
        width: 100%;
        height: 42px;
        background-color: #f5f5f5;
    }
}


/deep/ .ant-select-arrow {
  top: 71%;
}
/deep/ .ant-input-affix-wrapper {
    line-height: 32px;
    font-size: 14px;
    height: 32px;
    display: flex;
}
/deep/ .ant-input {
  line-height: 32px;
  font-size: 14px;
  border-radius: 2px;
}
/deep/ .ant-select-selection-selected-value,/deep/ .ant-select-selection__placeholder,/deep/ .ant-select-arrow ,/deep/ .ant-select-dropdown-menu-item {
    font-size: 14px;
}
/deep/.ant-btn {
    border-radius: 2px;
    font-size: 14px;
    line-height: 34px;
    margin: 0 3px;
    height: 34px;
}
</style>