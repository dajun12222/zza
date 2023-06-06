<template>
  <div>
    <elTable
      :columns="columns"
      :dataContent="dataContent"
      @goDetail="goDetail"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
const qs = require('qs');
import axios from 'axios';
@Component({
  name: 'newList',
  components: {
    ATable: Table,
    elTable,
  },
})
export default class newList extends Vue {
  @Prop({}) dataContent?: any;

  columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 50,
      customRender: (text, record, index) => `${index + 1}`,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'fileName',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '项目编号',
      dataIndex: 'projectNumber',
      key: 'projectNumber',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '审计单位',
      dataIndex: 'auditUnit',
      key: 'auditUnit',
    },

    {
      title: '送审单位',
      dataIndex: 'responsibleUnit',
      key: 'responsibleUnit',
    },
    {
      title: '归档年度',
      dataIndex: 'filingYear',
      key: 'filingYear',
      width: 80,
    },
    {
      title: '典型案例',
      dataIndex: 'isCase',
      key: 'isCase',
      width: 80,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = '是';
        } else {
          obj = '否';
        }
        return obj;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 70,
    },
  ];

  goDetail(item: any) {
    let { href } = this.$router.resolve({
      name: 'aduitFilesInveInfo',
      query: {
        id: item['id'],
        projectNode: '预算文件',
        isOpenPage: 'true',
        appCode: this.$route.query.code,
      },
    });
    window.open(href, '_blank');
  }
}
</script>
<style lang="less" scoped></style>
