<template>
    <a-tree-select
        v-model="AuditTypeValue"
        style="width: 100%;"
        :treeData="AuditTypeList"
        :replaceFields="replaceFields"
        :showCheckedStrategy="SHOW_ALL"
        :disabled="disabled"
        treeCheckable
        allowClear
        size="small"
        :dropdownMatchSelectWidth="true"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择项目模板"
    />
       
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
    import api  from '@/../extends/api';
    @Component({
        name: 'queryTemplate',
        components: {
            ATreeSelect: TreeSelect,
        },
    })
    export default class queryTemplate extends Vue {

        @Prop({}) getWorkflowCode?:string;

      

        //审计类别

        SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;

        @Prop({ default:false }) disabled?:boolean;

        @Prop({}) value?:any;

        @Watch('value',{ deep: true, immediate: true })
        onChangeValue(newVal:any){
            if(newVal && newVal.length > 0){
               // this.AuditTypeValue = newVal;
            }
            
        }

        AuditTypeValue:any = [];

        @Watch('AuditTypeValue',{ deep: true, immediate: true })
        onChangeAuditValue(newVal:any){
            this.$emit('input',newVal);
        }

        AuditTypeList:any = [];

        replaceFields: any = {
            children: "children",
            title: "name",
            key: "dictionaryId",
            value: "dictionaryId",
        };

        async queryQuestionTypeList(){
            let  dictionaryIdParams = '';
            switch(this.getWorkflowCode){
                case 'project_records':
                    dictionaryIdParams = 'SJMB-001-002';
                    //this.$emit('input',['SJMB-001-002']);
                break;
                case 'BudgetitemRegistration':
                    dictionaryIdParams = 'SJMB-001-001';
                    //this.$emit('input',['SJMB-001-001']);
                break;
                case 'project_records_ec':
                    dictionaryIdParams = 'SJMB-001-003';
                    //this.$emit('input',['SJMB-001-001']);
                break;
                case 'sj0001':
                    this.AuditTypeValue = ['SJMB-001-001'];
                    //this.$emit('input',['SJLC-001-001']);
                break;
                default: 
                    dictionaryIdParams = '';
                    //this.AuditTypeValue = [];
                break;
            }
            //
            
            //queryAuditTypeList
            const res:any = await api.queryTemplateTypeList({ 'dictionaryId': dictionaryIdParams });
            if(res.code === '00000'){
                this.AuditTypeList = JSON.parse(JSON.stringify(res.data));
                let dictionaryId = [];
                //SJMB-001-002 财务收支审计
                let activityName = (window as any).h3form.workflowInfo.activityName;
               
                if(activityName){
                    dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),activityName,'name');
                
                    if(dictionaryId && dictionaryId.length > 0){
                        this.AuditTypeValue = dictionaryId;
                    }
                }else
                if(this.getWorkflowCode === 'project_records'){
                    dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJMB-001-002','dictionaryId');
                    if(dictionaryId && dictionaryId.length > 0){
                        this.AuditTypeValue = dictionaryId;
                    }
                }else
                if(this.getWorkflowCode === 'BudgetitemRegistration'){
                    dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJMB-001-001','dictionaryId');
                    if(dictionaryId && dictionaryId.length > 0){
                        this.AuditTypeValue = dictionaryId;
                    }
                }else
                if(this.getWorkflowCode === 'sj0001'){
                    dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJMB-001-001','dictionaryId');
                    if(dictionaryId && dictionaryId.length > 0){
                        this.AuditTypeValue = dictionaryId;
                    }
                }else
                if(this.getWorkflowCode === 'project_records_ec'){
                    dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJMB-001-003','dictionaryId');
                    if(dictionaryId && dictionaryId.length > 0){
                        this.AuditTypeValue = dictionaryId;
                    }
                }
                
                
            }else{
                this.AuditTypeList = [];
            }   
        }

        getDictionaryId(data,name,paramsname){
            let dictionaryId:any = [];
            let result_obj = this.getChild(data,name,paramsname);
           
            let newData = [];
            if(result_obj && result_obj.length > 0){
                newData = this.moreToOne(result_obj);
            }
            console.log('start....activityName...');
                    console.log(result_obj);
            newData.map((item:any) => {
                dictionaryId.push(item['dictionaryId']);
            })
            return dictionaryId;
        }

        moreToOne(arr){
            return [].concat(...arr.map(item => {
                    if (item.children) {
                    let arr = [].concat(item, ...this.moreToOne(item.children));
                    delete item.children;
                    return arr;
                    }
                    return [].concat(item);
                }
            ));
            
        }

        getChild(arr,name,paramsname){
            let result:any = [];
            arr.map((item:any) => {
                if(item[paramsname] === name){
                    result = result.concat([item]);
                }else
                if(item['children'] && item['children'].length > 0){
                    result = result.concat(this.getChild(item['children'],name,paramsname));
                }
            })
            return result;
        }

        async created(){
            //审计问题类型查询
            this.queryQuestionTypeList();
           
        }

        close(){
            //this.$emit('input',false);
        }

    }
    </script>
    <style lang="less" scoped>
    /deep/ .ant-select-selection {
        height: 34px;
        overflow: hidden;
        align-items: inherit;
    }
    /deep/ .ant-select-search--inline {
        position: absolute;
    }
    </style>