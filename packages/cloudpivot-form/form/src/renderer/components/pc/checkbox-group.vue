<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    :class="{
      verticalLayout: layoutType && !ctrl.readonly,
      edit: !ctrl.readonly,
    }"
  >
    <template v-if="!ctrl.readonly">
      <a-radio-group
        v-if="isRadio"
        :value="val"
        :options="options"
        :class="{ vertical: isVertical }"
        @change="onRadioChange"
      />
      <a-checkbox-group
        v-else
        :value="val"
        :options="checkboxOptions"
        :class="{ vertical: isVertical }"
        @change="onChange"
      />
    </template>
    <div v-else class="items">
      <span v-if="isRadio">{{ text }}</span>
      <template v-else>
        {{ text }}
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Checkbox, Radio } from '@h3/antd-vue';
import { Component, Inject } from 'vue-property-decorator';
import { CheckboxGroupControl } from '../../controls';

@Component({
  name: 'checkbox-group',
  components: {
    ARadioGroup: Radio.Group,
    ACheckboxGroup: Checkbox.Group,
  },
})
export default class CheckboxGroup extends CheckboxGroupControl {
  @Inject()
  layoutTypeFn?: () => void;

  get layoutType() {
    if (this.layoutTypeFn) {
      return this.layoutTypeFn();
    }
  }

  onChange(value: string[]) {
    const val = value && value.length > 0 ? value.filter((x) => !!x) : null;
    this.setValue(val);
    super.resetCheckboxOptionDisabled();
  }

  onRadioChange(evt: MouseEvent) {
    const val = (evt.target as HTMLInputElement).value;
    this.setValue(val);
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-radio-group,
/deep/.ant-checkbox-group {
  &.vertical > label {
    display: block;
  }
}
/deep/.ant-radio-group,
/deep/.ant-checkbox-group {
  width: 100%;
}

/deep/.ant-radio-wrapper {
  // overflow: hidden;
  line-height: 32px;
  position: relative;
  top: -4px;
  word-break: break-all;
  span {
    display: inline-flex;
    position: relative;
    white-space: normal;
    top: -1px;
  }
}

/deep/.ant-checkbox-wrapper {
  line-height: 32px;
  position: relative;
  top: -4px;
  // overflow: hidden;
  word-break: break-all;
}

// .items > span::after{
//   // margin-right: 0.5em;
//   content: ';'
// }

.verticalLayout {
  // margin-left: 12px;
}
</style>
