<template>
  <div>
    <elTable
      :columns="columns"
      :dataContent="dataContent"
      @downloadFile="goDetail"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import elTable from '@/../extends/views/dataCollection/components/table.vue';
@Component({
  name: 'newList',
  components: {
    elTable,
  },
})
export default class newList extends Vue {
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
      title: '数据批次',
      dataIndex: 'pc',
      key: 'pc',
    },
    {
      title: '来源单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '来源系统',
      dataIndex: 'laiyuan',
      key: 'laiyuan',
    },
    {
      title: '数据总条数',
      dataIndex: 'total',
      key: 'total',
    },

    {
      title: '数据采集时间',
      dataIndex: 'time',
      key: 'time',
    },

    {
      title: '数据导出',
      dataIndex: '数据下载',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 200,
    },
  ];

  @Prop({}) dataContent?: any;

  goDetail(item: any) {
    let { href } = this.$router.resolve({
      name: 'aduitFilesInfo',
      query: {
        id: item['id'],
        isOpenPage: 'true',
        appCode: this.$route.query.code,
      },
    });
    window.open(href, '_blank');
  }
}
</script>
<style lang="less" scoped></style>
