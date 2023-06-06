<template>
  <div class="unitRank">
    <el-block-bg :title="title" :border="border" :year="false">
      <div id="elBubble" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import * as echarts from 'echarts';
import api from '@/../extends/api';
@Component({
  name: 'bubble',
  components: {
    elBlockBg: blockBg,
  },
})
export default class bubble extends Vue {
  @Prop({ default: '数据资源情况' }) title?: string;

  @Prop({ default: true }) border?: boolean;

  @Prop({ default: 350 }) width?: number;

  @Prop({ default: 260 }) height?: number;

  countList: any = {
    talentCounts: '人才库',
    agentCounts: '中介库',
    regulationsCounts: '法规库',
    caseCounts: '案例库',
    templateCounts: '模板库',
    questionCounts: '问题库',
    pigeonholeCounts: '归档项目库',
    mattersCounts: '事项库',
    dynamicCounts: '动态库',
    dictCounts: '字典库',
    dictionaryCounts: '数据资源目录库',
  };

  mounted() {
    setTimeout(() => {
      this.getList();
    }, 1000);
  }

  async getList() {
    try {
      const res: any = await api.dataResourceCounts();
      if (res.code === '00000') {
        //let option = res.data;
        let countData: any = [];
        // /{label: '可乐', amount: 100}
        Object.keys(res.data).map((key) => {
          if (key.indexOf('Counts') > -1) {
            countData.push({
              label: this.countList[key] + '\n' + res.data[key],
              amount: res.data[key],
            });
          }
        });
        this.initData(countData);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }

  returnColor() {
    return [
      '#FFB600',
      '#886CFF',
      '#0084FF',
      '#4CB690',
      '#58B458',
      '#6C6C6C',
      '#F56161',
      '#FC754C',
      '#5F5EEC',
    ];
  }

  returnRepulsion(data = []) {
    // 气泡基础大小
    let basicSize = 40;
    // 节点之间的斥力因子,值越大,气泡间距越大
    let repulsion = 80;
    // 根据气泡数量配置基础大小和斥力因子（以实际情况进行适当调整，使气泡合理分布）
    if (data.length >= 5 && data.length < 10) {
      basicSize = 35;
      repulsion = 60;
    }
    if (data.length >= 10 && data.length < 20) {
      basicSize = 35;
      repulsion = 60;
    } else if (data.length >= 20) {
      basicSize = 32;
      repulsion = 50;
    } else {
      basicSize = 35;
      repulsion = 40;
    }

    return { basicSize, repulsion };
  }

  initBubbleChart(data: any = [], format: any = []) {
    let maxValue: number = 0;
    let temp: any = [];
    data.forEach((item: any) => {
      temp.push(item[format[1]]);
    });
    maxValue = Math.max.apply(null, temp);

    // 气泡颜色数组
    let color = this.returnColor();
    // 气泡颜色备份
    let bakeColor = [...color];
    // 气泡数据
    let bubbleData: any = [];

    let { basicSize } = this.returnRepulsion();

    // 填充气泡数据数组bubbleData
    for (let item of data) {
      // 确保气泡数据条数少于或等于气泡颜色数组大小时，气泡颜色不重复
      if (!bakeColor.length) bakeColor = [...color];
      let colorSet = new Set(bakeColor);
      let curIndex = Math.round(Math.random() * (colorSet.size - 1));
      let curColor = bakeColor[curIndex];
      colorSet.delete(curColor);
      bakeColor = [...colorSet];
      // 气泡大小设置
      let size = (item[format[1]] * basicSize * 2) / maxValue;
      if (size < basicSize) size = basicSize;

      bubbleData.push({
        name: item[format[0]],
        value: item[format[1]],
        symbolSize: size,
        draggable: true,
        label: {
          normal: {
            textStyle: {
              fontSize: 12,
              color: '#4054f2',
            },
          },
        },
        itemStyle: {
          normal: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(255,255,255,0)', // 0% 处的颜色
                },
                {
                  offset: 0.4,
                  color: 'rgba(255,255,255,0)', // 100% 处的颜色
                },

                {
                  offset: 1,
                  color: 'rgba(64,84,242,0.8)', // 0% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            // 'borderColor': '#2275d3',
            // 'shadowColor': '#fff',
            // 'shadowBlur': 10,
          },
        },
      });
    }
    return bubbleData;
  }

  initData(data) {
    // let data = [
    //     {label: '可乐', amount: 100},
    //     {label: '雪碧', amount: 70},
    //     {label: '土豆', amount: 30},
    //     {label: '饼干', amount: 50}
    // ]
    let bubbleData: any = this.initBubbleChart(data, ['label', 'amount']);
    let { repulsion } = this.returnRepulsion();
    let bubbleId: any = document.getElementById('elBubble');

    let bubbleChart = echarts.init(bubbleId);
    let bubbleOptions: any = {
      //backgroundColor: '#fff',
      animationEasingUpdate: 'bounceIn',
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: repulsion,
            edgeLength: 10,
          },
          // 是否开启鼠标缩放和平移漫游
          roam: false,
          label: { normal: { show: true } },
          data: bubbleData,
        },
      ],
    };
    bubbleOptions && bubbleChart.setOption(bubbleOptions);
  }
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  // height: 30%;
  // margin-bottom: 7px;
  position: relative;
}
</style>
