<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="ruler-all-warp">
    <div
      id="ruler"
      class="ruler-warp"
    >
      <span class="ruler-lock-block"></span>
    </div>

    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'; // Component Prop Watch Emit Model Provide Inject Mixins
import rulerInit from './ruler-fn';
@Component({
  name: 'demo',
  components: {},
})
// ruler对像有setZoom缩放方法(z,x,y) z为缩放的等级，x,y为缩放的中心点与setRuler方法，配置项参看rulerInit，
export default class AppForm extends Vue {
  ruler: any;

  st (et: any) {
    console.log(et);
  }

  mounted () {
    this.$nextTick(() => { });
    const ruler = rulerInit({
      el: 'ruler',
      maxScale: 3000,
      startValue: -2000,
      vHeight: 8000,
      fontColor: '#000000',
      count: 200,
      fontSize: 9,
      sceneW: 1400,
      sceneH: 900,
    });
    this.ruler = ruler;
    this.$emit('ruler', ruler);
  }
}
</script>
<style lang="less" scoped>
.ruler-all-warp {
  overflow: hidden;
  position: relative;
  width: 100%;
  background-color: #fff;
  margin: 0;
  height: 100%;
  box-sizing: border-box;
  padding: 16px 0 0 16px;
}
.ruler-warp {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  /deep/ .line-w,
  /deep/ .line-h {
    position: absolute;
    display: none;
    z-index: 99999;
  }

  /deep/ .line-w {
    left: -50%;
    width: 200%;
    border-bottom: 1px dashed #aaa;
    height: 0px;
  }
  /deep/.line-h {
    width: 0px;
    height: 10000px;
    border-left: 1px dashed #aaa;
    top: -50%;
    left: 0;
  }
  /deep/ & > canvas {
    position: absolute;
    // cursor: pointer;
  }
  /deep/ & > canvas:nth-child(2) {
    left: 15px;
  }
  /deep/ & > canvas:last-child {
    top: 15px;
    right: 100%;
    transform-origin: 100% 0;
    transform: rotate(-90deg);
  }
  .ruler-lock-block {
    display: inline-block;
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: white;
    z-index: 500;
  }
}
</style>
