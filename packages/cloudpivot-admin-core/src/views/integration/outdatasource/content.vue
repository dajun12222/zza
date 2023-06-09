<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <div class="integration__head">
      <section class="integration__title">
        {{ folderName }}
      </section>
      <section>
        <InputSearch
          v-model="searchKey"
          placeholder="搜索服务编码或显示名称"
          style="width: 240px"
          :allowClear="true"
          @search="onSearch"
        />
        <a-button type="primary" class="integration__button" @click="addMethod">
          新建方法
        </a-button>
      </section>
    </div>
    <div class="integration__table">
      <a-table
        class="table-user-list"
        :loading="tableLoading"
        :columns="columns"
        :dataSource="list"
        :pagination="false"
        :scroll="{ y: 500 }"
        :locale="{ emptyText: $t('languages.NoRelevantData') }"
        :rowClassName="(record) => (isCanExpand(record) ? '' : 'hide-expand')"
        rowKey="code"
      >
        <!-- 表头 -->
        <span slot="indexTitle" class="text-ellipsis">{{
          $t('languages.NO')
        }}</span>
        <span slot="codeTitle" class="text-ellipsis resize">方法编码</span>
        <span slot="nameTitle" class="text-ellipsis resize">方法名称</span>
        <span slot="dataBaseConnectIdTitle" class="text-ellipsis resize">数据源</span>
        <span slot="modifyTitle" class="text-ellipsis resize">更新时间</span>
        <span slot="actionTitle" class="text-ellipsis">{{
          $t('languages.integration.Action')
        }}</span>
        <!-- 表体 -->
        <span
          slot="code"
          slot-scope="text"
          v-hight-light="{ keyWords: wd, value: text }"
          :title="text"
          class="text-ellipsis"
        ></span>
        <span
          slot="name"
          slot-scope="text"
          v-hight-light="{ keyWords: wd, value: text }"
          :title="text"
          class="text-ellipsis"
        ></span>
        <span
          slot="dataBaseConnectId"
          slot-scope="text"
          :title="text"
          class="text-ellipsis"
          >{{ text }}</span>
        <span slot="modifiedTime" slot-scope="text" class="text-ellipsis">{{
          text
        }}</span>
        <span
          slot="action"
          slot-scope="text, record"
          class="integration__actions operation"
        >
          <template v-if="isOperation(record)">
            <i
              class="icon aufontAll h-icon-all-eye-o"
              @click="editMethod(record)"
            ></i>
          </template>
          <template v-else>
            <!-- 编辑 -->
            <i @click="editMethod(record)">编辑</i>
            <!-- 运行webserver -->
            <i @click="runItem(record)">运行</i>
            <!-- 删除服务条目 -->
            <i @click="popItem(record)">删除</i>
          </template>
        </span>
      </a-table>
    </div>
    <!-- 运行方法 -->
    <a-drawer
      :title="'运行'"
      :visible="showRunDrawer"
      :closable="true"
      :destroyOnClose="true"
      width="850"
      placement="right"
      @close="closeRunDrawer"
    >
      <run-method :target="currentItem" @close="closeRunDrawer" />
    </a-drawer>
    <!-- 添加或编辑SQL方法 -->
    <a-drawer
      :title="methodDrawerTitle"
      :visible="showSqlMethodDrawer"
      :closable="true"
      :destroyOnClose="true"
      width="850"
      placement="right"
      wrapClassName="method-drawer"
      @close="closeMethodDrawer"
    >
      <add-sql-method
        :poolList="poolList"
        :method="currentMethod"
        :datasourceCategoryId="datasourceCategoryId"
        @close="closeMethodDrawer"
        @submit="afterMethodChanged"
        @test="testMethod"
      />
    </a-drawer>
  </div>
</template>
<script lang="ts">
import serviceApi from 'cloudpivot-admin-core/src/apis/biz-service/service.api';
import * as BizSql from 'cloudpivot-admin-core/src/apis/biz-sql/index';
import Bus from 'cloudpivot-admin-core/src/utils/bus';
import { Input, Icon, Table, Drawer, Button } from '@h3/antd-vue';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import AddSqlMethod from './modals/add-method_sql.vue';
import RunMethod from './modals/run-method.vue';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';

const MethodModule = namespace('Integration/OutdatasourceMethods');
const UserModule = namespace('System/User');
@Component({
  name: 'integration-content',
  components: {
    RunMethod,
    AddSqlMethod,
    InputSearch,
    AIcon: Icon,
    AButton: Button,
    ATable: Table,
    ADrawer: Drawer,
  },
})
export default class IntegrationContent extends Vue {
  @MethodModule.State('isLoading') isLoading!: boolean;

