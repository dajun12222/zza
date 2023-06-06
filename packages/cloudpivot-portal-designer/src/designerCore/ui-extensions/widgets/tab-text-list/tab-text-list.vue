<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="designer-tab-text-list" :style="wrapStyle">
    <!-- {{heads}} -->
    <template v-if="heads.length > 0">
      <tabs-heads
        v-model="activeKey"
        :heads="heads"
        :textStyle="style"
        @change="onActiveKeyChange"
      />
      <template v-for="panel in panels">
        <tabs-panel
          v-if="activeKey === panel.key"
          :key="panel.key"
          :panel="panel"
          :panelStyle="style"
        />
      </template>
    </template>
    <template v-else>
      <EmptyDataSource emptyText="您还没配置组件样式或展示内容哦～" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { EmptyDataSource } from '@portal-designer/toolbox';

@Component({
  components: {
    TabsHeads: () => import('./tabs-heads.vue'),
    TabsPanel: () => import('./tabs-panel.vue'),
    EmptyDataSource,
  },
})
export default class UiTabTextList extends Vue {
  @Prop({
    default: '',
  })
  backgroundColor!: string;

  @Prop({
    default: '',
  })
  backgroundImg!: string;

  @Prop({
    default: '',
  })
  borderRadius!: string;

  @Prop({
    default: '',
  })
  borderStyle!: string;

  @Prop({
    default: 0,
  })
  borderThickness!: number;

  @Prop({
    default: '',
  })
  borderColor!: string;

  @Prop({
    default: '',
  })
  textColor!: string;

  @Prop({
    default: '',
  })
  textThickness!: string;

  @Prop({
    default: () => [],
  })
  heads!: any[];

  activeKey: string = '';

  get wrapStyle() {
    const style: any = {};

    if (this.backgroundImg) {
      // 背景颜色
      style['background-image'] = `url(${this.backgroundImg})`;
    }

    if (this.backgroundColor) {
      // 背景颜色
      style['background-color'] = this.backgroundColor;
    }
    if (this.borderRadius) {
      // 圆角
      const RadiusEnum = {
        none: '0px',
        small: '2px',
        medium: '4px',
        big: '8px',
      };
      style['border-radius'] = RadiusEnum[this.borderRadius];
    }

    if (this.borderStyle) {
      // 边框类型
      style['border-style'] = this.borderStyle;
    }
    // 边框粗细
    style['border-width'] =
      this.borderThickness > 0 ? this.borderThickness + 'px' : 0;

    if (this.borderColor) {
      // 边框颜色
      style['border-color'] = this.borderColor;
    }
    return style;
  }

  get style() {
    const style: any = {};
    if (this.textColor) {
      style['color'] = this.textColor;
    }
    if (this.textThickness) {
      style['font-weight'] = this.textThickness;
    }
    return style;
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  get panels() {
    return this.heads;
  }

  onActiveKeyChange(activeKey: string) {
    const head = this.heads.find((h) => h.key === activeKey);
    this.heads.forEach((h) => (h.active = false));
    head.active = true;

    // this.$refs['textListDisplay'] as HTMLElement;
  }

  created() {
    this.setActiveKey();
  }

  @Watch('heads')
  onHeadsChange(val: boolean) {
    this.setActiveKey();
  }

  /**
   * 设置激活的tab
   */
  setActiveKey() {
    if (this.heads.length > 0) {
      let head = this.heads.find((h) => h.active);
      if (!head) {
        head = this.heads[0];
      }
      this.activeKey = head.key;
    }
  }
}
</script>

<style lang="less" scoped>
.designer-tab-text-list {
  width: 100%;
  height: 100%;
}
</style>
