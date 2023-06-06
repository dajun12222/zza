<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="content-box">
    <Header :selectedKeys="selectedKeys" />
    <router-view />
  </div>
</template>

<script lang="ts">
import Header from '@/components/shared/header/new-header.vue';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'appListView',
  components: {
    Header,
  },
})
export default class appListView extends Vue {
  selectedKeys: string = 'applications';

  created() {}
}
</script>

<style lang="less" scoped></style>
