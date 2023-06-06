<template>
  <div class="unitRank">
    <el-block-bg title="整改问题完成情况" :year="false">
      <div id="indexAmountTri" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'indexAmountTri',
  components: {
    elBlockBg: blockBg,
  },
})
export default class indexAmountTri extends Vue {
  @Prop({}) colors?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList() {
    const res: any = await api.reviewAmountInfo();
    if (res.errcode === 0) {
      let option = res.data;
      option.map((item: any, i) => {
        item['name'] = item['type'];
        item['value'] = item['amount'];
        item.itemStyle = { color: this.colors[i] };
      });
      echart.pie('indexAmountTri', res.data);
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
