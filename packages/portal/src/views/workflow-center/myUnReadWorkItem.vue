<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fu Zhuohang
 * @Date: 2022-01-04 18:06:33
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-04-13 15:53:56
 * @FilePath: \yunshu6.0\packages\portal\src\views\workflow-center\myUnReadWorkItem.vue
 * @Description:
-->
<template>
  <my-unread-work-item @openForm="openForm" />
</template>

<script lang="ts">
import flowCenter from 'cloudpivot-flow/flow-center/pc';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'UnReadWorkItem',
  components: {
    MyUnreadWorkItem: flowCenter.components.myCirculate,
  },
})
export default class UnReadWorkItem extends Vue {
  /**
   * 查看表单详情
   */
  openForm(obj: any) {
    const url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${
      obj.instanceId
    }&return=${
      location.pathname + location.search
    }&workitemType=unreadWorkitem`;
    if (this.isDingTalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      // const newWindow: any = window.open();
      // newWindow.location.href = url;
      obj.vm.IframeFormUrl = url;
      obj.vm.showIframeForm = true;
    }
  }
}
</script>

<style lang="less" scoped></style>