  @MethodModule.State('wd') wd!: boolean;

  @MethodModule.State('list') list!: BizService.Datasource.Item[];

  @MethodModule.Mutation('filterServices') filterServices: any;

  @MethodModule.Mutation('setLoading') setLoading: any;

  @MethodModule.Action('getListDatasourceMethods')
  getListDatasourceMethods: any;

  @MethodModule.Action('deleteDatasourceMethods') deleteDatasourceMethods: any;

  @MethodModule.Action('getAdapters') getAdapters: any;

  @MethodModule.Action('deleteService') deleteService: any;

  @UserModule.State('isJustAdmin') isJustAdmin!: boolean;

  @UserModule.State('loginedUserInfo') loginedUserInfo!: any;

  tableLoading: boolean = false;

  /**
   * 按钮操作权限
   */
  isOperation(e: any): boolean {
    if (!e || !Object.keys(e).length) {
      return false;
    }
    if (
      this.isJustAdmin ||
      e.createdBy === this.loginedUserInfo.id ||
      this.loginedUserInfo.permissions.includes('SYS_MNG')
    ) {
      // 历史数据不做处理 admin账号、方法创建人不做处理
      return false;
    } else {
      return true;
    }
  }

  poolList: any[] = [];

  // 搜索关键字
  searchKey: string = '';

  folderName: string = '';

  datasourceCategoryId: string = '';

  expandedRowKeys: string[] = [];

  // 是否展示运行窗口
  showRunDrawer: boolean = false;

  // 当前操作的服务
  currentItem: any = {};

  // 是否展示添加/编辑服务窗口
  showServerDrawer: boolean = false;

  // 服务窗口标题
  serverDrawerTitle: string = '新建服务';

  // 服务窗口操作原数据
  serverItem: any = {};

  // 是否展示方法弹窗
  showMethodDrawer: boolean = false;

  showSqlMethodDrawer: boolean = false;

  showSqlTableMethodDrawer: boolean = false;

  showEditTableMethodDrawer: boolean = false;

  methodDrawerTitle: string = '新建sql查询方法';

  currentServer: any = null;

  currentMethod: any = {};

  // 是否展示引用弹窗
  showReferenceDrawer: boolean = false;

  // 是否展示有引用不可删除弹窗
  showReferenceWarn: boolean = false;

  // 是否展示提示修改业务模型绑定信息弹窗
  showReferenceInfo: boolean = false;

