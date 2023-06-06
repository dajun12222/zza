<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-select
    v-model="selected"
    style="width: 100%"
    :mode="multiple"
    @change="onChange"
  >
    <a-select-option
      v-for="(item, index) in selectValue"
      :key="index"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator';
import { Select } from '@h3/antd-vue';

@Component({
  name: 'report-select-simple',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class ReportSelectSimple extends Vue {
  @Model('input', {
    default: () => [],
  })
  value!: any;

  @Prop({
    default: '',
  })
  formula!: string;

  selected: any = '';

  selectValue: any[] = [
    { value: 'DRAFT', label: '草稿' },
    { value: 'PROCESSING', label: '进行中' },
    { value: 'CANCELLED', label: '已取消' },
    { value: 'COMPLETED', label: '已完成' },
    { value: 'CANCELED', label: '已作废' },
  ];

  multiple: string = 'default';

  @Watch('formula', {
    immediate: true,
  })
  onFormulaChange(formula: string) {
    this.selected = '';
    switch (formula) {
      case 'Equal':
      case 'NotEqual':
        this.selected = '';
        this.multiple = 'default';
        break;
      default:
        this.selected = [];
        this.multiple = 'multiple';
        break;
    }
  }

  @Watch('value', {
    immediate: true,
  })
  onValueChange(val) {
    if (val) {
      if (Array.isArray(this.value) && this.value.length > 1) {
        this.selected = this.value.map((i) => i.value);
      } else {
        this.selected = this.value[0].value;
      }
    }
  }

  onChange(values: any) {
    // 返回给报表的数据需要是一个对象，即label/value对象，报表数据会对其进行解析
    let options: any;
    if (Array.isArray(values)) {
      options = this.selectValue.filter((item) => values.includes(item.value));
    } else {
      options = this.selectValue.find((item) => item.value === values);
    }
    this.$emit('input', options);
  }
}
</script>
