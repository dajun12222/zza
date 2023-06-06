<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    :style="customStyle ? customStyle.bgStyle : ''"
    class="data-range-setting-wrap"
  >
    <a-row class="mappingHeader" type="flex" justify="space-between">
      <a-col :span="7" class="fieldlab"> 数据名称 </a-col>
      <a-col :span="3" class="fieldlab"> 对比方式 </a-col>
      <a-col :span="3" class="fieldlab"> 值类型 </a-col>
      <a-col :span="7" class="fieldlab"> 当前模型字段/值 </a-col>
      <a-col :span="1" class="fieldlab" :style="{ visibility: 'hidden' }">
        删除
      </a-col>
    </a-row>
    <a-row
      v-for="(cond, index) in conditions"
      :key="index"
      type="flex"
      justify="space-between"
    >
      <a-col :span="7">
        <a-select
          v-model="cond.propertyCode"
          showSearch
          :filterOption="filterOption"
          @select="(e) => onItemSelect(cond)"
          @change="(e) => onItemChange(cond, index)"
        >
          <a-select-opt-group>
            <span slot="label" class="select-title">业务数据项</span>
            <template v-for="(i, key) in dataOptions">
              <a-select-option
                v-if="!i.isSystem"
                :key="key"
                :title="i.label"
                :value="i.value"
                :disabled="i.disabled"
              >
                {{ i.label }}
              </a-select-option>
            </template>
          </a-select-opt-group>

          <a-select-opt-group>
            <span slot="label" class="select-title">系统数据项</span>

            <template v-for="(i, key) in dataOptions">
              <a-select-option
                v-if="i.isSystem"
                :key="key"
                :title="i.label"
                :value="i.value"
                :disabled="i.disabled"
              >
                {{ i.label }}
              </a-select-option>
            </template>
          </a-select-opt-group>
        </a-select>
      </a-col>

      <a-col :span="3">
        <a-select
          v-model="cond.operatorType"
          :options="getOperators(cond.propertyType, cond.propertyCode)"
          @change="operatorTypeChange(cond)"
        />
      </a-col>

      <a-col v-show="!operatorAboutNull(cond.operatorType)" :span="3">
        <a-select
          v-model="cond.valueType"
          :options="
            cond.valueTypeShow
              ? staffDataItemValueTypeX
              : isRelevanceForm(cond.propertyType)
              ? staffDataItemValueTypeY
              : staffDataItemValueType
          "
          @change="onTypeChange(cond)"
          @dropdownVisibleChange="dropdownVisibleChange(index)"
        />
      </a-col>

      <a-col v-show="operatorAboutNull(cond.operatorType)" :span="3" />
      <a-col v-show="operatorAboutNull(cond.operatorType)" :span="7" />
      <template v-if="!operatorAboutNull(cond.operatorType)">
        <a-col v-if="cond.valueType === 'FIXED'" :span="7">
          <a-config-provider :locale="locale">
            <a-select
              v-if="isSequenceStatus(cond.propertyCode)"
              v-model="cond.value"
              :getPopupContainer="getPopupContainer"
            >
              <!-- <a-select-option :value="'DRAFT'"> 草稿 </a-select-option> -->
              <a-select-option :value="'PROCESSING'"> 进行中 </a-select-option>
              <a-select-option :value="'CANCELED'"> 已取消 </a-select-option>
              <a-select-option :value="'COMPLETED'"> 已完成 </a-select-option>
            </a-select>

            <a-input
              v-else-if="isText(cond.propertyType) || isTime(cond.propertyType)"
              v-model="cond.value"
              :placeholder="
                isDate(cond.propertyType)
                  ? '日期格式2019-05-10 12:00:00'
                  : isTime(cond.propertyType)
                  ? '时间格式12:00:00'
                  : [7, 8].includes(cond.operatorType)
                  ? '请输入，多个值以“;”连接'
                  : '请输入'
              "
              @change="onChange"
            />

            <a-input-group
              v-else-if="
                isNumber(cond.propertyType) && isBetween(cond.operatorType)
              "
              compact
              style="display: flex"
              @change="(d) => onNumberChange(cond, d)"
            >
              <a-input-number
                id="groupNumber0"
                v-model="cond.value[0]"
                style="flex: 1; text-align: center; border-right: 0"
              />
              <span
                style="
                  width: 30px;
                  height: 32px;
                  line-height: 30px;
                  text-align: center;
                  background-color: #fff;
                  border: 1px solid #d9d9d9;
                  color: #a0a0a0;
                "
                >~</span>
              <a-input-number
                id="groupNumber1"
                v-model="cond.value[1]"
                style="flex: 1; text-align: center; border-left: 0"
              />
            </a-input-group>

            <a-input-number
              v-else-if="isNumber(cond.propertyType)"
              v-model="cond.value"
              @change="onChange"
            />

            <a-range-picker
              v-else-if="
                isDate(cond.propertyType) && isBetween(cond.operatorType)
              "
              v-model="cond.value"
              :ranges="pickerRanges"
              @change="(d, ds) => onDateChange(cond, ds)"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>

            <a-date-picker
              v-else-if="
                isDate(cond.propertyType) && !isBetween(cond.operatorType)
              "
              :defaultValue="cond.value"
              @change="(d, ds) => onDateChange(cond, ds)"
            />

            <a-select
              v-else-if="isLogic(cond.propertyType)"
              v-model="cond.value"
              :getPopupContainer="getPopupContainer"
            >
              <a-select-option :value="1"> 是 </a-select-option>
              <a-select-option :value="0"> 否 </a-select-option>
              <a-select-option :value="2"> 全部 </a-select-option>
            </a-select>

            <!-- 地址 -->
            <pca-selector
              v-else-if="isAddress(cond.propertyType)"
              v-model="cond.value"
              :format="'pp-cc-aa'"
              :showEmpty="true"
              @change="onChange"
            />

            <!-- isSequenceStatus -->

            <staff-selector
              v-else-if="isStaffSelector(cond.propertyType)"
              v-model="cond.value"
              :options="getStaffSelectorOpts(cond)"
              :showDetail="true"
              @change="onChange"
            />
          </a-config-provider>
        </a-col>
        <a-col v-else :span="7">
          <a-select
            v-if="isDate(cond.propertyType) && isBetween(cond.operatorType)"
            v-model="cond.value"
            defaultValue="1"
            placeholder="请选择"
          >
            <a-select-option
              v-for="(option, key) in QueryDateTypeList"
              :key="key"
              :value="option.type"
            >
              {{ $t(`languages.Apps.ListControl.${option.text}`) }}
            </a-select-option>
          </a-select>
          <a-select
            v-else
            v-model="cond.currentPropertyCode"
            showSearch
            @dropdownVisibleChange="dropdownVisibleChange(index)"
          >
            <a-select-opt-group>
              <span slot="label" class="select-title">业务数据项</span>
              <template v-for="(i, key) in currentdataOptions">
                <a-select-option
                  v-if="!i.isSystem && !i.disabled"
                  :key="key"
                  :title="i.label"
                  :value="i.value"
                >
                  {{ i.label }}
                </a-select-option>
              </template>
            </a-select-opt-group>

            <a-select-opt-group>
              <span slot="label" class="select-title">系统数据项</span>

              <template v-for="(i, key) in currentdataOptions">
                <a-select-option
                  v-if="i.isSystem && !i.disabled"
                  :key="key"
                  :title="i.label"
                  :value="i.value"
                >
                  {{ i.label }}
                </a-select-option>
              </template>
            </a-select-opt-group>
          </a-select>
        </a-col>
      </template>

      <a-col :span="1">
        <a-icon type="delete" @click="remove(index)" />
      </a-col>
    </a-row>

    <div v-if="dataOptions.length" class="add">
      <span>
        <span>
          <i class="icon aufontAll h-icon-all-plus-o"></i>
        </span>
        <span @click="addAndConditions">添加且条件</span>
        <!-- <a-icon type="delete" @click="deleteOr" /> -->
      </span>
    </div>
    <div v-else class="message">请检查是否配置了业务模型</div>
  </div>
