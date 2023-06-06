<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-popover
    placement="bottom"
    :trigger="disabled ? 'none' : 'click'"
  >
    <template slot="content">
      <color-picker-panel
        :value="showValue"
        :colorOpacity="opacity"
        @change="onChange"
      />
    </template>

    <a-button
      class="dropdown-botton"
      :size="size"
      :disabled="disabled || false"
      :class="{[`dropdown-botton-${size}`]: size}"
    >
      <span
        class="icon-left"
        :style="fillStyle"
      >
        <a-icon
          v-if="icon"
          :type="icon"
        />

        <!-- :style="`color:${value};`" -->
      </span>
      <span class="icon-right">{{ showValue }}</span>

      <!-- <span class="icon-right">
                <a-icon type="down" />
            </span> -->
    </a-button>
  </a-popover>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Model,
} from 'vue-property-decorator';

import { Popover, Button, Icon } from '@h3/antd-vue';

// import ColorPickerPanel from './color-picker-panel.vue';

@Component({
  components: {
    APopover: Popover,
    AButton: Button,
    AIcon: Icon,
    ColorPickerPanel: () => import('./color-picker-panel.vue'),
  },
})
export default class ColorPicker extends Vue {
  @Prop({
    default: '',
  })
  icon!: string;

  @Model('change', {
    default: '#000000',
  })
  value!: string;

  @Prop({
    default: true,
  })
  fill!: boolean;

  @Prop({
    default: '',
  })
  defaultColor!: string;

  @Prop({
    default: '',
  })
  disabled!: boolean;

  @Prop({
    default: 'default',
  })
  size!: string;

  get fillStyle () {
    if (this.fill) {
      return {
        background: this.value,
      };
    }
    return {};
  }

  get showValue () {
    let hexcode = '#';
    if (this.value.search('rgba') > -1) {
      const arr = this.value.slice(5).split(',');
      for (let x = 0; x < 3; x++) {
        const n = parseInt(arr[x], 10);
        /*  if (parseInt(n) != n) return alert('请输入数字！');
            if (n > 255) return alert('数字在0-255之间！'); */
        const c = '0123456789ABCDEF';
        let b = '';
        let a = n % 16;
        b = c.substr(a, 1);
        a = (n - a) / 16;
        hexcode += c.substr(a, 1) + b;
      }
    } else {
      hexcode = this.value;
    }
    return hexcode;
  }

  get opacity () {
    let n = 1;
    if (this.value.search('rgba') > -1) {
      n = parseFloat(this.value.slice(5).split(',')[3]);
      if (isNaN(n)) {
        n = 1;
      } else {
        if (n > 1) {
          n = 1;
        }
        if (n < 0) {
          n = 0;
        }
      }
    }
    return n;
  }

  onChange (_value: string) {
    let value = _value;
    if (value === 'default') {
      value = this.defaultColor || '#FFFFFF';
    }
    this.$emit('change', value);
  }
}
</script>

<style lang="less" scoped>
button {
  vertical-align: top;
  padding: 0;
}

.dropdown-botton {
  width: 100%;
  display: flex;
  flex-direction: row;
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
  }

  &-small > span {
    height: 22px;
    line-height: 22px;
    padding-left: 8px;
    text-align: left;
  }
}

.icon-left {
  flex: 1;
  text-align: center;
  border-radius: 4px 0 0 4px;
}

.icon-right {
  flex: 3;
  font-size: 12px;
  border-left: 1px solid #dddddd;
  vertical-align: top;
  color: rgba(0, 0, 0, 1);
}
</style>
