<template>
  <div class="unitRank">
    <el-block-bg title="人才职业证书情况" :year="false">
      <div id="talentCertificate" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import * as echarts from 'echarts';
import api from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'talentCertificate',
  components: {
    elBlockBg: blockBg,
  },
})
export default class talentCertificate extends Vue {
  async getList() {
    const res: any = await api.talentResourceCounts(
      qs.stringify({
        type: '',
      }),
    );
    if (res.code === '00000') {
      let option = res.data; //talentTagsMap
      let countData: any = [];
      let countData1: any = [];
      Object.keys(option.talentTagsMap).map((key) => {
        countData.push(key);
        countData1.push(option.talentTagsMap[key]);
      });
      this.init(countData, countData1);
    } else {
    }
  }

  created() {
    // let resultContent:any = this.init('resultContent',300,500);

    this.getList();
  }

  init(data: any, data1: any) {
    let chartDom: any = document.getElementById('talentCertificate');
    let myChart: any = echarts.init(chartDom);
    var option;
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '5%',
        top: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: data,
          axisLabel: {
            interval: 0,
            textStyle: {
              fontSize: '0.715em',
              color: '#666',
            },
          },
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#666',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              fontSize: '0.715em',
              color: '#666',
            },
          },
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: data1,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1058FE' },
              { offset: 1, color: 'rgba(91,143,249,.6)' },
            ]),
            barBorderRadius: [20, 20, 0, 0],
          },
        },
      ],
    };

    option && myChart.setOption(option);

    //return myChart;
  }
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  // height: 33%;
  // margin-bottom: 7px;
  position: relative;
}
</style>
