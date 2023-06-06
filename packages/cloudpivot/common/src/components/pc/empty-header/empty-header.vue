<template>
  <div class="header">
    <div class="logo">
      <img v-if="logoSrc" :src="logoSrc" alt="logo" />
      <img v-else src="./images/yslogo.png" alt="logo" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  name: 'empty-header',
})
export default class EmptyHeader extends Vue {
  get logoSrc() {
    const refId: string = this.$store.state.themsConfig.portalLogo;
    return refId ? this.getDownloadUrlByRefId(refId) : '';
  }

  getDownloadUrlByRefId(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId, 'logo');
  }
}
</script>

<style lang="less" scoped>
// @import '../../../styles/themes/default.less';

.logo {
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0;
  img {
    height: 24px;
  }
}
</style>
