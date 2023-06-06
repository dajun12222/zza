<template>
  <div class="unitRank">
    <el-block-bg title="各审计类型问题分布" :year="false">
      <div id="typeProblem" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'typeProblem',
  components: {
    elBlockBg: blockBg,
  },
})
export default class typeProblem extends Vue {
  @Prop({}) colors?: any;

  @Prop({}) map?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
    //this.init();
  }

  async getList() {
    const res: any = await api.auditTypeProblemsNum();
    if (res.errcode === 0) {
      let option = res.data;
      let defaultVal = {VALUE: 0, NAME: ""};
      let targetArr = this.map.map((value) => ({...defaultVal, ...value}));
      if (option.length < 6) {
        option.forEach((item) => {
          const index = targetArr.findIndex((value) => value.NAME === item.NAME);
          if (index >= 0) {
            targetArr[index].VALUE = item.VALUE;
          } else {
            targetArr.push(item);
          }
        });
      }else {
        targetArr = option;
      }
      let num: number = 0;
      targetArr.map((item: any, i) => {
        // if (item && item['VALUE']) {
          num = num + item['VALUE'];
          item['value'] = item['VALUE'];
          item['name'] = item['NAME'];
        // }
        item.itemStyle = { color: this.colors[i] };
      });
      this.$store.commit('setCuntProblem', num.toString());
      echart.pie(
        'typeProblem',
        targetArr,
        {
          legend: {
            y: 'center',
            right: '8%',
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
          subtext: '问题总数', //副标题文本
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
  // height: 30%;
  // margin-bottom: 7px;
  position: relative;
}
</style>
