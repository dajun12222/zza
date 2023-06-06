<template>
  <div class="exam">
        <a-spin :spinning="spinning"> 
            <div ref="examTitle" class="examTitle">试卷名称：<span>{{ paperName }}</span></div>
            <a-form-model 
                ref="ruleForm" 
                :model="ruleForm" 
                :style="'height:' + outHeight"
            >
                <div ref="examCount" class="examCount">
                    <div style="display:flex;line-height:40px;">
                        共 <span>{{ paperNum }}</span> 题，总分 <span>{{ totalScore }}</span> 分，及格
                        <a-form-model-item prop="passScore" :rules="rules.passScore" class="passScoreItem">
                            <a-input-number
                                v-model.number="ruleForm.passScore"  
                                class="passScore" 
                                @change="e => passScoreChange(e)"
                            />分
                        </a-form-model-item>
                    </div>
                    <a-dropdown placement="bottomCenter" style="margin-top:4px;">
                        <a-button type="primary">创建试题</a-button>
                        <a-menu slot="overlay">
                            <a-menu-item @click="goChoose">从题库选择</a-menu-item>
                            <a-menu-item @click="upload">Excel导入</a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
                <a-table 
                    v-if="ruleForm.questionList.length"
                    :columns="columns" 
                    :dataSource="ruleForm.questionList" 
                    :rowKey="(record) => { record }"
                    bordered 
                    :pagination="false"
                    :scroll="{ y: tableHeight }"
                >
                    <div slot="aTooltip" slot-scope="text" class="aTooltip">
                        <a-tooltip :overlayStyle="{ maxWidth: '300px' }">
                            <template #title>{{ text }}</template>
                            {{ text }}
                        </a-tooltip>
                    </div>
                    <template slot="orderNum" slot-scope="text, record, i">
                        <a-form-model-item :prop="'questionList.' + i + '.orderNum'" :rules="rules.courseNum">
                            <a-input-number v-model.number="record.orderNum" @change="e => sortChange(e,i)" />
                        </a-form-model-item>
                    </template>
                    <template slot="scoreNum" slot-scope="text, record, i">
                        <a-form-model-item :prop="'questionList.' + i + '.scoreNum'" :rules="rules.courseNum">
                            <a-input-number v-model.number="record.scoreNum" class="inputNum" @change="e => numChange(e,i)" />
                        </a-form-model-item>
                    </template>
                    <div
                        slot="action"
                        slot-scope="text,record,index"
                    >
                        <span class="action" @click="handleRemove(record,index)">移除</span>
                    </div>
                </a-table>
                <a-table 
                    v-else
                    :columns="columns" 
                    :dataSource="ruleForm.questionList" 
                    :rowKey="(record) => { record }"
                    bordered 
                    :pagination="false"
                    :locale="locale"
                >
                    
                </a-table>
                <a-form-model-item v-if="ruleForm.questionList.length" class="btn">
                    <a-button type="primary" @click="submit('ruleForm')">保存</a-button>
                </a-form-model-item>
            </a-form-model>
            <a-modal
                :visible="show"
                title="导入试题"
                okText="确定"
                cancelText="取消"
                @ok="okModal"
                @cancel="hideModal"
            >
                <a src="javascript" @click="exportTemplate">下载模版</a>
                <p style="margin-top:10px;">
                    <a-upload-dragger
                        :multiple="false"
                        name="file"
                        accept=".xlsx, .xls"
                        :headers="header"
                        :action="uploadUrl"
                        :beforeUpload="beforeUpload"
                        :fileList="fileList"
                        :remove="uploadRemove"
                        @change="handleChange"
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
            <a-modal
                :visible="errorModal"
                title="导入试题"
                :footer="null"
                @cancel="hideErrorModal"
            >
                <div class="modalDiv">
                    <img src="../images/import-status.svg" />
                    <h3 v-if="!errorModalData.successCount && !errorModalData.errorCount">数据校验错误</h3>
                    <p v-if="errorModalData.errorMsg">{{ errorModalData.errorMsg }}</p>
                    <p v-if="!errorModalData.fileName">请参照<a src="javascript" @click="exportTemplate">示例文件</a>重新检查</p>
                    <h3 v-if="errorModalData.successCount && errorModalData.errorCount">数据导入完成</h3>
                    <p v-if="errorModalData.successCount && errorModalData.errorCount">
                        成功导入
                        <span class="green">{{ errorModalData.successCount }}</span>条数据，有
                        <span class="red">{{ errorModalData.errorCount }}</span>条数据导入失败
                    </p>
                    <p v-if="errorModalData.fileName">请
                        <a class="red" src="javascript" @click="exportErrorResult">下载错误数据</a>，
                        修改后再导入
                    </p>
                </div>
                <a-button v-if="!errorModalData.fileName" class="reUpload" @click="errorReupload">重新上传</a-button>
                <a-button v-if="errorModalData.fileName" class="reUpload" @click="errorReturn">完成</a-button>
            </a-modal>
        </a-spin>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Model, Watch } from "vue-property-decorator";
