<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="node-detail">
    <a-table :dataSource="list" :pagination="false">
      <!-- 序号 -->
      <a-table-column key="nodeName" dataIndex="nodeName" :width="164">
        <span slot="title" class="resize">节点名称</span>
      </a-table-column>

      <!-- 规则编码 -->
      <a-table-column key="targetModel" dataIndex="targetModel" :width="164">
        <span slot="title" class="resize">目标模型</span>
      </a-table-column>

      <!-- 规则名称 -->
      <a-table-column key="targetData" dataIndex="targetData" :width="164">
        <span slot="title" class="resize">目标数据</span>
      </a-table-column>

      <!-- 触发数据 -->
      <a-table-column
        key="exceptionDetail"
        dataIndex="exceptionDetail"
        :width="164"
      >
        <span slot="title" class="resize">异常详情</span>
      </a-table-column>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Table } from '@h3/antd-vue';
@Component({
  name: 'NodeDetail',
  components: {
    ATable: Table,
    ATableColumn: Table.Column,
  },
})
export default class NodeDetail extends Vue {
  list = [
    {
      nodeName: '新增',
      targetModel: '模型112',
      targetData: '123123123',
      exceptionDetail: '回滚',
    },
  ];
}
</script>

<style lang="less" scoped></style>
