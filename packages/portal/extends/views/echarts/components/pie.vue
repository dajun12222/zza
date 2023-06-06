<template>
    <div class="pie echartsDiv" />
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { } from "@h3/antd-vue";
import * as echarts from 'echarts';
import axios from 'axios';
import { each } from 'lodash';
@Component({
    name: 'pie',
    components: {
        
    },
})

export default class pie extends Vue {
    @Prop() pieData!: any;

    async mounted(){
        this.init();
    }
    init() {
        let chartDom = document.getElementsByClassName('pie');
        for (var i = 0; i < chartDom.length; i++) {
            let myChart:any = echarts.init(chartDom[i]as HTMLElement,null, {
                width: 275,
                height: 200,
            });
            let option:any = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    x:'right',      //可设定图例在左、右、居中
                    y:'bottom', 
                },
                series: [
                    {
                    name: 'Access From',
                    type: 'pie',
                    radius: this.pieData.radius,
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center',
                        normal: {
                            show: false,
                            formatter: "{d}% ",
                            textStyle: {
                                color: "#red"
                            },
                        },
                    },
                    emphasis: {
                        label: {
                            show: false,
                        }
                    },
                    labelLine: {
                        show: false,
                        length: 10,  
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                    }
                ]
            }; 
            option && myChart.setOption(option);
        }
        
    }
}
</script>
<style lang="less" scoped>
   
</style>
