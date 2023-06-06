<template>
  <div class="unitRank">
    <el-block-bg title="各审计类型报告分布" :year="false">
      <div id="achievementWorkStart" class="resultContent"></div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import echart from '@/../extends/utils/echart';
import api from '@/../extends/api';
@Component({
  name: 'achievementWorkStart',
  components: {
    elBlockBg: blockBg,
  },
})
export default class achievementWorkStart extends Vue {
  @Prop({}) colors?: any;

  @Prop({}) map?: any;

  created() {
    this.getList();
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList() {
    const res: any = await api.auditTypeReportDist();
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
      console.log(targetArr);
      
      targetArr.map((item: any, i) => {
        // if (item && item['VALUE']) {
          num = num + item['VALUE'];
          item['value'] = item['VALUE'];
          item['name'] = item['state'];
        // }
        item.itemStyle = { color: this.colors[i] };
      });

      echart.pie(
        'achievementWorkStart',
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
          subtext: '报告数量', //副标题文本
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
