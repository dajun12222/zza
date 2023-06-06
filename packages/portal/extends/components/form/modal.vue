<template>
  <a-modal
    :visible="value"
    :title="title"
    class="indexModal"
    @cancel="close"
    @ok="close"
  >
    <table-con
      v-if="modalData && modalData.length > 0"
      :modalData="modalData"
    />
    <elTable
      v-if="columnDatas && columnDatas.length > 0"
      class="elTableData"
      :columns="columnDatas"
      :dataContent="tableData"
    />
    <slot></slot>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal, Descriptions } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import tableCon from './tableCon.vue';
@Component({
  name: 'modalList',
  components: {
    AModal: Modal,
    elTable,
    tableCon,
    ADescriptions: Descriptions,
  },
})
export default class modalList extends Vue {
  @Prop({ default: '详情' }) title?: string;

  @Prop({ default: false }) value?: any;

  @Prop() modalData!: any;

  @Prop() columnDatas?: any;

  @Prop() tableData?: any;

  show: boolean = false;

  close() {
    this.$emit('input', false);
  }
}
</script>
<style lang="less" scoped>
.indexModal {
  position: fixed;
  width: 100%;
  z-index: 100;
  .elTableData {
    margin-top: 20px;
  }
  /deep/.ant-modal-header {
    border-bottom: 0;
    padding: 24px 24px 0;
    height: auto;
  }
  /deep/ .ant-modal-title {
    font-weight: 600;
  }
  /deep/.ant-modal {
    width: 80% !important;
    min-width: 800px;
  }
  /deep/.ant-modal-body {
    padding-top: 20px;
  }
  .modalDiv {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    font-size: 12px;
    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    th,
    td {
      padding: 8px 16px;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
    }
    th {
      width: 120px;
      background: #fafafa;
      font-weight: 400;
    }
    td {
      min-width: 170px;
      display: table-cell;
      word-break: break-word;
      overflow-wrap: break-word;
    }
  }
}
</style>
