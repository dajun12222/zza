<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="outer-wrapper">
    <!-- 遮罩 -->
    <div class="chart-card-mask" @click="destroy"></div>
    <!-- 动态窗 -->
    <div
      ref="chartCard"
      :style="positionStyle"
      :class="flowTrackChartCardPrefixCls"
    >
      <div class="title">节点名称</div>
      <div class="attr-block">
        <span class="name">触发的模型：</span>
        <span class="value">模型名称</span>
      </div>
      <div class="attr-block">
        <span class="name">变更的数据：</span>
        <span class="value">数据标题数据标题数据标题</span>
      </div>
      <div class="attr-block">
        <span class="name">执行时间：</span>
        <span class="value">2022-08-12 14:44:49</span>
      </div>
      <div class="attr-block">
        <span class="name">异常情况：</span>
        <span class="value">找不到目标模型</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'flow-track-chart-card',
  components: {},
})
export default class FormWorkflowTrackChartCard extends Vue {
  @Prop({ default: () => [] }) record!: any;

  @Prop({ default: () => ({}) }) rect?: DOMRect;

  mounted() {
    this.$nextTick(() => {
      (this.$refs.chartCard as HTMLElement).classList.add(
        'flow-track-chart-card--show',
      );

      // 卡片展示高度不够时，向上对齐展示
      const curDom = document.querySelector('.outer-wrapper') as HTMLElement;
      if (!curDom || !curDom.parentElement) {
        return;
      }
      const clientHeight: number = curDom.parentElement.clientHeight + 57;
      const card: any = this.$refs.chartCard as HTMLElement;
      if (!card || !card.clientHeight) {
        return;
      }
      const pageY: number = card.style.top ? parseInt(card.style.top) : 0;
      console.log(clientHeight, pageY, card);
      if (clientHeight - pageY < card.clientHeight + 20) {
        const height = this.rect && this.rect.height ? this.rect.height : 0;
        card.style.top = `${pageY - card.clientHeight + height}px`;
      }
    });
  }

  destroy() {
    this.$emit('destroy');
  }

  /**
   * 获取元素位置
   */
  get positionStyle() {
    const mainScrollTop: number = document.getElementsByClassName('main')[0]
      ? document.getElementsByClassName('main')[0].scrollTop
      : 0;

    const rect: any = this.rect;
    let pageX: number = 0;
    let pageY: number = 0;

    if (rect && rect.right && rect.left) {
      pageX = rect.right + 8;
      // 在 ie 上只有 rect.top, 没有 rect.y
      pageY = mainScrollTop
        ? mainScrollTop + (rect.y || rect.top)
        : rect.y || rect.top;
    }
    return `top:${pageY}px;left:calc(${pageX}px - 100vw + 850px)`;
  }

  /**
   * 获取
   */
  get flowTrackChartCardPrefixCls() {
    return {
      'flow-track-chart-card': true,
    };
  }
}
</script>
<style lang="less">
@chartCardZIndex: 1003;
.flow-track-chart-card {
  position: absolute;
  transition: all 0.25s;
  transform: scale(0.7);
  opacity: 0;
  top: 0;
  padding: @base4-padding-md;
  margin-bottom: @base4-padding-md;
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  width: 270px;
  max-height: 280px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: @chartCardZIndex;
  .title {
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    padding-bottom: 2px;
  }
  .attr-block {
    padding-top: 4px;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.chart-card-mask {
  position: fixed;
  left: 0;
  top: 0;
  z-index: @chartCardZIndex - 1;
  width: 100%;
  height: 100%;
}

.flow-track-chart-card--show {
  opacity: 1;
  transform: scale(1);
}
</style>