import { Button, Table, Input, Tooltip,Form, FormModel, InputNumber, Dropdown, Menu, Modal, Upload, Icon, message, Spin, Col} from "@h3/antd-vue";
import axios from 'axios';
import api  from '@/../extends/api';
import env  from '../../../../../portal/src/config/env'
import { listApi, listParams } from 'cloudpivot/api';
import empty from '../component/empty.vue';
const qs = require('qs');
// import date from "@cloudpivot/common/src/utils/date";
@Component({
  name: "examination",
  components: {
    AButton: Button,
     ACol: Col,
     ASpin:Spin,
    ATable: Table,
    AInput: Input,
    AInputNumber: InputNumber,
    ATooltip: Tooltip,
    AForm: Form,
    AFormItem: Form.Item,
    AFormModel: FormModel,
    AFormModelItem: FormModel.Item,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AModal:Modal,
    AUpload:Upload,
    AIcon: Icon,
  },
})
export default class examination extends Vue {
    show:any = false;

    errorModal:any = false;

    spinning:boolean = false;

    paperid:any = ""

    paperNum:any = '';

    paperName:any = ""

    passScore:any = ""

    outHeight:any = ''

    fileList:any=[];

    columns:any = [
        {
            title: '试题名称',
            dataIndex: 'questionTitle',
            key: 'questionTitle',
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '题型',
            dataIndex: 'questionType',
            key: 'questionType',
            width:130,
        },
        {
            title: '排序',
            dataIndex: 'orderNum',
            key: 'orderNum',
            width:130,
            scopedSlots: { customRender: "orderNum"}
        },
        {
            title: '分值',
            dataIndex: 'scoreNum',
            key: 'scoreNum',
            width:130,
            scopedSlots: { customRender: "scoreNum"}
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:70,
            scopedSlots: { customRender: "action"}
        }
    ]

    selectedRowKeys:any = []

    totalScore:any = 0;

    rules: any = {};

    ruleForm:any = {
        passScore:"",
        questionList:[]
    }

    locale:any = { emptyText: '暂无试题信息，请选择“创建试题”'}

    tableHeight:any = ''

    blob:any = {}

    errorModalData:any = {
        errorMsg:'',
        errorCount:'',
        successCount:'',
        fileName:''
    }

    beforeMount() {
        this.setRules();
    }

    created(){
        let newUrl = decodeURIComponent(window.location.href);
        if(newUrl.indexOf("paperid") !== -1){
            if(newUrl.indexOf("parentId") !== -1){
                this.paperid =  newUrl.split("paperid=")[1].split("&parentId")[0]
            }else{
                this.paperid =  newUrl.split("paperid=")[1].split("&isOpenPage")[0]
            }
        }
        this.getList();
        this.setHeight();
    }

