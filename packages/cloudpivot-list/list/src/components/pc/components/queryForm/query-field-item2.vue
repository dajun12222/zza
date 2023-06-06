<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="query-field-item"
    :class="{
      disPlays:
        (currentItem.options &&
          currentItem.options.showStyle === 'tree' &&
          currentItem.options.treeView) ||
        (!control.souceField.visible &&
          control.souceField.visible !== undefined),
    }"
  >
    <div class="query-item">
      <div class="item-left">
        <div class="field">
          <span>
            {{ getFieldName(params.propertyCode) }}
          </span>
        </div>
        <div class="filter-type">
          <a-select
            v-model="params.filterType"
            :placeholder="$t('languages.PlaceHolder.Select')"
            class="select"
            :dropdownStyle="{ minWidth: '86px' }"
            @change="filterTypeChange"
          >
            <a-select-option
              v-for="(rule, index) in ruleList"
              :key="index"
              :value="rule.value"
              :title="getRuleName(rule)"
            >
              {{ getRuleName(rule) }}
            </a-select-option>
            <!-- 迭代54需求，部门单选控件设置“作为查询条件”属性为true时，需新增“属于/不属于”类型查询方式 -->
            <!-- <template v-for="(rule, index) in ruleList">
              <a-select-option
                v-if="ifDisplayOption(params.propertyCode, rule.value)"
                :key="index"
                :value="rule.value"
                :title="getRuleName(rule)"
              >
                {{ getRuleName(rule) }}
              </a-select-option>
            </template> -->
          </a-select>
        </div>
      </div>
      <div v-if="!IsEmpty" class="value item-right">
        <BaseControlAdapter :key="time" :control="currentItem" />
      </div>
    </div>
    <div class="delete-item-icon">
      <span
        class="icon aufontAll"
        :title="`${$t('cloudpivot.list.pc.filterBox.delete')}`"
        @click="delFieldItem"
        >&#xec54;</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Select } from '@h3/antd-vue';
