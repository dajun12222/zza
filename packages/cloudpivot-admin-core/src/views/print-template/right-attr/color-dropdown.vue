<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-popover placement="bottom" trigger="click">
    <template slot="content">
      <ColorSelect @clickColor="onSelect" />
    </template>

    <a-button class="dropdown-botton" size="small">
      <span class="icon-left" :style="fillStyle">
        <i v-show="icon" class="icon aufontAll" :class="[icon]"></i>

        <!-- :style="`color:${value};`" -->
      </span>

      <span class="icon-right">
        <i class="anticon anticon-down"></i>
      </span>
    </a-button>
  </a-popover>
</template>

<script lang="ts">
import { Button, Popover } from '@h3/antd-vue';
import { Component, Vue, Prop, Model } from 'vue-property-decorator';

import ColorSelect from './color-component.vue';

@Component({
  name: 'color-dropdown',
  components: {
    ColorSelect,
    APopover: Popover,
    AButton: Button,
  },
})
export default class ColorDropdown extends Vue {
  @Prop({
    default: '',
  })
  icon!: string;

  @Model('change', {
    default: '',
  })
  value!: string;

  @Prop({
    default: false,
  })
  fill!: boolean;

  @Prop({
    default: '',
  })
  defaultColor!: string;

  get fillStyle() {
    if (this.fill) {
      return {
        background: this.value,
      };
    }
    return {};
  }

  onSelect(value: string) {
    if (value === 'default') {
      value = this.defaultColor || '#fff';
    }
    this.$emit('change', value);
  }
}
</script>

<style lang="less" scoped>
button {
  vertical-align: top;
}
</style>
