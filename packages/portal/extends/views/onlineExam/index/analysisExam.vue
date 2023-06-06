<template>
    <div class="analysis">
        <div class="echartsDiv">
             <div id="selectPassRate"></div>
            <div id="selectParticipationRate"></div>
        </div>
        <div style="margin:10px;">
            试卷名称：
            <a-select
                ref="select"
                :value="value1"
                style="width: 200px;"
                @change="handleChange"
            >
                <a-select-option v-for="item in selectList" :key="item.id" :value="item.id">{{ item.examinationName }}</a-select-option>
            </a-select>
        </div>
        
        <a-table
            :columns="tableColumns"
            :dataSource="tableData"
            :pagination="false"
            :rowKey="(record) => record.id"
            bordered
        />
    </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Table, Modal, Select } from "@h3/antd-vue";

import api  from '@/../extends/api';
import * as echarts from 'echarts';
import echart from '@/../extends/utils/echart';
const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'analysisExamtemplate',
  components: {
        ATable:Table,
        ASelect:Select,
        ASelectOption: Select.Option,
  },
})
export default class analysisExamtemplate extends Vue {
    @Prop() list?: any; 

    @Prop() pageVM: any; //父级组件的vue对象

   tableColumns:any = [
        {
            title: '题目',
            dataIndex: 'questionTitle',
            key: 'questionTitle',
        },
        {
            title: '参与答题的次数',
            dataIndex: 'answerNumber',
            key: 'answerNumber',
            customRender: (text: any) => {
                return text + ' 次';
            },
            width:130
        },
        {
            title: '错误次数',
            dataIndex: 'numberOfErrors',
            key: 'numberOfErrors',
            customRender: (text: any) => {
                return text + ' 次';
            },
            width:130
        },
        {
            title: '错误率',
            dataIndex: 'errorRate',
            key: 'errorRate',
            width:130
        },
   ]

   tableData:any = []

   value1:any = ''

   selectList:any = [];

   selectPassRateX:any = [];

   selectPassRateY:any = [];

   selectParticipationRateX:any = [];

   selectParticipationRateY:any = [];

   @Watch('list', { immediate: true })
    onChange(list) {
        if(list !== undefined){
            this.selectList = list.list;
            this.value1 = list.list[0].id
            this.getExamProportion(this.value1);
        }
    }

   mounted(){
        this.selectPassRateList();
        this.selectParticipationRateList();
   }

   init(xVal:any,yVal:any,id:any) {
        let chartDom = document.getElementById(id);
        let myChart:any = echarts.init(chartDom,null, {
            width: 500,
            height: 260,
        });
        myChart.clear();
        let option:any = {
                title: {
                    text:id === 'selectPassRate' ? "试卷考试及格率统计" : '试卷考试参与率统计',
                    left: 'center' // 标题居中显示
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (list) {
                        return list[0].name+'：'+list[0].value+'%'
                    } // 让为0的值不显示
                },
                xAxis: {
                    name:'考试名称',
                    type: 'category',
                    data: xVal
                },
                yAxis: {
                    name:id === 'selectPassRate' ? "及格率（%）" : '参与率（%）',
                    type: 'value'
                },
                series: [
                    {
                        data: yVal,
                        type: 'line',
                    }
                ]
            }; 
        option && myChart.setOption(option);
    }

   async selectTestPaperList(){
        let res:any = await api.selectTestPaperList();
        if(res.errcode === 0){
        }
    }

    async selectPassRateList(){
        let res:any = await api.selectPassRateList();
        if(res.errcode === 0){
            this.selectPassRateX = res.data.list.map(item => item.KTMC);
            this.selectPassRateY = res.data.list.map(item => parseFloat(item.JGL));
            this.init(this.selectPassRateX,this.selectPassRateY,'selectPassRate');
        }
    }

    async selectParticipationRateList(){
        let res:any = await api.selectParticipationRateList();
        if(res.errcode === 0){
             this.selectParticipationRateX = res.data.list.map(item => item.KSMC);
             this.selectParticipationRateY = res.data.list.map(item => parseFloat(item.KSCYL));
             this.init(this.selectParticipationRateX,this.selectParticipationRateY,'selectParticipationRate');
        }
    }

   async getExamProportion(val){
        const option = qs.stringify({
            examId:val
        });
        let res:any = await api.getExamProportion(option);
        if(res.errcode === 0){
            this.tableData = res.data.list;
        }
    }

    handleChange(val){
        this.value1 = val;
        this.getExamProportion(val);
    }
}
</script>

<style lang="less" scoped>
.analysis{
    min-height: 400px;
    height: calc(100% - 54px);
    /deep/.ant-table-placeholder{
        display: block !important;
    }
    .mr20{
        margin-right: 20px;
    }
}
.echartsDiv{
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
#selectParticipationRate{
    margin-left: 20px;
}
</style>