    validateWage(rule, value, callback){
        let reg = /^[1-9]+\d*$/
        if (value === '') {
            callback(new Error('请输入值'))
        } else if (!reg.test(value)) {
            callback(new Error('请输入正整数'))
        } else {
            callback()
        }
    }

    validatePass(rule, value, callback){
        let reg = /^[1-9]+\d*$/
        if(value && !reg.test(value)) {
            callback(new Error('请输入正整数'))
        }else if(value && value > this.totalScore){
            callback(new Error('及格分不能大于总分'))
        }else {
            callback()
        }
    }

    setRules() {
        this.rules = {
            courseNum: [{ 
                validator: this.validateWage, 
                type:'number',
                trigger: 'blur',
            }],
            passScore: [{
                validator: this.validatePass, 
                type:'number',
                trigger: 'blur',
            }]
        };
    }

    submit(){
        const ruleForm: any = this.$refs['ruleForm'];
        ruleForm.validate(async (valid) => {
            if (valid) {
                this.saveOnlinePaper("submit")
            }else{
                message.error("试题填写有误，请检查试题无误后再提交")
            }
        })
    }
    
    goChoose(){
        let { href } = this.$router.resolve({ 
            path: '/application/OnlineLearning/application-list/questionBank', 
            query: { isOpenPage: 'true',appCode:this.$route.query.code, paperid:this.paperid, parentId:'2c2c808386c05caa0186c0bd72f31d48',code:'questionBank'}, 
        });
        window.open(href,'_self')
    }

    handleRemove(item,index){
        let id = [];
        id.push(item.id);
        let option = {
            ids:id,
            schemaCode:"paper_Question"
        }
         Modal.confirm({
            title: "提示",
            content: "确认移除此试题吗？",
            okText: "确定",
            cancelText:'取消',
            onOk: () => {
                this.delete_data(option,index);
            },
        });
    }

    passScoreChange(e,i){
        this.$set(this.ruleForm, 'passScore', e)
    }

    sortChange(e,i){
        let list = [...this.ruleForm.questionList];
        list[i].orderNum = e;
        this.$set(this.ruleForm, 'questionList', list)
    }

    numChange(e,i){
        let list = [...this.ruleForm.questionList];
        list[i].scoreNum = e;
        this.$set(this.ruleForm, 'questionList', list)
        let objVal = 0;
        this.ruleForm.questionList.forEach(ele => {
            if(ele.scoreNum){
                objVal += ele.scoreNum
            }
        });
        this.totalScore = objVal;
    }

    beforeUpload(file: any, fileList:any) {
        this.fileList=fileList;
        let uploadDrag =  document.querySelectorAll(".ant-upload-drag") as NodeListOf<HTMLElement>;
        let uploadList =  document.querySelectorAll(".ant-upload-list") as NodeListOf<HTMLElement>;
        uploadDrag[0].style.display = 'none';
        uploadList[0].style.display = 'block';
    }

     handleChange(info: any) {
        this.blob = info.file;
        if (info.file.status === 'done') {
            this.blob = info.file.response;
        }
    }

    get uploadUrl() {
        return `${env.apiHost}/api/runtime/query/upload_file2`;
    }

