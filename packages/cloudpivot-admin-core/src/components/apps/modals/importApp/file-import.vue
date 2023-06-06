<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileImportTemplate :importVM="_self" />
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';

import AppsApi from 'cloudpivot-admin-core/src/apis/apps';

import { mixins } from 'vue-class-component';
import MixinImport from '../../../../components/global/modal/import/mixins/file-import';
import FileImportTemplate from '../../../../components/global/modal/import/templates/file-import-template.vue';

@Component({
  name: 'FileImport',
  components: {
    FileImportTemplate,
  },
})
export default class FileImport extends mixins(MixinImport) {
  @Inject()
  switchGroup!: Function;

  async doImport() {
    this.simulateImport();
    const { fileName, groupId } = this.uploadResult;
    const {
      dmCodeList,
      appCode,
      override,
      subCodeList,
      formModelMap,
      workflowList,
      reportCodeList,
    } = this.validResult;

    const workflowCodeChangedMap = {};
    const sheetCodeChangedMap = {};
    Array.isArray(workflowList) &&
      workflowList.forEach((el: any) => {
        workflowCodeChangedMap[el.workflowCode] = el.newCode || el.workflowCode;
      });

    formModelMap &&
      Object.values(formModelMap).forEach((el: any) => {
        if (Array.isArray(el)) {
          el.forEach((ele: any) => {
            if (!sheetCodeChangedMap[ele.schemaCode]) {
              sheetCodeChangedMap[ele.schemaCode] = {};
            }
            sheetCodeChangedMap[ele.schemaCode][ele.sheetCode] =
              ele.newCode || ele.sheetCode;

            // sheetCodeChangedMap[ele.sheetCode] = ele.newCode || ele.sheetCode
          });
        }
      });
    const fromAppMarket = false;
    const params = {
      appCode,
      fileName,
      override,
      dmCodeList,
      subCodeList,
      groupId,
      workflowCodeChangedMap,
      sheetCodeChangedMap,
      fromAppMarket,
      reportCodeList,
    };
    const res: any = await AppsApi.importApp(params);
    this.isImportEnd = true;
    this.$emit('importEnd');
    const { errcode, errmsg } = res;
    this.percent = 100;
    if (errcode === 0) {
      const { data } = res;
      if (data) {
        this.percent = 100;
        this.progressStatus = 'success';
        this.importStatusTxt = '导入成功';
        this.importHint = '请重新发布数据模型和流程';
        this.$emit('succeed');
        this.switchGroup(groupId);
      } else {
        this.percent = 75;
        this.progressStatus = 'exception';
        this.importStatusTxt = '导入失败';
        this.importHint = errmsg || '网络异常导入失败，重新导入';
      }
    } else {
      this.percent = 75;
      this.progressStatus = 'exception';
      this.importStatusTxt = '导入失败';
      this.importHint = errmsg || '网络异常导入失败，重新导入';
    }
    // 这种报错不宜展示给用户
    this.importHint =
      errcode === 999999
        ? '后台导入SQL执行出错，请重新导入！'
        : this.importHint;
  }
}
</script>

<style lang="less" scoped></style>
