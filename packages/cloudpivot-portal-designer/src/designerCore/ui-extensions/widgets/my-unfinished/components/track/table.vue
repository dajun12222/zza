<template>
  <div class="elTable">
    <a-table
      v-if="
        defaultExpandAllRows
          ? dataContent && dataContent.content && dataContent.content.length > 0
          : true
      "
      :columns="columns"
      :data-source="dataContent.content"
      :defaultExpandAllRows="defaultExpandAllRows"
      :scroll="{ y: '430px' }"
      bordered
      :pagination="false"
      :rowClassName="tableRowClassName"
      :rowKey="
        (record, index) => {
          return record.id;
        }
      "
      :customRow="customRowClick"
    >
      <span slot="instanceName" slot-scope="text, record" style="display:flex;align-items:center">
        <img src="./icon@2x.png" alt="" style="width: 16px; height: 16px;margin-right:5px" />
        {{ record.instanceName }}
       
      </span>
      <span slot="instanceName2" slot-scope="text, record" style="display:flex;align-items:center">
        <img src="./icon@2x.png" alt="" style="width: 16px; height: 16px;margin-right:5px" />
        {{ record.instanceName }}
        <div
        v-show="record.urgeCount > 0"
          style="
           padding:0 5px;
            height: 16px;
            background: #fdeae9;
            border-radius: 2px;
            color: #F0353F;
            font-size:10px;
            text-align:center;
            line-height:16px
          "
        >
          催办×{{ record.urgeCount }}
        </div>
      </span>
      <span slot="reminder" slot-scope="text, record">
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="alert"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 00-11.3 0l-39.6 39.6a8.03 8.03 0 000 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 00-11.3 0l-67.9 67.9a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z"
          />
        </svg>
      </span>
      <span slot="attention" slot-scope="text, record">
        <div>
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="star"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M512.5 190.4l-94.4 191.3-211.2 30.7 152.8 149-36.1 210.3 188.9-99.3 188.9 99.2-36.1-210.3 152.8-148.9-211.2-30.7z"
              fill="#e6f4ff"
            />
            <path
              d="M908.6 352.8l-253.9-36.9L541.2 85.8c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L370.3 315.9l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1L239 839.4a31.95 31.95 0 0046.4 33.7l227.1-119.4 227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM665.3 561.3l36.1 210.3-188.9-99.2-188.9 99.3 36.1-210.3-152.8-149 211.2-30.7 94.4-191.3 94.4 191.3 211.2 30.7-152.8 148.9z"
              fill="#1677ff"
            />
          </svg>
        </div>
        <!-- <div>
          <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z" /></svg>
        </div> -->

        <!-- <img src="./icon@2x.png" alt="" style="width:16px;height:16px" /> -->
        <!-- {{ record.instanceName }} -->
      </span>

      <a slot="templateName" slot-scope="text, record" @click="tname(record)">{{
        record.templateName
      }}</a>

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

  pagination: any = {
    size: 'small',
    current: 1,
    pageSize: 5,
    total: 0,
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

  tname(item: any) {
    this.$emit('tname', item);
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
          console.log('click', record);
          this.$emit('goDetail', record);
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
    debugger;
    this.pagination.current = current;
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding: 8px;
  text-align: left;
  border-right: 0;
  border-bottom: 1px solid #f0f0f0;
}
/deep/ .ant-table-header > table,
/deep/ .ant-table-body > table {
  border: 0;
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
