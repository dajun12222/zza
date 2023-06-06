<template>
    <div class="modelIndex">
        <a-col class="indexRight" :span="24">
            <div class="indexSearch">
                <template>
                    <p>模型名称
                        <a-tooltip title="标题过长会自动收缩">
                            <a-icon type="question-circle-o" class="poinIcon" style="color: rgba(0,0,0,.45);" />
                        </a-tooltip>：
                    </p>
                    <a-input v-model="optList.modelName" placeholder="请输入" class="indexInput" allowClear />
                </template>
                <template>
                    <p>业务类型：</p>
                    <!-- <a-select
                        ref="select"
                        v-model="optList.businessType"
                        class="indexSelect"
                        placeholder="请选择"
                        @change="changeSelect"
                    >
                         <a-select-option v-for="item in queryList" :key="item.id" :value="item.name">{{ item.name }}</a-select-option>
                    </a-select> -->
                    <a-tree-select 
                        v-model="optList.businessType"
                        class="indexSelect"
                        :treeData="queryList"
                        :replaceFields="replaceFields"
                        treeDefaultExpandAll
                        allowClear
                        :dropdownMatchSelectWidth="true"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        placeholder="请选择业务类型"
                        @select="changeSelect"
                    />   
                    <!-- <businessType v-model="queryListVal" /> -->
                </template>
                <template>
                    <a-button @click="clearSearch">重置</a-button>
                    <a-button type="primary" @click="search">查询</a-button>
                </template>
            </div>
            <a-spin :spinning="spinning"> 
                <div class="indexTable">
                    <a-table :columns="tableColumns" 
                        :data-source="tableData" 
                        :pagination="false" 
                        :rowKey="record => record.id"
                        :scroll="{ y: 445 }"
                    >
                         <template #customTitle>
                            <span>
                                模型名称
                                <a-tooltip title="标题过长会自动收缩">
                                    <a-icon type="info-circle-o" class="poinIcon" />
                                </a-tooltip>
                            </span>
                        </template>
                        <template slot="columnTooltip" slot-scope="text">
                            <a-tooltip v-if="isShowTooltip" placement="top" overlayClassName="columnTooltip" :overlayStyle="{maxWidth: '250px'}">
                                <template slot="title">{{ text }}</template>
                                <div class="cardp" @mouseenter="visibilityChange($event)">{{ text ? text : '-' }}</div>
                            </a-tooltip>
                            <div v-else class="cardp" @mouseenter="visibilityChange($event)">{{ text ? text : '-' }}</div>
                        </template>
                        <template slot="operation" slot-scope="text, record">
                            <a class="mr10" @click="toList(record)">字段查看</a>
                            <a class="mr10" @click="download(record)">模板下载</a>
                            <a @click="upload(record)">数据上传</a>
                        </template>
                    </a-table>
                </div>   
                
            </a-spin>
        </a-col>
        <a-modal
            :visible="show"
            title="模版上传"
            okText="确定"
            cancelText="取消"
            @ok="okModal"
            @cancel="hideModal"
        >
            <p style="margin-bottom:10px;">上传</p>
            <p>
                <a-upload-dragger
                    :multiple="false"
                    name="file"
                    accept=".xlsx, .xls"
                    :headers="header"
                    :action="uploadUrl"
                    :beforeUpload="beforeUpload"
                    :fileList="fileList"
                    :remove="handleRemove"
                >
                    <div class="tip">
                        <p class="uploadBox">
                            <a-icon type="inbox-o" class="uploadIcon" style="font-size: 48px;color: #40a9ff;" />
                        </p>
                        <div style="margin:20px 0;">
                            单击或拖动文件到此区域进行上传
                            <div class="upload-tip">支持单次上传一个,仅支持Excel文件</div>
                        </div>
                    </div>
                </a-upload-dragger>
            </p>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { Col, Spin, Tooltip, Input, Select, Button, Table, Icon, Modal, Upload, Progress, message, TreeSelect} from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import axios from 'axios';
