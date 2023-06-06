<template>
  <div>
    <elTable
      :columns="columns"
      :dataContent="dataContent"
      @goDetail="goDetail"
    />
    <el-modal
      v-model="showModel"
      :modalData="modalData"
      :columnDatas="columnDatas"
      :tableData="tableData"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table, Tooltip } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import elModal from '@/../extends/components/form/modal.vue';

import api from '@/../extends/api';
const qs = require('qs');

@Component({
  name: 'newList',
  components: {
    ATable: Table,
    ATooltip: Tooltip,
    elTable,
    elModal,
  },
})
export default class newList extends Vue {
  showModel: boolean = false;

  modalData: any = [];

  columns: any = [
    {
      title: '审计类型',
      dataIndex: 'auditType',
      key: 'auditType',
    },
    {
      title: '问题名称',
      dataIndex: 'performanceForm',
      key: 'performanceForm',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '审计定性',
      dataIndex: 'auditQualitativeBasis',
      key: 'auditQualitativeBasis',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '审计依据',
      dataIndex: 'basisForPunishment',
      key: 'basisForPunishment',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },

    {
      title: '审计建议',
      dataIndex: 'auditSuggestion',
      key: 'auditSuggestion',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '引用次数',
      dataIndex: 'quoteCount',
      key: 'quoteCount',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 70,
    },
  ];

  columnDatas: any = [
    {
      title: '问题编号',
      dataIndex: 'problemCode',
      key: 'problemCode',
      width: 140,
    },
    {
      title: '问题名称',
      dataIndex: 'performanceForm',
      key: 'performanceForm',
      width: 200,
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '审计定性',
      dataIndex: 'auditQualitativeBasis',
      key: 'auditQualitativeBasis',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '审计依据',
      dataIndex: 'basisForPunishment',
      key: 'basisForPunishment',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },

    {
      title: '审计建议',
      dataIndex: 'auditSuggestion',
      key: 'auditSuggestion',
      width: 200,
    },
    {
      title: '得分',
      dataIndex: 'similarSum',
      key: 'similarSum',
      width: 90,
    },
  ];

  tableData: any = {};

  @Prop({}) dataContent?: any;

  async goDetail(item: any) {
    //modalData
    let option = qs.stringify({
      id: item['id'],
    });
    const res: any = await api.queryQuestionDetails(option);
    if (res.code === '00000') {
      let maps = res.data;
      let options = {
        problemCode: maps.problemCode,
        performanceForm: maps.performanceForm,
        auditQualitativeBasis: maps.auditQualitativeBasis,
        basisForPunishment: maps.basisForPunishment,
      };
      this.getSimilarQuestionMatch(options);
      maps.source = ['基础问题库', '本地问题库', '新增问题库'][maps.source - 1];
      let modalData = this.serialization(maps);
      this.modalData = modalData;
      this.showModel = true;
    } else {
      this.modalData = {};
    }
  }

  async getSimilarQuestionMatch(option: any) {
    const res: any = await api.similarQuestionMatch(option);
    if (res.code === '00000') {
      let option = res.data;
      // option.map((item:any) => {
      //     item['similarSum'] = (parseFloat(item['similarSum']) * 100).toFixed(2) + '%';
      // })
      this.tableData = {
        content: option,
      };
    } else {
      this.tableData = {};
    }
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
      performanceForm: '问题名称',
      problemCode: '问题编号',
      auditQualitativeBasis: '审计定性',
      basisForPunishment: '审计依据',
      auditSuggestion: '审计建议',
      auditType: '审计类型',
      tags: '标签',
      source: '来源', //{{ ['基础问题库','本地问题库','新增问题库'][info.source - 1] }}
    };
  }
}
</script>
<style lang="less" scoped></style>
