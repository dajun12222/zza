<template>
    <div class="manageIndex">
        <a-col class="indexRight" :span="24">
            <div class="cardTab">
                <a-tabs type="card" @change="changeTab">
                    <template v-for="item in tabList">
                        <a-tab-pane :key="item.key" :tab="item.value">
                            <div class="tabCon">
                                <a-col class="tabConF" :span="6">
                                    <a-spin :spinning="spinning"> 
                                        <p class="tabTitle">{{ tabTitle }}</p>
                                        <a-table :columns="tableColumns" 
                                            :data-source="tableData" 
                                            :pagination="false" 
                                            :rowKey="record => record.id"
                                            :customRow="onClickRow"
                                        />
                                    </a-spin>
                                </a-col>
                                <a-col :span="18" class="tabConR">
                                    <div>
                                        <a-spin :spinning="spin"> 
                                            <p v-if="showTable" class="tabTitle">字典列表</p>
                                            <a-table 
                                                v-if="showTable"
                                                :columns="columns" 
                                                :data-source="data" 
                                                class="indexTable" 
                                                :pagination="false" 
                                                :rowKey="record => record.id" 
                                                :defaultExpandAllRows="true"
                                                :scroll="{ y: 440 }"
                                            />
                                        </a-spin>
                                    </div>
                                </a-col>
                            </div>
                        </a-tab-pane>
                    </template>
                </a-tabs>
            </div>
            
        </a-col>
    </div>
</template>
<script lang="ts">
import { Col, Spin, Table, Tabs} from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import axios from 'axios';
import api  from '@/../extends/api';
import { each, forEach } from "lodash";
const qs = require('qs');

@Component({
    name: 'manageIndex',
    components: {
        ACol: Col,
        ASpin:Spin,
        ATable: Table,
        ATabs: Tabs,
        ATabPane: Tabs.TabPane,
    },
})

export default class manageIndex extends Vue {
    spinning:any=false;

    spin:any=false;

    showTable:any=false;

    tabList:any=[];
    
    tabTitle:any="业务库";

    tableColumns: any = [
        {
            title:"主题库名称",
            dataIndex: 'name',
            key: 'name',
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
            title:"类型编码",
            dataIndex: 'code',
            key: 'code',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            },
        }
    ];

    tableData:any=[];

    columns:any = [
        {
          title: '字典名称',
          dataIndex: 'name',
          key: 'name',
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
          title: '字典ID',
          dataIndex: 'dictionaryId',
          key: 'dictionaryId',
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
        }
    ];

    data:any = [];

    created(){
        this.queryCategory();
        this.queryName(this.tabTitle);
    }

    async queryCategory(){
        const res:any = await api.queryCategory();
        if(res.code === '00000'){
            for(let i=0; i<res.data.length; i++ ){
                let param = {};
                param["key"]=i;
                param["value"]=res.data[i];
                this.tabList.push(param);
            }
        }else{
            this.tabList = [];
        }
    }

    async queryName(params?:any){
        this.spinning=true;
        let option ={
            category:params
        }
        let queryPage = qs.stringify(option);
        const res:any = await api.queryName(queryPage);
        this.spinning=false;
        if(res.code === '00000'){
            this.tableData=res.data;
        }else{
            this.tableData=[];
        }
    }

    async dataQueryDictList(params?:any){
        this.spin=true;
        let option ={
            typeCode:params
        }
        let queryPage = qs.stringify(option);
        const res:any = await api.dataQueryDictList(queryPage);
        this.spin=false;
        if(res.code === '00000'){
            this.data=res.data;
        }else{
            this.data=[];
        }
    }

    changeTab(activeKey){
        this.tabList.forEach(ele => {
            if(activeKey === ele.key){
                this.tabTitle=ele.value;
                this.showTable=false;
                this.queryName(ele.value);
            }
        });
    }
    
    onClickRow(record, index){
        return {
            on: {
                click: () => {
                    this.showTable=true;
                    this.dataQueryDictList(record.code)
                },
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .manageIndex{
        height: 100%;
        background: rgb(240,242,245);
        min-width: 1100px;
        .indexRight{
            padding: 8px;
        }
        .cardTab{
            background: #fff;
            padding: 24px;
        }
        .tabCon{
            display: flex;
        }
        .tabConF{
            border: 1px solid rgb(235, 238, 245);
        }
        .tabConR > div{
            border: 1px solid rgb(235, 238, 245);
            width: calc(100% - 15px);
            height: 100%;
            margin-left: 15px;
        }
        .tabTitle{
            color: rgb(23, 145, 255);
            padding: 10px 5px;
        }
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
        /deep/.ant-table-thead > tr > th,/deep/.ant-table-tbody > tr > td{
            padding: 10px;
        }
    }
</style>