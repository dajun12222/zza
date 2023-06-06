<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-button
    :type="mode"
    :style="{ ...btnStyle }"
    :disabled="disabled"
    :loading="loading"
    :class="{
      'has-icon': icon.type && showIcon,
      'ui-button-danger': mode === 'danger',
    }"
    @click="onClick"
  >
    <span v-if="icon.type && showIcon">
      <a-icon
        v-if="icon.type && showIcon"
        :type="icon.type"
        :theme="icon.theme"
        :style="{ fontSize: icon.size, color: icon.color }"
      />
    </span>

    <span>{{ content }}</span>
  </a-button>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { Button, Icon } from '@h3/antd-vue';

import baseControl from '../../widget-base';

@Component({
  components: {
    AButton: Button,
    AIcon: Icon,
  },
})
export default class UiButton extends Mixins(baseControl) {
  @Prop()
  mode!: any;

  @Prop()
  name!: string;

  @Prop()
  showIcon!: boolean;

  @Prop({
    default: () => ({}),
  })
  icon!: any;

  @Prop()
  code!: string;

  @Prop({
    default: false,
  })
  disabled!: boolean;

  @Prop({
    default: false,
  })
  loading!: boolean;

  @Prop()
  content!: string;

  pending: boolean = false;

  get btnStyle() {
    const style = this.style;
    //  #31448 【按钮】拖入页面中的按钮，设计时与预览不一致
    if (
      this.$uiEngine?.isDesignMode &&
      (!style.width || style.width === 'auto')
    ) {
      style.width = 'fit-content';
    }
    return style;
  }

  onClick() {
    if (this.pending) {
      return;
    }
    this.pending = true;
    setTimeout(() => {
      this.pending = false;
    }, 300);
    if (this.btnStyle?.opacity === 0) {
      return;
    }

    this.$emit('click', this.code, this.content);
  }
}
</script>

<style lang="less" scoped>
.ant-btn {
  display: block;
}

.has-icon {
  display: flex;
  align-items: center;

  & > span:last-child {
    margin-left: 8px;
  }
}

.ui-button-danger {
  color: #fff;
  background-color: #f0353f;
}
</style>
