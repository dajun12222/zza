<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="history-version">
    <span class="reports-info" :class="{ 'en-us': !isChinese }">
      {{ $t('cloudpivot.list.pc.importRecord.importRecordTips2') }}
    </span>
    <div class="main-content">
      <a-table
        :dataSource="historyList"
        :pagination="false"
        :rowKey="getRowKey"
        :scroll="{ y: 'calc(100vh - 214px)' }"
        bordered
      >
        <!-- 序列 -->
        <a-table-column key="importTime" dataIndex="importTime" :width="164">
          <span slot="title" class="resize">{{
            $t('cloudpivot.list.pc.importRecord.importTime')
          }}</span>
        </a-table-column>

        <!-- 流程编码 -->
        <a-table-column key="schemaName" dataIndex="schemaName" :width="182">
          <span slot="title" class="resize">{{
            $t('cloudpivot.list.pc.importRecord.modelName')
          }}</span>
        </a-table-column>

        <!-- 版本号 -->
        <a-table-column
          key="originalFilename"
          dataIndex="originalFilename"
          :width="258"
        >
          <span slot="title" class="resize">{{
            $t('cloudpivot.list.pc.importRecord.fileName')
          }}</span>
        </a-table-column>

        <a-table-column key="taskStatus" dataIndex="taskStatus" :width="100">
          <span slot="title" class="resize">{{
            $t('cloudpivot.list.pc.importRecord.process')
          }}</span>
          <template slot-scope="text">
            <span
              class="icon aufontAll"
              :class="statusMapObj[text].icon"
            ></span>
            <span :title="statusMapObj[text].content">{{
              statusMapObj[text].content
            }}</span>
          </template>
        </a-table-column>

        <a-table-column key="detail" dataIndex="detail">
          <span slot="title" class="resize">{{
            $t('cloudpivot.list.pc.importRecord.detail')
          }}</span>
          <template slot-scope="text, record">
            <template v-if="record.taskStatus === 'END'">
              <span>{{
                $t('cloudpivot.list.pc.importRecord.detailTips')
              }}</span>
              <span class="light-green">{{ record.successCount }}</span>
              <span>{{
                $t('cloudpivot.list.pc.importRecord.detailTips2')
              }}</span>
            </template>
            <template v-else-if="record.taskStatus === 'FAIL'">
              <span v-if="record.successCount">
                <span>{{
                  $t('cloudpivot.list.pc.importRecord.detailTips')
                }}</span>
                <span class="light-green">{{ record.successCount }}</span>
                <span>{{
                  $t('cloudpivot.list.pc.importRecord.detailTips2')
                }}</span>
              </span>
              <span
                v-if="record.secondImportData && record.secondImportData.length"
              >
                <span v-if="record.successCount">{{
                  $t('cloudpivot.list.pc.importRecord.detailTips3')
                }}</span>
                <span class="red">{{ record.secondImportData.length }}</span>
                {{ $t('cloudpivot.list.pc.importRecord.detailTips4') }}
              </span>
              <span v-else-if="record.errorCount">
                <span
                  v-if="
                    record.successCount ||
                    (record.secondImportData && record.secondImportData.length)
                  "
                  >，</span>
                <span class="red">{{ record.errorCount }}</span>{{ $t('cloudpivot.list.pc.importRecord.detailTips5') }}
              </span>
            </template>
            <template v-else-if="record.taskStatus === 'INIT'">
              <span>{{ $t('cloudpivot.list.pc.importRecord.detailTips6')
                }}{{ record.frontTask
                }}{{ $t('cloudpivot.list.pc.importRecord.detailTips7') }}</span>
            </template>
            <template v-else-if="record.taskStatus === 'RUN'">
              <span>80%</span>
            </template>
            <template v-else-if="record.taskStatus === 'CHECK_ERROR'">
              <span v-if="record.errorType === 4">{{ record.errorMsg }}</span>
              <span v-else-if="record.errorType === 7">{{
                $t('cloudpivot.list.pc.importRecord.detailTips8')
              }}</span>
              <span v-else-if="record.errorType === 3">{{
                $t('cloudpivot.list.pc.importRecord.detailTips9')
              }}</span>
            </template>
            <template v-else-if="record.taskStatus === 'EXCEPTION'">
              <span>{{
                $t('cloudpivot.list.pc.importRecord.detailTips10')
              }}</span>
            </template>
            <template v-else>
              <span>&nbsp;</span>
            </template>
          </template>
        </a-table-column>

        <a-table-column key="opera" dataIndex="opera" :width="112">
          <span slot="title" class="resize">{{
            $t('cloudpivot.list.pc.importRecord.options')
          }}</span>
          <template slot-scope="text, record">
            <span
              class="opera-btn"
              @click.stop="onAction(mapStatusOpera(record).type, record)"
            >
              {{ mapStatusOpera(record).name }}
            </span>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <div class="pagination">
      <a-pagination
        :total="total"
        :showTotal="
          (total) => $t('cloudpivot.flowCenter.pc.total', { num: total })
        "
        :pageSize="pageSize"
        :current="curPage"
        :pageSizeOptions="pageSizeOptions"
        showSizeChanger
        showQuickJumper
        @change="onPaginationChange"
        @showSizeChange="onSizeChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Table, Tooltip, Popover } from '@h3/antd-vue';
