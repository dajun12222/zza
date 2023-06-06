<template>
  <div
    :class="[type === 1 ? 'jobOverviewJiao' : type === 2 ? 'nobg' : 'ditu']"
    :style="[
      {
        width: width ? width : '100%',
        height: height ? height : '100%',
      },
      styles,
    ]"
  >
    <i></i>
    <strong></strong>
    <div v-if="titleShow" class="title_warp">
      <span v-if="title" class="title"> {{ title }}</span>
      <p v-if="year" class="year">{{ date }}年</p>
    </div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';

import * as echarts from 'echarts';

@Component({
  name: 'mapsContent',
  components: {},
})
export default class mapsContent extends Vue {
  date: string = moment().format('YYYY');

  @Prop({}) styles?: any;

  @Prop({}) width?: any;

  @Prop({}) height?: any;

  @Prop({}) title?: string;

  @Prop({}) title_list?: string;

  @Prop({ default: true }) border?: boolean;

  @Prop({ default: true }) year?: boolean;

  @Prop({ default: true }) titleShow?: boolean;

  @Prop({ default: 1 }) type?: number;
}
</script>
<style lang="less" scoped>
.ditu {
  // background: #ffffff;
  width: 100%;
  height: 100%;
  position: relative;
  // margin-bottom: 7px;
  // border-radius: 20px;
  // box-shadow: 0px 0px 10px #eaebee;
}
.nobg {
  background: #ffffff;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 20px;
  box-shadow: 0px 0px 10px #eaebee;
  > a {
    font-size: 1em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #004c8f;
    // line-height: 17px;
    margin-left: 5%;
    display: inline-block;
  }
  .title_warp {
    height: 33%;
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: auto;
    align-items: flex-end;
    > .title {
      display: inline-block;
      // border: solid 1px #1ACDFD;
      border-top: 0;
      border-radius: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      // position: absolute;
      // top: 2%;
      // left: 0.775rem;
      // padding: 1.5% 2%;
      color: #004c8f;
      font-weight: 600;
      > img {
        width: 14px;
        height: 14px;
      }
    }
    > a {
      display: flex;
      align-items: center;
      padding-left: 8px;
      position: absolute;
      top: 0;
      left: 0;
      color: #bfe3fc;
      font-weight: 100;
      font-size: 10px;
      width: 138px;
      height: 17px;
      background-image: url('../../style/image/list2-1_bg.png?202303091050');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
.jobOverviewJiao {
  width: 100%;
  height: 100%;
  position: relative;
  // background-image: url(../../style/image/div_left.png),
  //   url(../../style/image/div_rit.png);
  // background-position: left top, right top;
  // background-repeat: no-repeat, no-repeat;
  // background-size: auto 100%, auto 100%;
  // margin-bottom: 7px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 10px #eaebee;

  &:after {
    content: '';
    background-image: url(../../style/image/round_T_L@2x.png),
      url(../../style/image/round_B_L@2x.png);
    background-position: top left, bottom right;
    background-repeat: no-repeat;
    // border-top: 1px solid #2275d3;
    // border-left: 1px solid #2275d3;
    background-size: contain;
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  &:before {
    content: '';
    background-image: url(../../style/image/round_T_R@2x.png),
      url(../../style/image/round_B_R@2x.png);
    background-position: top left, bottom right;
    background-repeat: no-repeat;
    background-size: contain;
    // border-top: 1px solid #2275d3;
    // border-left: 1px solid #2275d3;
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
  > i {
    display: block;
    background: url(../../style/image/line_R@2x.png) no-repeat;
    // border-bottom: 1px solid #2275d3;
    // border-right: 1px solid #2275d3;
    width: 3px;
    height: 60%;
    position: absolute;
    bottom: 20%;
    right: 0;
    top: 20%;
    background-size: 100% 100%;
  }
  > strong {
    display: block;
    background: url(../../style/image/line_L@2x.png) no-repeat;
    // border-bottom: 1px solid #2275d3;
    // border-right: 1px solid #2275d3;
    width: 3px;
    height: 60%;
    position: absolute;
    bottom: 20%;
    left: 0;
    top: 20%;
    background-size: 100% 100%;
  }
  .title_warp {
    height: 15%;
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: auto;
    align-items: flex-end;
    > .title {
      display: inline-block;
      // border: solid 1px #1ACDFD;
      border-top: 0;
      border-radius: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      // position: absolute;
      // top: 2%;
      // left: 0.775rem;
      // padding: 1.5% 2%;
      color: #004c8f;
      font-weight: 600;
      > img {
        width: 14px;
        height: 14px;
      }
    }
    > a {
      display: flex;
      align-items: center;
      padding-left: 8px;
      position: absolute;
      top: 0;
      left: 0;
      color: #bfe3fc;
      font-weight: 100;
      font-size: 10px;
      width: 138px;
      height: 17px;
      background-image: url('../../style/image/list2-1_bg.png?202303091050');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>