import api  from '@/../extends/api';
import businessType from '@/../extends/components/tree/businessType.vue';
import { listApi as Application } from 'cloudpivot/api/index';
// import Divider from "../../../../../admin/src/views/print-template/center-panel/divider.vue";
const qs = require('qs');

@Component({
    name: 'modelIndex',
    components: {
        ACol: Col,
        ASpin:Spin,
        ATooltip: Tooltip,
        ASelect: Select,
        ASelectOption: Select.Option,
        AButton: Button,
        AInput: Input,
        ATable: Table,
        AIcon: Icon,
        AModal:Modal,
        AUpload:Upload,
        AProgress: Progress,
        ATreeSelect: TreeSelect,
    },
})

export default class modelIndex extends Vue {
    filtersList:any=[];

    show:boolean = false; //详情显示

    isShowTooltip:any=false;

    queryList:any=[];  //业务类型下拉数据

    tableData:any=[];

    tableColumns: any = [
        {
            title: '模型编码',
            dataIndex: 'modelCode',
            key: 'modelCode',
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
            dataIndex: 'modelName',
            key: 'modelName',
            ellipsis: true,
            slots: { title: 'customTitle'},
            scopedSlots: { customRender: "columnTooltip" },
        },
        {
            title: '业务类型',
            key: 'businessType',
            dataIndex: 'businessType',
            // filters: this.filtersList,
            // filterMultiple: false,
            // onFilter: (value: number | string | boolean, record: any) =>
            //     record.businessType === value,
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
            key: 'state',
            dataIndex: 'state',
            ellipsis: true,
            scopedSlots: { customRender: "columnTooltip" },
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = "已发布";
                }else{
                    obj = "未发布"
                }
                return obj;
            }
        },
        {
            title: '来源',
            key: 'source',
            dataIndex: 'source',
            ellipsis: true,
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = "内置";
                }else{
                    obj = "个性化"
                }
                return obj;
            }
        },
        {
            title: '操作',
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width:'220px'
        },
    ];

    spinning:boolean = false;

    fileList:any=[];

    optList:any={
        businessType:"",
        modelName: "",
    }

    modelCode:string="";

    queryListVal:string[] = [];

    replaceFields: any = {
        children: "children",
        title: "name",
        key: "name",
        value: "name",
    };

    created(){
        //业务类型查询
        this.queryBusinessTypeList();
        this.queryModel(this.optList);
    }

    async queryBusinessTypeList(){
        const res:any = await api.queryBusinessTypeList();
        if(res.code === '00000'){
            this.queryList = res.data[0]['children'];
            res.data[0]['children'].forEach(element => {
                var param:any={};
                param["text"]=element.name;
                param["value"]=element.name;
                this.filtersList.push(param);
            });
        }else{
            this.queryList = [];
            this.filtersList = [];
        }
        console.log(this.filtersList)
    }

    async queryModel(params?:any){
        this.spinning=true;
        let maps = Object.assign(params);
        let queryPage = qs.stringify(maps);
        const res:any = await api.queryModel(queryPage);
        this.spinning=false;
        if(res.code === '00000'){
            this.tableData = res.data;
        }else{
            this.tableData = [];
        }
    }

    async download(item:any){
        let options:any = {
            method: 'post',
            url: '/api/transfer/data-import/download?modelCode='+item['modelCode'],
            headers: {
            "content-type": "application/json;charset=UTF-8" 
            },
            responseType: 'blob'
        };
        axios.request(options).then(function (req:any) {
            let blob = new Blob([req], { type: "application/docx" });

            let objectUrl = ((window as any).URL || (window as any).webkitURL).createObjectURL(blob);
            let downFile = document.createElement("a");
            let fileName = item['modelName']+'.xlsx';
            downFile.style.display = "none";
            downFile.href = objectUrl;
            downFile.download = fileName;
            document.body.appendChild(downFile);
            downFile.click();
            document.body.removeChild(downFile); 
            window.URL.revokeObjectURL(objectUrl);
        });
    }

    visibilityChange(event) {
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
      const content_weight = ev.clientWidth;// 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
      // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      if (ev_weight > content_weight) {
        // 实际宽度 > 可视宽度  文字溢出
        this.isShowTooltip = true;
      } else {
        // 否则为不溢出
        this.isShowTooltip = false;
      }
    }

    changeSelect(value){
        console.log(value);
        this.optList.businessType=value;
    }

    search(){
        this.queryModel(this.optList)
    }

    clearSearch(){
        this.optList={
            businessType:"",
            modelName:""
        }
        this.queryModel(this.optList)
    }

    toList(params:any){
        let { href } = this.$router.resolve({ 
            name: 'modelManageList', 
            query: { modelCode:params.modelCode,isOpenPage: 'true',appCode:  this.$route.query.code }, 
        });
        window.open(href,'_blank')
    }

    upload(params){
        this.modelCode=params.modelCode;
        Modal.confirm({
            title: '模版下载是否完成?',
            content: '未下载，请先下载模版. 已下载，请忽略此提示.',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.show=true;
            },
        });
    }

    hideModal(){
        this.show=false;
        this.fileList=[];
        this.disSHow();
    }

    okModal(){
        let userInfo: any = window.sessionStorage.getItem('user');
        if (userInfo) {
            userInfo = JSON.parse(userInfo);
        } else {
            userInfo = { };
        }
        let operator = userInfo.name || '';
        let operatorId = userInfo.id || '';
        let auditUnit = userInfo.departmentName || '';
        if(this.fileList.length > 0){
            this.show=false;
            var formData = new FormData();
            formData.append('file', this.fileList[0]);
            formData.append('modelCode', this.modelCode);
            formData.append('operator', operator);
            formData.append('operatorId', operatorId);
            formData.append('auditUnit', auditUnit);
            axios.post('/api/transfer/data-import/import', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(res => {
                this.fileList=[];
                message.success("操作成功！");
            }).catch((err: any) => {
                message.error(err);
            });
            this.disSHow();
        }else{
            message.error("请上传文件！");
        }
    }

    get header() {
      const token = localStorage.getItem('token');
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    beforeUpload(file: any, fileList:any) {
        this.fileList=fileList;
        let uploadDrag =  document.querySelectorAll(".ant-upload-drag") as NodeListOf<HTMLElement>;
        let uploadList =  document.querySelectorAll(".ant-upload-list") as NodeListOf<HTMLElement>;
        uploadDrag[0].style.display = 'none';
        uploadList[0].style.display = 'block';
    }

    get uploadUrl() {
        return `${Application.fileUploadUrl}`;
    }

    handleRemove(file){
        this.fileList=[];
        this.disSHow();
    }
    
    disSHow(){
        let uploadDrag =  document.querySelectorAll(".ant-upload-drag") as NodeListOf<HTMLElement>;
        let uploadList =  document.querySelectorAll(".ant-upload-list") as NodeListOf<HTMLElement>;
        uploadDrag[0].style.display = 'block';
        uploadList[0].style.display = 'none';
    }
}
</script>
<style lang="less" scoped>
    .modelIndex{
        height: 100%;
        background: rgb(240,242,245);
        min-width: 1100px;
        .indexRight{
            padding: 8px;
        }
        .indexSearch{
            background: #fff;
            margin-bottom: 16px;
            padding: 24px;
            border-radius: 2px;
            display: flex;
            p{
                line-height: 32px;
            }
            .indexInput,.indexSelect{
                width: 30%;
                margin-right: 20px;
            }
            .indexSelect{
                margin-right: 30px;
            }
            /deep/.ant-btn{
                font-size: 14px;
                margin-right: 10px;
            }
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
        .mr10{
            margin-right: 10px;
        }
        .poinIcon{
            cursor: pointer;
        }
        .uploadBox{
            width: 100%;
        }
        .cardp {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    /deep/.ant-upload-list-item-name{
        width: 99%;
    }
</style>