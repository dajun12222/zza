<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
<div>
    <!-- <div :style="{ 'position': 'relative', 'height': (showHidden ? 'auto' : '800px'),'overflow': 'hidden' }"> -->
        <div :style="{ 'position': 'relative', 'height': 'auto','max-height': '800px','overflow-y': 'auto' }">
    <div class="leftRight">
        <span style="color: #f00;">{{ left }}{{ leftNum}}条</span>
        <span>{{ right }}</span>
        <!-- <button @click="getValue">选择数据</button> -->
    </div>
    <a-table 
            :columns="columns" 
            :data-source="dataContent.content" 
            :defaultExpandAllRows="defaultExpandAllRows"
            :scroll="{ y: '100%' }" 
            bordered 
            size="small"
            :rowKey="(record,index) => { return record.id }"
            :pagination="false" 
            >
                
                <div
                    slot="problemType"
                    slot-scope="text,record,i"
                    class="isEdit"
                >

                    <questionShowType v-model="dataContent.content[i]['problemTypeId']" @getParams="(data) => { return getParams(data,i) }" />
                </div>
                <div
                    slot="remake"
                    slot-scope="text,record,i"
                    class="isEdit"
                >
                <a-textarea v-model="dataContent.content[i]['remake']" :autoSize="{ minRows: 4, maxRows: 10 }" />
            
                </div>
                <div
                    slot="rectification"
                    slot-scope="text,record,i"
                    class="isEdit"
                >
                <!-- <a-textarea v-model="dataContent.content[i]['rectification']" :autoSize="{ minRows: 4, maxRows: 10 }" /> -->
                    <a-select
                        v-model="dataContent.content[i]['rectification']"
                        class="field-select"
                        style="width: 100%;"
                        @change="handleChange" 
                    >
                        <a-select-option
                            v-for="option in rectificationList"
                            :key="option"
                            class="field-select-item"
                        >
                            {{ option }}
                        </a-select-option>
                    </a-select>
                </div>
                <div
                    slot="amountLoss"
                    slot-scope="text,record,i"
                    class="isEdit"
                >
                <a-input v-model="dataContent.content[i]['amountLoss']" type="number" />
                
                </div>
            <div
                slot="isShowHide"
                slot-scope="text"
                class="isShowHide"
            >
            <!-- <rich-text
            :text="text"
            :align="align"
            :labelStyle="style"
            class="desc"
            ></rich-text> -->
            {{ text }}
            </div>
        </a-table>
        
    </div>
    <!-- <div class="isShowHidden" @click="isShowHidden">{{ showHidden ? '收起' : '展开' }}</div> -->
</div>
</template>

<script lang="ts">
import { Component,Inject,Watch,Prop,Vue } from 'vue-property-decorator';
import { BaseControl } from '../../controls';
import { LayoutControlOptions } from '../../typings';
import RichText from '../shared/rich-text.vue';
import { Row,Col,Button,Table,Tooltip,Input,Select } from "@h3/antd-vue";
import Axios from "cloudpivot/api/src/axios";
import Bus from "../../../../../form/utils/bus";

import questionShowType from './questionShowType.vue';

