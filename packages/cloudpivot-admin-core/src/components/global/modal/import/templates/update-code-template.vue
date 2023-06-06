<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    :class="{
      'update-code': true,
      'not-multi-list': importVM.notMultiList,
    }"
  >
    <div class="table-box">
      <div
        :class="{
          'table-box-tip': true,
          'not-multi-list': importVM.notMultiList,
        }"
      >
        <span class="icon aufontAll warning">&#xe99a;</span>
        <span class="file-status-txt">{{ importVM.duplicationInfo }}</span>
      </div>
      <a-table
        v-if="importVM.notMultiList"
        :pagination="false"
        :columns="importVM.listRule[0]['codeColumns']"
        :data-source="importVM.list"
      >
        <template slot="newInput" slot-scope="text, record">
          <div class="model-item 222">
            <a-input
              v-model="record[importVM.tableScopeInfo.code]"
              :class="record.isShow ? 'input-error' : ''"
              :placeholder="importVM.tableScopeInfo.placeholder"
              :maxLength="27"
              @change="importVM.valueChange(record)"
            >
              <a-tooltip
                v-if="record.isShow"
                slot="suffix"
                overlayClassName="import-server-hint"
                placement="bottom"
                :title="importVM.tableScopeInfo.duplicationTips"
              >
                <em class="icon aufontAll h-icon-all-close-circle"></em>
              </a-tooltip>
            </a-input>
          </div>
        </template>
      </a-table>

      <a-tabs v-else :activeKey="importVM.tabKey" @tabClick="importVM.tabClick">
        <!-- codeList一直会有但是只有存在重复时repeat才会为真 -->
        <template v-for="(config, index) in importVM.tabPaneConfig">
          <a-tab-pane
            v-if="
              importVM.list[config.listKey].length !== 0 &&
              (!config.required ||
                importVM.showTabWhileRequired ||
                config.showTabWhileRequired)
            "
            :key="index + 1 + ''"
          >
            <span slot="tab">
              {{ config.tabName
              }}<em v-if="config.required" style="color: red">*</em>
            </span>

            <InputSearch
              v-if="config.showSearch"
              v-model="importVM.searchText"
              :placeholder="'请输入' + config.tabName + '名称'"
              class="input-search"
              style="width: 260px; margin-bottom: 8px"
              :isAsync="true"
              :allowClear="true"
              @input="importVM.refreshDataSource(config.listKey)"
            />

            <slot :name="config.listKey">
              <a-table
                :pagination="false"
                :columns="config.tableColumnsConfig"
                :data-source="config.dataSource"
              >
                <template slot="newCode" slot-scope="text, record">
                  <div class="model-item">
                    <a-input
                      v-model="record.newCode"
                      :placeholder="'请输入' + config.tabName + '编码'"
                      :maxLength="28"
                      @change="importVM.inputChange"
                    />
                  </div>
                </template>
              </a-table>
            </slot>
          </a-tab-pane>
        </template>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Input, Table, Tabs, Icon, Tooltip } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';

@Component({
  name: 'update-code',
  components: {
    AInput: Input,
    ATable: Table,
    AIcon: Icon,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    InputSearch,
    ATooltip: Tooltip,
  },
})
export default class UpdateCodeTemplate extends Vue {
  @Prop()
  importVM!: any;
}
</script>
<style lang="less" scoped>
.ant-input-search {
  margin-bottom: 16px;
}
.collapse {
  margin-bottom: 16px;
  .collapse-title {
    height: 38px;
    font-size: 16px;
    color: #111218;
    line-height: 38px;
    cursor: pointer;
    &:hover {
      color: @primary-color;
      em {
        color: @primary-color;
      }
    }
    .collapse-icon {
      font-size: 14px;
      color: rgba(17, 18, 24, 0.5);
      margin-right: 8px;
    }
  }
}

.update-code {
  &.not-multi-list {
    min-height: 330px;
    .table-box-tip {
      margin-bottom: 13px;
      margin-top: 24px;
    }
  }
  .ant-tabs-tabpane {
    max-height: 470px;
    overflow: auto;
  }
  .table-box {
    &-tip {
      height: 40px;
      background: #fffbe6;
      border-radius: 4px;
      border: 1px solid #ffe58f;
      padding-left: 16px;
      & > .exclamation-circle,
      & > em {
        color: #faad14;
        font-size: 16px;
      }
      & > .file-status-txt {
        padding-left: 12px;
        font-size: 14px;
        font-weight: 400;
        line-height: 38px;
        color: rgba(17, 18, 24, 0.5);
      }
    }
    /deep/.ant-table {
      table {
        border: 1px solid #e9e9e9;
        border-bottom: none;
      }
      .ant-table-thead > tr > th {
        padding: 8px 10px;
      }
      .ant-table-tbody > tr > td {
        padding: 4px 10px;
      }
    }
  }
}

.warning {
  color: #f59a23;
}
</style>
