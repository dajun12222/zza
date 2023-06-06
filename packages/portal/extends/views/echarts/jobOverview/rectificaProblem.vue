<template>
  <div class="unitRank">
    <el-block-bg title="整改问题完成情况" :year="false">
      <div id="rectificaProblem" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'rectificaProblem',
  components: {
    elBlockBg: blockBg,
  },
})
export default class rectificaProblem extends Vue {
  @Prop({}) colors?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
    //this.init();
  }

  async getList() {
    const res: any = await api.rectifyProblemsDone();
    if (res.errcode === 0) {
      let option = res.data;
      let num: number = 0;
      option.map((item: any, i) => {
        if (item && item['value']) {
          num = num + item['value'];
          item.itemStyle = { color: this.colors[i] };
        }
      });
      echart.pie(
        'rectificaProblem',
        option,
        {
          legend: {
            y: 'center',
            right: '5%',
            width: '20%',
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
          subtext: '整改问题', //副标题文本
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
  // height: 33%;
  // margin-bottom: 7px;
  position: relative;
}
</style>
