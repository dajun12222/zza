<template>
  <div>
    <elTable
      :columns="columns"
      :detail="false"
      :download="true"
      :dataContent="dataContent"
      @download="download"
      @tname="tname"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

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
  
  @Prop({}) dataContent?: any;
  
  @Prop() typeKey?: string;

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
      title: '案例名称',
      dataIndex: 'templateName',
      key: 'templateName',
      scopedSlots: { customRender: 'templateName' },
      ellipsis: true,
    },
    {
      title: '案例分类',
      dataIndex: 'classificationDirectory',
      key: 'classificationDirectory',
      width: 200,
    // },
    // {
    //   title: '审计单位',
    //   dataIndex: 'auditUnit',
    //   key: 'auditUnit',
    },
    {
      title: '更新时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      width: 120,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value.substr(0, 10);
        } else {
          obj = '-';
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

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  getDownloadUrl(refId: string) {
    let url = `${
      this.apiHost
    }/api/aliyun/download?refId=${getDownloadUrlNew.getRefId(refId)}`;
    if (this.token) {
      url += '&T=' + this.token;
    }
    return url;
  }

  async download(item: any) {
    const url = this.getDownloadUrl(item.refId);
    window.open(url);
  }

  async tname(item: any) {
    console.log(item)
    let attrSrc = this.getDownloadUrl(item.refId);
    
    window.open(
      'http://192.168.0.88:8001/view/url?url=' +
        encodeURIComponent(attrSrc) + '&name='+ item.fileName,
    );
  }
}
</script>
<style lang="less" scoped></style>
