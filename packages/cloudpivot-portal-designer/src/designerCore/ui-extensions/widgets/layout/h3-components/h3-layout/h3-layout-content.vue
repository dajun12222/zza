<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div :class="[name]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const name = 'h3-layout-content';

@Component({
  components: {},
})
export default class H3LayoutContent extends Vue {
  get name () {
    return name;
  }
}
</script>

<style lang="less" scoped>
.h3-layout-content {
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
}
</style>
