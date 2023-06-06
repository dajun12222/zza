<template>
  <div class="elTable">
    <a-table
      :columns="columns"
      :data-source="dataContent.content"
      :defaultExpandAllRows="defaultExpandAllRows"
      bordered
      :pagination="true"
      :rowClassName="tableRowClassName"
      :rowKey="
        (record, index) => {
          return record.pc;
        }
      "
    >
      <div slot="action" slot-scope="text, record">
        <span class="action">
          <a v-if="detail" @click="goDetail(record)">数据下载</a>
        </span>
      </div>
      <div slot="filterDetail" slot-scope="text, record">
        <span class="filterDetail">
          <a-button type="primary" size="small" @click="details(record)">详情</a-button>
        </span>
      </div>
      <div slot="actualValue" slot-scope="text, record">
        <span class="actualValue">
          <a-button
            v-if="record.thresholdCode === 'threshold_single_value'"
            type="primary"
            size="small"
            @click="dataDetails(record)"
            >数据详情
          </a-button>
          <span
            v-if="record.thresholdCode === 'threshold_single_value'"
            style="color: #333; margin-left: 5px"
            >({{ text }})</span>
          <span v-else style="color: #f00">{{ text }}</span>
        </span>
      </div>
      <div slot="groupDataInfo" slot-scope="text, record">
        <span class="groupDataInfo">
          <a-button
            v-if="
              record.thresholdJudgingCondition &&
              record.thresholdJudgingCondition === 'group'
            "
            type="primary"
            size="small"
            @click="groupDetails(record)"
            >详情</a-button>
        </span>
      </div>
      <div slot="aTooltip" slot-scope="text" class="aTooltip">
        <a-tooltip :overlayStyle="{ maxWidth: '300px' }">
          <template #title>{{ text }}</template>
          {{ text }}
        </a-tooltip>
      </div>
    </a-table>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table, Tooltip } from '@h3/antd-vue';

@Component({
  name: 'elTable',
  components: {
    ATable: Table,
    ATooltip: Tooltip,
    AButton: Button,
  },
})
export default class elTable extends Vue {
  selectIndex: number = 0;

  selectData: any = {};

  @Prop({ default: true }) detail?: boolean;

  @Prop({ default: false }) edit?: boolean;

  @Prop({ default: false }) del?: boolean;

  @Prop({ default: false }) download?: boolean;

  @Prop({ default: false }) defaultExpandAllRows?: boolean;

  @Prop({}) columns?: any;

  @Prop({}) dataContent?: any;

  pagination: {
    size: 'small';
    current: 1;
    pageSize: 5;
    total: 0;
  };

  create() {
    console.log('列表', this.dataContent);
    console.log('列表1', this.columns);
    // debugger
  }

  goDetail(item: any) {
    this.$emit('goDetail', item);
  }

  goEdit(item: any) {
    this.$emit('edit', item);
  }

  goDel(item: any) {
    this.$emit('del', item);
  }

  details(item: any) {
    this.$emit('details', item);
  }

  dataDetails(item: any) {
    this.$emit('dataDetails', item);
  }

  groupDetails(item: any) {
    this.$emit('groupDetails', item);
  }

  downloadFile(item: any) {
    this.$emit('download', item);
  }

  customRowClick(record, index) {
    return {
      on: {
        click: () => {
          this.selectData = record;
          this.$emit('customRowClick', record);
        },
      },
    };
  }

  tableRowClassName(row, rowIndex) {
    if (this.defaultExpandAllRows && this.selectData.id === (row && row.id)) {
      return 'isActive';
    }
  }

  handleTableChange({ current, pageSize }) {
    this.pagination.current = current;
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding: 8px;
}
.aTooltip {
  span {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.elTable /deep/ .isActive {
  background-color: #e6f7ff;
}
.action {
  a {
    margin: 0 7px;
  }
}
</style>
