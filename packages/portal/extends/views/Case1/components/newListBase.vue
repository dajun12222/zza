<template>
  <div>
    <elTable :columns="typeKey === '投资项目审计' ? columns : columns1" :dataContent="dataContent" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';

const qs = require('qs');
@Component({
  name: 'newListBase',
  components: {
    ATable: Table,
    elTable,
  },
})
export default class newListBase extends Vue {
  
  @Prop({}) dataContent: any;
  
  @Prop() typeKey?: string;

  columns: any = [
    {
      dataIndex: 'qualitativeProblem',
      title: '审计问题名称',
      ellipsis: true,
    },
    {
      dataIndex: 'projectName',
      title: '所属项目',
      ellipsis: true,
    },
    {
      dataIndex: 'projectNode',
      title: '项目阶段',
      ellipsis: true,
    },
    {
      dataIndex: 'oneLevelDirectory',
      title: '一级目录',
      ellipsis: true,
    },
    {
      dataIndex: 'twoLevelDirectory',
      title: '二级目录',
      ellipsis: true,
    },
    {
      dataIndex: 'threeLevelDirectory',
      title: '三级目录',
      ellipsis: true,
    },
    {
      dataIndex: 'qualitativeBasis',
      title: '定性依据',
      ellipsis: true,
    },
    {
      dataIndex: 'suggestionsProblem',
      title: '审计建议',
      ellipsis: true,
    },
    {
      dataIndex: 'auditUnit',
      title: '审计单位',
      ellipsis: true,
    },
    {
      dataIndex: 'responsibleUnit',
      title: '被审计单位',
      ellipsis: true,
    },
    {
      dataIndex: 'filingYear',
      title: '归档年度',
      width: 100,
    },
  ];

  columns1: any = [
    {
      dataIndex: 'qualitativeProblem',
      title: '审计问题名称',
      ellipsis: true,
    },
    {
      dataIndex: 'projectName',
      title: '所属项目',
      ellipsis: true,
    },
    {
      dataIndex: 'oneLevelDirectory',
      title: '一级目录',
      ellipsis: true,
    },
    {
      dataIndex: 'twoLevelDirectory',
      title: '二级目录',
      ellipsis: true,
    },
    {
      dataIndex: 'threeLevelDirectory',
      title: '三级目录',
      ellipsis: true,
    },
    {
      dataIndex: 'qualitativeBasis',
      title: '定性依据',
      ellipsis: true,
    },
    {
      dataIndex: 'suggestionsProblem',
      title: '审计建议',
      ellipsis: true,
    },
    {
      dataIndex: 'auditUnit',
      title: '审计单位',
      ellipsis: true,
    },
    {
      dataIndex: 'responsibleUnit',
      title: '送审单位',
      ellipsis: true,
    },
    {
      dataIndex: 'filingYear',
      title: '归档年度',
      width: 100,
    },
  ];
}
</script>
<style lang="less" scoped></style>
