<template>
    <div class="catalogueIndex">
        <div class="scrollY">
            <a-col class="indexRight" :span="24">
                <div class="indexTable">
                    <h3 class="catalogueTitle"> {{ index === 1 ? "审计课程-目录" : "审计课程-试题" }} </h3>
                    <a-spin :spinning="spinning">    
                        <a-table :columns="index === 1 ? tableColumns : tableColumn" 
                            :data-source="tableData" 
                            :pagination="false" 
                            :rowKey="record => record.id"
                        >
                            <div
                                v-if="record.fileName"
                                slot="action"
                                slot-scope="text,record"
                            >
                                <span class="action">
                                    <!-- <i class="icon aufontAll h-icon-all-info-circle-fill" title="详情"></i> -->
                                    <i class="icon aufontAll h-icon-all-download" title="下载" @click="download(record)"></i>
                                </span>
                            </div>
                            <template slot="operation" slot-scope="text, record">
                                <a @click="showModalInfo(record.id)">详情</a>
                            </template>
                        </a-table>
                        <a-pagination
                            :page="page"
                            :total="total"
                            :showTotal="(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`"
                            :pageSize="size"
                            :current="page"
                            @change="changePage"
                        />
                    </a-spin>
                </div>
            </a-col>
        </div>
        <modalList ref="childModal" :modalData="modalData" />
    </div>
</template>
<script lang="ts">
import { Col, Spin, Table, Pagination } from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import modalList from '@/../extends/components/audit/dynamic/modal.vue';
import api  from '@/../extends/api';
import axios from 'axios';
const qs = require('qs');

@Component({
    name: 'catalogueIndex',
    components: {
        ACol: Col,
        ASpin:Spin,
        ATable: Table,
        APagination: Pagination,
        modalList
    },
})

export default class catalogueIndex extends Vue {
    @Watch('$route')

    childModal: any = null

    modalData:any = [];  //详情数据

