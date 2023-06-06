<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div v-if="lang === 'zh' && imageStr" class="workflow-status">
    <img :src="require('./images/' + imageStr + '.png')" />
  </div>

  <div v-else-if="imageStr" class="workflow-status">
    <img :src="require('./images/' + imageStr + '-en.png')" />
  </div>
  <!--
  <template v-else>

  </template> -->

  <!-- <img src="./images/timeout.png" v-else-if="timeout"> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'workflow-status',
})
export default class WorkflowStatus extends Vue {
  @Prop()
  status!: string;

  lang: string = localStorage.getItem('locale') || 'zh';

  get imageStr() {
    return this.status && this.status.toLowerCase();
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.lang = localStorage.getItem('locale') || 'zh';
  }
}
</script>

<style lang="less" scoped>
.workflow-status {
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>
