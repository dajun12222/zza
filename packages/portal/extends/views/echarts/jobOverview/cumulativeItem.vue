<template>
  <div class="unitRank">
    <el-block-bg :type="3" :year="false">
      <div class="cumulative" style="right: 15%">
        <div class="up">
          <label>累计项目</label>
          <p>
            <a v-for="(t, i) in prjectList.length" :key="i">
              {{ prjectList[i] }}</a>
          </p>
        </div>
      </div>
      <div class="cumulative" style="top: 20%">
        <div class="down">
          <label>累计问题</label>
          <p>
            <a v-for="(t, i) in problemList.length" :key="i">
              {{ problemList[i] }}</a>
          </p>
        </div>
      </div>
      <!-- <div class="item">
            <p>项目动态</p>
            <ul>
                <li>黑龙江</li>
                <li>预算文件</li>
                <li>发现审计问题：10</li>
            </ul>
        </div> -->
      <div id="cumulativeItem" style="width: 100%; height: 100%"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';

import * as echarts from 'echarts';
@Component({
  name: 'cumulativeItem',
  components: {
    elBlockBg: blockBg,
  },
})
export default class cumulativeItem extends Vue {
  get prjectList() {
    return (this.$store.state as any).countPrject;
  }

  get problemList() {
    return (this.$store.state as any).countProblem;
  }

  rootSize: any = null;

  mounted() {
    switch (true) {
      case window.innerWidth >= 1600 && window.innerWidth <= 1919:
        this.rootSize = 400;
        break;
      case window.innerWidth >= 1440 && window.innerWidth <= 1599:
        this.rootSize = 350;
        break;
      case window.innerWidth >= 1280 && window.innerWidth <= 1439:
        this.rootSize = 300;
        break;
      case window.innerWidth >= 1920:
        this.rootSize = 400;
        break;
      case window.innerWidth >= 2560:
        this.rootSize = 600;
        break;
      default:
        break;
    }

    this.init();
  }

  init() {
    let chartDom: any = document.getElementById('cumulativeItem');
    let nj_map = require('@/../extends/heilongjiang.json');
    console.log(nj_map);
    let myChart: any = echarts.init(chartDom, null, {
      height: this.rootSize,
    });

    let option: any = {};
    option = {
      // title: {
      //     text: 'heilongjiang',
      //     left: 0,
      //     textStyle: {
      //         fontSize: 10,
      //         color: "#257dff",
      //     },
      // },
      grid: {
        x: 50,
        y: 55,
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        position: 'right',
        confine: true,
        show: false,
      },
      visualMap: {
        left: 'left',
        min: 0,
        max: 0,
        inRange: {
          color: ['#2275d3'],
        },
        text: ['High', 'Low'],
        calculable: true,
        show: false,
      },
      geo: [
          {
            map: "heilongjiang",
            aspectScale: 1,
            zoom: 0.65,
            layoutCenter: ["40%", "40%"],
            layoutSize: "170%",
            show: true,
            roam: false,
            label: {
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                borderColor: "#c0f3fb",
                borderWidth: 1,
                shadowColor: "#8cd3ef",
                shadowOffsetY: 10,
                shadowBlur: 120,
                areaColor: "transparent",
              },
            }
          },
          // 重影
          {
            type: "map",
            map: "heilongjiang",
            zlevel: -1,
            aspectScale: 1,
            zoom: 0.65,
            layoutCenter: ["40%", "41%"],
            layoutSize: "170%",
            roam: false,
            silent: true,
            itemStyle: {
              normal: {
                borderWidth: 1,
                // borderColor:"rgba(17, 149, 216,0.6)",
                borderColor: "rgba(58,149,253,0.9)",
                shadowColor: "rgba(172, 122, 255,0.5)",
                shadowOffsetY: 5,
                shadowBlur: 15,
                areaColor: "rgba(5,21,35,0.4)",
              },
            },
          },
          {
            type: "map",
            map: "heilongjiang",
            zlevel: -2,
            aspectScale: 1,
            zoom: 0.65,
            layoutCenter: ["40%", "42%"],
            layoutSize: "170%",
            roam: false,
            silent: true,
            itemStyle: {
              normal: {
                borderWidth: 1,
                // borderColor: "rgba(57, 132, 188,0.4)",
                borderColor: "rgba(58,149,253,0.6)",
                shadowColor: "rgba(65, 214, 255,0.6)",
                shadowOffsetY: 5,
                shadowBlur: 15,
                areaColor: "rgba(5,21,35,0.4)",
              },
            },
          },
          {
            type: "map",
            map: "heilongjiang",
            zlevel: -3,
            aspectScale: 1,
            zoom: 0.65,
            layoutCenter: ["40%", "43%"],
            layoutSize: "170%",
            roam: false,
            silent: true,
            itemStyle: {
              normal: {
                borderWidth: 1,
                // borderColor: "rgba(11, 43, 97,0.8)",
                borderColor: "rgba(58,149,253,0.4)",
                shadowColor: "rgba(29, 111, 165,1)",
                shadowOffsetY: 10,
                shadowBlur: 10,
                areaColor: "rgba(5,21,35,0.2)",
              },
            },
          },
      ],
      series: [
        {
          name: "heilongjiang",
          type: "map",
          map: "heilongjiang", // 自定义扩展图表类型
          aspectScale: 1,
          zoom: 0.65, // 缩放
          showLegendSymbol: true,
          label: {
            normal: {
              show: true,
              textStyle: { color: "#fff", fontSize: "120%" },
            },
            emphasis: {
              show: true,
            },
          },
          itemStyle: {
            normal: {
              areaColor: {
                type: "linear",
                x: 1200,
                y: 0,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(3,27,78,0.75)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(58,149,253,0.75)", // 50% 处的颜色
                  },
                ],
                global: true, // 缺省为 false
              },
              borderColor: "#fff",
              borderWidth: 0.2,
            },
            emphasis: {
              show: false,
              color: "#fff",
              areaColor: "rgba(0,254,233,0.6)",
            },
          },
          layoutCenter: ["40%", "40%"],
          layoutSize: "170%",
          markPoint: {
            symbol: "none",
          },
        }

      ],
    };
    echarts.registerMap('heilongjiang', nj_map);
    myChart.setOption(option);
  }
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  height: 55%;
  // margin-bottom: 7px;
  .cumulative {
    justify-content: space-between;
    padding: 0 3%;
    width: 40%;
    position: absolute;
    top: 6%;
    right: 0;
    .up {
      background-image: url('../../../style/image/mapblue.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
    .down {
      background-image: url('../../../style/image/mapgreen.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      // margin-left: 80px;
      // margin-top: 24px;
    }
    div {
      width: 85%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: right;
      p {
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 2em;
        font-family: DingTalk-JinBuTi, DingTalk;
        font-weight: normal;
        color: #ffffff;
        // line-height: 31px;
        text-align: center;
        flex-basis: 50%;
        margin: 0;
        > a {
          color: #ffffff;
        }
      }
      label {
        font-weight: 500;
        color: #2d7dd8;
        flex-basis: 40%;
      }
    }
  }
  .item {
    position: absolute;
    bottom: 0;
    // left: 30px;
    // width: 210px;
    // height: 165px;
    p {
    }
  }
}
</style>
