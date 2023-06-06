<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileImportTemplate :importVM="_self" />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import serviceApi from '../../../../../apis/biz-service/service.api';
import MixinImport from '../../../../../components/global/modal/import/mixins/file-import';
import FileImportTemplate from '../../../../../components/global/modal/import/templates/file-import-template.vue';

@Component({
  name: 'FileImport',
  components: {
    FileImportTemplate,
  },
})
export default class FileImport extends mixins(MixinImport) {
  async doImport(uploadResult, validResult) {
    const { fileName, groupId } = uploadResult;
    const { modifyServiceCodes, overWrite } = validResult;
    const params = {
      fileName,
      groupId,
      modifyServiceCodes,
      overWrite,
    };
    const res: any = await serviceApi.importService(params);
    this.isImportEnd = true;
    const { errcode, errmsg } = res;
    this.percent = 100;
    if (errcode === 0) {
      const { data } = res;
      if (data) {
        this.percent = 100;
        this.progressStatus = 'success';
        this.importStatusTxt = '导入成功';
        this.importHint = '';
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