@Component({
name: 'layoutTable',
components: {
    RichText,
    ATable: Table,
    ATooltip: Tooltip,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATextarea: Input.TextArea,
    questionShowType,
}
})
export default class layoutTable extends Vue {

columns:any = [];

dataContent:any = [];

defaultExpandAllRows:boolean = false;

left:string = '';

leftNum:any = 0;

right:string = '';

showHidden:boolean = false;


rectificationList:any = [
    '已整改','未整改','视同整改'
];

@Prop({}) controlOpts:any;

@Inject()
getFormValues!: Function;


isShowHidden(){
    this.showHidden = !this.showHidden;
}

getValue(){
    
}

get align() {
    return this.controlOpts.align;
}

@Watch('dataContent',{immediate: false, deep: true})
onChangeDataContent(newVal:any){
   // this.ctrl.value = { 'content': newVal.content };
}

@Watch('controlOpts',{immediate: false, deep: true})
onChangeControlOpts(newVal:any){
    if(newVal && newVal.apiUrl){
        this.getList(newVal.apiUrl);
    }
}




change(item:any,index:number,text:string,e:any){
    
}

created(){

    
    if(this.controlOpts && (this.controlOpts as any).apiUrl){
        this.getList((this.controlOpts as any).apiUrl);
    }
    //this.getList();
}

mounted() {
    // 注册全局事件
    Bus.$on("getCodeStatus", (v: any) => {
    this.saveData();
    })
}

getParams(data,i){
    let content = JSON.parse(JSON.stringify( this.dataContent.content));
    if(data && data.length > 0){
        content[i]['problemType'] = data[0]['name'];
        this.dataContent.content = content;
    }
    
}

handleChange(){
    let num = 0;
    for(var i=0; i<this.dataContent.content.length; i++){
        if(this.dataContent.content[i].rectification === "未整改"){
            num++;
        }
    }
    this.leftNum = num;
}

async saveData(){
    // /
    /*
    [{
"id":"",
"remake":"",
"rectification":""
}]
    */
let data:any = [];
if(this.dataContent && this.dataContent.content){
    this.dataContent.content.map((item:any) => {
    data.push({
        "id": item['id'],
        "remake": item['remake'],
        "rectification": item['rectification'],
        "amountLoss": item['amountLoss'],
        "problemTypeId": item['problemTypeId'],
        "problemType": item['problemType'],
    })
    })

    const res:any = await Axios.post('/api/audit/problem/updateRecord', { list: data,'extend': 'a'});
}





    
}

async getList(url:string){
    let schemaCode = (window as any).h3form.formObj.bizObject.id || '';
    let instanceId = (window as any).h3form && (window as any).h3form.workflowInfo && (window as any).h3form.workflowInfo.instanceId || '';
    let activityName:string = (window as any).h3form.workflowInfo.activityName;
    let params:any = {
    bizObjectId: schemaCode,
    instanceId: instanceId,
    activityName: activityName
    };
    let paramsNumber:any = this.controlOpts && (this.controlOpts as any)['paramsNumber'] || '';
    if(paramsNumber){
    params[paramsNumber] = this.getFormValues()['paramsNumber'];
    }
    
    const res:any = await Axios.get(url, { params });
    if(res.errcode === 0){
    let title:any = res.data.title;
    let data:any = res.data.data;

    title = [
      {
        "customRender": (value, row, index) => {
            
          const obj = {
              children: `${index+1}`,
              attrs: {} as any,
          };
            
          return obj;
        },
        "dataIndex": "index",
        "width": 50,
        "title": "序号",
        "align": "center",
        "key": "index"
      },
      {
        "dataIndex": "problemType",
        "title": "问题类型",
        "key": "problemType",
        "scopedSlots": {
          "customRender": "problemType"
        },
        "width": 200,
      },
      {
        "dataIndex": "problem",
        "title": "问题",
        "key": "problem",
        // "customRender":(value, row, index) =>{
        //     const obj = {
        //         children: value,
        //         attrs: {
        //           rowSpan: 1
        //         },
        //     };
        //     if(row && row['length']){
        //         obj.attrs.rowSpan =  row['length'];
        //     }else{
        //         obj.attrs.rowSpan = 0;
        //     }
    
            
        //     return obj;
        // },
      },
      {
        "dataIndex": "brief",
        "title": "定性",
        "key": "brief",
      },
      {
        "dataIndex": "context",
        "title": "依据",
        "key": "context",
      },
      {
        
        "dataIndex": "remake",
        "title": "建议",
        "key": "remake",
      },
      {
        
        "dataIndex": "amountLoss",
        "title": "损失金额",
        "key": "amountLoss",
        "scopedSlots": {
          "customRender": "amountLoss"
        },
      },
      {
        "scopedSlots": {
          "customRender": "rectification"
        },
        "dataIndex": "rectification",
        "title": "整改落实",
        "key": "rectification"
      }
    ];
    title.map((item:any) => {
        if(item && item['customRender']){
        item['customRender'] = eval(item['customRender']);
        }
    })

    this.columns = title;
    let newData:any = this.setUpFile(data);
    this.left = res.data.left;
    this.leftNum = res.data.leftNum;
    this.right = res.data.right;
    this.dataContent = {
        'content': newData
    };
    }else{
    this.columns = [];
    this.dataContent = {};
    }
}


setUpFile(data:any){
        // /tableData
    let result:any = [];
    let saveJson:any = {};

    let newData:any = this.setSort(data);
    
    for(let i=0;i<newData.length;i++){
    if(saveJson[newData[i]['problem']]){
        saveJson[newData[i]['problem']] = saveJson[newData[i]['problem']] + 1;
    }else{
        saveJson[newData[i]['problem']] = 1;
    }
    }
    for(let i in saveJson){
    let index:number = newData.findIndex((item:any) => {
        return item['problem'] === i;
    })
    
    if(index > -1){
        let obj:any = newData[index];
        obj['length'] = saveJson[i];
        newData.splice(index,1,obj);
    }
    }

    return newData;
}

setSort(data:any){
    return data;
    return data.sort((a:any,b:any) => {
        return a.problem.localeCompare(b.problem);
    })
}


}
</script>

<style lang="less" scoped>
/deep/.mutil-text {
font-size: 12px;

& > span {
    color: rgba(0, 0, 0, 0.45);
}
}
/deep/ .ant-table-bordered {
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    font-size: 12px;
}
}
.isEdit {
width: 100%;
height: 100%;
}
.leftRight {
padding: 3px 0 12px 0;
display: flex;
justify-content: space-between;
font-size: 14px;
}
.isShowHidden {
color: #2970ff;
text-align: center;
margin-top: 7px;
background-color: #add5e0;
}
.form-body .printBtn .isEdit .ant-select {
    border: 0 !important;
}
</style>
  