<template>
  <div class="unitRank">
    <el-block-bg title="整改项目逾期情况" :year="false">
      <div id="indexProjectComplete" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'indexProjectComplete',
  components: {
    elBlockBg: blockBg,
  },
})
export default class indexProjectComplete extends Vue {
  @Prop({}) colors?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList() {
    const res: any = await api.rectifyProjectsOverdue();
    let center: any = ['28%', '48%'];
    switch (true) {
      case window.innerWidth >= 1280 && window.innerWidth <= 1439:
        center = ['33%', '48%'];
        break;
      default:
        break;
    }
    if (res.errcode === 0) {
      let option = res.data;
      option.map((item: any, i) => {
        item['name'] = item['state'];
        item.itemStyle = { color: this.colors[i] };
      });
      echart.pie('indexProjectComplete', res.data, {
        legend: {
          y: 'center',
          right: '5%',
          width: '15%',
          height: '100%',
          itemWidth: 7,
          textStyle: {
            fontSize: '0.715em',
            color: '#000',
          },
        },
        series: [
          {
            name: '整改项目逾期情况',
            type: 'pie',
            radius: ['78%'],
            center: center,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '1.14em',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: res.data,
          },
        ],
      });
    } else {
    }
  }
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  position: relative;
}
</style>
