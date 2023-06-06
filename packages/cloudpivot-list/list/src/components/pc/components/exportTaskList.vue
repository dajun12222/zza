<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="export-task-list">
    <div v-if="searchPage > 0" class="export__content">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :loading="false"
        :locale="{ emptyText: $t('cloudpivot.list.pc.noData') }"
        :pagination="false"
        :scroll="{ y: 'calc(100vh - 214px)' }"
        rowKey="id"
        size="small"
        :bordered="true"
      >
        <span slot="indexTitle">{{ $t('cloudpivot.list.pc.Number') }}</span>
        <span slot="refId" class="resize">{{
          $t('cloudpivot.list.pc.fileName')
        }}</span>
        <span slot="fileSize" class="resize">{{
          $t('cloudpivot.list.pc.fileSize')
        }}</span>
        <span slot="schemaName" class="resize">{{
          $t('cloudpivot.list.pc.modelName')
        }}</span>
        <span slot="endTime" class="resize">{{
          $t('cloudpivot.list.pc.exportTime')
        }}</span>
        <span slot="taskStatus" class="resize">{{
          $t('cloudpivot.list.pc.exportStatus')
        }}</span>
        <span slot="actionTitle" class="resize">{{
          $t('cloudpivot.list.pc.operation')
        }}</span>

        <span
          slot="refId"
          slot-scope="text"
          :title="text"
          class="text-ellipsis"
          >{{ text || '--' }}</span>
        <span
          slot="fileSize"
          slot-scope="text"
          :title="text"
          class="text-ellipsis"
          >{{ text || '--' }}</span>
        <span
          slot="schemaName"
          slot-scope="text"
          :title="text"
          class="text-ellipsis"
          >{{ text || '--' }}</span>
        <span
          slot="endTime"
          slot-scope="text"
          :title="text"
          class="text-ellipsis"
          >{{ text || '--' }}</span>
        <span
          slot="taskStatus"
          slot-scope="text"
          :title="text"
          class="text-ellipsis file-status-icon"
        >
          <span
            class="icon aufontAll"
            :class="[statusMapObj[text].icon, text]"
          ></span>
          <span :title="statusMapObj[text].content">{{
            statusMapObj[text].content
          }}</span>
        </span>
        <div
          slot="id"
          slot-scope="text, record"
          :class="{
            'biz-log__link': true,
            disabled: record.taskStatus !== 'END',
          }"
        >
          <a href="javascript:void(0)" @click="handleUploadFile(record)">{{
            $t('cloudpivot.list.pc.download')
          }}</a>
          <span @click="deleteRecord(record)">{{
            $t('cloudpivot.list.pc.Delete')
          }}</span>
        </div>
      </a-table>
    </div>

    <div v-show="searchPage > 0" class="export__footer">
      <a-pagination
        :current="params.page + 1"
        :defaultPageSize="params.size"
        :pageSizeOptions="pageSizeOptions"
        :showTotal="
          (total) => $t('cloudpivot.list.pc.Total', { num: totalPage })
        "
        :total="totalPage"
        showQuickJumper
        showSizeChanger
        @change="pageChange"
        @showSizeChange="pageSizeChange"
      />
    </div>

    <PageNoData
      v-if="totalPage === 0"
      :isShowNoData="true"
      type="show"
      :tipText="$t('cloudpivot.list.pc.NoData')"
      style="margin: 130px 0 150px"
    />

    <PageNoData
      v-else-if="searchPage === 0"
      :isShowNoData="true"
      type="search"
      :tipText="$t('cloudpivot.list.pc.NoData')"
      style="margin: 130px 0 150px"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { listApi } from 'cloudpivot/api';
import common from 'cloudpivot/common/pc';
import SmartSearch from './smart-search.vue';

const UserModule = namespace('System/User');

import { Table, Input, Progress, Pagination } from '@h3/antd-vue';

import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';

export enum statusEnum {
  RUN = '生成中',
  END = '生成成功',
  INIT = '排队中',
  FAIL = '生成失败',
}

