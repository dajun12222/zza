<template>
<div class="aduitfiles">
    <div class="right">
        <a-tabs @change="changeTab">
            <a-tab-pane v-for="item in activeKeyList" :key="item.id" :tab="item.name" />
        </a-tabs> 
        <div v-if="activeKey === 1">
            <a-spin :spinning="spinning"> 
                <a-row class="header">
                    <a-col :span="5" class="elCol">
                        <div>
                            <span>模型编码</span>
                            <a>{{ info.modelCode }}</a>
                        </div>
                    </a-col>
                    <a-col :span="5" class="elCol">
                        <div>
                            <span>模型名称</span>
                            <a>{{ info.modelName }}</a>
                        </div>
                    </a-col>
                    <a-col :span="5" class="elCol">
                        <div>
                            <span>执行时间</span>
                            <a>{{ info.updateTime }}</a>
                        </div>
                    </a-col>
                    <a-col :span="9" class="elCol">
                        <div>
                            <span>批次编号</span>
                            <a>{{ info.batchCode }}</a>
                        </div>
                    </a-col>
                </a-row>
                <div class="content">
                    <newList :columns="column" :dataContent="dataContent" />
                    <!-- <a-page :obj="dataContent" @searchPage="searchPage" style="margin-top: 12px;display: flex;justify-content: flex-end;"></a-page> -->
                </div>
            </a-spin>
        </div>
        <div v-if="activeKey === 2">
            <div class="resultDiv">
                <a-select
                    v-model="changeId"
                    class="selectChange"
                    style="width: 200px"
                    @change="onChange"
                >
                    <template v-for="items in changeList">
                        <a-select-option :key="items.id" :value="items.id">
                        {{ items.dataAnalysisName }}
                        </a-select-option>
                    </template>
                </a-select>
                <a-select
                    v-if="numList.length"
                    v-model="numId"
                    class="selectChange"
                    style="width: 200px"
                    @change="handleChange"
                >
                    <template v-for="items in numList">
                        <a-select-option :key="items" :value="items">
                        {{ items }}
                        </a-select-option>
                    </template>
                </a-select>
                <a-spin :spinning="spinning"> 
                    <div class="resultCon"> 
                        <div id="resultContent" style="height:300px;"></div>
                    </div>
                    <div class="content" style="margin-top:20px;">
                        <newList :columns="columns" :dataContent="dataListContent" />
                        <!-- <a-page :obj="dataListContent" style="margin-top: 12px;display: flex;justify-content: flex-end;" @searchPage="searchPage" /> -->
                    </div>
                </a-spin>
            </div>
        </div>  
    </div>
    
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import elTable from "@/../extends/components/table/table.vue";
import newList from "@/../extends/views/dataBatch/components/executionNewList.vue";
import page from '@/../extends/components/static/page.vue';
import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader,Form,message,Spin } from "@h3/antd-vue";
import * as echarts from 'echarts';
import axios from 'axios';
import api  from '@/../extends/api';
const qs = require('qs');
@Component({
    name: 'dataBatchExecution',
    components: {
    ARow: Row,
    ACol: Col,
    ASpin:Spin,
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
    elTable,
    },
})
export default class dataBatchExecution extends Vue {

    info:any = {};

    dataContent:any = {};

    column:any = [
        {
            title: '数据阈值名称',
            dataIndex: 'dataThresholdName',
            key: 'dataThresholdName',
            scopedSlots: { customRender: 'aTooltip' },
            align: 'center',
        },
        {
            title: '阈值规则名称',
            dataIndex: 'thresholdName',
            key: 'thresholdName',
        },
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
        },
        {
            title: '判断条件',
            dataIndex: 'judgingCondition',
            key: 'judgingCondition',
        },
        {
            title: '告警值',
            dataIndex: 'alarmValue',
            key: 'alarmValue',
        },

