<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="set-list-symbol">
    <a-radio-group v-model="selectValue" name="radioGroup">
      <template v-for="(item, index) in groupOptions">
        <a-radio :key="index" :value="item.value" :class="item.value">{{
          item.name
        }}</a-radio>
      </template>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import { Input, Icon, Upload, Popover, Radio } from '@h3/antd-vue';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

@Component({
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
  },
})
export default class DisplayField extends Mixins(PropertyComponent) {
  selectValue: string = '';

  groupOptions: any = [
    {
      value: 'noIcon',
      name: '无符号',
    },
    {
      value: 'dot',
      name: '圆点',
    },
    {
      value: 'diamond',
      name: '菱形',
    },
  ];

  @Watch('selectValue')
  symbolChange() {
    this.emitChange(this.selectValue);
  }

  created() {
    this.selectValue = this.groupCtrl?.value as any;
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    this.selectValue = val;
  }
}
</script>

<style lang="less" scoped>
.set-list-symbol {
  /deep/span.ant-radio {
    display: none !important;
  }
  /deep/.ant-radio-wrapper {
    display: inline-block;
    width: 64px;
    height: 28px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d4d5d6;
    text-align: center;
    line-height: 28px;
    > span {
      display: inline-block;
      height: 22px;
      font-size: 13px;
      font-weight: 400;
      color: #111218;
      line-height: 22px;
      position: relative;
    }
    &.ant-radio-wrapper-checked {
      border-color: #2970ff;
    }
    &.dot span {
      counter-reset: dot 2;
      padding-left: 21px;
      &::before {
        position: absolute;
        left: 7px;
        content: counter(dot, disc) ' ';
        font-size: 24px;
        top: -2px;
        color: #111218;
        display: inline-block;
      }
    }
    &.diamond span {
      counter-reset: diamond 2;
      padding-left: 21px;
      &::before {
        position: absolute;
        left: 7px;
        content: counter(diamond, square) ' ';
        font-size: 12px;
        color: #111218;
        transform: scale(0.6) rotate(45deg);
      }
    }
  }
}
</style>
