<template>
     <div class="aduitfiles">
        
         <div class="right">
             <a-row class="header">
                <a-col v-for="(t,i) in selectData" :key="i" :span="24">
                    <a-col :span="4" class="elCol">
                        <a-select v-model="t.param" allowClear placeholder="请选择" style="width: 100%;" @change="queryChange(i,'param')">
                            <a-select-option v-for="(item) in columns" :key="item.id" :value="item.fieldCode">{{ item.fieldName }}</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="4" class="elCol">
                        <a-select v-model="t.queryConditions" allowClear placeholder="请选择" style="width: 100%;">
                            <a-select-option v-for="(item) in getRange(i)" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="showDocument(i,'date',3) ? 8 : 4" class="elCol">
                        <a-input v-if="showDocument(i,'input',1)" v-model="t.inputOne" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入" />
                        <a-date-picker 
                            v-if="showDocument(i,'date',1)" 
                            v-model="t.dateOne" 
                            :format="getFormat(i)" 
                            :valueFormat="getFormat(i)"
                            style="width: 100%;" 
                        />
                        <a-month-picker 
                            v-if="showDocument(i,'date',2)" 
                            v-model="t.dateOne" place
                            :format="getFormat(i)" 
                            :valueFormat="getFormat(i)"
                            style="width: 100%;"  
                        />
                        <a-range-picker 
                            v-if="showDocument(i,'date',3)" 
                            v-model="t.dateTwo" 
                            :format="getFormat(i)" 
                            :valueFormat="getFormat(i)"
                            :mode="getMode(i,3)"
                            style="width: 100%;"
                        />
                    </a-col>
                    <a-col :span="showDocument(i,'date',3) ? 0 : 4" class="elCol">
                        <a-input v-if="showDocument(i,'input',2)" v-model="t.inputTwo" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入" />
                    </a-col>
                    <a-col :span="8" class="elCol">
                        <span>
                            <i v-if="i > 0" class="icon aufontAll h-icon-all-minus-circle-o reduceAdd reduce" @click="reduce(i)"></i>
                            <i class="icon aufontAll h-icon-all-plus-circle-o reduceAdd add" @click="add"></i>
                        </span>
                        <a-button v-if="i === selectData.length - 1" class="elButton" @click="reset">重置</a-button>
                        <a-button v-if="i === selectData.length - 1" type="primary" class="elButton" @click="search">查询</a-button>
                    </a-col>
                </a-col>
             </a-row>
             <div class="content">
                 <newList :columns="columns" :dataContent="dataContent" />
                 <a-page :obj="dataContent" style="margin-top: 12px;display: flex;justify-content: flex-end;" @searchPage="searchPage" />
             </div>
             
         </div>
         
     </div>
     </template>
     <script lang="ts">
     import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
     import newList from "@/../extends/views/dataBatch/components/infoNewList.vue";
     import page from '@/../extends/components/static/page.vue';
     import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader,Form,DatePicker } from "@h3/antd-vue";

     import moment from "moment";



     interface rangeObj {
        id: string;
        name: string;

     }
     interface selectDataObj {
        queryConditions: string | string[];
        param: string | string[];
        type?: string;
        oneValue: string;
        twoValue?: string;
        inputOne?: string;
        inputTwo?: string;
        dateOne?: string;
        dateTwo?: string[];
     }

     import api  from '@/../extends/api';
     const qs = require('qs');
     @Component({
         name: 'dataBatchInfo',
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
         ADatePicker: DatePicker,
         ARangePicker: DatePicker.RangePicker,
         AMonthPicker: DatePicker.MonthPicker,
         newList,
         APage:page,
         },
     })

    
     export default class dataBatchInfo extends Vue {
     
        range:Array<rangeObj> = [
            {
                id: '1',
                name: '精确'
            },
            {
                id: '2',
                name: '模糊'
            },
            {
                id: '3',
                name: '范围'
            },
        ];

        getRange(i:number){
            let rangeCopy = JSON.parse(JSON.stringify(this.range));
            let result:any = this.getSelectType(i);


            if(result && result['fieldTypeCode'] === 'field_varchar'){
                return rangeCopy.splice(0,2);
            }
            return rangeCopy; 
        }

        showDocument(i:number,type:string,position:number){
            /*
            判断逻辑
            默认显示一个input输入框  1个 input
            field_varchar 没有范围
            field_integer field_decimal 有一个或者两个input输入框
            field_timestamp field_year field_month field_day 有一个或者两个时间选择器
            选择类型或者范围的时候需要重置值 

            
            */


            // i 当前行数  type 当前类型 输入or下拉 position 位置
            let status:boolean = false;
            let isInput:boolean = true;
            let isPosition:boolean = false;
            switch(type){   
                case 'input':
                    isPosition = this.isPositionInput(position,i);
                    isInput= this.isShowInput(i);
                break;
                case 'date': 
                    isInput= this.isShowDate(i);
                    isPosition = this.isPositionDate(position,i);
                break;
            }
            
            
            if(isInput && isPosition){
                status = true;
            }else{
                status = false;
            }
     

            return status;
        }   

        isShowHideInput(i:number){
            let status:boolean = this.isShowInput(i);
            return status;

        }

  

        getFormat(i:number){
            let result:any = this.getMode(i);
            let format:string = 'YYYY-MM-DD';
            if(result){
                switch(result){
                    case 'time':
                        format = 'YYYY-MM-DD HH:mm:ss';
                    break;
                    case 'year':
                        format = 'YYYY';
                    break;
                    case 'month':
                        format = 'YYYY-MM';
                    break;
                    case 'date':
                        format = 'YYYY-MM-DD';
                    break;

                }
            }
            return format;
        }

        getMode(i:number,type?:number){
            let result:any = this.getSelectType(i);
            let mode:string | string[] = 'date';
            if(result && result['fieldTypeCode']){
                switch(result['fieldTypeCode']){
                    case 'field_timestamp':
                        mode = 'time';
                    break;
                    case 'field_year':
                        mode = 'year';
                    break;
                    case 'field_month':
                        mode = 'month';
                    break;
                    case 'field_day':
                        mode = 'date';
                    break;

                }
            }
            // if(type === 3){
            //     mode = [mode,mode];
            // }
            return mode;
        }

        isShowDate(i:number){
            //初始化默认不显示
            return this.isShowHide(i,false);
        }

        isShowInput(i:number){
            //初始化默认显示
            return this.isShowHide(i);
        }

        isShowHide(i:number,createdStatus:boolean = true){
            let status:boolean = createdStatus;
            let hideArr:string[] = ['field_timestamp','field_year','field_month','field_day'];
            let result:any = this.getSelectType(i);
            let index:number = hideArr.findIndex((item:string) => {
                return result['fieldTypeCode'] === item;
            })
            if(index > -1){
                status = !createdStatus;
            }
            return status; 
        }

        getSelectType(i:number){
            let fieldTypeCode:string = '';
            let fieldCode:string = '';
            let obj:any = this.selectData[i];
            if(obj && obj['param']){
                let result:any = this.columns.find((item:any) => {
                    return item['fieldCode'] === obj['param'];
                })
                if(result && result['fieldTypeCode']){
                    fieldTypeCode = result['fieldTypeCode'];
                    fieldCode = result['fieldCode'];
                    
                }

            }
            return {
                'fieldTypeCode': fieldTypeCode,
                'fieldCode': fieldCode,
            };
        }
        
        isPositionDate(position:number,i:number){
            let status:boolean = false;
            let obj:any = this.selectData[i];
            let queryConditions:boolean = true;
            let mode = (this.getMode(i) !== 'month');
            if(obj && obj['queryConditions'] && (obj['queryConditions'] === '3')){
                queryConditions = false;
            }
            
            switch(position){
                case 1:
                    if(queryConditions && mode){
                        status = true;
                    }
                break;
                case 2:
                    if(queryConditions && !mode){
                        status = true;
                    }
                break;
                case 3:
                    if(!queryConditions){
                        status = true;
                    }
                break;
            }
            return status;
        }

        isPositionInput(position:number,i:number){
            let status:boolean = true;
            if(position === 1){
                status = true;
            }else{
                status = this.getSelectPosition(i);
            }
            return status;
        }

        getSelectPosition(i:number){
            let status:boolean = false;
            let obj:any = this.selectData[i];
            if(obj && obj['queryConditions'] && obj['queryConditions'] === '3'){
                status = true;
            }
            return status;
        }




        selectData: selectDataObj[] = [
            {
                queryConditions: [],
                param: [],
                type: '',
                oneValue: '',
                twoValue: '',
                inputOne: '',
                inputTwo: '',
                dateOne: '',
                dateTwo: [],
            }
        ];
     
        columns:any = [];

        dataContent: any  =  {};
     
     
     
      
     
        created(){
            
            //获取表头
            let modelCode:any = this.$route.query.modelCode || '';
            this.getQueryByCode(modelCode);
             //获取列表
            this.search();
           
        }
     
      
     
        
     
         search(){
             this.getList({
                 page: "1",
                 size: "10",
             });
         }
         
         async getQueryByCode(modelCode:string){
            
            let queryPageStringify = qs.stringify({
                'modelCode': modelCode
            })
            let res:any = await api.queryByCode(queryPageStringify);
            if(res.code === '00000'){
                let options:any = res.data;
                options.map((item) => {
                    item['title'] = item['fieldName'];
                    item['dataIndex'] = item['fieldCode'];
                    item['key'] = item['fieldCode'];
                    item['scopedSlots'] = {customRender: 'aTooltip'};
                })
                this.columns = options;
            }else{
                this.columns = [];
            }
         }

         async getList(queryPage){
             let maps:selectDataObj[] = [];
             let selectData = JSON.parse(JSON.stringify(this.selectData));
            let oneValue:string = '';
            let twoValue:string = '';
            let queryConditions:string = '';
            let param:string = '';
             selectData.map((item:any,i:number) => {
                if(this.isShowInput(i)){
                    oneValue = item['inputOne'] || '';
                    twoValue = item['inputTwo'] || '';
                }else
                if(this.isShowDate(i)){
                    if(item['queryConditions'] === '3'){
                        oneValue = item['dateTwo'][0];
                        twoValue = item['dateTwo'][1];
                    }else{
                        oneValue = item['dateOne'];
                    }
                }
                if(item && item['queryConditions'] && item['queryConditions'].length > 0){
                    queryConditions = item['queryConditions'];
                }
                if(item && item['param'] && item['param'].length > 0){
                    param = item['param'];
                }
                maps.push({
                    'queryConditions': queryConditions,
                    'param': param,
                    'type': this.getSelectType(i)['fieldTypeCode'],
                    'oneValue': oneValue,
                    'twoValue': twoValue,
                });
               
             })
           
             queryPage['modelCode'] = this.$route.query.modelCode || '';
             queryPage['batchCode'] = this.$route.query.batchCode || '';
             let queryPageStringify = qs.stringify(queryPage)
             const res:any = await api.queryByBatch(maps,queryPageStringify);
             if(res.code === '00000'){
                 let option = res.data;
                 option['total'] = Number(option['total']);
                 this.dataContent = {
                    'content': res.data.content[0],
                    'page': Number(option['page']),
                    'size': Number(option['size']),
                    'total': Number(option['total']),
                 };
             }else{
                 this.dataContent = {};
             }
         }
     
        
     
     
         searchPage(option:any){
             this.getList(option);
         }
    
         reset(){
            this.selectData = [{
                queryConditions: [],
                param: [],
                type: '',
                oneValue: '',
                twoValue: '',
                inputOne: '',
                inputTwo: '',
                dateOne: '',
                dateTwo: [],
            }];
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

        reduce(i:number){
            this.selectData.splice(i,1);
        }

        add (){
            this.selectData.push({
                queryConditions: [],
                param: [],
                type: '',
                oneValue: '',
                twoValue: '',
                inputOne: '',
                inputTwo: '',
                dateOne: '',
                dateTwo: [],
            });
        }

        queryChange(i:number,type:string){
            let selectData: selectDataObj[] = JSON.parse(JSON.stringify(this.selectData));
            let obj:selectDataObj = selectData[i];
            switch(type){
                case 'queryConditions':
                    obj['type'] = '';
                    obj['inputOne'] = '';
                    obj['inputTwo'] = '';
                    obj['dateOne'] = '';
                    obj['dateTwo'] = [];
                break;
                case 'param':
                    obj['queryConditions'] = [];
                    obj['type'] = '';
                    obj['inputOne'] = '';
                    obj['inputTwo'] = '';
                    obj['dateOne'] = '';
                    obj['dateTwo'] = [];
                break;
            }
            selectData[i] = obj;
            this.selectData = selectData;
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
                 span {
                    display: inline-block;
                    width: 60px;
                 }
                 .elButton {
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
     .reduceAdd {
        font-size: 22px;
        color: #2970ff;
        margin-right: 7px;
     }
     </style>