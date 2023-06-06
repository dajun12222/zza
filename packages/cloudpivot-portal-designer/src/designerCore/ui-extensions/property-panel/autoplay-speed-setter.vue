<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="autoplay-speed-setter">
    <a-input-number
      v-model="playSpeed"
      class="autoplay-speed-input"
      :min="1"
      :max="60"
      @change="playSpeedChange"
    />
    <span class="autoplay-speed-text">秒</span>
    <div v-if="inputErr" class="err-tips">
      <span>请输入1-60范围内的整数</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';
import { InputNumber } from '@h3/antd-vue';

@Component({
  name: 'autoplay-speed-setter',
  components: {
    AInputNumber: InputNumber,
  },
})
export default class AutoplaySpeedSetter extends Mixins(PropertyComponent) {
  playSpeed: number = 0;

  // 是否展示输入超出范围提示
  inputErr: boolean = false;

  created() {
    this.playSpeed = (this.groupCtrl?.value as any) / 1000 || 3;
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange() {
    this.playSpeed = (this.groupCtrl?.value as any) / 1000 || 3;
  }

  valueChange(value) {
    this.emitChange(value);
  }

  playSpeedChange(value) {
    if (!value && value !== 0) {
      value = 1;
    }
    if (value < 1 || value > 60) {
      this.inputErr = true;
      return;
    } else {
      this.inputErr = false;
    }
    value = Math.round(value);
    this.playSpeed = value;
    this.valueChange(value * 1000);
  }
}
</script>
<style lang="less" scoped>
.autoplay-speed-setter {
  display: flex;
  align-items: center;
  position: relative;
  .autoplay-speed-input {
    width: 100%;
    height: 30px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d4d5d6;
    /deep/.ant-input-number-input {
      height: 28px;
    }
  }
  .autoplay-speed-text {
    display: inline-block;
    margin-left: 12px;
    height: 22px;
    font-size: 13px;
    font-weight: 400;
    color: #111218;
    line-height: 22px;
  }
  .err-tips {
    position: absolute;
    top: 34px;
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #f0353f;
    line-height: 20px;
  }
}
</style>
