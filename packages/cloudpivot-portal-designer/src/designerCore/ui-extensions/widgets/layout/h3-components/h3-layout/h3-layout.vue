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

const name = 'h3-layout';

@Component({
  components: {},
})
export default class H3Layout extends Vue {
  get name () {
    return name;
  }
}
</script>

<style lang="less" scoped>
.h3-layout {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
}
</style>
