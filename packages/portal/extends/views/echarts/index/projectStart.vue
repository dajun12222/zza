<template>
  <div class="unitRank">
    <el-block-bg title="整改项目完成情况" :year="false">
      <div id="indexPrjectStart" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'indexPrjectStart',
  components: {
    elBlockBg: blockBg,
  },
})
export default class indexPrjectStart extends Vue {
  @Prop({}) colors?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList() {
    const res: any = await api.rectifyProjectsDone();
    if (res.errcode === 0) {
      let option = res.data;
      let num: number = 0;
      option.map((item: any, i) => {
        item['name'] = item['state'];
        if (item && item['value']) {
          num = num + item['value'];
          item.itemStyle = { color: this.colors[i] };
        }
      });
      echart.pie(
        'indexPrjectStart',
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
          text: num, //主标题文本
          subtext: '整改项目', //副标题文本
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