import { Component, Vue } from 'vue-property-decorator';
import { listApi } from 'cloudpivot/api';

@Component({
  name: 'ImportsReports',
  components: {
    ATable: Table,
    ATableColumn: Table.Column,
    ATooltip: Tooltip,
    APopover: Popover,
  },
})
export default class ImportsReports extends Vue {
  historyList = [];

  total: any = 0;

  pageSize: any = 20;

  curPage: any = 1;

  pageSizeOptions: Array<string> = ['10', '20', '50', '100'];

  timer: any = null;

  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  onPaginationChange(value) {
    this.curPage = value;
    this.curPageData();
    this.limitFiveMinute();
  }

  onSizeChange(current, size) {
    this.curPage = 1;
    this.pageSize = size;
    this.curPageData();
    this.limitFiveMinute();
  }

  beforeMount() {}

  getRowKey(record) {
    return record.time;
  }

  onAction(actionType, data) {
    switch (actionType) {
      case 'dowmloadTemplate':
        this.exportTemplate();
        break;
      case 'modifyData':
        this.modifyData(data);
        break;
      case 'downloadError':
        this.downloadErrorFile(data);
        break;
      default:
        break;
    }
  }

  exportTemplate() {
    this.$emit('exportTemplate');
  }

  modifyData(data) {
    this.$emit('modifyData', data);
  }

  downloadErrorFile(data) {
    this.$emit('downloadErrorFile', data.fileName);
  }

  mounted() {
    this.curPageData();
    this.limitFiveMinute();
  }

  //导入记录轮询导入结果超过五分钟后报连接超时
  limitFiveMinute() {
    setTimeout(() => {
      if (
        this.historyList.some((item) =>
          ['RUN', 'INIT'].includes(item.taskStatus),
        )
      ) {
        clearTimeout(this.timer);
        this.$message.error('连接超时');
      }
    }, 300000);
  }

