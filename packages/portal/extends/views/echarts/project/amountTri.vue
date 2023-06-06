<template>
  <div class="unitRank">
    <el-block-bg title="送审金额情况" :year="false">
      <div id="amountTri" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'amountTri',
  components: {
    elBlockBg: blockBg,
  },
})
export default class amountTri extends Vue {
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
      let num: number = 0;
      option.map((item: any, i) => {
        item['name'] = item['type'];
        item['value'] =
          Math.floor((parseInt(item['amount']) / 10000) * 100) / 100;
        if (item && item['value']) {
          num = num + item['value'];
          item.itemStyle = { color: this.colors[i] };
        }
      });
      echart.pie(
        'amountTri',
        option,
        {
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
        },
        {
          text: Math.floor(num * 100) / 100, //主标题文本
          subtext: '送审金额(万)', //副标题文本
        },
      );
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
