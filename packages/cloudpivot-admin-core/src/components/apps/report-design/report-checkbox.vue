<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="report-checkbox">
    <a-radio-group v-model="inputType" class="inputType" @change="changeType">
      <a-radio :value="1"> 输入文本 </a-radio>
      <a-radio :value="2"> 选择选项 </a-radio>
    </a-radio-group>
    <a-input v-if="inputType === 1" v-model="inputValue" placeholder="请输入" />
    <a-select
      v-else-if="inputType === 2"
      v-model="currentValue"
      showSearch
      style="width: 100%"
      placeholder="请选择"
      :mode="mode"
      optionFilterProp="children"
      :filterOption="filterOption"
      @change="onChange"
    >
      <!-- <a-select-option :disabled="true" v-if="hasEmpty" key ><span style="color: #bfbfbf;">{{
        emptyValue
      }}</span></a-select-option> -->

      <template v-for="opt in options">
        <a-select-option v-if="typeof opt !== 'object'" :key="opt">
          <span :title="opt" class="select-drop-item">{{ opt }}</span>
        </a-select-option>
        <a-select-option v-else-if="typeof opt === 'object'" :key="opt.name">
          <span :title="opt" class="select-drop-item">{{ opt.name }}</span>
        </a-select-option>
      </template>
    </a-select>
  </div>
</template>

<script lang="ts">
import { DataItemType } from 'cloudpivot-form/form/schema';
import { Input, Radio, Select, Tooltip } from '@h3/antd-vue';
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';
import appsApi from '../../../apis/apps';

@Component({
  name: 'report-dropdown',
  components: {
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    AInput: Input,
  },
})
export default class ReportDropdown extends Vue {
  @Prop({
    default() {
      return [];
    },
  })
  value!: any[];

  @Model('change')
  @Prop({
    default: () => ({}),
  })
  field!: any;

  @Prop({
    default: '',
  })
  formula!: string;

  inputType: number = 1;

  get mode() {
    if (this.isMultiple) {
      return 'multiple';
    }
    return 'default';
  }

  get isMultiple() {
    return (
      ['In', 'NotIn'].includes(this.formula) ||
      this.field.dataType === DataItemType.Checkbox ||
      this.field.dataType === DataItemType.DropdownMulti
    );
  }

  get inputValue() {
    return this.value.join(';');
  }

  set inputValue(value) {
    const theValue = value.split(';');
    this.$emit('input', theValue);
  }

  get currentValue() {
    return this.value;
  }

  set currentValue(value) {
    this.$emit('input', value);
  }

  created() {
    this.init();
  }

  @Watch('field')
  update() {
    this.init();
  }

  changeType() {
    if (this.inputType === 1) {
      console.log(this.value);
    } else if (this.inputType === 2) {
      this.init();
    } else {
      console.log(this.value);
    }
  }

  async init() {
    const vm: any = this;
    const params = {
      schemaCode: this.field.schemaCode,
    };
    appsApi.getDataItemList(params).then((res) => {
      const data = res.data;
      if (Array.isArray(data)) {
        const item = data.filter((i: any) => {
          return i.code === vm.field.field;
        });
        const options = JSON.parse(item[0].options);
        if (!/^(\{).*(\})$/.test(options.options)) {
          vm.options = options.options.split(';');
        } else {
          vm.options = JSON.parse(options.options).useDictionariesData;
        }
      } else {
        return;
      }
    });
  }

  options: any[] = [];

  onChange(val: any[]) {
    console.log('onChange', val);
  }

  filterOption(input: any, option: any) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }
}
</script>

<style lang="less">
.report-checkbox {
  .inputType {
    margin-bottom: 10px;
  }
}
</style>