import BaseControlAdapter from 'cloudpivot-form/form/src/renderer/components/pc/base-control-adapter.vue';
import {
  getRulesLisForRelevance,
  getRulesList,
} from 'cloudpivot-form/form/src/typings/view-filter-type-map';
import zhToEn from 'cloudpivot-list/list/src/components/pc/locales/zhToEn';
import { Component, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import { renderer } from 'cloudpivot-form/form';
import { DataItemType } from 'cloudpivot-form/form/schema';
import { formatVal, toFormControl } from './query-form-util';

@Component({
  name: 'query-field-item',
  components: {
    BaseControlAdapter,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class queryFieldItem extends Vue {
  @Prop() control!: any;

  @Prop() controls!: any[];

  @Prop() index!: number;

  @Prop() isRelevance!: boolean;

  // @Prop({ default: [] }) filterCtrt!: any[];
  filterCtrt: any[] = [];

  @Provide()
  findController(key: string | number, rowIndex?: number) {
    if (key !== this.CopyCurrentItem.key) {
      this.$emit('filterChange', { key1: key, index: this.index });
      if (this.filterCtrt.length > 0) {
        return this.filterCtrt[0];
      }
    }
    return this.CopyCurrentItem;
  }

  StaffSelectorValue: any = null;

  time: number = new Date().getTime();

  @Provide()
  valueChange(value) {
    this.StaffSelectorValue = value;
  }

  get CopyCurrentItem() {
    return { ...this.currentItem };
  }

  delFieldItem() {
    this.$emit('delFieldItem', this.params.propertyCode);
  }

  IsEmpty: boolean = false;

  params: any = {
    propertyCode: '',
    filterType: '',
    propertyType: '',
  };

  get ctrl() {
    return this.currentItem.controller || {};
  }

  get ctrlVal() {
    return {
      key: this.ctrl.key,
      value: this.ctrl.value || this.StaffSelectorValue,
    };
  }

  getFieldName(propertyCode: string) {
    const lang = this.$i18n.locale;
    const ctrl = this.controls.find((item: any) => {
      return item.key === propertyCode;
    });
    let name =
      ctrl.options &&
      (lang === 'zh' ? ctrl.options.name : zhToEn[ctrl.options.name]);
    const name_i18n_JSON = ctrl.options && ctrl.options.name_i18n;
    if (name_i18n_JSON) {
      const name_i18n = JSON.parse(name_i18n_JSON);
      if (name_i18n[lang]) {
        name =
          lang === 'zh'
            ? name_i18n[lang]
            : zhToEn[name_i18n[lang]] || name_i18n[lang];
      }
    }
    return name;
  }

  // 迭代54需求，部门单选控件设置“作为查询条件”属性为true时，需新增“属于/不属于”类型查询方式
  // ifDisplayOption(propertyCode: string, value: string) {
  //   const ctrl = this.controls.find((item: any) => {
  //     return item.key === propertyCode;
  //   });
  //   const { souceField, key } = ctrl;
  //   if (ctrl.type === DataItemType.DeptSingle) {
  //     return (
  //       ['createdDeptId', 'ownerDeptId'].includes(key) ||
  //       !['Of', 'NotOf'].includes(value) ||
  //       (['Of', 'NotOf'].includes(value) && souceField.backupQueryCode)
  //     );
  //   } else {
  //     return true;
  //   }
  // }

  getRuleName(rule) {
    const lang = this.$i18n.locale;
    let name = rule.name;
    const name_i18n_JSON = rule.name_i18n;
    if (name_i18n_JSON) {
      const name_i18n = JSON.parse(name_i18n_JSON);
      if (name_i18n[lang]) {
        name = name_i18n[lang];
      }
    }
    return name;
  }

  @Watch('ctrlVal')
  onCtrlValChange(val, oldValue) {
    if (val.key === oldValue.key && val.value !== oldValue.value) {
      // 日期需要修改sourceField中的endValue与startValue
      this.updateSourceField(val.value);
      this.$emit('valueChange');
    }
  }

  fieldChange(propertyCode) {
    this.$emit('fieldChange', {
      key: propertyCode,
      index: this.index,
      control: this.control,
    });
    this.init(propertyCode);
  }

  isValidDate(date) {
    //判断是否是一个正确的日期格式
    return date instanceof Date && !isNaN(date.getTime());
  }

  @Watch('currentItem.souceField.filterType')
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
          // 工单——#105129 20230224--关联单选弹出框下拉数据项作为查询条件不是下拉框-建发-6.11/6.12/develop  https://rdmp.authine.cn/project/#/team/LSY1vbUE/task/SDocKmVzb10a33d2
          // if (this.$route.name === 'form-detail') {
          //   // 关联表单的查询条件中涉及到下拉框单选多选、单选、复选时，无论设置的常量还是变量，在组合查询运行时都展示为输入框
          //   this.currentItem.souceField.displayType = 0;
          // } else {
          this.currentItem.souceField.displayType = 3;
          // }
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
            this.currentItem.souceField.startValue = this.ctrlVal.value;
          }
          if ([DataItemType.Date].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.isValidDate(
              this.ctrlVal.value,
            )
              ? this.ctrlVal.value
              : this.currentItem.souceField.startValue;
          }
        }

        if (oldValue && ['IsNotNull', 'IsNull'].includes(oldValue)) {
          // 为空、不为空切换过来，值置空
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = [];
          } else if (
            [DataItemType.DeptSingle].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = this.ctrlVal.value;
          } else {
            //Else Empty block statement
          }
        } else {
          if (
            [
              DataItemType.StaffMulti,
              DataItemType.DeptSingle,
              DataItemType.DeptMulti,
              DataItemType.StaffDeptMix,
              DataItemType.StaffSingle,
              DataItemType.Logic,
            ].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = this.ctrlVal.value;
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
            this.currentItem.souceField.defaultValue = this.ctrlVal.value;
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
            this.currentItem.souceField.startValue = this.ctrlVal.value[0];
            this.currentItem.souceField.endValue = this.ctrlVal.value[1];
          }
        } else if (oldValue && !['NotBetween', 'Between'].includes(oldValue)) {
          // 其他切换到 介于、不介于，值置空
          if (
            [DataItemType.Number, DataItemType.Date].includes(
              this.currentItem.propertyType,
            )
          ) {
            this.currentItem.souceField.startValue = '';
            this.currentItem.souceField.endValue = '';
          }
        } else {
          if ([DataItemType.Number].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.ctrlVal.value[0];
            this.currentItem.souceField.endValue = this.ctrlVal.value[1];
          }
          if (
            [DataItemType.Date].includes(this.currentItem.propertyType) &&
            Array.isArray(this.ctrlVal.value) &&
            this.ctrlVal.value[0] &&
            this.ctrlVal.value[1]
          ) {
            const ctrlVal = [
              new Date(this.ctrlVal.value[0]),
              new Date(this.ctrlVal.value[1]),
            ];
            this.currentItem.souceField.startValue = this.isValidDate(
              ctrlVal[0],
            )
              ? this.ctrlVal.value[0]
              : this.currentItem.souceField.startValue;
            this.currentItem.souceField.endValue = this.isValidDate(ctrlVal[1])
              ? this.ctrlVal.value[1]
              : this.currentItem.souceField.endValue;
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
            this.currentItem.souceField.startValue = this.ctrlVal.value;
          }
          if ([DataItemType.Date].includes(this.currentItem.propertyType)) {
            this.currentItem.souceField.startValue = this.isValidDate(
              this.ctrlVal.value,
            )
              ? this.ctrlVal.value
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
      case 'Of':
      case 'NotOf':
        //解决拥有者部门查询不生效问题
        if (!oldValue) {
          if (
            [DataItemType.DeptSingle].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = this.ctrlVal.value;
          }
        }
        if (oldValue && ['IsNotNull', 'IsNull'].includes(oldValue)) {
          // 其他切换到 为空、不为空，保持原来值
          if (
            [DataItemType.DeptSingle].includes(this.currentItem.propertyType)
          ) {
            this.currentItem.souceField.defaultValue = this.ctrlVal.value;
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
        DataItemType.Address,
        DataItemType.RelevanceFormEx,
        DataItemType.RelevanceForm,
      ].includes(this.currentItem.propertyType)
    ) {
      // 切换操作符号不不改变当前值
      this.currentItem.souceField.defaultValue = this.ctrlVal.value;
    }

    const controler: any = this.resetControler(this.currentItem.souceField);

    // 工单——#105129 20230224--关联单选弹出框下拉数据项作为查询条件不是下拉框-建发-6.11/6.12/develop  https://rdmp.authine.cn/project/#/team/LSY1vbUE/task/SDocKmVzb10a33d2
    // if (this.isRelevance) {
    //   if (['NotEq', 'Eq'].includes(value)) {
    //     if (
    //       [DataItemType.Checkbox, DataItemType.Radio].includes(
    //         this.currentItem.propertyType,
    //       )
    //     ) {
    //       controler.type = renderer.FormControlType.Text;
    //       if (Array.isArray(controler.options.defaultValue)) {
    //         controler.options.defaultValue =
    //           controler.options.defaultValue.join(';');
    //       }
    //       this.ctrl.value = controler.options.defaultValue;
    //       controler.value = controler.options.defaultValue;
    //     }
    //   }
    //   if (
    //     ['NotLike', 'Like'].includes(value) &&
    //     [
    //       DataItemType.Radio,
    //       DataItemType.Checkbox,
    //       DataItemType.Dropdown,
    //       DataItemType.DropdownMulti,
    //     ].includes(this.currentItem.propertyType)
    //   ) {
    //     controler.type = renderer.FormControlType.Text;
    //     if (Array.isArray(controler.options.defaultValue)) {
    //       controler.options.defaultValue =
    //         controler.options.defaultValue.join(';');
    //     }
    //     this.ctrl.value = controler.options.defaultValue;
    //     controler.value = controler.options.defaultValue;
    //   }
    // }

    if (
      !(
        this.control.propertyType === DataItemType.Date &&
        isNaN(Date.parse(this.control.value))
      ) &&
      !(
        ['NotBetween', 'Between'].includes(this.control.filterType) &&
        !Array.isArray(this.control.value)
      )
    ) {
      controler.value = this.control.value;
    }
    this.currentItem = controler;

    this.time = new Date().getTime();
  }

  filterTypeChange(value) {
    this.currentItem.souceField.filterType = value;
    this.$emit('valueChange');
  }

  getValue() {
    let value = this.ctrlVal.value;
    if (['IsNotNull', 'IsNull'].includes(this.params.filterType)) {
      value = undefined;
    }
    if (Array.isArray(value) && !value.length) {
      value = null;
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

  clearValue() {
    if (this.currentItem.controller.souceField) {
      this.currentItem.controller.souceField.startValue = null;
      this.currentItem.controller.souceField.endValue = null;
    }
    this.currentItem.controller.value = null;
    this.StaffSelectorValue = null;
    this.time = new Date().getTime();
  }

  getControler() {
    const res = JSON.parse(JSON.stringify(this.currentItem));
    res.filterType = this.params.filterType;
    res.value = this.ctrlVal.value;

    delete res.controller;
    return res;
  }

  // 重新生成controler数据
  resetControler(field) {
    const controler: any = toFormControl(field);
    renderer.components.FormRendererHelper.mergeValue([controler], {}, true);
    controler.edit = true;
    return controler;
  }

  init(propertyCode) {
    this.currentItem = this.controls.find((el) => el.key === propertyCode);
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

  get ruleList() {
    return (this.isRelevance ? getRulesLisForRelevance : getRulesList)(
      this.currentItem.propertyType,
      this.params.propertyCode,
    );
  }

  mounted() {}

  /**
   * 值改变时更新sourceField
   */
  updateSourceField(newVal) {
    if (
      [DataItemType.Date].includes(this.currentItem.propertyType) &&
      this.currentItem.souceField &&
      newVal
    ) {
      this.currentItem.souceField.startValue = newVal[0];
      this.currentItem.souceField.endValue = newVal[1];
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.query-field-item {
  display: flex;
  // align-items: center;
  padding-top: 12px;
  padding-left: 24px;
  padding-right: 18px;

  .query-item {
    .item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
      width: 272px;
      .field {
        // flex: 160;
        // min-width: 160px;
        // margin-right: 8px;
        padding: 0;
        height: 20px;
        font-size: 12px;
        font-weight: 600;
        color: #111218;
        line-height: 20px;
      }
      .filter-type {
        // flex: 100;
        // min-width: 100px;
        // margin-right: 8px;
        /deep/.ant-select-selection--single {
          height: 24px;
          border: unset;
          box-shadow: unset;
          .ant-select-selection__rendered {
            height: 20px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(17, 18, 24, 0.5);
            line-height: 20px;
            margin-top: 2px;
            margin-bottom: 2px;
            &:hover {
              color: @hoverColor;
            }
            .ant-select-selection-selected-value {
              height: 20px;
            }
          }
          .ant-select-arrow {
            right: 8px;
            margin-top: -7px;
            &:hover {
              color: @hoverColor;
            }
          }
        }
        /deep/.filter-type-list {
          min-width: 86px;
        }
      }
    }

    .item-right {
      &.value {
        width: 272px;
      }
    }
  }

  .delete-item-icon {
    margin-left: 8px;
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(17, 18, 24, 0.5);
    &:hover {
      cursor: pointer;
      color: @hoverColor;
    }
  }

  /deep/.ant-select {
    width: 100%;
  }
}
.disPlays {
  display: none;
}
</style>