        {
            title: '过滤条件详情',
            dataIndex: 'filterDetail',
            key: 'filterDetail',
            scopedSlots: { customRender: 'filterDetail' },
        },
        {
            title: '实际值',
            dataIndex: 'fieldValue',
            key: 'fieldValue',
            scopedSlots: { customRender: 'actualValue' },
        },
        {
            title: '分组数据详情',
            dataIndex: 'groupDataInfo',
            key: 'groupDataInfo',
            scopedSlots: { customRender: 'groupDataInfo' },
        }
    ]

    columns:any = [
        {
            title: '分析字段值(x轴)',
            dataIndex: 'analysisFieldValue',
            key: 'analysisFieldValue',
        },
        {
            title: '数值',
            dataIndex: 'statisticsFieldValue',
            key: 'statisticsFieldValue',
        }
    ];

    dataListContent:any = {};

    activeKey:any = 1;
  
    activeKeyList:any = [
        {
            id: 1,
            name: '阈值执行结果'
        },
        {
            id: 2,
            name: '分析执行结果'
        }
    ];

    changeList:any = [];

    changeId:any = '';

    numId:any = '';

    numList:any = [];

    echartsType:any = '';

    echartsAnalysis:any = [];

    echartsStatistics:any = [];

    statisticsFieldName:any = '';

    analysisFieldName:any = '';

    spinning:boolean = false;

    created(){
        //获取列表
        this.getList();
    }

    async getList(){ //阈值执行结果列表
        this.spinning = true;
        let option = qs.stringify({ batchCode: this.$route.query.batchCode || '' });
        const res:any = await api.executeResult(option);
        this.spinning = false;
        //cascaderData
        if(res.code === '00000'){
            this.info = res.data;
            this.dataContent = {
                'content': res.data.executeResults
            };
        }else{
            this.info = {};
            this.dataContent = {};
        }
    }

    //分析执行结果
    async analysisQuery(){  //第一个下拉
        let option = qs.stringify({ batchCode: this.$route.query.batchCode || '' });
        const res:any = await api.analysisQuery(option);
        if(res.code === '00000'){
            this.changeList = res.data;
            this.changeId = res.data[0].id;
            this.analysisFieldName = res.data[0].analysisFieldName;
            this.statisticsFieldName = res.data[0].statisticsFieldName;
            this.echartsType = this.returnType(res.data[0].chartStyle);
            this.queryFieldValueGroup(this.changeId);
        }else{
            this.changeList = [];
        }
    }

    async queryFieldValueGroup(item:any){  //第二个下拉
        let option = qs.stringify({ id: item || '' });
        const res:any = await api.queryFieldValueGroup(option);
        if(res.code === '00000'){
            this.numList = res.data;
            if(res.data.length <= 1 && res.data[0] === null){
                this.numList = [];
            }
            this.numId = res.data[0];
            this.analysisExecuteResult(res.data[0]);
        }else{
            this.numList = [];
        }
    }

    async analysisExecuteResult(item:any){  //图表及列表内容
        this.spinning = true;
        this.echartsAnalysis = [];
        this.echartsStatistics = [];
        let option:any = { 
            batchCode: this.$route.query.batchCode || '',
            dataAnalysisId: this.changeId || '',
            fieldValueGroup: item || '',
        };
        const res:any = await api.analysisExecuteResult(option);
        this.spinning = false;
        if(res.code === '00000'){
            res.data.forEach(ele => {
                this.echartsAnalysis.push(ele.analysisFieldValue);
                if(this.echartsType === 'pie'){
                    let pieData = {};
                    pieData["value"] = ele.statisticsFieldValue.substring(0, ele.statisticsFieldValue.lastIndexOf('%'));
                    pieData["name"] = ele.analysisFieldValue;
                    this.echartsStatistics.push(pieData);
                }else{
                    if(ele.statisticsFieldValue.indexOf("%") !== -1){
                        this.echartsStatistics.push(ele.statisticsFieldValue.substring(0, ele.statisticsFieldValue.lastIndexOf('%')));
                    }else{
                        this.echartsStatistics.push(ele.statisticsFieldValue);
                    } 
                }
            });
            this.init();
            this.dataListContent = {
                'content': res.data,
                'page': 1,
                'size': 5,
                'total': res.data.length,
            };
        }else{
           this.dataListContent = {};
        }
    }

    async changeTab(activeKey){
        this.activeKey = activeKey;
        if(activeKey === 2){
            await this.analysisQuery(); //获取执行结果第一个下拉
        }
    }

    onChange(value){
        this.changeId = value;
        this.changeList.forEach(ele => {
            if(value === ele.id){
                this.echartsType = this.returnType(ele.chartStyle);
                this.analysisFieldName = ele.analysisFieldName;
                this.statisticsFieldName = ele.statisticsFieldName;
            }
        });
        this.queryFieldValueGroup(value);
    }

    handleChange(value){
        this.analysisExecuteResult(value);
    }

    init() {
        let chartDom = document.getElementById('resultContent');
        let myChart:any = echarts.init(chartDom,null, {
            width: 1100,
            height: 300,
        });
        myChart.clear();
        let option:any = {}; 
        if(this.echartsType === 'line'){
            option = {
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    name:this.analysisFieldName,
                    type: 'category',
                    data: this.echartsAnalysis
                },
                yAxis: {
                    name:this.statisticsFieldName,
                    type: 'value'
                },
                series: [
                    {
                        data: this.echartsStatistics,
                        type: this.echartsType,
                    }
                ]
            }; 
        }else if(this.echartsType === 'bar'){
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                grid: {
                    left:"15%",
                    bottom: 90
                },
                dataZoom: [
                    {
                    type: 'inside'
                    },
                    {
                    type: 'slider'
                    }
                ],
                xAxis: {
                    name:this.analysisFieldName,
                    data: this.echartsAnalysis,
                    silent: false,
                    splitLine: {
                    show: false
                    },
                    splitArea: {
                    show: false
                    }
                },
                yAxis: {
                    name:this.statisticsFieldName,
                    splitArea: {
                    show: false
                    }
                },
                series: [
                    {
                    type: 'bar',
                    data: this.echartsStatistics,
                    large: true
                    }
                ]
            }; 
        }else if(this.echartsType === 'pie'){
            option = {
                tooltip: {
                    trigger: 'item',
                },
                legend:{
                    type: 'scroll',
                    orient: 'vertical',
                    right: 100,
                    // top: 10,
                    bottom: 20,
                    data: this.echartsStatistics,
                    formatter: name => {
                        return name.length > 10 ? name.substr(0, 10) + '...' : name;
                    },
                    tooltip:{
                        show:true
                    },
                    icon:"circle",
                },
                series: [
                    {
                        type: this.echartsType,
                        radius: '80%',
                        center: ['30%', '45%'],
                        label: {
                            normal: {
                                show: false,
                            },
                        },
                        data: this.echartsStatistics,
                        emphasis: {
                            itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }; 
        }
        option && myChart.setOption(option);
    }

    returnType(text){
        let val = '';
        if(text === "折线"){
            val = 'line'
        }else if(text === "柱状"){
            val = 'bar'
        }else if(text === "饼图"){
            val = 'pie'
        }
        return val;
    }
    
    searchPage(option:any){
        console.log(option)
    }
}
</script>
<style lang="less" scoped>
.aduitfiles {
height: 100%;
padding: 12px;
overflow-y: auto;
min-width: 1100px;
.left {
    padding: 12px;
    background-color: #fff;
    
}
.right {
    background-color: #fff;
    padding:12px;
    .header {
        padding: 10px;
        background-color: #fff;
        .elCol {
            padding: 2px;
            div {
                border: 1px solid rgba(0,0,0,.06);
                border-radius: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 10px;
                span {
                    color: rgba(0,0,0,.85);
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                a {
                    color: rgb(23, 145, 255);
                    font-weight: 700;
                    font-size: 16px;
                }
            }
            
            .elButton {
                width: 100px;
                margin-right: 10px;
            }
        }
    }
    .content {
        padding: 24px 0;
        padding-top: 0;
        background-color: #fff;
        p {
            padding: 0 0 12px 0;
        }
    }
    .selectChange{
        margin-right: 10px;
    }
    .resultDiv{
        border-radius: 5px;
        box-shadow: 0 0 5px #d4e4fa;
        padding: 12px;
        margin: 2px;
    }
    .resultCon{
        padding: 24px;
        border: 1px solid rgba(0,0,0,.06);
        margin-top: 20px;
    }
}
}
</style>