  curPageData() {
    listApi
      .getUserImportingProgress({ page: this.curPage, size: this.pageSize })
      .then((res: any) => {
        if (res.errcode === 0 && res.data) {
          if (
            this.getRefershSignByCompare(this.historyList, res.data.content)
          ) {
            this.$emit('successImport');
          }
          this.historyList = res.data.content;
          this.total = res.data.totalElements;
          //存在排队中或正在导入状态的导入任务时，五秒后重新调用接口刷新导入记录数据
          if (
            this.historyList.some((item) =>
              ['RUN', 'INIT'].includes(item.taskStatus),
            )
          ) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.curPageData();
            }, 5000);
          }
        } else {
          this.$message.error(res.errmsg);
        }
      });
  }

  errorIcon: any = 'h-icon-all-close-circle';

  successIcon: any = 'h-icon-all-check-circle';

  sequenceIcon: any = 'h-icon-all-clock-circle';

  loadingIcon: any = 'h-icon-all-loading-o';

  get statusMapObj() {
    return {
      FAIL: {
        content: this.$t('cloudpivot.list.pc.ImportFailed2') as string,
        icon: this.errorIcon,
      },
      END: {
        content: this.$t('cloudpivot.list.pc.ImportSuccess2') as string,
        icon: this.successIcon,
      },
      EXCEPTION: {
        content: this.$t('cloudpivot.list.pc.ImportFailed2') as string,
        icon: this.errorIcon,
      },
      INIT: {
        content: this.$t('cloudpivot.list.pc.Queuing') as string,
        icon: this.sequenceIcon,
      },
      RUN: {
        content: this.$t('cloudpivot.list.pc.Importing2') as string,
        icon: this.loadingIcon,
      },
      CHECK_ERROR: {
        content: this.$t('cloudpivot.list.pc.verifyError') as string,
        icon: this.errorIcon,
      },
    };
  }

  /**
   * 对比数据，判断有没有刷新模型数据列表的必要
   * 如果某个任务更新前是排队中或正在导入的状态
   * 更新后，变为了其他状态且successCount不为零
   * 即需要更新
   */
  getRefershSignByCompare(oldData, newData) {
    return oldData
      .filter((item) => ['RUN', 'INIT'].includes(item.taskStatus))
      .some((item) => {
        return newData.some((el) => {
          return (
            el.taskId === item.taskId &&
            !['RUN', 'INIT'].includes(el.taskStatus) &&
            el.successCount
          );
        });
      });
  }

  mapStatusOpera(record) {
    if ([1, 9].includes(record.errorType)) {
      if (record.secondImportData && record.secondImportData.length) {
        return {
          name: this.$t(
            'cloudpivot.list.pc.importRecord.modifyData',
          ).toString(),
          type: 'modifyData',
        };
      } else {
        return {
          name: this.$t(
            'cloudpivot.list.pc.importRecord.downloadError',
          ).toString(),
          type: 'downloadError',
        };
      }
    } else if ([8].includes(record.errorType)) {
      return {
        name: this.$t('cloudpivot.list.pc.importRecord.modifyData').toString(),
        type: 'modifyData',
      };
    } else if ([4, 7, 10].includes(record.errorType)) {
      return {
        name: this.$t(
          'cloudpivot.list.pc.importRecord.dowmloadTemplate',
        ).toString(),
        type: 'dowmloadTemplate',
      };
    } else {
      return {
        name: '',
        type: '',
      };
    }
  }

  destroyed() {
    clearTimeout(this.timer);
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.history-version {
  padding: 24px 24px 0 24px;
  display: flex;
  flex-direction: column;
  height: 100%;

  .reports-info {
    position: absolute;
    top: 18px;
    color: rgba(17, 18, 24, 0.5);
    left: 112px;
    &.en-us {
      left: 172px;
    }
  }

  .main-content {
    flex: 1;
    max-height: calc(100% - 50px);
    overflow: hidden;
  }

  .pagination {
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
  /deep/.ant-table {
    color: #111218;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 8px 16px;
    font-size: 13px;
    .opera-btn {
      color: @highlightColor;
      cursor: pointer;
    }
    .icon {
      font-size: 12px;
      padding-right: 8px;
      &.h-icon-all-close-circle {
        color: #f0353f;
      }
      &.h-icon-all-check-circle {
        color: #00c293;
      }
      &.h-icon-all-clock-circle {
        color: rgba(17, 18, 24, 0.25);
      }
      &.h-icon-all-loading-o {
        color: #2970ff;
        &::before {
          font-size: 14px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
      }
    }

    .light-green {
      color: #00c293;
    }

    .red {
      color: #f0353f;
    }
  }
  /deep/.ant-table-thead > tr > th {
    background: #f5f6f9;
    padding: 8px 16px;
    font-weight: bold;
    span {
      font-size: 14px;
      color: #111218;
    }
  }
  /deep/.ant-table-empty {
    .ant-table-body {
      overflow: inherit !important;
    }
  }
  .view {
    color: @highlightColor;
  }
  .resize {
    display: inline-block;
    height: 22px;
    width: calc(100% + 32px);
    padding: 0 16px;
    -webkit-transform: translateX(-16px);
    transform: translateX(-16px);
    font-weight: 600;
    i {
      font-size: 12px;
      line-height: 22px;
      color: rgba(17, 18, 24, 0.5);
      cursor: pointer;
    }
  }
  .resize-first {
    border-left: none;
  }
}

@keyframes spin {
  from {
    transform: scale(0.85714) rotate(0deg);
  }
  to {
    transform: scale(0.85714) rotate(360deg);
  }
}
</style>