    get header() {
      const token = localStorage.getItem('token');
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    upload(params){
        this.show=true;
    }
    

    uploadRemove(file){
        this.fileList=[];
        this.disSHow();
    }

    hideModal(){
        this.show=false;
        this.fileList=[];
        this.disSHow();
    }

    okModal(){
        if(this.fileList.length > 0){
            this.show=false;
            this.import_data();
            this.disSHow();
        }else{
            message.error("请上传文件！");
        }
    }

    disSHow(){
        let uploadDrag =  document.querySelectorAll(".ant-upload-drag") as NodeListOf<HTMLElement>;
        let uploadList =  document.querySelectorAll(".ant-upload-list") as NodeListOf<HTMLElement>;
        uploadDrag[0].style.display = 'block';
        uploadList[0].style.display = 'none';
    }

    async getList(){
        this.spinning = true;
        let option = {
            paperid: this.paperid
        }
        let queryPage = qs.stringify(option);
        const res:any = await api.getOnlinePaperByID(queryPage);
        this.spinning=false;
        if(res.errcode === 0){
           this.paperName = res.data.paperName;
           this.paperNum = res.data.questionList.length;
           this.ruleForm.passScore = res.data.passScore?res.data.passScore:0;
           this.totalScore = res.data.totalScore?res.data.totalScore:0;
           this.ruleForm.questionList = res.data.questionList;
        }
    }

     async saveOnlinePaper(val?:any){
        this.ruleForm['id'] = this.paperid;
        this.ruleForm['totalScore'] = this.totalScore;
        // this.ruleForm['passScore'] = this.passScore;
        this.ruleForm['paperName'] = this.paperName;
        this.ruleForm['paperNum'] = this.ruleForm.questionList.length;
        for(var i=0; i<this.ruleForm.questionList.length; i++){
            delete this.ruleForm.questionList[i].questionTitle
            delete this.ruleForm.questionList[i].questionType
            delete this.ruleForm.questionList[i].paperId
        }
        const res:any = await api.saveOnlinePaper(this.ruleForm);
        if(res.errcode === 0){
            if(val){  //保存按钮
                message.success("保存成功")
                setTimeout(() => {
                    let { href } = this.$router.resolve({ 
                        path: '/application/OnlineLearning/application-list/paperLibrary', 
                        query: { isOpenPage: 'true', parentId:'2c2c808386c05caa0186c0bd72f31d48',code:'paperLibrary'}, 
                    });
                    window.open(href,'_self')
                },1500)
            }else{ //移除
                message.success("移除成功")
                setTimeout(() => {
                    this.getList();
                },1500)
            }
        }else{
            if(val){
                message.error("保存失败")
             }else{
                message.error("移除失败")
             }
        }
    }

    async delete_data(option,index){
        this.spinning = true;
        const res:any = await api.delete_data(option);
        if(res.errcode === 0){
            let option = [];
            for (let i = 0; i < this.ruleForm.questionList.length; i++) {
                if(index !== i){
                    option.push(this.ruleForm.questionList[i])
                }else{
                    if(this.totalScore > 0){
                        this.totalScore = this.totalScore - this.ruleForm.questionList[i].scoreNum;
                    }
                }
            }
            this.ruleForm.questionList = option;
            this.saveOnlinePaper();
        }
    }

    async import_data(){
        let option = qs.stringify({
            fileName:this.blob,
            originalFilename:this.fileList[0].name,
            schemaCode:"paper_Question",
            // paperId:this.paperid,
            queryCode:"paper_Question",
            queryField:false
        })
        const res:any = await api.import_data(option);
        this.spinning = true;
        if(res.errcode === 0){
            this.fileList=[];
            setTimeout(() =>{
                this.import_progress(res.data.taskId);
            },2000)
        }else{
            this.spinning = false;
            message.error(res.errmsg);
        }
    }

    async importQuestionData(){
        let option = qs.stringify({
            paperId:this.paperid
        })
        const res:any = await api.importQuestionData(option);
        // await setTimeout(() => {
        //     this.getList();
        // }, 1500);
        if(res.data.code === "1"){
            message.success("操作成功！");
            this.getList();
        }else{
            message.error(res.data.msg);
        }
    }

    async exportTemplate() {
        const params = {
            schemaCode:  "paper_Question",
            queryCode:  "paper_Question",
            languageType: "zh"
        };
        const res = await listApi.exportTemplate(params)
        if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
            this.$message.error(
                this.$t('cloudpivot.list.pc.DownloadFailed') as string,
            );
        } else {
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });

            const fileName = `试题模版导入示例${this.getTime()}.xlsx`;