@Component({
  name: 'ExportTaskList',
  components: {
    SmartSearch,
    PageNoData: common.components.PageNoData,
    ATable: Table,
    InputSearch,
    AProgress: Progress,
    APagination: Pagination,
  },
})
export default class ExportTaskList extends Vue {
  @Prop() isShowExportReportsModal!: boolean;

  statusFile: any = {
    RUN: statusEnum.RUN,
    END: statusEnum.END,
    INIT: statusEnum.INIT,
    FAIL: statusEnum.FAIL,
  };

  statusFileIcon: any = {
    RUN: 'h-icon-all-loading-o',
    END: 'h-icon-all-flow-pass',
    INIT: 'h-icon-all-symbol_Timeselector',
    FAIL: 'h-icon-all-flow-cancel',
  };

  dataSource = [];

  columns: any = [
    // 序号
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: 50,
      key: 'index',
      align: 'center',
    },
    //文件名称
    {
      dataIndex: 'refId',
      slots: { title: 'refId' },
      scopedSlots: { customRender: 'refId' },
      key: 'refId',
    },
    //文件大小
    {
      dataIndex: 'fileSize',
      slots: { title: 'fileSize' },
      scopedSlots: { customRender: 'fileSize' },
      key: 'fileSize',
      width: 88,
    },
    // 模型名称
    {
      dataIndex: 'schemaName',
      slots: { title: 'schemaName' },
      scopedSlots: { customRender: 'schemaName' },
      key: 'schemaName',
      width: 290,
    },
    //导出时间
    {
      dataIndex: 'endTime',
      slots: { title: 'endTime' },
      scopedSlots: { customRender: 'endTime' },
      key: 'endTime',
      width: 168,
    },
    //导出状态
    {
      dataIndex: 'taskStatus',
      slots: { title: 'taskStatus' },
      scopedSlots: { customRender: 'taskStatus' },
      key: 'taskStatus',
      width: 100,
    },
    // 操作
    {
      dataIndex: 'id',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'id' },
      key: 'id',
      width: 96,
      align: 'left',
    },
  ];

  statusList = [
    { id: 'END', name: '生成成功' },
    { id: 'FAIL', name: '生成失败' },
    { id: 'INIT', name: '排队中' },
    {
      id: 'RUN',
      name: '生成中',
    },
  ];

  totalPage: number = 0;

  searchPage: number = 0;

  pageSizeOptions: Array<string> = ['10', '20', '50', '100'];

  errorIcon: any = 'h-icon-all-close-circle';

  successIcon: any = 'h-icon-all-check-circle';

  sequenceIcon: any = 'h-icon-all-clock-circle';

  loadingIcon: any = 'h-icon-all-loading-o';

  params = {
    page: 0,
    size: 20,
    name: '',
  };

  created(): void {
    this.getTaskList();
  }

  @Watch('isShowExportReportsModal')
  changeShowList(val) {
    if (val) {
      this.getTaskList();
    }
    this.resetParams();
  }

  async deleteRecord(record: any) {
    if (record.taskStatus !== 'END') {
      return;
    }
    const id = record.id;
    const res = await listApi.deleteExportTaskList({ id: id });
    if (res.errcode === 0) {
      this.$message.success('删除成功');
      this.getTaskList();
    } else {
      (this as any).$message.error(res.errmsg);
    }
  }

  resetParams() {
    this.params.name = '';
    this.getTaskList();
  }

  query() {
    this.params.page = 0;
    this.getTaskList();
  }

  async handleUploadFile(record: any) {
    if (record.taskStatus !== 'END') {
      return;
    }
    const id = record.id;
    this.$emit('downLoadExportFile', id);
  }

  getFileSize(fileSize) {
    let temp: number = 0;
    let unit: string = 'kb';
    if (fileSize < Math.pow(1024, 2)) {
      temp = fileSize / 1024;
      unit = 'KB';
    } else if (fileSize < Math.pow(1024, 3)) {
      temp = fileSize / Math.pow(1024, 2);
      unit = 'MB';
    } else if (fileSize < Math.pow(1024, 4)) {
      temp = fileSize / Math.pow(1024, 3);
      unit = 'GB';
    } else {
      //Else Empty block statement
    }

    if (temp) {
      return temp.toFixed(2) + unit;
    } else {
      return temp;
    }
  }

  async getTaskList() {
    const params = {
      name: this.params.name,
      page: this.params.page,
      size: this.params.size,
    };
    const res = await listApi.getExportTaskList(params);
    if (res.errcode === 0) {
      res.data.content.forEach((item: any, index: number) => {
        item.fileSize = this.getFileSize(item.fileSize);
        item.index = index + 1 + params.page * params.size;
      });
      if (this.params.name) {
        this.searchPage = res.data.totalElements;
      } else {
        this.totalPage = res.data.totalElements;
        this.searchPage = res.data.totalElements;
      }
      this.dataSource = res.data.content;
    }
  }

  // 分页 page change 回调
  pageChange(page: number, pageSize: number) {
    this.params.page = page - 1;
    this.params.size = pageSize;
    this.getTaskList();
  }

  /**
   * 修改分页大小
   */
  pageSizeChange(current: number, pageSize: number) {
    this.params.page = 0;
    this.params.size = pageSize;
    this.getTaskList();
  }

  get statusMapObj() {
    return {
      FAIL: {
        content: this.$t('cloudpivot.list.pc.ExportFailed2') as string,
        icon: this.errorIcon,
      },
      END: {
        content: this.$t('cloudpivot.list.pc.ExportSuccess2') as string,
        icon: this.successIcon,
      },
      EXCEPTION: {
        content: this.$t('cloudpivot.list.pc.ExportFailed2') as string,
        icon: this.errorIcon,
      },
      INIT: {
        content: this.$t('cloudpivot.list.pc.Queuing') as string,
        icon: this.sequenceIcon,
      },
      RUN: {
        content: this.$t('cloudpivot.list.pc.Exporting') as string,
        icon: this.loadingIcon,
      },
      CHECK_ERROR: {
        content: this.$t('cloudpivot.list.pc.Queuing') as string,
        icon: this.errorIcon,
      },
    };
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
/deep/.page-no-data {
  padding: 105px 0px 188px !important;
  margin: unset !important;
  img {
    width: 163px;
    height: 163px;
  }
}
.export__content {
  /deep/.ant-table-small {
    border-radius: 2px;
    .ant-table-header {
      border-radius: 2px 2px 0 0 !important;
    }
    .ant-table-body {
      border-radius: 0 0 2px 2px !important;
      overflow-y: overlay !important;
    }
  }
  /deep/.ant-table-thead {
    background: #f8f8fb;
  }
}
.export__footer {
  float: right;
  padding: 13px 0;
  margin-right: 24px;
  /deep/.ant-pagination > li {
    border-radius: 2px;
    a,
    div,
    input {
      border-radius: 2px;
    }
    .ant-select-arrow {
      right: 7px;
    }
  }
}

.search {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  .ant-input-affix-wrapper {
    width: 212px;
  }
}

.file-status-icon {
  span {
    font-size: 13px;
    margin-right: 5px;
  }

  .icon {
    font-size: 12px;
  }

  .END {
    color: #00c293;
  }

  .RUN {
    color: #2970ff;
  }

  .INIT {
    color: #faad14;
  }

  .FAIL {
    color: #f4454e;
  }
}

.biz-log__link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > a {
    font-size: 13px;
    color: @highlightColor;
    cursor: pointer;
  }
  > span {
    margin-left: 5px;
    font-size: 13px;
    color: @highlightColor;
    cursor: pointer;
  }
  &.disabled {
    > a,
    > span {
      color: rgba(17, 18, 24, 0.25);
      cursor: not-allowed;
    }
  }
}

.ant-table-header.ant-table-hide-scrollbar {
  overflow: auto !important;
}

.ant-table-row-cell-break-word {
  padding: 12px 12px;
}

.export-task-list {
  padding: 24px 24px 0 24px;
  display: flex;
  flex-direction: column;
  height: 100%;

  .export__content {
    flex: 1;
  }

  .export__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
    &::before {
      content: '';
      border-top: thin solid #dddddd;
      width: 100vw;
      position: absolute;
      bottom: 50px;
      left: 0;
    }
  }
}

/deep/tr td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
