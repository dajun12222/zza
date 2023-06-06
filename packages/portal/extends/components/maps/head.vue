<template>
  <div class="elHeader">
    <p></p>
    <div class="elHeaderMenu">
      <ul>
        <li :class="{ active: active === 1 }" @click="change(1)">工作概览</li>
        <li :class="{ active: active === 2 }" @click="change(2)">审计项目</li>
        <li :class="{ active: active === 3 }" @click="change(3)">审计成果</li>
        <li :class="{ active: active === 4 }" @click="change(4)">审计整改</li>
        <li :class="{ active: active === 5 }" @click="change(5)">审计队伍</li>
        <li :class="{ active: active === 6 }" @click="change(6)">数据资源</li>
      </ul>
      <!-- <ul class="elHeaderMenuTwo">

        </ul> -->
    </div>
    <span>
      {{ date }}
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';
@Component({
  name: 'elHeader',
  components: {},
})
export default class elHeader extends Vue {
  date: string = moment().format('YYYY-MM-DD dddd');

  @Prop({ default: 1 }) active?: number;

  change(num: number) {
    this.active = num;
    this.$emit('change', num);
  }
}
</script>
<style lang="less" scoped>
@font-face {
  font-family: 'example-font';
  src: url('../../style/font/优设标题黑.ttf');
}
@font-face {
  font-family: '庞门正道标题体';
  src: url('../../style/font/庞门正道标题体.ttf');
}
.elHeader {
  width: 100%;
  height: 10%;
  background-image: url('../../style/image/top_bg.png?t=202303091543');
  background-repeat: no-repeat;
  background-size: 110% 60%;
  background-position: -4px -3px;
  display: flex;
  // position: relative;
  > .elHeaderMenu {
    width: 70%;
    height: 100%;
    margin: 0 auto;
    display: grid;
    // grid-template-columns: 25% 50% 25%;

    > ul {
      display: flex;
      // align-items: center;
      justify-content: center;
      padding-top: .7%;
      width:100%;
      height: 100%;
      > li {
        font-family: 'example-font', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 11%;
        height: 40%;
        background-image: url('../../style/image/nav_nor.png?t=202303091543');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        font-size: 1em;
        color: #2970FF;
        cursor: pointer;
      }
      > li:hover {
        color: #fff;
        background-image: url('../../style/image/nav_sel.png?t=202303091543');
      }
      > li.active {
        color: #fff;
        background-image: url('../../style/image/nav_sel.png?t=202303091543');
      }
    }

  }
  > p {
    width: 22%;
    height: 100%;
    background: url('../../style/image/title@2x.png?t=202303091543') no-repeat  -4px -1px;
    background-size: contain;
  }
  > span {
    font-size: 1em;
    font-family: '庞门正道标题体' , sans-serif;
    color: #004c8f;
    width: 12%;
    line-height: 40px;
  }
}
</style>
