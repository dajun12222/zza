<template>
    <div class="classIndex">
        <div class="scrollY">
            <a-col class="indexLeft" :span="6">
                <treeList ref="childTree" :treeData="treeData" @arrKeys="toSearch(arguments)" />
            </a-col>
            <a-col class="indexRight" :span="18">
                <searchList 
                    ref="childSearch" 
                    :searchList="searchList"
                    @searchInfo="toSearchData" 
                    @tagClose="tagClose"
                />
                <a-spin :spinning="spinning">    
                    <tableList  
                        :tableList="tableTwo" 
                        @changePage="changePage"
                        @modalInfo="showModalInfo"
                        @toList="toList"
                        @download="download"
                    />
                </a-spin>
            </a-col>
        </div>
        <modalList ref="childModal" :modalData="modalData" />
    </div>
</template>
<script lang="ts">
import { Col, Spin } from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import treeList from '@/../extends/components/audit/dynamic/tree.vue';
import tableList from '@/../extends/components/audit/dynamic/table.vue';
import searchList from '@/../extends/components/audit/dynamic/search.vue';
import modalList from '@/../extends/components/audit/dynamic/modal.vue';
import axios from 'axios';
import api  from '@/../extends/api';
const qs = require('qs');

@Component({
    name: 'classIndex',
    components: {
        ACol: Col,
        ASpin:Spin,
        treeList,
        tableList,
        searchList,
        modalList
    },
})

export default class classIndex extends Vue {
    show:boolean = false; //详情显示

    tableColumns: any = [
        {
            title: '序号',
            scopedSlots: { customRender: 'num' },
            width:'50px'
        },
        {
            title: '课程名称',
            dataIndex: 'courseName',
            key: 'courseName',
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
            title: '课程更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
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
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = '发布';
                }else{
                    obj = "未发布"
                }
                return obj;
            },
            width:'100px'
        },
        {
            title: '试题数量',
            dataIndex: 'questionsCount',
            key: 'questionsCount',
            ellipsis: true,
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            },
            width:'100px'
        },
        {
            title: '操作',
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width:'120px'
        },
    ];

    tableTwo:any = {
        tableTitle:'事项列表',
        tableData:[],
        tableColumns:this.tableColumns,
        page:'',
        size:'',
        total:'',
        name:'classIndex'
    };

    searchList:any={
        searchData:{},
        objData:[],
        searchTag:'classIndex',
    };
    
    page:any="1";

    treeData:any=[]; //树结构菜单

    treeDataOption:any = {};

    typeList:any=[];

    modalData:any = [];  //详情数据

    childTable: any = null // 存储子组件

    childModal: any = null

    childSearch: any = null

    childTree: any = null

    spinning:boolean = false;
    
    async mounted(){
        this.getCreated();
        this.queryCourseList();
    }

    //详情
    async queryCourseDetails(params?:any){
        let option = qs.stringify({
          "courseId": params
        })
        const res:any = await api.queryCourseDetails(option);
        if(res.code === '00000'){
            this.modalData=[
                [
                    {
                        "name":"课程名称",
                        "con":res.data.courseName,
                        "cols":""
                    },
                    {
                        "name":"课程分类",
                        "con":res.data.courseType,
                        "cols":""
                    },
                    {
                        "name":"课程简介",
                        "con":res.data.courseIntroduction,
                        "cols":""
                    } 
                ],
                [
                    {
                        "name":"试题数量",
                        "con":res.data.questionsCount,
                        "cols":""
                    },
                    {
                        "name":"状态",
                        "con":res.data.enabled?"启用":"未启用",
                        "cols":""
                    },
                    {
                        "name":"学习资料",
                        "con":res.data.fileName,
                        "cols":""
                    } 
                ],
                [
                    {
                        "name":"主题库标识",
                        "con":res.data.subjectCode,
                        "cols":""
                    },
                    {
                        "name":"创建时间",
                        "con":res.data.createTime,
                        "cols":""
                    },
                    {
                        "name":"修改时间",
                        "con":res.data.updateTime,
                        "cols":""
                    } 
                ]
                     
            ]
            return this.modalData;
        }
    }

    async showModalInfo(id: any){
        await this.queryCourseDetails(id);
        this.childModal = this.$refs.childModal;
        this.childModal.showModal();
    }

    //查询表格
    async getCreated(){
        await this.pageCourseQuery(this.treeDataOption);
    }

    async pageCourseQuery(params?:any,option?:any){
        this.spinning=true;
        let pageOption = {
            page: this.page,
            size: "10",
        };
        let maps = Object.assign(pageOption,option);
        let queryPage = qs.stringify(maps);
        const res:any = await api.pageCourseQuery( params,queryPage);
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
            courseName:params.title?params.title:params.courseName,
            typeList: this.typeList || [],
        }
        await this.pageCourseQuery(this.treeDataOption);
    }

    //树结构
    async queryCourseList(){
        const res:any = await api.queryCourseList();
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
        this.pageCourseQuery(this.treeDataOption);
    }

    toList(id: any,index:any){
        let { href } = this.$router.resolve({ 
            name: 'catalogue', 
            query: { id,index,isOpenPage: 'true',appCode:  this.$route.query.code }, 
        });
        window.open(href,'_blank')
    }

    async download(item:any){
        let options:any = {
            method: 'POST',
            url: '/api/transfer/course/downloadFile?courseCatalogueId='+item['id'],
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
    .classIndex{
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
        }
        .indexRight{
            padding: 8px;
        }
    }
</style>