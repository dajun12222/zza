<template>
<div class="dataContent">
    <div v-show="!isWorkCheckUser" class="button">
        <a-button v-if="isShowAdd" type="primary" size="small" @click="add">新增</a-button>
        <!-- <a-button type="danger" danger @click="del" size="small">删除</a-button>
        <a-button type="dashed" @click="importData" size="small">导入</a-button>
        <a-button type="dashed" @click="exportData" size="small">导出</a-button> -->
        <a-button v-if="isShowSave" type="primary" size="small" @click="save">保存</a-button>
    </div>
    <div class="table">
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys,fixed:true, onChange: onSelectChange }" -->
        <a-table
        :columns="columns" :data-source="treeData" :scroll="{ x: 1380}" bordered :pagination="false"
        size="small"
        :rowKey="(record,index) => { return index }"
        >
            <div
                slot="questionTypeId"
                slot-scope="text,record,index"
            >
                <a-cascader
                    v-model="record.shorttext"
                    :options="AuditTypeList"
                    :fieldNames="replaceFields"
                    placeholder="请选择问题目录"
                    @change="(option) => { return getParams(option,index) }"
                />
             <!-- <questionShowType
                v-model="record.questionTypeId" 
                :treeCheck="3" 
                :treeCheckable="false" 
                :shorttext="record.shorttext"
                @getParams="(option) => { return getParams(option,index) }" 
              /> -->
            </div>
           <!--  <div
                slot="performanceForm"
                slot-scope="text,record"
            >
                <a-textarea v-model="record.performanceForm" placeholder="审计问题名称" :rows="6" :readonly="isWorkCheckUser" />
            </div> -->
            <div
                slot="qualitativeProblem"
                slot-scope="text,record"
            >
                <a-textarea v-model="record.qualitativeProblem" placeholder="定性" :rows="6" :readonly="isWorkCheckUser" />
            </div>
            <div
                slot="qualitativeBasis"
                slot-scope="text,record"
            >
                <a-textarea v-model="record.qualitativeBasis" placeholder="依据" :rows="6" :readonly="isWorkCheckUser" />
            </div>
            <div
                slot="suggestionsProblem"
                slot-scope="text,record"
            >
                <a-textarea v-model="record.suggestionsProblem" placeholder="建议" :rows="6" :readonly="isWorkCheckUser" />
            </div>
            <!-- <div
                slot="isAdd"
                slot-scope="text,record"
            >
                <a-switch v-model="record.radio1670564674070" size="small" />
            </div> -->
            <div
                slot="review"
                slot-scope="text,record"
            >
                <a-button class="quote" type="primary" size="small" @click="reviewOne(record)">复核</a-button>
            </div>
            <div
                slot="action"
                slot-scope="text,record,index"
            >
                <a-button class="quote" type="danger" size="small" @click="delOne(index)">删除</a-button>
            </div>
        </a-table>
    </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,Table,Input,Switch,Cascader } from "@h3/antd-vue";
import questionShowType from '@/../extends/components/tree/questionShowType.vue';
import api  from '@/../extends/api';
import OAuthApi from "@/apis/oauth";
const qs = require('qs');
@Component({
    name: 'showData',
    components: {
        AModal: Modal,
        AButton: Button,
        ATable: Table,
        ASwitch: Switch,
        ACascader: Cascader,
        ATextarea: Input.TextArea,
        questionShowType
    },
})
export default class showData extends Vue {

    get isShowAdd(){
        return this.mode !== 'showhtml';
    }

    get isShowSave(){
        return this.mode !== 'showhtml';
    }

    @Prop({ default: false }) isMediation?:boolean;

    @Watch('isMediation',{ deep: true, immediate: true })
    onChangeIsMediation(newVal:any){

        if(newVal){
            this.columns.splice(5,1);
        }
    }

    @Watch('isWorkCheckUser',{ deep: true, immediate: true })
    onIsWorkCheckUser(newVal:any){
        if(newVal){
            this.columns.splice(4,3);
        }
    }

    questionTypeId: any = '';

    selectedRowKeys: any = [];

