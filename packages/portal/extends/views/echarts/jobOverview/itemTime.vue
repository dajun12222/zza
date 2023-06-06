<template>
  <div class="unitRank">
    <el-block-bg title="项目时间变化趋势图" :year="false">
      <div id="itemTime" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import * as echarts from 'echarts';
import api from '@/../extends/api';
@Component({
  name: 'itemTime',
  components: {
    elBlockBg: blockBg,
  },
})
export default class itemTime extends Vue {
  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
    //this.init();
  }

  async getList() {
    const res: any = await api.projectsTimeThrend();
    if (res.errcode === 0) {
      //let option = res.data;
      this.init(res.data);
    } else {
    }
  }

  init(data: any) {
    let chartDom: any = document.getElementById('itemTime');
    let myChart: any = echarts.init(chartDom);
    var option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        itemWidth: 7,
        itemHeight: 7,
        borderRadius: 0,
        x: 230,
        y: 20,
        textStyle: {
          fontSize: '0.715em',
          color: '#000',
        },
        data: ['今年', '去年'],
      },
      grid: {
        // 图表距离边框的距离，可用百分比和数字（px）配置
        left: '13%',
        bottom: '14%',
        right: '10%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          textStyle: {
            fontSize: 10,
          },
        },
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            fontSize: '0.715em',
          },
        },
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
      series: [
        {
          name: '今年',
          data: data.nowArr,
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#5AD8A6', //改变折线点的颜色
              lineStyle: {
                color: '#5AD8A6', //改变折线颜色
                width: 2,
              },
            },
          },
        },
        {
          name: '去年',
          data: data.pastArr,
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#5B8FF9', //改变折线点的颜色
              lineStyle: {
                color: '#5B8FF9', //改变折线颜色
                width: 2,
              },
            },
          },
        },
        // {
        //     // 设置涟漪特效动画
        //     type:'effectScatter',
        //     // 有三种: cartesian2d(二维的直角坐标系) polar(极坐标系) geo(地理坐标系) ,此需求使用cartesian2d
        //     coordinateSystem: 'cartesian2d',
        //     // 单个闪烁点 ↓
        //     data: [{value:['2月',26],symbolSize:8}], //2d坐标系--[x轴, y轴, 标记大小]

        //     // 多个闪烁点 ↓
        //     // 方法一 -- start:
        //     // data: [{value:['Mon',820],symbolSize:10},{value:['Tue',932],symbolSize:10}],
        //     // 方法一 -- end

        //     // 方法二 -- start:
        //     // data: [['Mon',820],['Tue',932]], //2d坐标系--[x轴, y轴, 标记大小]
        //     // symbolSize: 10,
        //     // 方法二 -- end

        //     // 何时显示特效:'render'-绘制完成后显示特效 'emphasis'-高亮（hover）的时候显示特效
        //     showEffectOn: 'render',
        //     // 涟漪特效配置
        //     rippleEffect: {
        //         // 波纹的绘制方式,可选'stroke'和'fill'
        //         brushType: 'stroke'
        //     },
        //     hoverAnimation: true,
        //     itemStyle: {
        //         normal: {
        //         color: '#f00',
        //         shadowBlur: 10,
        //         shadowColor: '#f00'
        //         }
        //     },
        //     zlevel:1
        // }
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
  position: relative;
}
</style>
