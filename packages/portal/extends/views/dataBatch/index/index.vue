<template>
<div class="aduitfiles">
   
    <div class="right">
        <a-row class="header">
            <a-form :layout="'horizontal'" v-bind="formItemLayout">
                <a-col :span="8">
                    <a-form-item label="批次编号:">
                        <a-input v-model="batchCode" autocomplete="off" style="width: 200px;" allowClear placeholder="请输入" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="业务类型：">
                        <!-- <a-select v-model="queryListVal" placeholder="请选择" style="width: 200px;" allowClear>
                            <a-select-option v-for="(item) in queryList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select> -->
                        <businessType v-model="queryListVal" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="模型编码:">
                        <a-input v-model="modelCode" autocomplete="off" style="width: 200px;" allowClear placeholder="请输入" />
                    </a-form-item>
                </a-col>
            </a-form>
            <a-col :span="8" class="elCol">
                <a-button class="elButton" @click="reset">重置</a-button>
                <a-button type="primary" class="elButton" @click="search">查询</a-button>
            </a-col>
        </a-row>
        <div class="content">
            <newList :dataContent="dataContent" @refer="refer" @execute="execute" @del="del" />
            <!-- <a-page :obj="dataContent" @searchPage="searchPage" style="margin-top: 12px;display: flex;justify-content: flex-end;"></a-page> -->
        </div>
        
    </div>
    
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import newList from "@/../extends/views/dataBatch/components/newList.vue";
import page from '@/../extends/components/static/page.vue';
import businessType from '@/../extends/components/tree/businessType.vue';
import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader,Form,message,Modal } from "@h3/antd-vue";

import api  from '@/../extends/api';
const qs = require('qs');
@Component({
    name: 'dataBatchIndex',
    components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    AButton: Button,
    ATag: Tag,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ACascader: Cascader,
    AForm: Form,
    AFormItem: Form.Item,
    newList,
    APage:page,
    businessType,
    },
})
export default class dataBatchIndex extends Vue {

    queryListVal:string[] = [];

    queryList:any = [];

    batchCode:string | null = null;

    modelCode:string | null = null;

    dataContent: any  =  {};


    formItemLayout:any = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };

   

    created(){
  
        //获取列表
        this.search();
        //业务类型查询
        this.queryBusinessTypeList();
    }

    

    search(){
        
        this.getList();
    }

    async getList(queryPage?){
        let maps:any = {};
       
        maps['businessType'] = this.queryListVal.length > 0 ? this.queryListVal : '';
        maps['batchCode'] = this.batchCode;
        maps['modelCode'] = this.modelCode;
   
        let queryPageStringify = qs.stringify(maps)
        const res:any = await api.queryDataBatch(queryPageStringify);
        if(res.code === '00000'){
            let option = res.data;
            this.dataContent = {
                'content': res.data
            };
        }else{
            this.dataContent = {};
        }
    }

    async queryBusinessTypeList(){
        const res:any = await api.queryBusinessTypeList();
        if(res.code === '00000'){
            this.queryList = res.data[0]['children'];
        }else{
            this.queryList = [];
        }
    }

    async batchExecute(item:any){
        let pageOption = {
            batchCode:item
        };
        let queryPage = qs.stringify(pageOption);
        const res:any = await api.batchExecute(queryPage);
        if(res.code === '00000'){
            message.success("执行成功!");
             this.getList();
        }
    }

    async deleteByBatch(item:any){
        let pageOption = {
            batchCode:item
        };
        let queryPage = qs.stringify(pageOption);
        const res:any = await api.deleteByBatch(queryPage);
        if(res.code === '00000'){
            message.success("删除成功!");
             this.getList();
        }
    }

    close(selectedKeys){
        this.getList();
    }

    select(selectedKeys){
        if(selectedKeys && selectedKeys['type'] === 'typeList'){
            selectedKeys['type'] = 'auditType';
        }
      
        this.search();
    }

    searchPage(option:any){
        this.getList(option);
    }

 

    reset(){
        this.queryListVal = [];
        this.batchCode = '';
        this.modelCode = '';
        this.search();
    }

    refer(){
        this.search();
    }

    execute(item:any){
       this.batchExecute(item.batchCode);
    }

    del(item:any){
        Modal.confirm({
            title: '警告',
            content: '是否确定继续本次删除?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.deleteByBatch(item.batchCode);
            },
        });
    }

    setUn(data:any){
        data.map((item:any) => {
            if(item && item.children && item.children.length > 0){
                item.children = this.setUn(item.children);
            }else{
                item.children = [];
            }
        })
        return data;
    }
}
</script>
<style lang="less" scoped>
.aduitfiles {
height: 100%;
padding: 12px;
overflow-y: auto;
.left {
    padding: 12px;
    background-color: #fff;
    
}
.right {
    .header {
        padding: 24px;
        background-color: #fff;
        .elCol {
            padding-right: 16px;
            .elButton {
                width: 100px;
                margin-right: 10px;
            }
        }
    }
    .content {
        margin-top: 12px;
        padding: 24px;
        background-color: #fff;
        p {
            padding: 0 0 12px 0;
        }
    }
}
}
</style>