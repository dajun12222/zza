<template>
<div class="dataContent">
    <div class="elTable">
        <a-table :columns="columns" :data-source="treeData" :scroll="{ y: '100%' }" bordered :pagination="false" class="aTable"
        :rowKey="(record,index) => { return index }"
        />


    </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,Row,Col,Input,Table } from "@h3/antd-vue";
import problemType from '@/../extends/components/tree/problemType.vue';
import questionType from '@/../extends/components/tree/questionType.vue';
import api  from '@/../extends/api';
import page from '@/../extends/components/static/page.vue';
const qs = require('qs');
@Component({
    name: 'quoteReview',
    components: {
        AModal: Modal,
        ARow: Row,
        ACol: Col,
        AInput: Input,
        problemType,
        questionType,
        ATable: Table,
        AButton: Button,
        APage:page,
    },
})
export default class quoteReview extends Vue {

    searchKey:string = '';

    AuditTypeValue:any = [];

    @Prop({ default: {} }) reviewObj?:any;

    @Watch('reviewObj', { deep: true, immediate: true })
    onChangeReviewObj(newVal:any){
        let params = {
            qualitativeProblem: newVal['qualitativeProblem'],
            qualitativeBasis: newVal['qualitativeBasis'],
        }
        this.getlist(params);
    }

    // @Watch('AuditTypeValue',{ deep: true, immediate: true })
    // onChangeAuditTypeValue(newVal:any){

    // }

     QuestionTypeValue:any = [];
    // @Watch('QuestionTypeValue',{ deep: true, immediate: true })
    // onChangeQuestionTypeValue(newVal:any){

    // }

    columns:any = [
    {
            title: '定性',
            dataIndex: 'qualitativeProblem',
            key: 'qualitativeProblem',
            align: 'center',
            width: 300,
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
        {
            title: '相似度',
            dataIndex: 'similar',
            key: 'similar',
            align: 'center',
            width: 60,
            customRender: (value) => {
                return value+'%';
            }
        }
    ]

    treeData: any = [];

    dataContent: any  =  {};

    created(){

    }

    async getlist(params?:any,option?:any){
        let pageOption = {
            page: "1",
            size: "10",
        };
        let maps = Object.assign(params);
        // let queryPage = qs.stringify(maps);
        let queryPage = maps;
       console.log('maps',maps)
        const res:any = await api.similar(queryPage);
        if(res.code === '00000'){
            res.data.map((item) => {
                if(item.similarSum){
                    item.similarSum = (item.similarSum * 100).toFixed(2) + '%';
                }
            })
            this.treeData = res.data;
            console.log(this.treeData)
            debugger
        }else{
            this.treeData = [];
            //this.count = 0;
        }
    }

    searchPage(option:any){

        let params = {
            qualitativeProblem: '',
            qualitativeBasis: '',
        };
        this.getlist(params,option);


    }

    quote(item:any){
        item['quoteID'] = item['id'];
        item['questionTypeId'] = item['questionTypeId'].split(',');
        delete item['id'];
        this.$emit('quote',item);
    }
}
</script>
<style lang="less" scoped>
.dataContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    .elRow {
        padding: 10px;
        .elColLabel {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 24px;
        }
        .elColPadding {
            padding: 0 3px;

        }
    }
    .elTable {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
        padding-top: 0;
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

</style>
