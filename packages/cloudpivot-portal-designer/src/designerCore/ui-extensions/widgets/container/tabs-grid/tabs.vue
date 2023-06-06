<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="tabs-grid" :style="wrapStyle">
    <TabsHeaderRow
      v-if="tabDirection === 'row'"
      v-model="activeKey"
      :heads="heads"
      :textStyle="style"
      :tabTitlePosition="tabTitlePosition"
      @change="onActiveKeyChange"
    />
    <TabsHeaderColumn
      v-else-if="tabDirection === 'column'"
      v-model="activeKey"
      :heads="heads"
      :textStyle="style"
      @change="onActiveKeyChange"
    />
    <template v-for="(child, index) in panels">
      <TabsPanel
        v-if="child.props.tab === activeKey.toString()"
        :key="index"
        :class="tabDirection"
        :panel="child"
        :index="index"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  PropSync,
  Mixins,
  Watch,
} from 'vue-property-decorator';

import { Tabs, Icon, Button } from '@h3/antd-vue';

import TabsBase from './tabs-base';

import TabsHeaderRow from './tabs-header-row.vue';
import TabsHeaderColumn from './tabs-header-column.vue';

import TabsPanel from './tabs-panel.vue';

@Component({
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AIcon: Icon,
    AButton: Button,
    TabsHeaderRow,
    TabsHeaderColumn,
    TabsPanel,
  },
})
export default class UiTabs extends Mixins(TabsBase) {
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

  @Prop({
    default: '',
  })
  tabDirection!: string;

  @Prop({
    default: '',
  })
  tabTitlePosition!: string;

  activeKey: string = '';

  get panels() {
    return this.$uiChildren?.filter((child) => {
      return child.props.visible?.show !== false;
    });
  }

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

    switch (this.tabDirection) {
      case 'row':
        style['flex-flow'] = 'column';
        break;
      case 'column':
        style['flex-flow'] = 'row';
        break;
      default:
        break;
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
.tabs-grid {
  display: flex;
  background-size: cover;
  background-position: center;
}
</style>
