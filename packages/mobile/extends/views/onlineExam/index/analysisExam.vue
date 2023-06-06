<template>
    <div class="analysis">
        <div class="echartsDiv">
            <div id="selectPassRate" style="height:260px"></div>
            <div id="selectParticipationRate" style="height:260px"></div>
        </div>
    </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Table, Modal, Select } from "@h3/antd-vue";

import api  from '@/../extends/api';
import * as echarts from 'echarts';
// import echart from '@/../extends/utils/echart';
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

    @Prop() pageVM: any; //父级组件的vue对象


   selectPassRateX:any = [];

   selectPassRateY:any = [];

   selectParticipationRateX:any = [];

   selectParticipationRateY:any = [];

   screenWidth:any =  window.innerWidth;

    mounted(){
        this.selectPassRateList();
        this.selectParticipationRateList();
    }

    created() {
        window.addEventListener("resize", this.handleResize);
    }
    
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize)
    }
    
    handleResize() {
        this.screenWidth = window.innerWidth
        document.getElementById('selectPassRate')!.style.width = this.screenWidth
        document.getElementById('selectParticipationRate')!.style.width = this.screenWidth
    }

    init(xVal:any,yVal:any,id:any) {
        let chartDom: HTMLElement | null = document.getElementById(id);
        if (chartDom) {
            let myChart:any = echarts.init(chartDom as HTMLElement);
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
                    grid: {
                        right: '4%',
                        bottom: '15%',
                        // containLabel: true
                    },
                    xAxis: {
                        name:'考试名称',
                        type: 'category',
                        data: xVal,
                        nameLocation:'middle',
                        nameGap: 25
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
            
        } else {
            console.error(`Can not find element with id "${id}".`);
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
}
</script>

<style lang="less" scoped>
.analysis{
    // min-height: 400px;
    // height: calc(100% - 54px);
    /deep/.ant-table-placeholder{
        display: block !important;
    }
    .mr20{
        margin-right: 20px;
    }
}
.echartsDiv{
    // display: flex;
    // justify-content: center;
    margin-top: 10px;
    padding: 10px;
}
#selectParticipationRate{
    // margin-left: 20px;
}
</style>