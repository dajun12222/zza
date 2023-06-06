<template>
    <div class="dynamicIndex">
        <div class="scrollY">
            <a-col class="indexLeft" :span="6">
                <treeList ref="childTree" :treeData="treeData" @arrKeys="toSearch(arguments)" />
            </a-col>
            <a-col class="indexRight" :span="18">
                <a-spin :spinning="spinning">
                    <tableList  
                        ref="childTable"
                        :tableList="tableOne" 
                        @modalInfo="showModalInfo"
                        @changePage="changePage"
                    />
                </a-spin>
                <searchList 
                    ref="childSearch" 
                    :searchList="searchList"
                    @searchInfo="toSearchData" 
                    @tagClose="tagClose"
                />
                <a-spin :spinning="spinning">    
                    <tableList  
                        :tableList="tableTwo" 
                        @modalInfo="showModalInfo"
                        @download="download"
                    />
                </a-spin>
            </a-col>
        </div>
        
        <modalList :id="modalId" ref="childModal" :modalData="modalData" />
    </div>
</template>
<script lang="ts">
import { Col, Spin, Tooltip } from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import treeList from '@/../extends/components/audit/dynamic/tree.vue';
import tableList from '@/../extends/components/audit/dynamic/table.vue';
import searchList from '@/../extends/components/audit/dynamic/search.vue';
import modalList from '@/../extends/components/audit/dynamic/modal.vue';
import axios from 'axios';
import api  from '@/../extends/api';
// import Divider from "../../../../../admin/src/views/print-template/center-panel/divider.vue";
const qs = require('qs');

@Component({
    name: 'dynamicIndex',
    components: {
        ACol: Col,
        treeList,
        tableList,
        searchList,
        modalList,
        ASpin:Spin,
        ATooltip: Tooltip
    },
})

export default class dynamicIndex extends Vue {
    show:boolean = false; //详情显示

