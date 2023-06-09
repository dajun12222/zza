<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <h3-input-number
    v-if="!readonly"
    v-model="val"
    :class="{ mobileShow: mobile }"
    :placeholder="mobile && readonlyFormula ? '' : placeholder"
    :disabled="readonlyFormula"
    style="width: 100%"
    @keydown="onKeydown"
    @blur="onBlur"
    @focus="onFocus"
    @change="onValueChange"
  />

  <span v-else>{{ text }}</span>
</template>

<script lang="ts">
import { NumberControl } from 'cloudpivot-forms';
import { Subscription } from 'rxjs';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { NumberInputControl } from '../../controls';
import { NumberFormatType } from '../../typings';
import numberFilter from '../number-filter';
import H3InputNumber from '../shared/h3-input-number.vue';

@Component({
  name: 'input-number',
  components: {
    // AInputNumber: InputNumber
    H3InputNumber,
  },
  filters: {
    number: numberFilter,
  },
})
export default class PcInputNumber extends NumberInputControl {
  val: any = '';

  text = '';

  subscription?: Subscription;

  focused = false;

  @Prop({
    default: false,
  })
  mobile!: boolean;

  setControl() {
    const _ctrl = this.ctrl as NumberControl;

    this.val = _ctrl.hasValue ? _ctrl.value : '';

    // if (_ctrl.hasValue) {
    this.formatNumber();
    // }
  }

  formatNumber() {
    if (!this.readonly) {
      if (!this.focused && this.$el) {
        const input = this.$el.querySelector('input');
        if (input) {
          this.format(input);
        }
      }
    } else {
      this.text = this.formatter();
    }
  }

  handleValueChange(value: any): void {
    const _ctrl = this.ctrl as NumberControl;

    this.$emit('change', _ctrl.value);
    this.val = _ctrl.hasValue ? (_ctrl.value as any) : null;
    this.formatNumber();
  }

  // @Watch("val")
  onValueChange(val: any) {
    if (val !== '' && val !== null) {
      val = Number(val);
    }
    if (typeof val === 'number' && !Number.isNaN(val)) {
      // this.ctrl.value = val;
      this.setValue(this.typeTrans(val));
      this.val = this.typeTrans(val);
    } else {
      this.ctrl.value = null;
      this.val = '';
    }
  }

  onKeydown(evt: KeyboardEvent) {
    const ft = this.controlOpts.format1;
    if (ft === NumberFormatType.Int || ft === NumberFormatType.Ratio) {
      if (evt.key === '.') {
        evt.preventDefault();
      }
    }
  }

  onBlur(evt: KeyboardEvent) {
    this.focused = false;
    const input = evt.target as HTMLInputElement;
    this.format(input);
    this.$emit('blur');
  }

  onFocus(evt: KeyboardEvent) {
    this.focused = true;
    setTimeout(() => {
      const input = evt.target as HTMLInputElement;
      input.value = this.val;
    }, 100);
    this.$emit('focus');
  }

  format(input: HTMLInputElement) {
    const format = super.formatter();
    this.setValue(this.typeTrans(this.ctrl.value));
    // 设置500ms 兼容ie浏览器有时无法渲染格式化值问题
    setTimeout(() => {
      return (input.value = format);
    }, 500);
  }

  mounted() {
    this.doFormat();
  }

  doFormat() {
    if (typeof this.ctrl.value === 'number') {
      const input = this.$el.querySelector('input');
      if (input) {
        this.format(input);
      }
    }
  }

  destroyed() {
    super.destroyed();
  }

  @Watch('readonly')
  onWritableChange() {
    if (!this.ctrl.readonly) {
      this.$nextTick(() => {
        this.doFormat();
      });
    }
  }
}
</script>

<style lang="less">
.mobileShow {
  input {
    background: #ffffff;
  }
}
</style>
