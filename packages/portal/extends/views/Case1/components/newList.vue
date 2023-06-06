<template>
  <div>
    <elTable
      :columns="columns"
      :dataContent="dataContent"
      :download="true"
      :detail="false"
      @download="download"
/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import api  from '@/../extends/api';
const qs = require('qs');

@Component({
  name: 'newList',
  components: {
    ATable: Table,
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
      title: '审计文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '被审计单位',
      dataIndex: 'responsibleUnit',
      key: 'responsibleUnit',
    },
    {
      title: '归档年度',
      dataIndex: 'filingYear',
      key: 'filingYear',
    },

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 70,
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

  async download(item: any) {
    let option = qs.stringify({
      id: item['id'],
    });

    let res: any = await api.fileDownload(option);

    let blob = new Blob([res], { type: 'application/docx' });

    let objectUrl = (
      (window as any).URL || (window as any).webkitURL
    ).createObjectURL(blob);
    let downFile = document.createElement('a');
    let fileName = item['fileName'];
    downFile.style.display = 'none';
    downFile.href = objectUrl;
    downFile.download = fileName;
    document.body.appendChild(downFile);
    downFile.click();
    document.body.removeChild(downFile);
    window.URL.revokeObjectURL(objectUrl);
  }
}
</script>
<style lang="less" scoped></style>
