<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <!-- 单行文本、单选框、 单选下拉-->
  <div
    v-if="
      [
        FormControlType.Text,
        FormControlType.Radio,
        FormControlType.Dropdown,
      ].includes(col.type)
    "
  >
    {{ col.conReadonlyValue }}
  </div>

  <!-- 长文本、富文本 -->
  <div
    v-else-if="[FormControlType.Textarea].includes(col.type)"
    v-html="col.conReadonlyValue"
  ></div>

  <!-- 逻辑 -->
  <div v-else-if="col.type === FormControlType.Logic">
    <span v-if="col.conReadonlyValue">
      {{ $t('cloudpivot.form.renderer.sheet.logicTrueValue') }}
    </span>
    <span v-else>
      {{ $t('cloudpivot.form.renderer.sheet.logicFalseValue') }}
    </span>
  </div>

  <!-- 多选框、下拉多选 -->
  <div
    v-else-if="
      [FormControlType.Checkbox, FormControlType.DropdownMulti].includes(
        col.type,
      )
    "
  >
    {{ multiText(col.conReadonlyValue) }}
  </div>

  <!-- 地址 -->
  <div
    v-else-if="
      [FormControlType.Address, FormControlType.Location].includes(col.type)
    "
  >
    {{ addressString(col.conReadonlyValue) }}
  </div>
  <!-- 单选多选选人、单选多选部门、混合选人选部门控件 -->
  <div
    v-else-if="
      [
        FormControlType.StaffSelector,
        FormControlType.StaffMultiSelector,
        FormControlType.DepartmentSelector,
        FormControlType.DepartmentMultiSelector,
        FormControlType.StaffDeptMixed,
      ].includes(col.type)
    "
  >
    <form-staff-selector-readonly :data="col.conReadonlyValue" />
  </div>

  <!-- 日期 -->
  <div v-else-if="[FormControlType.Date].includes(col.type)">
    <span>{{ getDateShowText(col) }}</span>
  </div>

  <!-- 数值 -->
  <div v-else-if="[FormControlType.Number].includes(col.type)">
    <span>{{ getNumberShowText(col) }}</span>
  </div>

  <!-- 图片 -->
  <div v-else-if="[FormControlType.Image].includes(col.type)">
    <imageReadonly :data="col.conReadonlyValue" :batch="col.options.batch" />
  </div>

  <!-- 附件 -->
  <div v-else-if="[FormControlType.Attachment].includes(col.type)">
    <attachmentReadonly
      :data="col.conReadonlyValue"
      :batch="col.options.batch"
    />
  </div>

  <!-- 关联单选 -->
  <div v-else-if="[FormControlType.RelevanceForm].includes(col.type)">
    <template v-if="col.options.linkMode">
      <a class="link" @click.stop.prevent="onClick(col.conReadonlyValue, col)">
        {{
          getRelevanceFormShowText(
            col.conReadonlyValue[col.conReadonlyValue.displayCode],
            col.conReadonlyValue.displayCode,
          )
        }}
      </a>
    </template>

    <template v-else>
      {{
        getRelevanceFormShowText(
          col.conReadonlyValue[col.conReadonlyValue.displayCode],
          col.conReadonlyValue.displayCode,
        )
      }}
    </template>
  </div>

  <!-- 关联多选 -->
  <div v-else-if="[FormControlType.RelevanceFormEx].includes(col.type)">
    <template v-if="col.conReadonlyValue">
      <template v-if="col.options.linkMode">
        <template
          v-for="(item, key) in col.conReadonlyValue
            ? col.conReadonlyValue.items
            : []"
        >
          <a :key="key" class="link" @click.stop.prevent="onClick(item, col)">
            {{
              getRelevanceFormShowText(
                item[col.conReadonlyValue.displayCode],
                col.conReadonlyValue.displayCode,
              )
            }}
          </a>
        </template>
      </template>

      <template v-else>
        {{
          col.conReadonlyValue.items
            .map((el) =>
              getRelevanceFormShowText(
                el[col.conReadonlyValue.displayCode],
                col.conReadonlyValue.displayCode,
              ),
            )
            .join('；')
        }}
      </template>
    </template>
  </div>

  <!-- 手写签名 -->
  <div v-else-if="[FormControlType.Signature].includes(col.type)">
    <template v-if="col.conReadonlyValue">
      <template v-for="item in col.conReadonlyValue">
        <img
          :key="item.id"
          style="width: 104px; height: 104px"
          :src="getDownloadUrl(item.refId)"
          alt=""
        />
      </template>
    </template>
  </div>

  <!-- 附件等使用组件形式来显示(组件中涉及较多转换处理，暂不挪出) -->
  <span v-else>{{ col.type }} - {{ col.conReadonlyValue }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormControlType } from 'cloudpivot-form/form/schema';
import FormStaffSelectorReadonly from './form-staff-selector-readonly.vue';
import imageReadonly from './image-readonly.vue';
import attachmentReadonly from './attachment-readonly.vue';
import * as Helper from 'cloudpivot-list/list/src/components/pc/helper/helper';

import { listApi } from 'cloudpivot/api';

import { utils } from 'cloudpivot/common';

const DateHandle = utils.DateHandle;

import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  name: 'base-control-readonly',
  components: {
    FormStaffSelectorReadonly,
    imageReadonly,
    attachmentReadonly,
  },
})
export default class BaseControlReadonly extends Vue {
  @Prop() col!: any;

  @Prop() columns!: any;

  FormControlType: any = FormControlType; //控件类型

  mounted() {}

  getDownloadUrl(refId: string) {
    if (!refId) {
      return '';
    } else if (refId && refId.indexOf('http') > -1) {
      return refId;
    } else {
      return getDownloadUrlNew.getImageUrl(refId, 'application');
    }
  }

