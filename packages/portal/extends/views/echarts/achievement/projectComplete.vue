<template>
  <div class="unitRank">
    <el-block-bg title="项目完成情况" :year="false">
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
  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList() {
    const res: any = await api.projectArchiveInfo();
    if (res.errcode === 0) {
      let option = res.data;
      option.map((item: any) => {
        item['name'] = item['state'];
      });
      echart.pie('projectComplete', res.data, {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['50%'],
            center: ['40%', '40%'],
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
