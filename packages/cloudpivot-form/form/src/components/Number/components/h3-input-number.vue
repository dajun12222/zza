<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="h3-input-number"
    :class="{
      'h3-input-number-focused': focused,
      'h3-input-number-disabled': disabled,
    }"
  >
    <span
      v-if="!disabled && isMoneyNumber() && focused"
      class="moneyNumber font-ele"
      :style="{ left: isMobile ? 0 : '11px' }"
    >
      {{ isMoneyNumber() }}
    </span>
    <a-tooltip
      :getPopupContainer="getPopupContainer"
      :placement="placement"
      :visible="showTooltip"
    >
      <template slot="title">
        {{ tips }}
      </template>
      <input
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        :style="inputStyle"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="(e) => $emit('keydown', e)"
        @keyup="(e) => $emit('keyup', e)"
        @input="onChange"
      />
    </a-tooltip>

    <!-- <template v-if="ctrl.hasError">
      请输入数字
    </template> -->
    <!-- <span
      v-if="!disabled && isPercentage() && focused"
      class="percentage font-ele"
      :style="{ right: isMobile ? 0 : '26px' }"
    >
      %
    </span> -->
    <div v-if="!disabled" class="h3-input-number-steps">
      <span @click="stepUp">
        <i class="aufontAll h-icon-all-up-o"></i>
      </span>
      <span @click="stepDown">
        <i class="aufontAll h-icon-all-down-o"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Tooltip } from '@h3/antd-vue';
import { Component, Model, Prop, Vue } from 'vue-property-decorator';
import conduct from './../conduct';

@Component({
  name: 'h3-input-number',
  components: {
    ATooltip: Tooltip,
  },
})
export default class H3InputNumber extends Vue {
  @Prop({
    default: '',
  })
  placeholder!: string;

  @Prop({
    default: false,
  })
  disabled!: boolean;

  @Model('change')
  value!: number | null;

  @Prop({
    default: 1,
  })
  step!: number;

  @Prop({
    default: () => [],
  })
  ctrl!: any;

  @Prop({
    default: {},
  })
  controlOpts!: any;

  @Prop({
    default: false,
  })
  isMobile!: boolean;

  tips: string = '请输入不超过15个数字';

  focused = false;

  tooltipVisible: boolean = false;

  get showTooltip() {
    if (this.percentageTipsVisible) {
      this.tips = this.$t(
        'cloudpivot.form.renderer.tip.percentageTip',
      ).toString();
    }
    return this.percentageTipsVisible || this.tooltipVisible;
  }

  get placement() {
    return this.percentageTipsVisible ? 'bottomLeft' : 'topLeft';
  }

  get percentageTipsVisible() {
    return (
      (!this.disabled &&
        this.isPercentage() &&
        this.focused &&
        !this.inputValue.length) ||
      false
    );
  }

  get inputStyle() {
    let left = '11px';
    if (this.focused && this.isMoneyNumber()) {
      if (this.isMobile) {
        if (this.isMoneyNumber().length === 1) {
          left = '11px !important';
        } else {
          left = '28px !important';
        }
      } else {
        if (this.isMoneyNumber().length === 1) {
          left = '22px';
        } else {
          left = '40px';
        }
      }
    }
    return {
      'padding-left': left,
    };
  }

  get inputValue() {
    const val = typeof this.value === 'number' ? this.value.toString() : '';
    return val;
  }

  onFocus(evt: Event) {
    this.focused = true;
    this.$emit('focus', evt);
  }

  onBlur(evt: Event) {
    const inputVal: any = (evt.target as HTMLInputElement).value;
    if (['-', '-0', '-0.'].includes(inputVal)) {
      this.$emit('change', null);
    }

    this.focused = false;
    this.$emit('blur', evt);
    this.tooltipVisible = false;
  }

  stepUp() {
    if (this.value !== null) {
      const val = this.value + this.step;
      this.$emit('change', val);
    }
  }

  stepDown() {
    if (this.value !== null) {
      const val = this.value - this.step;
      this.$emit('change', val);
    }
  }

  // 获取控件数值格式
  getNumberType() {
    const formatList = (conduct as any).properties.format1.options.list;
    const format = this.controlOpts.format1;
    let label: any = '';
    for (let index = 0; index < formatList.length; index++) {
      const element = formatList[index];
      if (element.value === format) {
        label = element.label;
        break;
      }
    }
    return label;
  }

  // 控件是否百分比值
  isPercentage() {
    return this.getNumberType().indexOf('%') > -1;
  }

  // 其他前置符号
  isMoneyNumber() {
    const numberType = this.getNumberType();
    const matchMoney = numberType.match(/^[^\d]+/);
    let res = matchMoney && matchMoney[0];
    if (res === '空') {
      res = '';
    }
    return res;
  }

