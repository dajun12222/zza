<template>
  <div id="portal-form-list-container" class="app-menu">
    <div id="ApplicationList" ref="application" class="application-box">
      <div class="list-table-box">
        <h1>自定义应用列表页面</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
@Component({
  name: 'ApplicationList',
  components: {},
})
export default class ApplicationList extends Vue {
  created() {}
}
</script>

<style lang="less">
.list-table-box {
  text-align: center;
}
</style>