            this.downloadFile(blob, fileName);
        }  
    }

    async import_progress(id:any){
        let option = qs.stringify({
            taskId:id
        })
        const res:any = await api.import_progress(option);
        this.spinning = false;
       if(res.data.taskStatus === 'END'){
            this.importQuestionData();
       }else{
            this.errorModalData.errorMsg = res.data.errorMsg;
            this.errorModalData.successCount = res.data.successCount;
            this.errorModalData.errorCount = res.data.errorCount;
            this.errorModalData.fileName = res.data.fileName;
            this.errorModal = true;
       }
    }

    errorReupload(){
        this.show = true;
        this.errorModal = false;
    }

    errorReturn(){
        this.errorModal = false;
        this.importQuestionData();
    }

    async exportErrorResult() {
        console.log('下载错误信息文档');
        const res = await listApi.downErrorResult(this.errorModalData.fileName);
        if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
        this.$message.error(
            this.$t('cloudpivot.list.pc.DownloadFailed') as string,
        );
        } else {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        const stamp = new Date().getMilliseconds();
        const fileName = `试题错误信息${this.getTime()}.xlsx`;

        this.downloadFile(blob, fileName);
        }
    }

    hideErrorModal(){
        this.errorModal = false;
        if(this.errorModalData.fileName){
            this.importQuestionData();
        }else{
            this.getList();
        }
    }

    setHeight(){
        // 页面可视高-顶部实际高-底部实际高-多余部分高度
      let that = this;
      this.$nextTick(() => {
        let headerHeight:any = (this.$refs.examTitle as HTMLDivElement).offsetHeight;
        let bodyHeight:any = document.body.clientHeight;
        this.outHeight = bodyHeight - headerHeight - 125 + "px";
        this.tableHeight = bodyHeight - headerHeight - 295;
      });
    }

    getTime() {
        const date = new Date();
        const mounth =
        date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const days = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
        const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
        const minutes =
        date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
        const seconds =
        date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;

        const stamp = `${date.getFullYear()}${mounth}${days}${hours}${minutes}${seconds}`;
        return stamp;
    }

    downloadFile(blob: any, fileName: string) {
        const msSaveOrOpenBlob: any = window.navigator.msSaveOrOpenBlob;
        if (msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
        } else {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.download = fileName;
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
        }
    }
}
</script>

<style lang="less" scoped>
    .exam{
        // width: calc(100% - 25px);
        height: 100%;
        background: #fff;
        margin: 10px;
        padding:15px 20px;
        .examTitle{
            font-size: 16px;
            color: #333;
            span{
                color: #2970FF;
            }
        }
        .examCount{
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            color: #333;
            line-height: 32px;
            span{
                color: rgba(255,182,143);
            }
        }
        .remove{
            margin-bottom: 10px;
        }
        .action{
            color: var(--highlightColor, #2970FF);
            cursor: pointer;
        }
        .btn /deep/.ant-form-item-control{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        .aTooltip{
            span {
                display: inline-block;
                max-width: 100%;
                white-space:nowrap; 
                overflow:hidden; 
                text-overflow:ellipsis;

            }
        }
        /deep/.ant-form-item{
            margin-bottom: 0;
        }
        .passScore{
            margin: 0 5px;
        }
        /deep/.ant-table-tbody > tr > td{
            padding: 10px 10px;
            text-align: center;
        }
    }
    .uploadBox{
        width: 100%;
    }
    .modalDiv{
        margin-top: 10px;
        position: relative;
        text-align: center;
        img{
            width: 100px;
            height: 100px;
            position: absolute;
            left: 50%;
            margin-left: -50px;
        }
        h3{
            padding-top: 125px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        p{
            margin-bottom: 10px;
            font-size: 14px;
            color:rgba(0, 0, 0, 0.65);
        }
    }
    .reUpload{
        width:80px;
        height: 35px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        margin: 20px 0 50px 0;
    }
    .red{
        color:#f4454e;
    }
    .green{
        color: #17bc94;
    }
    /deep/ .ant-table .ant-table-thead > tr > th{
        padding-top: 11px;
        text-align: center;
    }
</style>