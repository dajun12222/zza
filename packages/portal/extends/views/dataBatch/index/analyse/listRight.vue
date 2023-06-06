<template>
    <a-modal :visible="show" :title="isEdit ? '编辑' : '新增'" class="indexModal" width="800px" @cancel="close" @ok="ok">
        <a-form 
            :layout="'horizontal'"
            :model="formState"
            :rules="rules"
        >
            <a-row>
                <a-col :span="8" class="elCol">
                    <a-form-item label="字段名称" required name="fieldCode">
                        <a-select v-model="formState.fieldCode" :disabled="isEdit" placeholder="请选择字段名称">
                            <a-select-option v-for="(item) in queryByCodeData" :key="item.id" :value="item.fieldCode">{{ item.fieldName }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8" class="elCol">
                    <a-form-item label="判断条件" required name="judgingCondition">
                        <a-select v-model="formState.judgingCondition" placeholder="请选择阈值编码">
                            <a-select-option v-for="(item) in judgingConditionArray" :key="item.id" :value="item.judgingCondition">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8" class="elCol">
                    <a-form-item label="告警值" required name="judgingValue">
                        <a-input v-model="formState.judgingValue" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader,Form,Modal } from "@h3/antd-vue";
        
    import api  from '@/../extends/api';
    const qs = require('qs');
    @Component({
        name: 'listRight',
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
            AModal: Modal,
        },
    })
    export default class listRight extends Vue {
    
        @Prop({}) isEdit:boolean = false;

        @Prop({}) thresholdID:string = '';
    
        @Prop({}) info:any;
    
        @Watch('info',{ deep: true, immediate: true })
        onChangeThresholdInfo(newVal:any){
            let formState:any = {};
            if(newVal && newVal.id){
                formState = {
                    fieldCode: newVal['fieldName'],//字段名称
                    judgingCondition: newVal['judgingCondition'],//判断条件
                    judgingValue: newVal['judgingValue'],//判断值
                    thresholdRelationId: newVal['thresholdRelationId'],//所属阈值id
                    modelCode: '',
                    batchCode: '',
                };
                this.formState = formState;
            }else{
                formState = {
                    fieldCode: [] || '',//字段名称
                    judgingCondition: [] || '',//判断条件
                    judgingValue: '',//判断值
                    thresholdRelationId: '',//所属阈值id
                    modelCode: '',
                    batchCode: '',
                };
                this.formState = formState;
            }
        }
    
        formState:any = {
            fieldCode: [] || '',//字段名称
            judgingCondition: [] || '',//判断条件
            judgingValue: '',//判断值
            thresholdRelationId: '',//所属阈值id
            modelCode: '',
            batchCode: '',
            
        };
    
        rules:any = {
            // dataThresholdName: [
            //     { required: true, message: 'Please input Activity name', trigger: 'blur' },
            // ],
            // fieldCode: [
            //     { required: true, message: 'Please input Activity name', trigger: 'blur' },
            // ],
            // thresholdCode: [
            //     { required: true, message: 'Please input Activity name', trigger: 'blur' },
            // ],
            // judgingCondition: [
            //     { required: true, message: 'Please input Activity name', trigger: 'blur' },
            // ],
            // alarmValue: [
            //     { required: true, message: 'Please input Activity name', trigger: 'blur' },
            // ],
        };
    
        judgingConditionArray:any = [
            {
                'id': '1',
                'name': '等于',
                'judgingCondition': '=',
            },
            {
                'id': '2',
                'name': '不等于',
                'judgingCondition': '!=',
            },
            {
                'id': '3',
                'name': '包含',
                'judgingCondition': 'like',
            },
        ];
    
    
        @Prop({ default: '新增' }) title?:string;
    
        @Prop({ default: false }) value?:boolean;
    
        @Watch('value',{ deep: true, immediate: true })
        onChangeValue(newVal:boolean){
            if(newVal){
                //字段名称
                this.getQueryByCode();
            }
            this.show = newVal;
        }
    
    
   
    
        show:boolean = false;
    
        async ok(){
            let obj:any = this.queryByCodeData.find((item:any) => {
                return item['fieldCode'] === this.formState.fieldCode;
            })
            // /obj['fieldTypeCode']
            this.formState.batchCode = this.$route.query.batchCode;
            this.formState.modelCode = this.$route.query.modelCode;
            this.formState.thresholdRelationId = this.thresholdID || '';
            let queryPageStringify:any = {};
            if(this.info && this.info.id){
                this.formState['id'] = this.info.id;
                queryPageStringify = qs.stringify(this.formState)
                let res:any = await api.insertDataThreshold(queryPageStringify);
            }else{
                queryPageStringify = qs.stringify(this.formState)
                let res:any = await api.updateDataThreshold(queryPageStringify);
            }
            this.$emit('input',false);
        }
    
        close(){
            this.$emit('input',false);
        }
    
        queryByCodeData:any = [];
    
        async getQueryByCode(){
            let queryPageStringify = qs.stringify({
                'modelCode': this.$route.query.modelCode || ''
            })
            let res:any = await api.queryByCode(queryPageStringify);
            if(res.code === '00000'){
                let options:any = res.data;
                this.queryByCodeData = this.filterTime(options);
            }else{
                this.queryByCodeData = [];
            }
        }
    
        
    
        filterTime(data:any){
            return data;
            let filterArray:string[] = ['field_timestamp','field_year','field_month','field_day'];
            let newData:any = [];
            let index:number = 0;
            data.map((item:any) => {
                index = filterArray.findIndex((c:string) => {
                    return item['fieldTypeCode'] === c;
                });
                if(index === -1){
                    newData.push(item);
                }
            })
            return newData;
        }
    
     
    
      
    
    }
    </script>
    <style lang="less" scoped>
    .elCol {
        padding: 10px;
    }
    </style>