</template>

<script lang="ts">
import {
  Col,
  Row,
  Select,
  ConfigProvider,
  Icon,
  Input,
  InputNumber,
  DatePicker,
} from '@h3/antd-vue';
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';
import { DataItemType } from '../.././schema';
import StaffSelector from '../components/form-staff-selector/pc/staff-selector.vue';
import * as dataitemStore from '../../stores/data-items.store-helper';
import zhCN from '@h3/antd-vue/lib/locale-provider/zh_CN';
import enUS from '@h3/antd-vue/lib/locale-provider/en_US';
import pcaSelector from 'cloudpivot-form/form/src/common/components/pca-selector/pca-selector.vue';
import {
  DataItem,
  DateItemOperatorType,
  logicDataItemOperators,
  numberDataItemOperators,
  relevanceFormDataItemOperators,
  sequenceStatusOperators,
  staffDataItemOperators,
  textDataItemOperators,
} from './data-item2';
import { QueryDateTypeList } from '../../schema/query-type';
import moment from 'moment';

export interface DataitemConditionItem {
  propertyCode: string;

  propertyType: DataItemType;

  currentPropertyCode?: string;

  operatorType: DateItemOperatorType;

  valueType: string;

  valueTypeShow?: boolean;

  value: any;
}

export interface DataitemConditionValue {
  type: number;

