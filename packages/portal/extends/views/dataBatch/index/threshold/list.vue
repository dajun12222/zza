<template>
<a-modal :visible="show" :title="isEdit ? '编辑' : '新增'" class="indexModal" width="800px" @cancel="close" @ok="ok">
    <a-form 
        :layout="'horizontal'"
        :model="formState"
        :rules="rules"
    >
        <a-row>
            <a-col :span="12" class="elCol">
                <a-form-item label="数据规则阈值名称" required name="dataThresholdName">
                    <a-input v-model="formState.dataThresholdName" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入" />
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="字段名称" required name="fieldCode">
                    <a-select v-model="formState.fieldCode" :disabled="isEdit" placeholder="请选择字段名称">
                        <a-select-option v-for="(item) in queryByCodeData" :key="item.id" :value="item.fieldCode">{{ item.fieldName }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="阈值类型" required name="thresholdType">
                    <a-select v-model="formState.thresholdType" :disabled="isEdit" placeholder="请选择阈值类型">
                        <a-select-option v-for="(item) in queryThresholdTypeData" :key="item" :value="item">{{ item }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol"> 
                <a-form-item label="阈值编码" required name="thresholdCode">
                    <a-select v-model="formState.thresholdCode" :disabled="isEdit" placeholder="请选择阈值编码">
                        <a-select-option v-for="(item) in thresholdCodeData" :key="item.id" :value="item.thresholdCode">{{ item.thresholdName }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="判断条件" required name="judgingCondition">
                    <a-select v-model="formState.judgingCondition" placeholder="请选择阈值编码">
                        <a-select-option v-for="(item) in judgingConditionArray" :key="item.id" :value="item.judgingCondition">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="告警值" required name="alarmValue">
                    <a-input v-model="formState.alarmValue" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入" />
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
    name: 'thresholdList',
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
export default class thresholdList extends Vue {

    isEdit:boolean = false;

    @Prop({}) info:any;

    @Watch('info',{ deep: true, immediate: true })
    onChangeThresholdInfo(newVal:any){
        let formState:any = {};
        if(newVal && newVal.id){
            formState = {
                dataThresholdName: newVal['dataThresholdName'],
                fieldCode: newVal['fieldCode'],
                thresholdType: newVal['thresholdType'],
                thresholdCode: newVal['thresholdCode'],
                judgingCondition: newVal['judgingCondition'],
                alarmValue: newVal['alarmValue'],
                fieldTypeCode: newVal['fieldTypeCode'],
            };
            this.formState = formState;
            this.isEdit = true;
        }else{
            formState = {
                dataThresholdName: '',//数据规则阈值名称
                fieldCode: [] || '',//字段名称
                thresholdType: [] || '',//阈值类型
                thresholdCode: [] || '',//阈值编码
                judgingCondition: [] || '',//判断条件
                alarmValue: '',//告警值
                fieldTypeCode: '',//字段名称编码
                modelCode: '',
                batchCode: '',
            };
            this.formState = formState;
            this.isEdit = false;
        }
    }

    formState:any = {
        dataThresholdName: '',//数据规则阈值名称
        fieldCode: [] || '',//字段名称
        thresholdType: [] || '',//阈值类型
        thresholdCode: [] || '',//阈值编码
        judgingCondition: [] || '',//判断条件
        alarmValue: '',//告警值
        fieldTypeCode: '',//字段名称编码
        modelCode: '',
        batchCode: '',
        
    };

    rules:any = {
        dataThresholdName: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        fieldCode: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        thresholdCode: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        judgingCondition: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        alarmValue: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
    };

    judgingConditionPrimitive:any = [
        {
            'id': '1',
            'name': '大于',
            'judgingCondition': '>',
        },
        {
            'id': '2',
            'name': '小于',
            'judgingCondition': '<',
        },
        {
            'id': '3',
            'name': '等于',
            'judgingCondition': '=',
        },
        {
            'id': '4',
            'name': '大于等于',
            'judgingCondition': '>=',
        },
        {
            'id': '5',
            'name': '小于等于',
            'judgingCondition': '<=',
        },
    ];

    judgingConditionArray:any = [];

    @Prop({ default: '新增' }) title?:string;

    @Prop({ default: false }) value?:boolean;

    @Watch('value',{ deep: true, immediate: true })
    onChangeValue(newVal:boolean){
        if(newVal){
            //字段名称
            this.getQueryByCode();
            //阈值类型
            this.getQueryThresholdType();
        }
        this.show = newVal;
    }

    @Watch('formState.thresholdType',{ deep: true, immediate: true })
    onChangeThresholdType(newVal:string){
        if(newVal){
            //请求阈值编码
            this.getThresholdCode(newVal);
        }
    }

    @Watch('formState.fieldCode',{ deep: true, immediate: true })
    onChangeFieldCode(newVal:string){
        if(newVal){
            //阈值类型处理
            this.setThresholdType(newVal);
            //判断条件处理
            this.setJudgingCondition(newVal);
        }
    }

    show:boolean = false;

    async ok(){
        let obj:any = this.queryByCodeData.find((item:any) => {
            return item['fieldCode'] === this.formState.fieldCode;
        })
        // /obj['fieldTypeCode']
        this.formState.fieldTypeCode = obj &&obj['fieldTypeCode'] || '';
        this.formState.batchCode = this.$route.query.batchCode;
        this.formState.modelCode = this.$route.query.modelCode;
        let queryPageStringify:any = {};
        if(this.info && this.info.id){
            this.formState.id = this.info.id;
            queryPageStringify = qs.stringify(this.formState)
            let res:any = await api.updateDataThreshold(queryPageStringify);
        }else{
            queryPageStringify = qs.stringify(this.formState)
            let res:any = await api.insertDataThreshold(queryPageStringify);
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

    queryThresholdTypeData:any = [];

    queryThresholdTypeArray:any = [];

    async getQueryThresholdType(){
        let res:any = await api.queryThresholdType();
        if(res.code === '00000'){
            let options:any = res.data;
            this.queryThresholdTypeArray = options;
            this.queryThresholdTypeData = JSON.parse(JSON.stringify(options));
        }else{
            this.queryThresholdTypeArray = [];
            this.queryThresholdTypeData = [];
        }
    }

    filterTime(data:any){
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

    thresholdCodeData:any = [];

    async getThresholdCode(thresholdType:string){
        if(!this.isEdit){
            this.formState.thresholdCode = [];
        }
        let queryPageStringify = qs.stringify({
            'thresholdType': thresholdType || ''
        })
        let res:any = await api.queryThresholdNameByType(queryPageStringify);
        if(res.code === '00000'){
            let options:any = res.data;
            this.thresholdCodeData = options;
        }else{
            this.thresholdCodeData = [];
        }
    }

    setJudgingCondition(fieldCode:string){
        if(!this.isEdit){
            this.formState.judgingCondition = [];
        }
        let obj:any = {};
        if(fieldCode){
            obj = this.queryByCodeData.find((item:any) => {
                return item['fieldCode'] === fieldCode;
            })
        }
        
        if(obj && obj['fieldTypeCode'] === 'field_varchar'){
            this.judgingConditionArray = JSON.parse(JSON.stringify(this.judgingConditionPrimitive)).splice(2,1);
        }else{
            this.judgingConditionArray = JSON.parse(JSON.stringify(this.judgingConditionPrimitive));
        }
    }

    setThresholdType(fieldCode:string){
        if(!this.isEdit){
            this.formState.thresholdType = [];
        }
        let obj:any = {};
        if(fieldCode){
            obj = this.queryByCodeData.find((item:any) => {
                return item['fieldCode'] === fieldCode;
            })
        }
        
        if(obj && obj['fieldTypeCode'] === 'field_varchar'){
            this.queryThresholdTypeData = JSON.parse(JSON.stringify(this.queryThresholdTypeArray)).splice(1,1);
        }else{
            this.queryThresholdTypeData = JSON.parse(JSON.stringify(this.queryThresholdTypeArray));
        }
    }
}
</script>
<style lang="less" scoped>
.elCol {
    padding: 10px;
}
</style>