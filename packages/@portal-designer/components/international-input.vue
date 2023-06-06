<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-input v-model="value" @change="onChange" />
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Input } from '@h3/antd-vue';

interface ValueI18n {
  zh?: string;
  en?: string;
}

@Component({
  name: 'international-input',
  components: {
    AInput: Input,
  },
})
export default class InternationalInput extends Vue {
  @Prop({ default: () => {} })
  valueI18n: ValueI18n;

  @Prop({ default: 30 })
  maxLength?: number;

  value: string = '';

  mounted() {
    this.value = this.valueI18n[this.$i18n.locale];
  }

  @Watch('$i18n.locale', { immediate: true })
  localeChange(val) {
    this.value = this.valueI18n[this.$i18n.locale];
  }

  onChange() {
    const valueI18n = JSON.parse(JSON.stringify(this.valueI18n));
    let index = 0;
    let realLength = 0;
    while (realLength <= this.maxLength && index < this.value.length) {
      const charCode = this.value.charCodeAt(index);
      if (charCode >= 0 && charCode <= 128) {
        realLength += 1;
      } else {
        realLength += 2;
      }
      if (realLength > this.maxLength) {
        break;
      } else {
        index++;
      }
    }
    this.value = this.value.slice(0, index);
    valueI18n[this.$i18n.locale] = this.value;
    this.$emit('valueChange', valueI18n);
  }
}
</script>