    columns:any = [
        {
            title: '问题类型',
            dataIndex: 'questionTypeId',
            key: 'questionTypeId',
            align: 'center',
            width: 140,
            scopedSlots: { customRender: 'questionTypeId' },
        },
        // {
        //     title: '问题名称',
        //     dataIndex: 'performanceForm',
        //     key: 'performanceForm',
        //     align: 'center',
        //     width: 270,
        //     scopedSlots: { customRender: 'performanceForm' },
        // },
        {
            title: '定性',
            dataIndex: 'qualitativeProblem',
            key: 'qualitativeProblem',
            align: 'center',
            width: 270,
            scopedSlots: { customRender: 'qualitativeProblem' },
        },
        {
            title: '依据',
            dataIndex: 'qualitativeBasis',
            key: 'qualitativeBasis',
            align: 'center',
            width: 270,
            scopedSlots: { customRender: 'qualitativeBasis' },
        },
        {
            title: '建议',
            dataIndex: 'suggestionsProblem',
            key: 'suggestionsProblem',
            align: 'center',
            width: 270,
            scopedSlots: { customRender: 'suggestionsProblem' },
        },
        // {
        //     title: '是否新增',
        //     dataIndex: 'isAdd',
        //     key: 'isAdd',
        //     align: 'center',
        //     width: 100,
        //     scopedSlots: { customRender: 'isAdd' },
        // },
        {
            title: '复核',
            dataIndex: 'review',
            key: 'review',
            align: 'center',
            width: 80,
            scopedSlots: { customRender: 'review' },
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

    treeData: any = [

    ];

    bizObjectId:string = '6a07d7c360f64d6d8b5ae784c7efee8a';

    mode:string = 'edit';

    isWorkCheckUser:boolean = false;

    schemaCode:string = '';

    
    AuditTypeList:any = [];

    replaceFields: any = {
        children: "children",
        label: "name",
        value: "id",
    };

    async created(){
        let route = this.$route as any;
        this.bizObjectId = route.query.bizObjectId || '6a07d7c360f64d6d8b5ae784c7efee8a';
        this.mode = route.query.mode;
        this.schemaCode = route.query.schemaCode;
        this.getList();
        this.queryQuestionTypeList();
        if(this.mode === 'view'){
            this.isWorkCheckUser = true;
        }else
        if(this.mode === 'review'){

            this.columns.splice(6,1);
            this.columns.splice(5,1);
            // this.columns.splice(6,1);
        }else
        if(this.mode === 'showhtml'){
            this.columns.splice(6,2);
        }else
        if(this.mode === 'del'){
            this.columns.splice(4,1);
        }else
        {
            const res = await OAuthApi.getUserInfo();
            if (res.errcode === 0) {
                let info:any = res.data;
                let maps = {
                    userId: info['id'] || '',
                    formId: this.bizObjectId,
                    schemaCode: this.schemaCode
                };
                let queryPage = qs.stringify(maps);
                const respone:any = api.getWorkItemCheckUserId(queryPage);
                if(respone.errcode === 0){
                    this.isWorkCheckUser = true;
                }
            }
        }
    }

    add(){
        this.treeData.push({
            'id': '',
            'quoteID': '',
            'isQuote': false,
            'questionTypeId': [],
            'qualitativeProblem': '',
            //'performanceForm': '',
            'qualitativeBasis': '',
            'suggestionsProblem': '',
            'radio1670564674070': false,
            'shorttext1663123660655': '',
            'shorttext1663123660656': '',
            'shorttext1663123660657': '',
        });
    }

    assignment(item:any){
        debugger
        let index = this.checkIsQuote();
        console.log('index  '+index);
        let treeData = JSON.parse(JSON.stringify(this.treeData));
        if(index > -1){
            let obj = treeData[index];
            obj = Object.assign({},obj,item);


            
            obj['isQuote'] = true;
            obj['longtext1663322501560'] = item['auditTypeId'];
            // obj['questionTypeId'] = item['questionTypeContent'];
            this.$set(this.treeData,index,obj);
            
            // this.treeData = treeData;
            console.log( this.treeData);
        }
        this.$forceUpdate();
    }

    getParams(option:any,index:number){
        debugger
        let treeData = JSON.parse(JSON.stringify(this.treeData));
        let obj = treeData[index];
        console.log('option',option);
        if(option){
            obj['shorttext1663123660655'] = option && option[0] || '';
            obj['shorttext1663123660656'] = option && option[1] || '';
            obj['shorttext1663123660657'] = option && option[2] || '';
        }else{
            obj['shorttext1663123660655'] = '';
            obj['shorttext1663123660656'] = '';
            obj['shorttext1663123660657'] = '';
        }
        this.$set(treeData,index,obj);
        this.treeData = treeData;
        this.$forceUpdate();

    }

    checkIsQuote(){
        // debugger
        let index = -1;
        // console.log(this.treeData);
        
        this.treeData.some((item,i) => {
            if(!item.isQuote){
                index = i;
                return true;
            }
        })
        return index;
    }

    delOne(index:number){
        this.treeData.splice(index,1);
        // let treeData = JSON.parse(JSON.stringify(this.treeData));
        // let selectedRowKeys = JSON.parse(JSON.stringify(this.selectedRowKeys));
        // selectedRowKeys.map((item,index) => {

        // })
    }

    fieldMap(){
        //字段映射
        return {
            'quoteID': 'shorttext1663135518349',//引用id
            'shorttext1663123660655': 'shorttext1663123660655',//问题类型
            'shorttext1663123660656': 'shorttext1663123660656',//问题类型
            'shorttext1663123660657': 'shorttext1663123660657',//问题类型
            'qualitativeProblem': 'shorttext1663123657443',//定性
            //'performanceForm': 'longtext1663124234679',//问题名称
            'qualitativeBasis': 'longtext1663124236951',//依据
            'suggestionsProblem': 'longtext1663124239302',//定性
        }
    }

    async queryQuestionTypeList(){
        //queryAuditTypeList
        const res:any = await api.queryQuestionTypeList();
        if(res.errmsg === 'success'){
            switch (this.schemaCode) {
                case 'plan_financial_jx':
                    //绩效审计
                    this.AuditTypeList = [res.data[1]]
                    break;
                case 'project_records_ec':
                    //经济责任
                    this.AuditTypeList = [res.data[2]]
                    break;
                case 'project_records_la':
                    //执法
                    this.AuditTypeList = [res.data[3]]
                    break;
                case 'project_records_sp':
                    //专项
                    this.AuditTypeList = [res.data[4]]
                    break;
                case 'project_records':
                    //财务
                    this.AuditTypeList = [res.data[5]]
                    break;
                case 'js001':
                case 'bd_ysProjects':
                case 'bd_zbProjects':
                case 'bd_projectht':
                    //投资
                    this.AuditTypeList = [res.data[1]]
                    break;
                default:
                    break;
            }
            
        }else{
            this.AuditTypeList = [];
        }   
    }

    async save(){
        debugger
        let treeData = JSON.parse(JSON.stringify(this.treeData));
        // bizObjectId treeData

        let maps = this.fieldMap();

        let item:any = {};
        for(let i=0;i<treeData.length;i++){
        
            item = treeData[i];
           
            Object.keys(maps).map((e) => {
                item[maps[e]] = item[e];
            })
            item['formId'] = this.bizObjectId;
        }



        const res:any = await api.save({ extend: this.bizObjectId,list:treeData });
        if(res.errcode === 0){
            this.$message.success(res.errmsg);
        }else{
            this.$message.error(res.errmsg);
        }

    }

    async getList(){
        // getList
        //let queryPage = qs.stringify(maps);
        let maps = {
            formId: this.bizObjectId
        };
        let queryPage = qs.stringify(maps);
        const res:any = await api.getList(queryPage);

        if(res.errcode === 0){
            let maps = this.fieldMap();
            let data = JSON.parse(JSON.stringify(res.data));
            data.map((item:any) => {
                Object.keys(maps).map((e) => {
                    if(e){
                        if(e && maps[e] && item[maps[e]] && item[maps[e]] !== 'null' && item[maps[e]] !== 'undefined'){
                            // console.log(item[maps[e]]);
                            item[e] = item[maps[e]];
                        }else{
                            item[e] = '';
                        }
                    }

                })


                // if(item && item['questionTypeId']){
                //     let questionTypeId = item['questionTypeId'].split(',');
                //     let longText1670415714220 = item['longtext1670415714220'].split(',');
                //     let questionContent:any = [];
                //     questionTypeId.map((c:any,index:number) => {
                //         questionContent.push({
                //             'label': longText1670415714220[index],
                //             'value': c,
                //         })
                //     })
                //      item['questionTypeId'] = questionContent;
                // }else{
                //     item['questionTypeId'] = [];
                // }
              

                item['isQuote'] = true;
                // item['shorttext1663123660657'] = '领导干部经济责任审计';
                // item['shorttext1663123660656'] = '行政事业单位主要领导干部经济责任审计';
                // item['shorttext1663123660655'] = '三重一大';
                
                item['shorttext'] = [item['shorttext1663123660655'],item['shorttext1663123660656'],item['shorttext1663123660657']];
            })
            
            this.treeData = data;
           // this.$message.success(res.errmsg);
        }else{
            this.$message.error(res.errmsg);
        }
    }

    reviewOne(item:any){
        this.$emit('review',item);
    }

    importData(){}

    exportData(){}

    onSelectChange(selectedRowKeys: any){
        this.selectedRowKeys = selectedRowKeys;
    }


}
</script>
<style lang="less" scoped>
.dataContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    .button {
        padding: 10px;
        /deep/ .ant-btn {
            min-width: 60px;
            margin-right: 8px;
        }
    }
    .table {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
        padding-top: 0;
        /deep/ .ant-table-thead > tr > th,/deep/ .ant-table-tbody > tr > td {
            //padding: 8px 8px;
        }
        .quote {
            cursor: pointer;
            min-width: auto;
        }
    }
}
</style>
