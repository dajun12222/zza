<template>
    <div class="modelList">
        <div class="scrollY">
            <a-col class="indexRight" :span="24">
                <a-spin :spinning="spinning"> 
                    <div class="indexTable">
                        <p class="listTitle">数据列表</p>
                        <a-table :columns="tableColumns" 
                            :data-source="tableData" 
                            :pagination="false" 
                            :rowKey="record => record.id"
                        />
                    </div>   
                </a-spin>
            </a-col>
        </div>
    </div>
</template>
<script lang="ts">
import { Col, Spin, Table, } from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import axios from 'axios';
import api  from '@/../extends/api';
// import Divider from "../../../../../admin/src/views/print-template/center-panel/divider.vue";
const qs = require('qs');

@Component({
    name: 'modelList',
    components: {
        ACol: Col,
        ASpin:Spin,
        ATable: Table,
    },
})

export default class modelList extends Vue {
    spinning:any=false;

    tableColumns: any = [
        {
            title: '字段编码',
            dataIndex: 'fieldCode',
            key: 'fieldCode',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            },
        },
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
            ellipsis: true,
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            }
        },
        {
            title: '字段类型',
            key: 'fieldTypeCode',
            dataIndex: 'fieldTypeCode',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            }
        },
        {
            title: '是否可查询',
            key: 'filedSelect',
            dataIndex: 'filedSelect',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = "是";
                }else{
                    obj = "否"
                }
                return obj;
            }
        },
        {
            title: '模型编码',
            key: 'modelCode',
            dataIndex: 'modelCode',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            }
        }
    ];

    tableData:any=[];

    modelCode:any="";

    async mounted(){
       this.modelCode=this.$route.query.modelCode;
       this.queryByCode(this.modelCode);
    }
    
    async queryByCode(params?:any){
        this.spinning=true;
        let option={
            modelCode:params
        }
        let maps = Object.assign(option);
        let queryPage = qs.stringify(maps);
        const res:any = await api.queryByCode(queryPage);
        this.spinning=false;
        if(res.code === '00000'){
            this.tableData = res.data;
        }else{
            this.tableData = [];
        }
    }
}
</script>
<style lang="less" scoped>
    .modelList{
        background: rgb(240,242,245);
        min-width: 1100px;
        overflow: hidden;
        height: 100%;
        .scrollY{
            height: 100%;
            overflow-y: scroll;
        }
        .indexRight{
            padding: 8px;
        }
        .listTitle{
            font-size: 15px;
            margin-bottom: 10px;
        }
        .indexTable{
            background: #fff;
            padding:24px;
            margin-bottom: 24px;
            border-radius: 2px;
            /deep/.ant-table-thead > tr > th{
                position: relative;
            }
            /deep/.ant-table-thead>tr>th:not(:last-child):before {
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 1.6em;
                background-color: rgba(0,0,0,.06);
                transform: translateY(-50%);
                transition: background-color .3s;
                content: "";
            }
        }
    }
</style>