<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="query-conditions-item">
    <div class="query-field">
      <a-select
        v-model="params.propertyCode"
        class="field-select"
        dropdownClassName="field-select-item-list"
        :getPopupContainer="Cus_GetPopupContainer"
        @change="fieldChange"
      >
        <a-select-option
          v-for="(dataItem, idx) in dataItemControls"
          :key="idx"
          :value="dataItem.key"
          class="field-select-item"
        >
          {{ dataItem.options.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="query-type">
      <a-select
        v-model="params.filterType"
        class="option-select"
        dropdownClassName="option-select-item-list"
        :getPopupContainer="Cus_GetPopupContainer"
        @change="filterTypeChange"
      >
        <a-select-option
          v-for="(rule, idx) in ruleList"
          :key="idx"
          :value="rule.value"
        >
          {{ rule.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="query-value">
      <BaseControlAdapter
        v-if="!IsEmpty"
        :key="time"
        class="value-input"
        :control="currentItem"
      />
    </div>
    <div class="delete-field">
      <span
        class="delete-icon aufontAll h-icon-all-delete-o"
        @click="delFieldItem"
      ></span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Provide, Watch } from 'vue-property-decorator';
import BaseControlAdapter from 'cloudpivot-form/form/src/renderer/components/pc/base-control-adapter.vue';
import { Row, Col, Select } from '@h3/antd-vue';
import { getRulesList } from 'cloudpivot-form/form/src/typings/view-filter-type-map';
import { DataItemType } from 'cloudpivot-form/form/schema';
import { formatVal, toFormControl } from './utils/conditions-setter-util';
import { renderer } from 'cloudpivot-form/form';

@Component({
  name: 'query-conditions-item',
  components: {
    BaseControlAdapter,
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class QueryConditionsItem extends Vue {
  @Prop({
    default: () => {
      return {};
    },
  })
  control: any;

  @Prop({
    default: () => {
      return [];
    },
  })
  dataItemControls: any[];

  @Prop() index!: number;

  @Provide()
  findController(key: string | number, rowIndex?: number) {
    return this.CopyCurrentItem;
  }

  get CopyCurrentItem() {
    return { ...this.currentItem };
  }

  time: number = new Date().getTime();

  get ruleList() {
    return getRulesList(this.currentItem.propertyType, this.currentItem.key);
  }

  IsEmpty: boolean = false;

  params: any = {
    propertyCode: '',
    filterType: '',
    propertyType: '',
  };

  StaffSelectorValue: any = null;

  @Provide()
  valueChange(value) {
    this.StaffSelectorValue = value;
  }

  @Watch('ctrlVal')
  onCtrlValChange(val) {}

  get ctrl() {
    return this.currentItem.controller || {};
  }

  get ctrlVal() {
    return this.ctrl.value || this.StaffSelectorValue;
  }

  Cus_GetPopupContainer(triggerNode) {
    return triggerNode.parentNode;
  }

  init(propertyCode) {
    this.currentItem = this.control;
    this.params.propertyCode = propertyCode;
    this.params.filterType = this.currentItem.filterType;
    this.params.propertyType = this.currentItem.propertyType;

    this.IsEmpty = ['IsNotNull', 'IsNull'].includes(this.params.filterType);

    if (
      !['NotBetween', 'Between'].includes(this.currentItem.filterType) &&
      [DataItemType.Date].includes(this.currentItem.propertyType) &&
      this.currentItem.options.defaultValue
    ) {
      this.currentItem.value = new Date(this.currentItem.options.defaultValue);
    }
  }

  created() {
    this.init(this.control.key);
  }

  currentItem: any = ''; // 当前选中的ctrl

  fieldChange(propertyCode) {
    this.$emit('fieldChange', {
      key: propertyCode,
      index: this.index,
      control: this.control,
    });
    this.init(propertyCode);
    // this.$emit('valueChange');
  }

  filterTypeChange(value) {
    this.currentItem.souceField.filterType = value;
    this.onFilterTypeChange(value, this.currentItem.filterType);
    this.conditionChange();
  }

  // @Watch('currentItem.souceField.filterType',{immediate: true})
  onFilterTypeChange(value, oldValue) {
    this.IsEmpty = ['IsNotNull', 'IsNull'].includes(value);

    switch (value) {
      case 'Eq':
      case 'NotEq':
        if (
          [
            DataItemType.Radio,
            DataItemType.Checkbox,
            DataItemType.Dropdown,
            DataItemType.DropdownMulti,
          ].includes(this.currentItem.propertyType)
        ) {
          this.currentItem.souceField.displayType = 3;
        }

        if (oldValue && ['NotBetween', 'Between'].includes(oldValue)) {
          // 从介于、不介于其他切换过来：清空值
          if (
            [DataItemType.Number, DataItemType.Date].includes(
              this.currentItem.propertyType,
            )
          ) {
            this.currentItem.souceField.startValue = '';
          }
        } else {
          if ([DataItemType.Number].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.ctrlVal;
          }
          if ([DataItemType.Date].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.isValidDate(
              this.ctrlVal,
            )
              ? this.ctrlVal
              : this.currentItem.souceField.startValue;
          }
        }

        if (oldValue && ['IsNotNull', 'IsNull'].includes(oldValue)) {
          // 为空、不为空切换过来，值置空
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = [];
          }
        } else {
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = this.ctrlVal;
          }
        }

        break;

      case 'Like':
      case 'NotLike':
        if (
          [
            DataItemType.Radio,
            DataItemType.Checkbox,
            DataItemType.Dropdown,
            DataItemType.DropdownMulti,
          ].includes(this.currentItem.propertyType)
        ) {
          this.currentItem.souceField.displayType = 0;
        }

        if (oldValue && ['IsNotNull', 'IsNull'].includes(oldValue)) {
          // 为空、不为空切换过来，值置空
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = [];
          }
        } else {
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = this.ctrlVal;
          }
        }
        break;

      case 'Between':
      case 'NotBetween':
        if (oldValue && ['NotBetween', 'Between'].includes(oldValue)) {
          // 介于、不介于切换，值不变
          if (
            [DataItemType.Number, DataItemType.Date].includes(
              this.currentItem.propertyType,
            )
          ) {
            this.currentItem.souceField.startValue = this.ctrlVal[0];
            this.currentItem.souceField.endValue = this.ctrlVal[1];
          }
        }
        if (oldValue && !['NotBetween', 'Between'].includes(oldValue)) {
          // 其他切换到 介于、不介于，值置空
          if (
            [DataItemType.Number, DataItemType.Date].includes(
              this.currentItem.propertyType,
            )
          ) {
            this.currentItem.souceField.startValue = '';
            this.currentItem.souceField.endValue = '';
          }
        }
        break;

      case 'Gt':
      case 'Lt':
      case 'Gte':
      case 'Lte':
        if (oldValue && ['NotBetween', 'Between'].includes(oldValue)) {
          // 从介于、不介于其他切换过来：清空值
          if (
            [DataItemType.Number, DataItemType.Date].includes(
              this.currentItem.propertyType,
            )
          ) {
            this.currentItem.souceField.startValue = '';
          }
        } else {
          if ([DataItemType.Number].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.ctrlVal;
          }
          if ([DataItemType.Date].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.isValidDate(
              this.ctrlVal,
            )
              ? this.ctrlVal
              : this.currentItem.souceField.startValue;
          }
        }
        break;

      case 'IsNotNull':
      case 'IsNull':
        if (oldValue && ['IsNotNull', 'IsNull'].includes(oldValue)) {
          // 为空、不为空切换，值不变
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = [];
          }
        }
        if (oldValue && !['IsNotNull', 'IsNull'].includes(oldValue)) {
          // 其他切换到 为空、不为空，值置空
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = [];
          }
        }
        break;

      default:
        break;
    }

    if (
      [
        DataItemType.Radio,
        DataItemType.Checkbox,
        DataItemType.Dropdown,
        DataItemType.DropdownMulti,
        DataItemType.ShortText,

        DataItemType.RelevanceFormEx,
        DataItemType.RelevanceForm,
      ].includes(this.currentItem.propertyType)
    ) {
      // 切换操作符号不不改变当前值
      this.currentItem.souceField.defaultValue = this.ctrlVal;
    }

    const controler: any = this.resetControler(this.currentItem.souceField);
    this.currentItem = controler;

    this.time = new Date().getTime();
    this.conditionChange();
  }

  // 重新生成controler数据
  resetControler(field) {
    const controler: any = toFormControl(field);
    renderer.components.FormRendererHelper.mergeValue([controler], {}, true);
    controler.edit = true;
    return controler;
  }

  isValidDate(date) {
    //判断是否是一个正确的日期格式
    return date instanceof Date && !isNaN(date.getTime());
  }

  getValue() {
    let value = this.ctrlVal;
    if (['IsNotNull', 'IsNull'].includes(this.params.filterType)) {
      value = undefined;
    }
    return {
      queryFilterType: this.params.filterType,
      propertyCode: this.params.propertyCode,
      propertyType: this.params.propertyType,
      propertyValue: formatVal(
        this.params.propertyType,
        value,
        this.params.propertyCode,
        this.params.filterType,
        this.currentItem.options.format,
      ),
    };
  }

  mounted() {
    // this.$emit('valueChange');
  }

  delFieldItem() {
    this.$emit('delFieldItem', this.params.propertyCode, this.index);
  }

  conditionChange() {
    this.$emit('conditionChange', {
      index: this.index,
      control: this.currentItem,
    });
  }
}
</script>
<style lang="less" scoped>
.query-conditions-item {
  display: flex;
  align-items: center;
  .query-field {
    margin-right: 8px;
    width: 206px;
    height: 32px;
    border-radius: 4px;
    .field-select {
      width: 100%;
    }
  }
  .query-type {
    margin-right: 8px;
    width: 88px;
    height: 32px;
    border-radius: 4px;
    .option-select {
      width: 100%;
    }
  }
  .query-value {
    margin-right: 12px;
    width: 206px;
    height: 32px;
    border-radius: 4px;
    .value-input {
      background: #fff;

      &.number {
        display: flex;
        line-height: 32px;
        margin: unset;
        border: 1px solid #d4d5d6;
        border-radius: 2px;
        height: 32px;
        /deep/ .h3-input-number {
          height: 30px;
          border: unset;
          width: 50% !important;
          &:first-child:hover,
          &:first-child.h3-input-number-focused {
            border-right: 1px solid #d4d5d6;
            border-radius: 2px;
          }
        }
        /deep/ .separate {
        }
      }
    }
  }
  .delete-field {
    width: 16px;
    text-align: center;
    .delete-icon {
      font-size: 14px;
      cursor: pointer;
    }
  }
  + .query-conditions-item {
    margin-top: 8px;
  }
}
</style>