    tableColumns: any = [
        {
            title: '序号',
            scopedSlots: { customRender: 'num' },
            width:'50px'
        },
        {
            title: '采集时间',
            dataIndex: 'date',
            key: 'date',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            },
            width:'105px'
        },
        {
            title: '采集来源',
            dataIndex: 'sourceType',
            key: 'sourceType',
            ellipsis: true,
            width:'105px',
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
            title: '动态类型',
            key: 'type',
            dataIndex: 'type',
            ellipsis: true,
            width:'105px',
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
            title: '动态标题',
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            scopedSlots: { customRender: "columnTooltip" },
        },
        {
            title: '置顶时间',
            key: 'topDate',
            dataIndex: 'topDate',
            ellipsis: true,
            width:'105px',
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
            title: '操作',
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width:'80px'
        },
    ];

    tableOne:any = {
        tableData:[],
        tableColumns:this.tableColumns,
    };

    tableTwo:any = {
        tableTitle:'数据列表',
        tableData:[],
        tableColumns:this.tableColumns,
        page:'',
        size:'',
        total:'',
        name:'dynamicIndex'
    }

    treeData:any=[]; //树结构菜单

    treeDataOption:any = {
        title: '',
        sourceType: '',
        startDate: '',
        endDate: '',
        typeList: [],
    };

    searchList:any={
        objData:[],
        searchClass:'dynamicIndex',
    };

    typeList:any=[];

    modalData:any = [];  //详情数据

    page:any="1";

    childTable: any = null // 存储子组件

    childModal: any = null

    childSearch: any = null

    childTree: any = null

    spinning:boolean = false;

    modalId="";
    
    async mounted(){
        this.queryTopList();
        this.getCreated();
        this.queryDynamicTypeList();
    }

    //第一个表格
    async queryTopList(){
        const res:any = await api.queryTopList();
        if(res.code === '00000'){
            this.tableOne.tableData = res.data;
        }
    }

    //详情
    async queryActInfo(params?:any){
        let option = qs.stringify({
          "id": params
        })
        const res:any = await api.queryActInfo(option);
        if(res.code === '00000'){
            this.modalData=[
                [
                    {
                        "name":"动态标题",
                        "con":res.data.title,
                        "cols":""
                    },
                    {
                        "name":"发布单位",
                        "con":res.data.company,
                        "cols":""
                    },
                    {
                        "name":"来源",
                        "con":res.data.sourceType,
                        "cols":""
                    } 
                ],
                [
                    {
                        "name":"类型",
                        "con":res.data.type,
                        "cols":""
                    },
                    {
                        "name":"动态内容",
                        "con":res.data.content,
                        "cols":""
                    },
                    {
                        "name":"作者",
                        "con":res.data.author,
                        "cols":""
                    } 
                ],
                [
                    {
                        "name":"采集时间",
                        "con":res.data.date,
                        "cols":""
                    },
                    {
                        "name":"主题库标识",
                        "con":res.data.subjectCode,
                        "cols":""
                    },
                    {
                        "name":"原文链接",
                        "con":res.data.link,
                        "cols":""
                    },
                ],
                [
                    {
                        "name":"动态附件",
                        "con":res.data.fileName,
                        "cols":5
                    }
                ]
                     
            ]
            return this.modalData;
        }
    }

    async showModalInfo(id: any){
        this.modalId=id;
        await this.queryActInfo(id);
        this.childModal = this.$refs.childModal;
        this.childModal.showModal();
    }

    //查询and第二个表格
    async getCreated(){
        await this.pageActQuery(this.treeDataOption);
    }

    async pageActQuery(params?:any,option?:any){
        this.spinning=true;
        let pageOption = {
            page: this.page,
            size: "10",
        };
        let maps = Object.assign(pageOption,option);
        let queryPage = qs.stringify(maps);
        const res:any = await api.pageActQuery( params,queryPage);
        this.spinning=false;
        if(res.code === '00000'){
            this.tableTwo.tableData = res.data.content;
            this.tableTwo.page = Number(res.data.page);
            this.tableTwo.size = Number(res.data.size);
            this.tableTwo.total = Number(res.data.total);
        }
    }

    //搜索组件搜索表格
    async toSearchData(params?:any){
        this.page="1";
        this.treeDataOption={
            title:params.title || '',
            sourceType:params.sourceType || '',
            startDate:params.startDate || '',
            endDate:params.endDate || '',
            typeList: this.typeList || [],
        }
        await this.pageActQuery(this.treeDataOption);
    }

    //树结构
    async queryDynamicTypeList(){
        const res:any = await api.queryDynamicTypeList();
        if(res.code === '00000'){
            this.treeData = res.data;
            return this.treeData;
        }
    }

    save(item) {
        if (item.dictionaryId) this.typeList.push(item.dictionaryId);
        if (item.children && item.children.length > 0) {
            for (let index = 0; index < item.children.length; index++) {
                let element = item.children[index];
                this.save(element)
            }
        }

    }

    fn(arr,id) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].dictionaryId === id) {
                this.save(arr[i])
            } else {
                if (arr[i].children && arr[i].children.length > 0) {
                    this.fn(arr[i].children,id)
                }
            }
        }
    }

    //点击树结构
    toSearch(data: any){
        this.searchList.objData=[];
        let typeTag:any = Object.values(data[0]);
        if(typeTag.length > 2){
            const lastTag:any = typeTag.pop();
            typeTag.unshift(lastTag);
        }
        const typeTagParam:any={
            "name1":typeTag[0],
            "name2":typeTag[typeTag.length-1],
            "typeId":'typeList',
        };
        this.searchList.objData.push(typeTagParam);
        this.typeList=[];
        this.fn(this.treeData,String(data[1]))
        this.treeDataOption.typeList =this.typeList;
        this.toSearchData(this.treeDataOption);
    }

    tagClose(){
        this.typeList=[];
        this.toSearchData(this.treeDataOption);
    }

    changePage(page){
        this.page=page;
        this.pageActQuery(this.treeDataOption);
    }
    
    async download(item:any){
        let options:any = {
            method: 'POST',
            url: '/api/transfer/dynamic/downloadFile?dynamicId='+item['id'],
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
}
</script>
<style lang="less" scoped>
    .dynamicIndex{
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
         .indexLeft{
            padding:8px 8px 8px 12px;
            > div {
                border-radius: 5px !important;
                box-shadow: 0 0 5px #d4e4fa;
            }
        }
        .indexRight{
            padding: 8px;
            > div {
                border-radius: 5px !important;
                box-shadow: 0 0 5px #d4e4fa;
            }
        }
    }
    .action i {
        margin-left: 10px;
        margin-right: 5px;
        cursor: pointer;
    }
</style>