<template>
<div class="dataContent" @click="showList = false">
    <a-row class="elRow" style="display: flex;justify-content: center;">
        <!-- <a-col :span="10" class="elColLabel"></a-col> -->
        <!-- <a-col :span="2" class="elColPadding" style="padding: 0;">
            
        </a-col> -->
        <a-col :span="10" class="elColPadding" style="padding: 0;">
            <a-col :span="2" class="elColLabel">关键词：</a-col>
            <a-col :span="5" class="elColPadding" style="padding: 0;">
                <a-select v-model="field" style="width: 100%" placeholder="请选择">
                    <a-select-option
                        v-for="(item) in fieldList"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.name }}</a-select-option>
                </a-select>    
            </a-col>
            <a-col :span="17" class="elColPadding" style="padding: 0;">
                <a-input 
                    v-model="keyWord"
                    placeholder="请输入关键词"
                    class="input-getlist"
                    allowClear
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
            </a-col>
            <span class="Disclaimer">*检索结果仅供参考，审计人员应根据实际情况编写问题定性</span>

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
        <a-col :span="2" class="elColLabel ">目录分类：</a-col>
        <a-col :span="4" class="elColPadding">
            <questionType v-model="AuditTypeValue" :treeCheckable="false" />
        </a-col>
        
        <a-col :span="2" class="elColPadding">
            <a-button type="primary" @click="search">查询</a-button>
        </a-col>
        
    </a-row>
    
    <div class="elTable">
        <a-table :columns="columns" :data-source="treeData" :scroll="{ y: '100%' }" bordered :pagination="false" class="aTable"
        :rowKey="(record,index) => { return index }"
        >
            <div
                slot="questionQualitative"
                slot-scope="text"
            >
                <div v-html="text"></div>
            </div>
            <div
                slot="qualitativeBasis"
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
        </a-table>
    </div>
    <div style="width:1px;height:42px;"></div>
    <div class="APageion">
        <a-page :obj="dataContent" @searchPage="searchPage" />
    </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,Row,Col,Input,Table,Select, List } from "@h3/antd-vue";
import queryTree from '@/../extends/components/tree/queryTree.vue';
import questionType from '@/../extends/components/tree/questionType.vue';
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
        ATable: Table,
        AButton: Button,
        ASelect: Select,
        ASelectOption: Select.Option,
        APage:page,
        AList:List,
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
            dataIndex: 'questionQualitative',
            key: 'questionQualitative',
            align: 'center',
            width: 300,
            scopedSlots: { customRender: 'questionQualitative' },
        },
        {
            title: '依据',
            dataIndex: 'qualitativeBasis',
            key: 'qualitativeBasis',
            align: 'center',
            width: 300,
            scopedSlots: { customRender: 'qualitativeBasis' },
        },
        {
            title: '建议',
            dataIndex: 'auditSuggestion',
            key: 'auditSuggestion',
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
            title: '引用次数',
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

    AssociateWords: any = [];

    showList: boolean = false;

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
        this.getlist(params);
    }

    nextSerach() {
        this.showList = false;
        this.search()
        }

    async getAssociate(val) {
    // this.dictionaryId = '';
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

    async getlist(params?:any,option?:any){
        let pageOption = {
            page: "1",
            size: "10",
        };
        let maps = Object.assign(pageOption,option);
        let queryPage = qs.stringify(maps);
       
        const res:any = await api.search(params,queryPage);

        if(res.errmsg === 'success'){
            res.data.page = Number(res.page);
            res.data.size = 10;
            res.data.total = Number(res.total);
            //res.data.content = this.getSort(this.sort,res.data.content);
            //this.count = res.data.total;
            this.treeData = res.data;
            this.dataContent = res.data;
        }else{
            this.treeData = [];
            this.dataContent  = {};
            //this.count = 0;
        }
    }

    searchPage(option:any){

        let params = {
            keyWord: this.keyWord || '',
            field: this.field && this.field.length > 0 ? this.field : '',
            dictionaryId: this.AuditTypeValue && this.AuditTypeValue.length > 0 ? this.AuditTypeValue : '',
            source: this.source > 0 ? this.source : '',
        }
        this.getlist(params,option);
        
        
    }

    quote(item:any){
        debugger
        let obj = JSON.parse(JSON.stringify(item));
        let questionTypeContent:any = [];
        obj['quoteID'] = obj['id'];

        if(obj && !obj['questionTypeId']){
            obj['questionTypeId'] = [];
        }else{
            let questionType = obj['questionType'].split(',');
            let questionTypeId = obj['questionTypeId'].split(',');
            
         
            questionTypeId.map((c:any,index:number) => {
                questionTypeContent.push({
                    'label': questionType[index],
                    'value': c,
                })
            })
        }
        obj.questionTypeContent = questionTypeContent;
        obj['qualitativeProblem'] = obj['questionQualitative'];
        obj['suggestionsProblem'] = obj['auditSuggestion'];
        console.log(obj);
        this.$emit('quote',obj);
    }

    setUpHtml(str:string){
        return str.replace(/<\/?.+?\/?>/g,'');
    }
}
</script>
<style lang="less" scoped>
.dataContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    .elRow {
        padding: 20px;
        // border-bottom: 1px solid #d6d4d4;
        .elColLabel {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 32px;
        }
        .elColPadding {
            padding: 0 3px;
            position: relative;
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
        /deep/ .ant-list-items {
            display: flex;
            flex-direction: column;
        }
        /deep/ .ant-list-items .associate-item {
            border-bottom: 1px solid #e8e8e8;
        }
    }
    .Disclaimer {
      color: #f41e1e;
      font-family: serif;
      font-size: 12px;
    }
    .elTable {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
        // padding-top: 10px;
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
        position: fixed;
        bottom: 0;
    }
}
/deep/ em {
  color: crimson;
  font-style: inherit;
}
/deep/ .ant-table > .ant-table-content > .ant-table-scroll > .ant-table-header .ant-table-thead > tr > th {
    padding: 5px;
    background: #fafafa;
}
</style>