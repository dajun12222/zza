<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-home-groups">
    <app-home-group
      v-for="(group, index) in appGroups"
      :key="index"
      :title="group.title"
      :title_i18n="group.title_i18n"
      :childrens="group.childrens"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppHomeGroup from './app-home-group.vue';

@Component({
  name: 'app-home-groups',
  components: {
    AppHomeGroup,
  },
})
export default class AppHomeGroups extends Vue {
  @Prop() appGroups!: Array<any>;
}
</script>
<style lang="less" scoped></style>