  onClick(item, col: any) {
    console.log(col);
    const options: any = col.options;
    this.open(
      options.schemaCode,
      options.queryCode,
      options.sheetParams.id,
      options.sheetParams.sheetid,
      options.isAuthorize,
      col.parentKey ? `${col.parentKey}.${col.key}` : col.key,
      {
        id: item.id,
      },
    );
  }

  open(
    schemaCode: string,
    queryCode: string,
    id: string,
    sheetId: string,
    isAuthorize: boolean,
    code: string,
    value: any,
  ) {
    const params = {
      bizObjectId: value.id,
      schemaCode,
    };
    listApi.getFormUrl(params).then((res: any) => {
      // ;
      if (/DingTalk/.test(navigator.userAgent)) {
        res += '&T=' + localStorage.getItem('token');
      }
      if (isAuthorize) {
        res +=
          '&tempAuthSheetId=' +
          sheetId +
          '&tempAuthObjectId=' +
          id +
          '&tempAuthPropertyCode=' +
          code;
      }
      window.open(res);
    });
  }

  /**
   * 显示多选值的名称
   * @param value
   * @returns
   */
  multiText(value) {
    if (Array.isArray(value)) {
      let text = value.filter((x) => x).join(';');
      if (text.length > 0) {
        text += ';';
      }
      return text;
    }
    return value;
  }

  getRelevanceFormShowText(value, displayCode) {
    if (displayCode === 'sequenceStatus') {
      return this.$t(`cloudpivot.flow.pc.WorkflowState.${value}`) || '';
    }
    if (Array.isArray(value)) {
      // 关联单选返回的是数组
      return value.map((el) => el.name).join(';');
    }
    return value;
  }

  /**
   * 显示地址控件的名称
   * @param value
   * @returns
   */
  addressString(value) {
    if (!value) {
      return '';
    }
    const { provinceName, cityName, districtName, address } = value;
    const addressList: Array<any> = [];
    addressList.push(provinceName, cityName, districtName, address);
    const str = addressList.reduce((strItem: string, current: string) => {
      let currentStr: string = '';
      let beforeStr: String = '';
      if (current) {
        currentStr = current;
      }
      if (strItem) {
        beforeStr = strItem;
      }
      return `${beforeStr} ${currentStr}`;
    });
    return str;
  }

  getNumberDisplayFormatType(str) {
    const numberTypeNameList = Helper.numberTypeName;
    const obj = numberTypeNameList.find((i) => i.text === str);
    return obj ? obj.type : 'Millimeter';
  }

  /**
   * 数值格式转换
   * @param col
   */
  getNumberShowText(col: any) {
    const column: any = this.columns.find((c: any) => c.key === col.key);
    column.displayFormat = this.getNumberDisplayFormatType(
      column.options.format,
    );
    // 数值数据项展示格式处理
    let textValue;
    if (col.conReadonlyValue === 0) {
      textValue = 0;
    } else if (col.conReadonlyValue) {
      if (column.displayFormat) {
        textValue = Helper.numberToDisplay(col.conReadonlyValue, column);
      } else {
        textValue = col.conReadonlyValue;
      }
    } else {
      //Else Empty block statement
    }
    return textValue;
  }

  getDateDisplayFormatType(str) {
    switch (str) {
      case 'YYYY-MM-DD HH:mm:ss':
        return 2;
      case 'YYYY-MM-DD HH:mm':
        return 3;
      case 'YYYY-MM':
        return 4;
      case 'YYYY':
        return 5;
      case 'MM-DD':
        return 6;
      case 'HH:mm':
        return 7;
      case 'HH:mm:ss':
        return 8;
      case 'YYYY-MM-DD CN-APM':
        return 9;
      case 'YYYY-MM-DD CN-APM HH:mm':
        return 10;
      case 'YYYY-MM-DD EN-APM':
        return 11;
      case 'YYYY-MM-DD EN-APM HH:mm':
        return 12;
      default:
        return 1;
    }
  }

  /**
   * 日期数据项展示格式处理
   * @param col
   */
  getDateShowText(col: any) {
    if (!col.conReadonlyValue) {
      return;
    }
    const column: any = this.columns.find((c: any) => c.key === col.key);
    column.displayFormat = this.getDateDisplayFormatType(column.options.format);
    let textValue;
    const date = new Date(
      typeof col.conReadonlyValue === 'string'
        ? col.conReadonlyValue.replace(/-/g, '/')
        : col.conReadonlyValue,
    ); // 修复safari/ie下日期转换问题
    const month =
      date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const yearAndMonth = `${date.getFullYear()}-${month}`;
    const time = `${date.getFullYear()}-${month}-${day}`;
    const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    const minutes =
      date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds =
      date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    switch (column.displayFormat) {
      case 0:
        break;
      case 1:
        textValue = time;
        break;
      case 2:
        textValue = `${time} ${hours}:${minutes}:${seconds}`;
        break;
      case 3:
        textValue = `${time} ${hours}:${minutes}`;
        break;
      case 4:
        textValue = yearAndMonth;
        break;
      case 5:
        textValue = date.getFullYear();
        break;
      case 6:
        textValue = `${month}-${day}`;
        break;
      case 7:
        textValue = `${hours}:${minutes}`;
        break;
      case 8:
        textValue = `${hours}:${minutes}:${seconds}`;
        break;
      default:
        break;
    }

    if (!textValue && col.conReadonlyValue) {
      textValue = DateHandle.dateFormat(
        new Date(col.conReadonlyValue),
        col.options.format,
      );
    }

    return textValue;
  }
}
</script>

<style lang="less" scoped></style>