  onChange(evt: Event) {
    const inputVal: any = (evt.target as HTMLInputElement).value;
    if (['-', '-0', '-0.'].includes(inputVal)) {
      return;
    }
    if (inputVal !== '-' && Number.isNaN(Number(inputVal))) {
      // 输入的不是数值类型
      this.tips = `请输入正确内容`;
      this.tooltipVisible = true;
    } else {
      this.tooltipVisible = false;
    }
    var val = /^-?\d+(\.{1}\d*)?$/.test(inputVal) ? Number(inputVal) : null;
    if (val) {
      const numberType: any = this.getNumberType();
      let decimal = numberType
        ? numberType.split('.')[1]
          ? numberType.split('.')[1].length
          : 0
        : 0;
      const inter = inputVal.split('.');

      if (~numberType.indexOf('%')) {
        // 百分比类型，小数位数量减1
        decimal -= 1;
      }
      if (numberType === '空') {
        const num = inter[1] ? 17 : 16;
        if (inputVal.length > num || (inter[1] && inter[1].length > 8)) {
          this.tips = '最大长度16位，精度8位（8位小数）';
          this.tooltipVisible = true;
          inter[0] = inter[0].slice(0, 16);
          const count = 16 - inter[0].length;
          if (inter[1]) {
            inter[1] = inter[1].slice(0, count > 8 ? 8 : count);
          }
          val = +inter.join('.');
          (evt.target as HTMLInputElement).value = val + '';
        } else {
          this.tooltipVisible = false;
        }
      } else if (decimal) {
        // 控件是小数格式
        const num = inter[1] ? 17 : 16;
        if (inputVal.length > num) {
          this.tips = `最大长度16位，精度${decimal}位（${decimal}位小数)`;
          this.tooltipVisible = true;
          inter[0] = inter[0].slice(0, 16);
          const count = 16 - inter[0].length;
          if (inter[1]) {
            inter[1] = inter[1].slice(0, count > 8 ? 8 : count);
          }
          val = inter.join('.');
          (evt.target as HTMLInputElement).value = val + '';
        } else if (inter[1] && inter[1].length > decimal) {
          this.tips = `小数点后请输入不超过${decimal}位`;
          this.tooltipVisible = true;
          inter[1] = inter[1].slice(0, decimal);
          val = inter.join('.');
          console.log('val小数超位===>', val);
          (evt.target as HTMLInputElement).value = val + '';
          console.log(
            'val小数超位2===>',
            (evt.target as HTMLInputElement).value,
          );
        } else if (inter[0].length > 16) {
          this.tips = '请输入不超过16个数字';
          this.tooltipVisible = true;
          inter[0] = inter[0].slice(0, 16);
          val = inter.join('.');
          (evt.target as HTMLInputElement).value = val + '';
        } else {
          this.tooltipVisible = false;
        }
      } else {
        // 正数最大只能输入 16位
        if (inter[0].length > 16) {
          this.tips = '请输入不超过16个数字';
          this.tooltipVisible = true;
          inter[0] = inter[0].slice(0, 16);
          val = inter.join('.');
          (evt.target as HTMLInputElement).value = val + '';
          console.log(val);
        } else {
          this.tooltipVisible = false;
        }
      }
    }
    this.$emit('change', val);
  }

  mounted() {
    this.$nextTick(() => {
      const input = this.$el.querySelector('input');
      if (input) {
        this.$emit('format', input);
      }
    });
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
.h3-input-number {
  border: 1px solid @border-color;
  border-radius: 2px;
  // transition: all 0.3s;
  // background-color: #fff;
  background-image: none;
  display: inline-block;
  line-height: 1.5;
  height: 32px;
  font-size: 14px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  .percentage {
    position: absolute;
    right: 26px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(0, 0, 0, 0.65);
  }
  .moneyNumber {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(0, 0, 0, 0.65);
  }

  & > input {
    width: 100%;
    height: 30px;
    padding: 0 11px;
    text-align: left;
    background-color: transparent;
    border: 0;
    outline: 0;
    // transition: all 0.3s linear;
    color: @light-color-2;
    font-size: 14px;

    &::-moz-placeholder {
      color: @light-color-4;
    }

    &::-webkit-input-placeholder {
      color: @light-color-4;
    }

    &:-ms-input-placeholder {
      color: @light-color-4;
    }
  }

  &:hover {
    border: 1px solid @primary-color;

    & .h3-input-number-steps {
      opacity: 1;
    }
  }

  &-disabled {
    background: rgb(245, 245, 245);

    & > input {
      cursor: not-allowed;
    }

    &:hover {
      border-color: rgb(217, 217, 217);
    }
  }

  &-focused {
    box-shadow: 0px 0px 0px 2px @primary-light-color;
    border: 1px solid @primary-color;

    & .h3-input-number-steps {
      opacity: 1;
    }
  }

  &-steps {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
    width: 22px;
    display: inline-flex;
    flex-direction: column;
    height: 100%;
    border-radius: 0 @border-radius-base @border-radius-base 0;
    border-left: 1px solid @border-color;
    transition: opacity 0.24s linear 0.1s;
    background: #fff;

    & > span {
      text-align: center;
      height: 50%;
      line-height: 14px;
      cursor: pointer;
      transition: all 0.1s linear;

      &:hover {
        color: @primary-color;
      }

      &:first-child {
        border-bottom: 1px solid @border-color;
      }

      & > i {
        font-size: 12px;
        font-weight: 700;
        transform: scale(0.6);
        display: inline-block;
      }
    }
  }
}
</style>
