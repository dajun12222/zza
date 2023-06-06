<template>
  <div class="content-box">
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">

import Header from "@/components/shared/header/new-header.vue";
import { Component, Vue, Watch } from 'vue-property-decorator';


@Component({
  name: 'auditView',
  components: {
    Header,
  }
})

export default class auditView extends Vue {
}
</script>

<style lang="less" scoped>
</style>
