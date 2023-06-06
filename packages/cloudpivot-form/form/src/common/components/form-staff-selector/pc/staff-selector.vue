<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: your name
 * @Date: 2020-04-22 14:02:14
 * @LastEditTime: 2021-12-30 20:02:17
 * @LastEditors: baidongsheng
 * @Description: In User Settings Edit
 * @FilePath: \frontend\modules\cloudpivot\form\src\common\components\form-staff-selector\pc\staff-selector.vue
 -->

<template>
  <SmartOrg
    :org="org"
    :isExport="options.isExport"
    :isDisplayRoot="options.isDisplayRoot"
    :selectOrg="options.selectOrg"
    :selectUser="options.selectUser"
    :showModel="options.showModel"
    :showSelect="options.showSelect"
    :showError="options.showError"
    :isMulpitle="options.mulpitle"
    :title="options.title"
    :keepDeptIds="keepDeptIds"
    :selectedData="selected"
    :searchData="searchList"
    :departmentsTotal="departmentsTotal"
    :usersTotal="usersTotal"
    :orgName="options.key"
    :selectPlaceholder="options.placeholder || placeholder"
    :placeholder="SearchPlaceholder"
    :showPart="options.showPart"
    :maxTagCount="options.maxTagCount"
    :allowRecursion="false"
    :locale="locale"
    :disabled="disabled"
    :showLoading="showLoading"
    :isDisableClick="isDisableClick"
    :showNotData="showNotData"
    :displayType="
      (queryDisplayType === 'tag' ? '' : queryDisplayType) || displayType
    "
    :roleLabel="roleLabel"
    :propVisiblePart="visiblePart"
    :showDetail="showDetail"
    @focus="treeFocus"
    @onClickBreadcrumb="onClickBreadcrumb"
    @change="onChange"
    @onSearch="onSearch"
    @onClickTrunBack="onClickTrunBack"
    @onClickNextHierarchy="onClickNextHierarchy"
    @ok="onOk"
    @cancle="onCancle"
  />
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { StaffSelectorBase } from '../staff-selector-base';
import SmartOrg from './smart-org/smartOrg.vue';

@Component({
  name: 'staff-selector',
  components: {
    SmartOrg,
  },
  model: {
    event: 'change',
    prop: 'value',
  },
})
export default class StaffSelector extends StaffSelectorBase {
  @Prop() visiblePart?: boolean;

  @Prop() showDetail?: boolean;

  get SearchPlaceholder() {
    let output = '';
    if (this.options.selectOrg) {
      // output = "搜索组织";
      output = 'SearchOrg';
    }
    if (this.options.selectUser) {
      // output = "搜索姓名/账号";
      output = 'SearchNameAccount';
    }
    if (this.options.selectOrg && this.options.selectUser) {
      // output = "搜索组织、姓名";
      output = 'SearchOrgUserRole';
    }
    return output;
  }

  treeFocus() {
    super.treeFocus();
  }

  // 树-返回
  onClickTrunBack() {
    super.onClickTrunBack();
  }

  // 树-下一级
  onClickNextHierarchy(val: any) {
    super.onClickNextHierarchy(val);
  }

  onClickBreadcrumb(val: any) {
    super.onClickBreadcrumb(val);
  }

  onChange(items: any[]) {
    super.onChange(items);
  }

  async onOk(items: any[]) {
    super.onOk(items);
  }

  onCancle() {
    super.onCancle();
  }

  onSearch(name: string) {
    let type = '';
    if (this.options.selectOrg) {
      //选组织
      type = 'department';
    }
    if (this.options.selectUser) {
      //选人
      type = 'user';
    }
    if (this.options.selectOrg && this.options.selectUser) {
      //选组织/人
      type = '';
    }

    super.onSearch(name, type);
  }
}
</script>

<style lang="less" scoped></style>
