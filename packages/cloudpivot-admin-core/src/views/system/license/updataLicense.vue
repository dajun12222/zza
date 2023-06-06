<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-upload
    v-if="isAdmin"
    :customRequest="customRequest"
    :multiple="false"
    listType="text"
    :fileList="fileList"
    :maxCount="1"
    accept=".license"
    class="upload"
  >
    <span class="updata">更新</span>
  </a-upload>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Upload } from '@h3/antd-vue';
import systemApi from 'cloudpivot-admin-core/src/apis/system/system-manager.api';

@Component({
  name: 'updataLicense',
  components: {
    AUpload: Upload,
  },
})
export default class updataLicense extends Vue {
  fileList: any[] = [];

  customRequest(info) {
    let formData = new FormData();
    formData.append('file', info.file);
    systemApi.updataLicenseFile(formData).then((res: any) => {
      if (res.errcode === 0) {
        this.$emit('uploadLicenseSuccess');
        this.$message.success(res.errmsg);
      }else{
        this.$message.error(res.errmsg);
      }
      
    });
  }

  isAdmin: boolean = false;

  created() {
    let user: any = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.isAdmin =
        Array.isArray(user.permissions) && user.permissions.includes('ADMIN');
    } else {
      this.isAdmin = false;
    }
  }
}
</script>

<style lang="less" scoped>
span.updata {
  font-size: 14px;
  margin-left: 16px;
  font-weight: 400;
  color: #2970ff;
  cursor: pointer;
}
</style>