    tableColumns: any = [
        {
            title: '序号',
            scopedSlots: { customRender: 'num' },
            width:'50px',
            customRender: (text,record,index) => `${index+1}`,
        },
        {
            title: '目录名称',
            dataIndex: 'catalogueName',
            key: 'catalogueName',
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
            title: '学时(分钟)',
            dataIndex: 'classHour',
            key: 'classHour',
            width:'100px',
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
            title: '课件类别',
            dataIndex: 'category',
            key: 'category',
            width:'100px',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = '发布';
                }else{
                    obj = "未发布"
                }
                return obj;
            },
        },
        {
            title: '目录源文件名',
            dataIndex: 'fileName',
            key: 'fileName',
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
            title: '试题更新时间',
            dataIndex: "updateTime",
            key: 'updateTime',
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
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            width: 70,
        }
    ];

    tableColumn: any = [
        {
            title: '序号',
            scopedSlots: { customRender: 'num' },
            width:'50px',
            customRender: (text,record,index) => `${index+1}`,
        },
        {
            title: '试题内容',
            dataIndex: 'examinationQuestionsContent',
            key: 'examinationQuestionsContent',
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
            title: '试题类型',
            dataIndex: 'examinationQuestionsType',
            key: 'examinationQuestionsType',
            width:'100px',
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
            title: '正确答案',
            dataIndex: 'correct',
            key: 'correct',
            width:'100px',
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
            title: '试题分析',
            dataIndex: 'examinationQuestionsAnalysis',
            key: 'examinationQuestionsAnalysis',
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
            title: '试题更新时间',
            dataIndex: "updateTime",
            key: 'updateTime',
            width: 130,
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
            title: '操作',
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width:70
        },
    ];

    page:any=1;

    size:any=10;

    total:any=0;

    spinning:boolean = false;

    tableData:any=[];

    index:any="";
    
    async mounted(){
        this.index=this.$route.query.index;
        this.getCreated();
    }

    //查询表格
    async getCreated(){
        await this.queryId();
    }

    async queryId(){
        this.spinning=true;
        let pageOption = {
            page: this.page,
            size: "10",
            courseId:this.$route.query.id
        };
       let queryPage = qs.stringify(pageOption);
       let res:any={};
       if(this.index === "1"){
            res = await api.queryCatalogueByCourseId(queryPage);
       }else{
            res = await api.queryByCourseId(queryPage);
       }

       if(res.code === '00000'){
            this.spinning=false;
            this.tableData = res.data.content;
            this.page = Number(res.data.page);
            this.size = Number(res.data.size);
            this.total = Number(res.data.total);
        }
    }

    changePage(page){
        this.page=page;
        this.queryId();
    }

    async download(item:any){
        let options:any = {
            method: 'POST',
            url: '/api/transfer/course/downloadFile?courseCatalogueId='+item['id']+'&courseId='+this.$route.query.id,
            headers: {
            "content-type": "application/json;charset=UTF-8" 
            },
            responseType: 'blob'
        };

        axios.request(options).then(function (req:any) {
            let blob = new Blob([req], { type: "application/docx" });
            let objectUrl = ((window as any).URL || (window as any).webkitURL).createObjectURL(blob);
            let downFile = document.createElement("a");
            let fileName = item['fileName'];
            downFile.style.display = "none";
            downFile.href = objectUrl;
            downFile.download = fileName;
            document.body.appendChild(downFile);
            downFile.click();
            document.body.removeChild(downFile); 
            window.URL.revokeObjectURL(objectUrl);
        });
    }

     //详情
    async examinationQuestionsInfo(params?:any){
        let option = qs.stringify({
          "id": params
        })
        const res:any = await api.examinationQuestionsInfo(option);
        if(res.code === '00000'){
            this.modalData=[
                [
                    {
                        "name":"试题内容",
                        "con":res.data.examinationQuestionsContent,
                        "cols":""
                    },
                    {
                        "name":"试题类型",
                        "con":res.data.examinationQuestionsType,
                        "cols":""
                    },
                    {
                        "name":"正确答案",
                        "con":res.data.correct,
                        "cols":""
                    } 
                ],
                [
                    {
                        "name":"试题解析",
                        "con":res.data.examinationQuestionsAnalysis,
                        "cols":""
                    },
                    {
                        "name":"选项个数",
                        "con":res.data.options,
                        "cols":""
                    },
                    {
                        "name":"课程类型名称",
                        "con":res.data.typeName,
                        "cols":""
                    } 
                ],
                [
                    {
                        "name":"更新时间",
                        "con":res.data.updateTime,
                        "cols":"5"
                    },
                ]
                     
            ]
            return this.modalData;
        }
    }

    async showModalInfo(id: any){
        await this.examinationQuestionsInfo(id);
        this.childModal = this.$refs.childModal;
        this.childModal.showModal();
    }
} 
</script>
<style lang="less" scoped>
    .catalogueIndex{
        height: 100%;
        background: rgb(240,242,245);
        display: flex;
        flex-direction: row;
        overflow:hidden; 
        min-width: 1100px;
        .scrollY{
            flex: 1;
            height: 100%;
            overflow-y: scroll;
        }
        .indexRight{
            padding: 8px;
        }
        .indexTable{
            background: #fff;
            padding:24px;
            margin-bottom: 24px;
            border-radius: 2px;
            /deep/.ant-table-thead > tr > th, /deep/.ant-table-tbody > tr > td{
                padding:8px;
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
            .title{
                font-size: 16px;
                font-weight: 500;
                color: rgba(0,0,0,.85);
                margin-bottom: 18px;
            }
            /deep/.ant-pagination{
                display: flex;
                justify-content: right;
                margin: 16px 0;
            }
            .cardp {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .ml15{
                margin-left: 15px;
            }
        }
        .action i {
            margin-left: 5px;
            margin-right: 5px;
            cursor: pointer;
        }
        .catalogueTitle{
            margin-bottom: 10px;
            font-weight: 600;
        }
    }
</style>