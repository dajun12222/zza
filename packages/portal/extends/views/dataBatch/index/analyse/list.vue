<template>
<a-modal :visible="show" :title="isEdit ? '编辑' : '新增'" class="indexModal" width="800px">
    <a-form 
        :layout="'horizontal'"
        :model="formState"
        :rules="rules"
    >
        <a-row>
            <a-col :span="24" class="elCol">
                <a-form-item label="数据分析名称" required name="dataAnalysisName">
                    <a-input v-model="formState.dataAnalysisName" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入" />
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="规则类型" required name="dataAnalysisType">
                    <a-select v-model="formState.dataAnalysisType" :disabled="isEdit" placeholder="请选择规则类型">
                        <a-select-option v-for="(item) in dataAnalysisTypeData" :key="item" :value="item">{{ item }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="分析规则名称" required name="fieldCode">
                    <a-select v-model="formState.fieldCode" :disabled="isEdit" placeholder="请选择分析规则名称">
                        <a-select-option v-for="(item) in analysisTypeData" :key="item.id" :value="item.analysisCode">{{ item.analysisName }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol"> 
                <a-form-item label="分析字段名称" required name="analysisFieldName">
                    <a-select v-model="formState.analysisFieldName" :disabled="isEdit" placeholder="请选择分析字段名称">
                        <a-select-option v-for="(item) in queryByCodeData" :key="item.id" :value="item.fieldName">{{ item.fieldName }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="统计字段名称" required name="statisticsFieldName">
                    <a-select v-model="formState.statisticsFieldName" placeholder="请选择统计字段名称">
                        <a-select-option v-for="(item) in statisticsFieldNameData" :key="item.id" :value="item.fieldName">{{ item.fieldName }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="计算方式" required name="calculationMethod">
                    <a-select v-model="formState.calculationMethod" placeholder="请选择计算方式">
                        <a-select-option v-for="(item) in calculationMethodData" :key="item" :value="item">{{ item }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="统计分析周期" required name="dataAnalysisCycle">
                    <a-select v-model="formState.dataAnalysisCycle" placeholder="请选择统计分析周期">
                        <a-select-option v-for="(item) in dataAnalysisCycleData" :key="item" :value="item">{{ item }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="elCol">
                <a-form-item label="图表样式" required name="chartStyle">
                    <a-select v-model="formState.chartStyle" placeholder="请选择图表样式">
                        <a-select-option v-for="(item) in judgingConditionArray" :key="item.id" :value="item.judgingCondition">{{ item.name }}</a-select-option>
                    </a-select>
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
                dataAnalysisName: newVal['dataAnalysisName'],
                dataAnalysisType: newVal['dataAnalysisType'],
                fieldCode: newVal['fieldCode'],
                analysisFieldName: newVal['analysisFieldName'],
                statisticsFieldName: newVal['statisticsFieldName'],
                calculationMethod: newVal['calculationMethod'],
                dataAnalysisCycle: newVal['dataAnalysisCycle'],
                chartStyle: newVal['chartStyle'],
            };
            this.formState = formState;
            this.isEdit = true;
        }else{
            formState = {
                dataAnalysisName: '',//数据分析名称
                dataAnalysisType: [] || '',//规则类型
                dataAnalysisCode: [] || '',//分析规则名称
                fieldCode: [] || '',//分析字段名称
                statisticsFieldName: [] || '',//统计字段名称
                calculationMethod: [] || '',//计算方式
                dataAnalysisCycle: [] || '',//统计分析周期
                chartStyle: [] || '',  //图表样式
                modelCode: '',
                batchCode: '',
            };
            this.formState = formState;
            this.isEdit = false;
        }
    }

    formState:any = {
        dataAnalysisName: '',//数据规则阈值名称
        dataAnalysisType: [] || '',//规则类型
        dataAnalysisCode: [] || '',//分析规则名称
        fieldCode: [] || '',//分析字段名称
        statisticsFieldName: [] || '',//统计字段名称
        calculationMethod: [] || '',//计算方式
        dataAnalysisCycle: [] || '',//统计分析周期
        chartStyle: [] || '',  //图表样式
        modelCode: '',
        batchCode: '',
    };

    rules:any = {
        dataAnalysisName: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        dataAnalysisType: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        fieldCode: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        analysisFieldName: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        statisticsFieldName: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        calculationMethod:[
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        dataAnalysisCycle:[
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
        chartStyle:[
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ],
    };

    dataAnalysisTypeData:any = [];

    analysisTypeData:any = [];

    queryByCodeData:any = [];

    analysisFieldNameData:any = [];

    statisticsFieldNameData:any = [];

    calculationMethodData:any = [];

    dataAnalysisCycleData:any = [];

    judgingConditionArray:any = [];

    businessType:any = '';


    @Prop({ default: '新增' }) title?:string;

    @Prop({ default: false }) value?:boolean;

    @Watch('value',{ deep: true, immediate: true })
    onChangeValue(newVal:boolean){
        if(newVal){
            this.businessType = this.$route.query.businessType;
            //字段名称
            this.getQueryByCode();
            //规则类型
            this.getQueryAnalysisType();
        }
        this.show = newVal;
    }

    @Watch('formState.dataAnalysisType',{ deep: true, immediate: true })
    onChangeThresholdType(newVal:string){
        if(newVal){
            //请求分析规则名称
            this.queryAnalysisNameByType(newVal);
        }
    }

    @Watch('formState.statisticsFieldName',{ deep: true, immediate: true })
    onChangeStatistics(newVal:string){
        if(newVal){
            this.statisticsFieldNameData.map((item:any) => {
               if(item.fieldName === newVal){
                    if(item.fieldTypeCode === "field_integer" || item.fieldTypeCode === "field_decimal"){
                        this.calculationMethodData = ['总数','求和']
                    }else{
                        this.calculationMethodData = ['总数']
                    }
                }
            })
        }
    }

    @Watch('formState.analysisFieldName',{ deep: true, immediate: true })
    onChangeAnalysisFieldName(newVal:string){
        if(newVal){
            this.statisticsFieldNameData.map((item:any) => {
               if(item.fieldName === newVal){
                    if(item.fieldTypeCode === "field_year"){
                        this.dataAnalysisCycleData = ['年']
                    }else if(item.fieldTypeCode === "field_month"){
                        this.dataAnalysisCycleData = ['年','月']
                    }else{
                        this.dataAnalysisCycleData = ['年','月','日']
                    }
                }
            })
        }
    }


    show:boolean = false;

    close(){
        // this.$emit('input',false);
    }

    //分析字段名称
    async getQueryByCode(){
        let queryPageStringify = qs.stringify({
            'modelCode': this.$route.query.modelCode || ''
        })
        let res:any = await api.queryByCode(queryPageStringify);
        if(res.code === '00000'){
            let options:any = res.data;
            this.queryByCodeData = this.filterTime(options);
            this.statisticsFieldNameData = this.filterStatic(options);
        }else{
            this.queryByCodeData = [];
            this.statisticsFieldNameData = [];
        }
    }

    //规则类型
    async getQueryAnalysisType(){
        let res:any = await api.queryAnalysisType();
        if(res.code === '00000'){
            let options:any = res.data;
            this.dataAnalysisTypeData = JSON.parse(JSON.stringify(options));
        }else{
            this.dataAnalysisTypeData = [];
        }
    }

    //规则名称
    async queryAnalysisNameByType(analysisType:string){
        if(!this.isEdit){
            this.formState.dataAnalysisCode = [];
        }
        let queryPageStringify = qs.stringify({
            'analysisType': analysisType || ''
        })
        let res:any = await api.queryAnalysisNameByType(queryPageStringify);
        if(res.code === '00000'){
            let options:any = res.data;
            this.analysisTypeData = options;
        }else{
            this.analysisTypeData = [];
        }
    }

    filterTime(data:any){
        let filterArray:string[] = ['field_year','field_month','field_day'];
        let newData:any = [];
        let index:number = 0;
        data.map((item:any) => {
            index = filterArray.findIndex((c:string) => {
                return item['fieldTypeCode'] === c;
            });

            if(index !== -1){
                newData.push(item);
            }
        })
        return newData;
    }

    filterStatic(data:any){
        let filterArray:string[] = ['field_timestamp'];
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
/deep/.ant-form-item{
    margin-bottom: 0;
}
</style>