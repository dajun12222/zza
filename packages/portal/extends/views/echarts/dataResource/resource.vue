<template>
  <div class="unitRank">
    <el-block-bg :title="title" :year="false">
      <p class="year"></p>
      <div class="box">
        <div
          class="lie"
          style="
            text-align: center;
            background: #f0f6ff;
            border-radius: 8px;
            width: 40%;
            justify-content: center;
          "
        >
          <p
            style="
              font-size: 28px;
              font-family: DingTalk-JinBuTi, DingTalk;
              font-style: italic;
              font-weight: bold;
              color: #2970ff;
              margin-bottom: 10%;
            "
          >
            {{ info.historicalData }}
          </p>
          <p>数据总量</p>
        </div>
        <div class="lie" style="color: #6397ff">
          <p>
            本年新增：<span style="color: #43cd93">{{ info.newThisYear }}</span>
          </p>
          <p>
            本年更新：<span style="color: #6b22d3">{{
              info.updateThisYear
            }}</span>
          </p>
          <p>
            本月新增：<span style="color: #ea9200">{{
              info.newThisMonth
            }}</span>
          </p>
          <p>
            本月更新：<span style="color: #1239ff">{{
              info.updateThisMonth
            }}</span>
          </p>
        </div>
      </div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import * as echarts from 'echarts';
import { Row, Col } from '@h3/antd-vue';
@Component({
  name: 'unitRank',
  components: {
    ARow: Row,
    ACol: Col,
    elBlockBg: blockBg,
  },
})
export default class unitRank extends Vue {
  @Prop({}) title?: string;

  @Prop({
    default: () => {
      return {
        historicalData: 0,
        newThisYear: 0,
        newThisMonth: 0,
        updateThisMonth: 0,
      };
    },
  })
  info?: any;

  mounted() {}
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  height: auto;
  margin-bottom: 7px;
  position: relative;
  .box {
    display: flex;
    justify-content: center;
    height: 70%;
    @media screen and (max-width: 1440px) {
      height: 60%;
    }
    color: #2970ff;
    font-size: 14px;
    .lie {
      margin: 10px;

      p {
      }
    }
  }
  .year {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 32px;
    text-align: right;
    margin-right: 5px;
    color: #fff;
    display: none;
  }

  .resourceCon {
    width: 80%;
    margin: 0 auto;
    .resourceConCol {
      margin-bottom: 10px;
      color: #7690a5;
      padding-left: 20px;
    }
    .resourceConColTwo {
      padding-left: 0px;
    }
  }
}
</style>
