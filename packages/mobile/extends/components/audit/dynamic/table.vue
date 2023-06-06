<template>
  <div class="indexTable">
    <p v-if="tableList.tableTitle" class="title">{{ tableList.tableTitle }}</p>
    <a-table
      :columns="tableList.tableColumns"
      :data-source="tableList.tableData"
      :pagination="false"
      :rowKey="(record) => record.id"
    >
      <template slot="columnTooltip" slot-scope="text">
        <a-tooltip
          v-if="isShowTooltip"
          placement="top"
          overlayClassName="columnTooltip"
          :overlayStyle="{ maxWidth: '250px' }"
        >
          <template slot="title"><div v-html="text"></div></template>
          <div class="cardp" @mouseenter="visibilityChange($event)">
            <!-- {{ text ? text : '-' }} -->
            <div class="pdiv" v-html="text ? text : '-'"></div>
          </div>
        </a-tooltip>
        <div v-else class="cardp" @mouseenter="visibilityChange($event)">
          <!-- {{ text ? text : '-' }} -->
          <div class="pdiv" v-html="text ? text : '-'"></div>
        </div>
      </template>

      <span slot="num" slot-scope="text, records, index">{{
        Number(index) + 1
      }}</span>

      <template slot="operation" slot-scope="text, record">
        <a @click="showInfo(record)">详情</a>
        <a
          v-if="tableList.name === 'classIndex'"
          class="ml15"
          @click="toList(record, 1)"
          >目录</a>
        <!-- <a v-if="tableList.name=='classIndex'" class="ml15" @click="toList(record,2)">试题</a> -->
        <span
          v-if="
            tableList.name !== 'dynamicIndex' &&
            tableList.tableTitle &&
            record.fileName
          "
          class="action"
        >
          <i
            class="icon aufontAll h-icon-all-download"
            title="下载"
            @click="download(record)"
          ></i>
        </span>
      </template>
    </a-table>
    <a-pagination
      v-if="tableList.page && tableList.total && tableList.size"
      :page="tableList.page"
      :total="tableList.total"
      :showTotal="
        (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
      "
      :pageSize="tableList.size"
      :current="tableList.page"
      @change="changePage"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Table, Pagination, Tooltip } from '@h3/antd-vue';
import axios from 'axios';
import { each } from 'lodash';
@Component({
  name: 'tableList',
  components: {
    ATable: Table,
    APagination: Pagination,
    ATooltip: Tooltip,
  },
})
export default class tableList extends Vue {
  [x: string]: unknown;

  @Prop() tableList!: any;

  isShowTooltip: any = false;

  //显示详情
  showInfo(item: any) {
    this.$emit('modalInfo', item.id);
  }

  toList(item: any, index: any) {
    this.$emit('toList', item.id, index);
  }

  changePage(page, pageSize) {
    this.$emit('changePage', page);
  }

  visibilityChange(event) {
    const ev = event.target;
    const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
    const content_weight = ev.clientWidth; // 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
    // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
    if (ev_weight > content_weight) {
      // 实际宽度 > 可视宽度  文字溢出
      this.isShowTooltip = true;
    } else {
      // 否则为不溢出
      this.isShowTooltip = false;
    }
  }

  async download(item: any) {
    this.$emit('download', item);
  }
}
</script>
<style lang="less" scoped>
.indexTable {
  background: #fff;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 2px;
  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td {
    padding: 8px;
    text-align: center;
  }
  /deep/.ant-table-thead > tr > th {
    position: relative;
  }
  /deep/.ant-table-thead > tr > th:not(:last-child):before {
    position: absolute;
    top: 50%;
    right: 0;
    width: 1px;
    height: 1.6em;
    background-color: rgba(0, 0, 0, 0.06);
    transform: translateY(-50%);
    transition: background-color 0.3s;
    content: '';
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 18px;
  }
  /deep/.ant-pagination {
    display: flex;
    justify-content: right;
    margin: 16px 0;
  }
 .cardp {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 22px;
    /deep/p {
      width: 100% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    .pdiv{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
  }

  .ml15 {
    margin-left: 15px;
  }
}
.action i {
  margin-left: 10px;
  margin-right: 5px;
  cursor: pointer;
}
</style>
