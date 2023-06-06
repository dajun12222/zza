<template>
  <div class="unitRank">
    <el-block-bg title="项目完成情况" :year="false">
      <div style="width: 100%; height: 20px"></div>
      <div id="projectComplete" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'projectComplete',
  components: {
    elBlockBg: blockBg,
  },
})
export default class projectComplete extends Vue {
  @Prop({}) colors?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList() {
    const res: any = await api.projectArchiveInfo();
    let center: any = ['28%', '40%'];
    switch (true) {
      case window.innerWidth >= 1280 && window.innerWidth <= 1439:
        center = ['33%', '40%'];
        break;
      default:
        break;
    }
    if (res.errcode === 0) {
      let option = res.data;
      if (option[0].state === '正常') {
        option = option.reverse()
      }
      option.map((item: any, i) => {
        item['name'] = item['state'];
        item.itemStyle = { color: this.colors[i] };
      });
      echart.pie('projectComplete', res.data, {
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
            name: '项目完成情况',
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
                fontSize: 16,
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