  conditions: DataitemConditionItem[];
}

@Component({
  name: 'dataitem-condition',
  components: {
    StaffSelector,
    ASelect: Select,
    ARow: Row,
    ACol: Col,
    ASelectOption: Select.Option,
    ASelectOptGroup: Select.OptGroup,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    ADatePicker: DatePicker,
    ARangePicker: DatePicker.RangePicker,
    AConfigProvider: ConfigProvider,
    pcaSelector,
  },
})
export default class DataitemCondition extends Vue {
  @Prop()
  items!: Array<DataItem>;

  @Prop()
  customStyle!: Object;

  @Model('change')
  value!: DataitemConditionValue;

  @Prop()
  dataItems!: any;

  conditions: DataitemConditionItem[] = [];

  get locale() {
    switch (this.$i18n.locale) {
      case 'en':
        return enUS;
      case 'zh':
      default:
        return zhCN;
    }
  }

  get QueryDateTypeList() {
    return QueryDateTypeList.filter((item) => item.type !== 0);
  }

  dataOptions: {
    label: string;
    value: string;
    type: DataItemType;
    disabled: boolean;
  }[] = [];

  currentdataOptions: {
    label: string;
    value: string;
    type: DataItemType;
    disabled: boolean;
    isSystem: boolean;
  }[] = []; //当前模型表单数据项

  staffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    mulpitle: true,
    showModel: true,
    showSelect: true,
    placeholder: '',
  };

  /**
   * 关联表单数据限定范围值类型
   */
  staffDataItemValueType = [
    {
      label: '固定值',
      value: 'FIXED',
    },
    {
      label: '动态值',
      value: 'DYNAMIC',
    },
  ];

  staffDataItemValueTypeX = [
    {
      label: '固定值',
      value: 'FIXED',
    },
  ];

  staffDataItemValueTypeY = [
    {
      label: '动态值',
      value: 'DYNAMIC',
    },
  ];

  getStaffSelectorOpts(cond: DataitemConditionItem) {
    const obj = {
      selectOrg: true,
      selectUser: true,
      mulpitle: true,
      showModel: true,
      showSelect: true,
      placeholder: '请选择',
    };
    switch (cond.propertyType) {
      case DataItemType.StaffSingle:
        obj.selectOrg = false;
        obj.selectUser = true;
        obj.mulpitle = false;
        if ([16, 15].includes(cond.operatorType)) {
          // 位于/不位于
          obj.mulpitle = true;
        }
        if ([11, 12].includes(cond.operatorType)) {
          // 属于/不属于
          obj.mulpitle = true;
          obj.selectUser = false;
          obj.selectOrg = true;
        }
        break;
      case DataItemType.StaffMulti:
        obj.selectOrg = false;
        obj.selectUser = true;
        obj.mulpitle = true;
        if ([11, 12].includes(cond.operatorType)) {
          // 属于/不属于
          obj.mulpitle = true;
          obj.selectUser = false;
          obj.selectOrg = true;
        }
        break;
      case DataItemType.DeptSingle:
        obj.selectOrg = true;
        obj.selectUser = false;
        obj.mulpitle = false;
        if ([16, 15].includes(cond.operatorType)) {
          // 位于/不位于
          obj.mulpitle = true;
        }
        if ([11, 12].includes(cond.operatorType)) {
          // 属于/不属于
          obj.mulpitle = true;
        }
        if ([13, 14].includes(cond.operatorType)) {
          // 拥有/不拥有
          obj.mulpitle = true;
          obj.selectUser = true;
        }
        break;
      case DataItemType.DeptMulti:
        obj.selectOrg = true;
        obj.selectUser = false;
        obj.mulpitle = true;
        if ([13, 14].includes(cond.operatorType)) {
          // 拥有/不拥有
          obj.mulpitle = true;
          obj.selectUser = true;
        }
        break;

      case DataItemType.StaffDeptMix:
        if ([11, 12].includes(cond.operatorType)) {
          // 属于/不属于
          obj.selectUser = false;
        }
        break;
      default:
        break;
    }
    return obj;
  }

  getOperators(type: DataItemType, code: string) {
    switch (type) {
      case DataItemType.Number:
      case DataItemType.Date:
      case DataItemType.Time:
        return numberDataItemOperators;

      case DataItemType.Logic:
        return logicDataItemOperators;

      case DataItemType.ShortText:
      case DataItemType.Radio:
      case DataItemType.Checkbox:
      case DataItemType.Dropdown:
      case DataItemType.DropdownMulti:
      case DataItemType.LongText:
        if (code === 'sequenceStatus') {
          return this.getOperatorsByCode(code);
        } else {
          return textDataItemOperators;
        }
      // 选人控件没有拥有、不拥有
      case DataItemType.StaffSingle:
      case DataItemType.StaffMulti:
      case DataItemType.StaffDeptMix:
        return staffDataItemOperators.slice(
          0,
          staffDataItemOperators.length - 2,
        );

      case DataItemType.DeptMulti:
      case DataItemType.DeptSingle:
        return staffDataItemOperators;

      case DataItemType.Address:
      case DataItemType.RelevanceForm:
      case DataItemType.RelevanceFormEx:
        return relevanceFormDataItemOperators;
      default:
        break;
    }
  }

  getOperatorsByCode(code: string) {
    switch (code) {
      case 'sequenceStatus':
        return sequenceStatusOperators;
      default:
        break;
    }
  }

  isText(type: DataItemType) {
    return [
      DataItemType.ShortText,
      DataItemType.LongText,
      DataItemType.Checkbox,
      DataItemType.Radio,
      DataItemType.DropdownMulti,
      DataItemType.Dropdown,
    ].includes(type);
  }

  isNumber(type: DataItemType) {
    return type === DataItemType.Number;
  }

  isDate(type: DataItemType) {
    return type === DataItemType.Date;
  }

  isBetween(type: DateItemOperatorType) {
    return [
      DateItemOperatorType.Between,
      DateItemOperatorType.NotBetween,
    ].includes(type);
  }

  isRelevanceForm(type: DataItemType) {
    return (
      type === DataItemType.RelevanceForm ||
      type === DataItemType.RelevanceFormEx
    );
  }

  isTime(type: DataItemType) {
    return type === DataItemType.Time;
  }

  isLogic(type: DataItemType) {
    return type === DataItemType.Logic;
  }

  isStaffSelector(type: DataItemType) {
    return [
      DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
    ].includes(type);
  }

  isAddress(type: DataItemType) {
    return [DataItemType.Address].includes(type);
  }

  isSequenceStatus(code: string) {
    //
    return code === 'sequenceStatus';
  }

  operatorAboutNull(type: DateItemOperatorType) {
    return (
      type === DateItemOperatorType.IsNull ||
      type === DateItemOperatorType.IsNotNull
    );
  }

  @Watch('items', {
    immediate: true,
  })
  onItemsChange(items: DataItem[]) {
    if (items) {
      setTimeout(() => {
        this.dataOptions = items
          .filter(
            (item) =>
              item.type !== DataItemType.Attachment &&
              item.type !== DataItemType.ApprovalOpinion &&
              item.type !== DataItemType.Sheet,
          )
          .map((item) => {
            let disabled = false;

            const code = item.parentCode
              ? `${item.parentCode}.${item.code}`
              : item.code;

            if (this.conditions) {
              const c = this.conditions.find(
                (co: any) => co.propertyCode === code,
              );

              if (c) {
                c.propertyType = item.type;
                disabled = true;
              }
            }

            const label = item.parentCode
              ? `${item.name}[${item.parentCode}.${item.code}]`
              : `${item.name}[${item.code}]`;

            return {
              label,
              value: code,
              type: item.type,
              isSystem: item.isSystem,
              disabled,
            };
          });
      }, 10);
    }
  }

  @Watch('value', {
    immediate: true,
  })
  onValueChange(val: DataitemConditionValue) {
    if (!val) {
      return;
    }

    if (val.conditions) {
      this.conditions = val.conditions; /* .slice(0); */
    } else {
      this.conditions = [];
    }
  }

  @Watch('conditions', {
    immediate: true,
  })
  onChangeConditions(conditions) {
    console.log(conditions, 'conditions==>');
    this.dataOptions.forEach((its) => {
      its.disabled = false;
    });
    conditions.forEach((item) => {
      this.dataOptions.forEach((el) => {
        if (el.value === item.propertyCode) {
          el.disabled = true;
        }
      });
    });
  }

  deleteOr() {
    this.$emit('deleteOr');
  }

  addAndConditions() {
    const item = this.dataOptions.find((op) => !op.disabled);
    if (!item) {
      this.$message.error('已无更多数据选项');
      return;
    }

    const operators = this.getOperators(item.type, item.value);
    if (!operators) {
      return;
    }

    item.disabled = true;

    this.conditions.push({
      propertyCode: item.value,
      propertyType: item.type,
      operatorType: operators[0].value,
      value: '',
      valueType: 'FIXED',
    });

    this.onChange();
  }

  remove(index: number) {
    const item = this.dataOptions.find(
      (op) => op.value === this.conditions[index].propertyCode,
    );
    if (item) {
      item.disabled = false;
    }
    this.conditions.splice(index, 1);
    this.onChange();
    if (!this.conditions.length) {
      this.deleteOr();
    }
  }

  onItemSelect(cond: DataitemConditionItem) {
    const item = this.dataOptions.find((x) => x.value === cond.propertyCode);
    if (item) {
      item.disabled = false;
    }
  }

  onItemChange(cond: DataitemConditionItem, index: number) {
    this.onChangeConditions(this.conditions);
    const item = this.dataOptions.find((x) => x.value === cond.propertyCode);
    if (item) {
      cond.propertyType = item.type;
      cond.value = '';

      const operators = this.getOperators(item.type, item.value);
      if (operators) {
        cond.operatorType = operators[0].value;
      }

      item.disabled = true;
    }

    cond.valueType = this.isRelevanceForm(cond.propertyType)
      ? 'DYNAMIC'
      : 'FIXED';
    if (cond.currentPropertyCode) {
      cond.currentPropertyCode = '';
    }
    this.onChange();
  }

  onDateChange(cond: DataitemConditionItem, dateText: string) {
    cond.value = dateText;
    this.onChange();
  }

  onNumberChange(cond: any, res: any) {
    const id = res.target.id;
    let start: any = '';
    let end: any = '';
    if (Array.isArray(cond.value) && cond.value.length === 2) {
      start = Number(cond.value[0]);
      end = Number(cond.value[1]);
    }
    if (id === 'groupNumber0') {
      start = Number(res.target.value);
      // end = Math.max(start, end)
    } else {
      end = Number(res.target.value);
      // start = Math.min(start, end)
    }
    cond.value = [start, end];
    this.onChange();
  }

  operatorTypeChange(cond: DataitemConditionItem) {
    cond.valueType = this.isRelevanceForm(cond.propertyType)
      ? 'DYNAMIC'
      : 'FIXED';
    cond.value = '';

    if (
      cond.propertyType === DataItemType.Number &&
      [DateItemOperatorType.Between, DateItemOperatorType.NotBetween].includes(
        cond.operatorType,
      )
    ) {
      cond.value = [0, 0];
    }
    this.onChange();
  }

  onTypeChange(cond: DataitemConditionItem) {
    cond.value = '';
    this.onChange();
  }

  onChange() {
    const value = {
      conditions: this.conditions,
    };
    this.$emit('change', value);
  }

  /**
   * 选人控件placeholder多语言
   */
  placeHolderLang() {
    this.staffSelectorOpts.placeholder = this.$t(
      'Languages.Apps.PlzSetOrgOrUser',
    ) as string;
  }

  getPopupContainer(triggerNode: any) {
    return triggerNode.parentNode;
  }

  @Watch('$i18n.locale')
  onLanguageChange(l: string) {
    this.placeHolderLang();
  }

  filterOption(input, option) {
    return (
      option.componentOptions.children &&
      option.componentOptions.children[0].text &&
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.trim().toLowerCase()) >= 0
    );
  }

  //初始化当前表单数据项数据
  initData() {
    const currentData: any[] = dataitemStore.getDataItems(this);
    if (Array.isArray(currentData)) {
      let arr: any = [];
      for (let con of currentData) {
        if (con.code !== 'workflowInstanceId') {
          let arrItem = {};
          if (
            con.type === DataItemType.Sheet &&
            this.dataItems.parentCode &&
            con.code === this.dataItems.parentCode
          ) {
            if (con.properties.length > 0) {
              for (let x of con.properties) {
                if (x.code !== 'sortKey') {
                  arrItem = {
                    label: `${x.name}[${this.dataItems.parentCode}.${x.code}]`,
                    value: `${this.dataItems.parentCode}.${x.code}`,
                    type: x.type,
                    disabled: false,
                    isSystem: x.isSystem,
                  };
                  arr.push(arrItem);
                }
              }
            }
          } else {
            arrItem = {
              label: `${con.name}[${con.code}]`,
              value: con.code,
              type: con.type,
              disabled: false,
              isSystem: con.isSystem,
            };
            arr.push(arrItem);
          }
        }
      }
      this.currentdataOptions = arr;
    }
  }

  created() {
    this.initData();
  }

  //根据目标模型数据项筛选适配的当前表单的数据项
  filterData(index: number) {
    let item = this.conditions[index];
    this.currentdataOptions.forEach((x) => {
      x.disabled = false;
    });
    item.valueTypeShow = false;
    switch (item.propertyType) {
      case DataItemType.ShortText:
      case DataItemType.Dropdown:
      case DataItemType.Radio:
        this.filterDataItem([
          DataItemType.ShortText,
          DataItemType.Dropdown,
          DataItemType.Radio,
        ]);
        break;
      case DataItemType.DropdownMulti:
      case DataItemType.Checkbox:
        this.filterDataItem([
          DataItemType.DropdownMulti,
          DataItemType.Checkbox,
        ]);
        break;
      case DataItemType.Date:
        this.filterDataItem([DataItemType.Date]);
        break;
      case DataItemType.Number:
        if (
          [
            DateItemOperatorType.Between,
            DateItemOperatorType.NotBetween,
          ].includes(item.operatorType)
        ) {
          item.valueTypeShow = true;
          item.value = ['', ''];
          this.conditions = [...this.conditions];
        }
        this.filterDataItem([DataItemType.Number]);
        break;
      case DataItemType.StaffSingle:
        if (
          [
            DateItemOperatorType.Contains,
            DateItemOperatorType.NotContains,
            DateItemOperatorType.In,
            DateItemOperatorType.NotIn,
            DateItemOperatorType.Of,
            DateItemOperatorType.NotOf,
          ].includes(item.operatorType)
        ) {
          item.valueTypeShow = true;
          this.conditions = [...this.conditions];
        }
        this.filterDataItem([DataItemType.StaffSingle]);
        break;
      case DataItemType.StaffMulti:
        if (
          [
            DateItemOperatorType.In,
            DateItemOperatorType.NotIn,
            DateItemOperatorType.Of,
            DateItemOperatorType.NotOf,
          ].includes(item.operatorType)
        ) {
          item.valueTypeShow = true;
          this.conditions = [...this.conditions];
        }
        this.filterDataItem([DataItemType.StaffMulti]);
        break;
      case DataItemType.DeptSingle:
        if (
          [
            DateItemOperatorType.Contains,
            DateItemOperatorType.NotContains,
            DateItemOperatorType.In,
            DateItemOperatorType.NotIn,
            DateItemOperatorType.Of,
            DateItemOperatorType.NotOf,
            DateItemOperatorType.Have,
            DateItemOperatorType.NotHave,
          ].includes(item.operatorType)
        ) {
          item.valueTypeShow = true;
          this.conditions = [...this.conditions];
        }
        this.filterDataItem([DataItemType.DeptSingle]);
        break;
      case DataItemType.DeptMulti:
        if (
          [
            DateItemOperatorType.In,
            DateItemOperatorType.NotIn,
            DateItemOperatorType.Of,
            DateItemOperatorType.NotOf,
            DateItemOperatorType.Have,
            DateItemOperatorType.NotHave,
          ].includes(item.operatorType)
        ) {
          item.valueTypeShow = true;
          this.conditions = [...this.conditions];
        }
        this.filterDataItem([DataItemType.DeptMulti]);
        break;
      case DataItemType.StaffDeptMix:
        if (
          [
            DateItemOperatorType.In,
            DateItemOperatorType.NotIn,
            DateItemOperatorType.Of,
            DateItemOperatorType.NotOf,
            DateItemOperatorType.Have,
            DateItemOperatorType.NotHave,
          ].includes(item.operatorType)
        ) {
          item.valueTypeShow = true;
          this.conditions = [...this.conditions];
        }
        this.filterDataItem([DataItemType.StaffDeptMix]);
        break;
      case DataItemType.Logic:
        this.filterDataItem([DataItemType.Logic]);
        break;
      case DataItemType.LongText:
        this.filterDataItem([DataItemType.LongText]);
        break;
      case DataItemType.Address:
        this.filterDataItem([DataItemType.Address]);
        break;
      case DataItemType.RelevanceForm:
      case DataItemType.RelevanceFormEx:
        this.filterDataItem([
          DataItemType.RelevanceForm,
          DataItemType.RelevanceFormEx,
        ]);
        break;
      default:
        break;
    }
  }

  filterDataItem(arr: number[]) {
    this.currentdataOptions.forEach((x) => {
      if (arr.indexOf(x.type) === -1) {
        x.disabled = true;
      }
    });
  }

  dropdownVisibleChange(index: number) {
    this.filterData(index);
  }

  get pickerRanges() {
    return {
      当天: [moment(), moment()],
      昨天: [moment().add(-1, 'days'), moment().add(-1, 'days')],
      本周: [moment().startOf('week'), moment().endOf('week')],
      上周: [
        moment()
          .week(moment().week() - 1)
          .startOf('week'),
        moment()
          .week(moment().week() - 1)
          .endOf('week'),
      ],
      本月: [moment().startOf('month'), moment().endOf('month')],
      上月: [
        moment()
          .month(moment().month() - 1)
          .startOf('month'),
        moment()
          .month(moment().month() - 1)
          .endOf('month'),
      ],
      本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
      本年度: [moment().startOf('year'), moment().endOf('year')],
    };
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
.data-range-setting-wrap {
  background: #f4f5f8;
  border-radius: 4px;
}

.fieldlab {
  color: #000;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
}

/deep/.ant-row-flex {
  padding: 5px 24px;

  & > div > *:not(i) {
    width: 100%;
  }
}

/deep/.ant-col-6,
/deep/.ant-col-8 {
  display: flex;
  // align-items: center;
  padding-right: 10px;
}

/deep/.ant-col-1 {
  display: flex;
  padding-top: 0.5em;
  // align-items: center;
  // justify-content: center;

  & > i {
    cursor: pointer;
  }
}

.row {
  display: flex;
  align-items: center;
}
.ml8 {
  margin-left: 8px;
}

.mr8 {
  margin-right: 8px;
}

.add {
  color: @primary-color;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  line-height: 48px;
  span {
    margin-top: 16px;
    margin-right: 8px;
  }
}
</style>
<style lang="less">
.data-range-setting-wrap {
  .ant-tabs {
    padding-left: 0.5em;
  }
  .ant-tabs-nav {
    .ant-tabs-tab {
      margin: 0 32px 0 16px;
    }
  }
}
</style>