  // 表头信息
  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 80,
      key: 'index',
      align: 'center',
    },
    {
      dataIndex: 'code',
      slots: { title: 'codeTitle' },
      scopedSlots: { customRender: 'code' },
      width: 165,
      key: 'code',
      align: 'left',
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      width: 165,
      key: 'name',
      align: 'left',
    },
    {
      dataIndex: 'dataBaseConnectName',
      slots: { title: 'dataBaseConnectIdTitle' },
      scopedSlots: { customRender: 'dataBaseConnectName' },
      width: 165,
      key: 'dataBaseConnectName',
      align: 'left',
    },
    {
      dataIndex: 'modifiedTime',
      slots: { title: 'modifyTitle' },
      scopedSlots: { customRender: 'modifiedTime' },
      width: 220,
      key: 'modify',
      align: 'left',
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      width: 180,
      key: 'action',
    },
  ];

  // 当前正在刷新的SOAP服务
  syncingSoap: string = '';

  /**
   * 判断是否是restful服务或者soap服务
   */
  isCanExpand(record: BizService.Datasource.Item) {
    return /restful|soap|data_/i.test(record.dataBaseConnectId);
  }

  /**
   * 判断是否是restful服务
   */
  isRestful(record: BizService.Datasource.Item) {
    return /restful/i.test(record.dataBaseConnectId);
  }

  /**
   * 判断是否是soap服务
   */
  isSoap(record: BizService.Datasource.Item) {
    return /soap/i.test(record.dataBaseConnectId);
  }

  /**
   * 判断是否是database服务（数据库服务）
   */
  isDatabase(record: BizService.Datasource.Item) {
    return /^data_/i.test(record.dataBaseConnectId);
  }

  /**
   * 展开子表格
   */
  expandRow(expanded: boolean, record: any) {
    if (expanded) {
      this.expandedRowKeys.push(record.code);
    } else {
      this.expandedRowKeys = this.expandedRowKeys.filter(
        (key: string) => key !== record.code,
      );
    }
  }

  /**
   * 删除服务
   */
  async popItem(record: BizService.Datasource.Item) {
    const vm: any = this;
    this.$confirm({
      title: this.$t('languages.integration.ConfirmDeleteMethod'),
      okText: this.$t('languages.Apps.Ok').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        vm.deleteDatasourceMethods({ id: record.id }).then((res: any) => {
          if (!res.errcode) {
            vm.$message.success('删除成功');
            vm.getListDatasourceMethods(vm.datasourceCategoryId);
          } else {
            const msg: string = res.errmsg || '请求接口出错！';
            vm.$message.error(msg);
          }
        });
      },
    });
  }

  /**
   * 运行服务或方法
   */
  runItem(item: any) {
    this.currentItem = item;
    this.showRunDrawer = true;
  }

  /**
   * 测试并保存方法
   */
  testMethod(item: any) {
    console.log('测试方法', item);

    this.runItem(item);
    const target: any = { ...this.currentServer };
    Bus.$emit('renewMethodList', target);
  }

  /**
   * 关闭运行窗口
   */
  closeRunDrawer() {
    this.showRunDrawer = false;
  }

  /**
   * 根据编码及名称搜索服务
   */
  onSearch() {
    this.filterServices(this.searchKey);
  }

  /**
   * 清空搜索内容
   */
  clearKeyword() {
    this.searchKey = '';
    if (this.wd) {
      this.filterServices('');
    }
  }

  /**
   * 显示添加服务抽屉弹出
   */
  showAddDrawer(record?: BizService.Datasource.Item) {
    if (record) {
      this.serverDrawerTitle = '编辑服务';
      this.serverItem = record;
    } else {
      this.serverDrawerTitle = '新建服务';
      this.serverItem = {};
    }
    this.showServerDrawer = true;
  }

  /**
   * 关闭添加服务抽屉
   */
  closeServerDrawer() {
    this.showServerDrawer = false;
  }

  /**
   * 添加服务下的方法-弹窗
   */
  addMethod(record: BizService.Datasource.Item) {
    console.log('添加集成方法', record);
    this.methodDrawerTitle = '新建sql查询方法';
    this.currentServer = record;
    this.currentMethod = {};
    console.log('going to add sql server method');
    this.showSqlMethodDrawer = true;
  }

  /**
   * 编辑集成方法
   */
  editMethod(
    method: BizService.Method.Item,
    service?: BizService.Datasource.Item,
  ) {
    this.methodDrawerTitle = '编辑sql查询方法';
    this.currentServer = service;
    this.currentMethod = method;
    console.log('going to edit sql server method');
    this.showSqlMethodDrawer = true;
  }

  /**
   * 关闭方法添加/编辑弹窗
   */
  closeMethodDrawer() {
    this.showMethodDrawer = false;
    this.showSqlMethodDrawer = false;
    this.showSqlTableMethodDrawer = false;
    this.showEditTableMethodDrawer = false;
    this.$nextTick(() => {
      this.currentServer = null;
      this.currentMethod = {};
    });
  }

  /**
   * 添加/编辑sql查询方法成功后，重新获取对应服务下的方法列表
   * @params bindCount 方法绑定的业务模型方法的数量，以用于判断是否有绑定业务模型
   */
  afterMethodChanged(bindCount: number) {
    this.getListDatasourceMethods(this.datasourceCategoryId);
    const service: any = { ...this.currentServer };
    const method: any = { ...this.currentMethod };
    Bus.$emit('renewMethodList', service);
    this.closeMethodDrawer();
    if (bindCount) {
      this.currentItem = method;
      this.showReferenceInfo = true;
    }
  }

  /**
   * 切换目录时，更新右侧视图列表
   */
  setFolder(item: BizService.Folder.Item) {
    if (item) {
      this.folderName = item.name;
      this.datasourceCategoryId = item.id;
      this.expandedRowKeys = [];
      this.getListDatasourceMethods(item.id);
    } else {
      this.folderName = '';
      this.datasourceCategoryId = '';
      this.expandedRowKeys = [];
    }
  }

  /**
   * 手动刷新soap方法列表
   */
  syncMethod(record: BizService.Datasource.Item) {
    if (this.syncingSoap) {
      this.$message.warn('请等待上一次同步完成后操作');
      return;
    }
    this.syncingSoap = record.code;
    const timestamp: number = Date.now();
    serviceApi
      .refreshSoapMethods({
        serviceCode: record.code,
      })
      .then((res: any) => {
        if (res.errcode === 0 && Array.isArray(res.data)) {
          res.data.forEach((item: any, index: number) => {
            item.index = index + 1;
          });
          record.methods = res.data;
          Bus.$emit('renewMethodList', record, res.data);
          const diff: number = Date.now() - timestamp;
          const delay: number = diff > 1000 ? 0 : 1000;
          setTimeout(() => {
            this.syncingSoap = '';
            this.$message.success('刷新成功！');
          }, delay);
        } else {
          this.syncingSoap = '';
          this.$message.error('同步失败，请检查SOAP服务地址是否可用！');
        }
      })
      .finally(() => {});
  }

  /**
   * 展示查看引用弹窗
   */
  referMethod(record: BizService.Datasource.Item) {
    this.currentItem = record;
    this.showReferenceDrawer = true;
  }

  /**
   * 关闭查看引用弹窗
   */
  closeReferenceDrawer() {
    this.showReferenceDrawer = false;
    this.currentItem = null;
  }

  /**
   * 展示有引用信息不可删除弹窗
   */
  showReferWarn(record: BizService.Datasource.Item) {
    this.currentItem = record;
    this.showReferenceWarn = true;
  }

  /**
   * 关闭有引用信息不可删除弹窗
   */
  closeReferWarn() {
    this.showReferenceWarn = false;
    this.currentItem = null;
  }

  /**
   * 关闭修改后有引用信息的提示弹窗
   */
  closeReferInfo() {
    this.showReferenceInfo = false;
    this.currentItem = null;
  }

  getPoolList() {
    this.setLoading(true);
    BizSql.getBizSqlList()
      .then((res: Common.Data) => {
        console.log('get pool list:', res);
        if (res.errcode === 0 && Array.isArray(res.data)) {
          this.poolList = res.data;
        }
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  mounted() {
    this.getPoolList();
  }
}
</script>
<style lang="less" scoped>
@import '../../../styles/table.less';
.integration {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    .close-icon {
      color: rgba(17, 18, 24, 0.25);
      margin-right: 12px;
    }
  }
  &__title {
    font-size: 18px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: #111218;
  }
  &__button {
    width: 82px;
    margin-left: 16px;
    padding-left: 0;
    padding-right: 0;
    i {
      margin-right: 8px;
      font-size: 12px;
    }
  }
  &__table {
    &,
    /deep/.ant-table-header,
    /deep/.ant-table-body {
      &::-webkit-scrollbar {
        width: 0;
        display: none;
      }
    }
    // /deep/.ant-table-thead span {
    //   display: inline-block;
    //   height: 22px;
    //   color: rgba(17, 18, 24, 0.5);
    //   font-weight: 600;
    // }
    /deep/.ant-table-body {
      max-height: calc(100vh - 180px - 44px) !important;
      overflow: auto;
      table {
        padding: 0;
      }
      th,
      td {
        color: #111218;
        overflow: hidden;
      }
      /deep/.hide-expand .ant-table-row-expand-icon {
        display: none;
        pointer-events: none;
      }
      /deep/.ant-table-body {
        max-height: none !important;
      }
    }
    /deep/.ant-table-row {
      background-color: #fff;
    }
    /deep/.ant-table-expanded-row {
      &,
      &:hover {
        background-color: transparent;
      }
      > td {
        padding: 0 !important;
        background-color: inherit;
      }
    }
    /deep/.ant-table-expand-icon-th,
    /deep/.ant-table-row-expand-icon-cell {
      padding: 0 !important;
      width: 15px;
      min-width: 15px;
    }
  }
  &__actions {
    i {
      cursor: pointer;
    }
    i:last-child {
      padding-right: 0;
    }
  }
}
</style>

<style lang="less">
.method-drawer {
  z-index: 999;
  .ant-drawer-body {
    height: calc(100% - 55px - 26px);
    overflow: auto;
  }
}
.sync_spin {
  &,
  &:before {
    display: inline-block;
    animation: spining 1s infinite linear;
    -webkit-animation: spining 1s infinite linear;
  }
}
@keyframes spining {
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spining {
  100% {
    transform: rotate(360deg);
  }
}

.refer-modal_wrap {
  .ant-modal-body {
    max-height: 60vh;
    overflow-y: auto;
  }
  .ant-modal-footer {
    .ant-btn-default {
      display: none;
    }
  }
  .refer-modal {
    &_tip {
      display: flex;
      align-items: flex-start;
      min-height: 104px;
      padding: 16px 24px;
      margin-bottom: 20px;
      border-width: 1px;
      border-style: solid;
      border-radius: 4px;
      > i {
        flex: none;
        width: 24px;
        height: 24px;
        margin-right: 16px;
        font-size: 24px;
        line-height: 24px;
      }
      > article {
        flex: 1;
        header {
          color: #111218;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
        }
        p {
          margin-top: 4px;
          color: rgba(17, 18, 24, 0.5);
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
        }
      }
    }
    .success {
      border-color: #b7eb8f;
      background-color: #f6ffed;
      > i {
        color: #52c41a;
      }
    }
    .warn {
      border-color: #ffe58f;
      background-color: #fffbe6;
      > i {
        color: #faad14;
      }
    }
  }
}
</style>
