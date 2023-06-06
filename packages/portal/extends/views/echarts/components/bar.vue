<template>
    <div class="bar echartsDiv" />
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { } from "@h3/antd-vue";
import * as echarts from 'echarts';
import axios from 'axios';
import { each } from 'lodash';
@Component({
    name: 'bar',
    components: {
        
    },
})

export default class bar extends Vue {

    async mounted(){
        this.init();
    }

    init() {
        let chartDom = document.getElementsByClassName("bar");
        for (var i = 0; i < chartDom.length; i++) {
            let myChart:any = echarts.init(chartDom[i]as HTMLElement,null, {
                width: 275,
                height: 200,
            });
            let option:any = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                    }
                },
                legend: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    data: ['CPA', 'CIA', 'CISA', 'CICPA', 'ACCA', '其他']
                },
                series: [
                    {
                        name: '内部人才',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: [5, 15, 22, 20, 30, 22]
                    },
                    {
                        name: '外部人才',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: [0, 6, 10, 5, 11, 15]
                    }
                ]
            };
            // let option: any = {
            //     xAxis: {
            //         data: ['Animals', 'Fruits', 'Cars']
            //     },
            //     yAxis: {},
            //     dataGroupId: '',
            //     animationDurationUpdate: 500,
            //     series: {
            //         type: 'bar',
            //         id: 'sales',
            //         data: [
            //         {
            //             value: 5,
            //             groupId: 'animals'
            //         },
            //         {
            //             value: 2,
            //             groupId: 'fruits'
            //         },
            //         {
            //             value: 4,
            //             groupId: 'cars'
            //         }
            //         ],
            //         universalTransition: {
            //         enabled: true,
            //         divideShape: 'clone'
            //         }
            //     }
            //     };
            //     const drilldownData = [
            //     {
            //         dataGroupId: 'animals',
            //         data: [
            //         ['Cats', 4],
            //         ['Dogs', 2],
            //         ['Cows', 1],
            //         ['Sheep', 2],
            //         ['Pigs', 1]
            //         ]
            //     },
            //     {
            //         dataGroupId: 'fruits',
            //         data: [
            //         ['Apples', 4],
            //         ['Oranges', 2]
            //         ]
            //     },
            //     {
            //         dataGroupId: 'cars',
            //         data: [
            //         ['Toyota', 4],
            //         ['Opel', 2],
            //         ['Volkswagen', 2]
            //         ]
            //     }
            //     ];
            //     myChart.on('click', function (event) {
            //     if (event.data) {
            //         var subData = drilldownData.find(function (data) {
            //         return data.dataGroupId === event.data.groupId;
            //         });
            //         if (!subData) {
            //         return;
            //         }
            //         myChart.setOption({
            //         xAxis: {
            //             data: subData.data.map(function (item) {
            //             return item[0];
            //             })
            //         },
            //         series: {
            //             type: 'bar',
            //             id: 'sales',
            //             dataGroupId: subData.dataGroupId,
            //             data: subData.data.map(function (item) {
            //             return item[1];
            //             }),
            //             universalTransition: {
            //             enabled: true,
            //             divideShape: 'clone'
            //             }
            //         },
            //         graphic: [
            //             {
            //             type: 'text',
            //             left: 50,
            //             top: 20,
            //             style: {
            //                 text: 'Back',
            //                 fontSize: 18
            //             },
            //             onclick: function () {
            //                 myChart.setOption(option);
            //             }
            //             }
            //         ]
            //         });
            //     }
            //     });
            option && myChart.setOption(option);
        } 
    }
}
</script>
<style lang="less" scoped>
   
</style>
