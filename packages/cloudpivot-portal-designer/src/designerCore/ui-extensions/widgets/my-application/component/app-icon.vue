<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-icon">
    <template v-if="appData.content">
      <img
        :src="'data:image/png;base64,' + appData.content"
        class="content-item-icon"
      />
    </template>

    <template v-else-if="appData.logoUrl">
      <img
        v-if="appData.logoUrl.indexOf('http') > -1"
        :src="appData.logoUrl"
        class="content-item-icon"
      />
      <img
        v-else
        :src="getDownloadUrlNew(appData.logoUrl, 'application')"
        class="content-item-icon"
      />
    </template>

    <template v-else>
      <svg class="tabs-app-li-icon icon svgIcon" aria-hidden="true">
        <use xlink:href="#h-icon-all-application1" />
      </svg>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  components: {},
})
export default class MyApplication extends Vue {
  @Prop() appData!: any;

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }
}
</script>
