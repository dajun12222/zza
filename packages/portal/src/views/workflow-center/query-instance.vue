<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fu Zhuohang
 * @Date: 2022-01-04 18:06:33
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-04-13 15:53:19
 * @FilePath: \yunshu6.0\packages\portal\src\views\workflow-center\query-instance.vue
 * @Description:
-->
<template>
  <query-instance @openForm="openForm" />
</template>

<script lang="ts">
// 初始化表单组件配置
import '@/config/h3-form';
import Store from '@/store/index';
import flowCenter from 'cloudpivot-flow/flow-center/pc';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'QueryInstance',
  components: {
    queryInstance: flowCenter.components.QueryInstance,
  },
})
export default class QueryInstance extends Vue {
  /**
   * 查看表单详情
   */
  openForm(obj: any) {
    const url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${
      obj.instanceId
    }&return=${location.pathname + location.search}&workitemType=queryInstance`;
    if (this.isDingTalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      const newWindow: any = window.open();
      newWindow.location.href = url;
    }
  }
}
</script>

<style lang="less" scoped></style>
