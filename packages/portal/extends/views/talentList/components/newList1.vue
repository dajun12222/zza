<template>
  <div>
    <elTable
      :columns="columns"
      :dataContent="dataContent"
      @goDetail="goDetail"
    />
    <el-modal v-model="showModel" :modalData="modalData" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import elModal from '@/../extends/components/form/modal.vue';

import api from '@/../extends/api';

const qs = require('qs');
@Component({
  name: 'newList',
  components: {
    ATable: Table,
    elTable,
    elModal,
  },
})
export default class newList extends Vue {
  showModel: boolean = false;

  modalData: any = [];

  columns: any = [
    // {
    //     title: '序号',
    //     dataIndex: 'index',
    //     key: 'index',
    //     align: 'center',
    //     width: 50,
    //     customRender: (text,record,index) => `${index+1}`,
    // },
    // {
    //     title: '人员编号',
    //     dataIndex: 'personCode',
    //     key: 'personCode',
    // },
    {
      title: '人员姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      ellipsis: true,
    },
    {
      title: '人员性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: '人员年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '所属单位',
      dataIndex: 'intermediaryName',
      key: 'intermediaryName',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '职务',
      dataIndex: 'post',
      key: 'post',
      ellipsis: true,
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
      key: 'telephone',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '工龄',
      dataIndex: 'workDate',
      key: 'workDate',
      width: 80,
    },
    {
      title: '资质证书',
      dataIndex: 'credentials',
      key: 'credentials',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '人才标签',
      dataIndex: 'tagsName',
      key: 'tagsName',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
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

  async goDetail(item: any) {
    //modalData
    let option = qs.stringify({
      id: item['id'],
    });
    const res: any = await api.outsideQueryInfo(option);
    let modalData = this.serialization(res.data);
    this.modalData = modalData;
    this.showModel = true;
  }

  serialization(data: any) {
    let option: any = [];
    let att: any = [];
    let mapping = this.mapping();
    for (let i in mapping) {
      let obj = {
        name: mapping[i],
        con: data[i],
        cols: '',
      };
      att.push(obj);
      if (att && att.length === 3) {
        option.push(att);
        att = [];
      }
    }
    if (att.length !== 0) {
      option.push(att);
    }
    return option;
  }

  mapping() {
    return {
      personCode: '人员编号',
      name: '人员姓名',
      gender: '人员性别',
      age: '人员年龄',
      intermediaryName: '所属单位',
      post: '职务',
      telephone: '联系方式',
      workDate: '工龄',
      credentials: '资质证书',
      tagsName: '人才标签',
      email: '邮箱',
      education: '学历',
    };
  }
}
</script>
<style lang="less" scoped></style>
