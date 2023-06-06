<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <UpdateCodeTemplate :importVM="_self">
    <template slot="subCodeList">
      <template v-for="(item, key) in subClassificationList">
        <div v-if="getSubCodeItem(item).length" :key="key" class="collapse">
          <div class="collapse-title" @click="toogleShow(item)">
            <span class="collapse-icon">
              <a-icon v-if="item[0].show" type="right" />
              <a-icon v-else type="down" />
            </span>
            <span>{{ item[0].parentSchemaName }}</span>
          </div>
          <div v-show="!item[0].show" class="collapse-content">
            <a-table
              :pagination="false"
              :columns="tabPaneConfig[2].tableColumnsConfig"
              :data-source="getSubCodeItem(item)"
            >
              <template slot="newCode" slot-scope="text, record">
                <div class="model-item">
                  <a-input
                    v-model="record.newCode"
                    :placeholder="$t('languages.Apps.PlzFillInNewCode')"
                    :maxLength="28"
                  />
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </template>
    </template>
    <template slot="formModelMap">
      <template v-for="(item, key) in list.formModelMap">
        <div v-if="getFormModelItem(item).length" :key="key" class="collapse">
          <div class="collapse-title" @click="toogleShow(item)">
            <span class="collapse-icon">
              <a-icon v-if="item[0].show" type="right" />
              <a-icon v-else type="down" />
            </span>
            <span>{{ item[0].schemaName }}</span>
          </div>
          <div v-show="!item[0].show" class="collapse-content">
            <a-table
              :pagination="false"
              :columns="tabPaneConfig[3].tableColumnsConfig"
              :data-source="getFormModelItem(item)"
            >
              <template slot="newCode" slot-scope="text, record">
                <div class="model-item">
                  <a-input
                    v-model="record.newCode"
                    :placeholder="$t('languages.Apps.PlzFillInNewCode')"
                    :maxLength="24"
                  />
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </template>
    </template>
  </UpdateCodeTemplate>
</template>
<script lang="ts">
import { Input, Table, Tabs, Icon, Tooltip } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinUpdateCode from '../../../../components/global/modal/import/mixins/update-code';
import UpdateCodeTemplate from '../../../../components/global/modal/import/templates/update-code-template.vue';

@Component({
  name: 'update-code',
  components: {
    AInput: Input,
    ATable: Table,
    AIcon: Icon,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ATooltip: Tooltip,
    UpdateCodeTemplate,
  },
})
export default class UpdateCode extends mixins(MixinUpdateCode) {
  @Prop() type!: any;

  tabPaneConfig: any[] = [
    {
      listKey: 'appCodeList',
      tabName: '应用',
      required: true,
      showSearch: false,
      dataSource: [],
      showTabWhileRequired: false,
      tableColumnsConfig: [
        {
          title: '应用',
          key: 'appName',
          dataIndex: 'appName',
        },
        {
          title: '原编码',
          key: 'appCode',
          dataIndex: 'appCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'modelCodeList',
      tabName: '模型',
      required: true,
      showSearch: false,
      dataSource: [],
      showTabWhileRequired: false,
      tableColumnsConfig: [
        {
          title: '模型',
          key: 'modelName',
          dataIndex: 'modelName',
        },
        {
          title: '原编码',
          key: 'modelCode',
          dataIndex: 'modelCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'subCodeList',
      tabName: '子表',
      required: true,
      showSearch: true,
      customRender: true,
      dataSource: [],
      showTabWhileRequired: false,
      tableColumnsConfig: [
        {
          title: '模型',
          key: 'modelName',
          dataIndex: 'modelName',
        },
        {
          title: '原编码',
          key: 'modelCode',
          dataIndex: 'modelCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'formModelMap',
      tabName: '表单',
      showSearch: true,
      required: false,
      dataSource: [],
      showTabWhileRequired: false,
      tableColumnsConfig: [
        {
          title: '表单',
          key: 'sheetName',
          dataIndex: 'sheetName',
        },
        {
          title: '原编码',
          key: 'sheetCode',
          dataIndex: 'sheetCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'workflowList',
      tabName: '流程',
      required: false,
      showSearch: false,
      dataSource: [],
      showTabWhileRequired: false,
      tableColumnsConfig: [
        {
          title: '流程',
          key: 'workflowName',
          dataIndex: 'workflowName',
        },
        {
          title: '原编码',
          key: 'workflowCode',
          dataIndex: 'workflowCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'reportCodeList',
      tabName: '报表',
      required: true,
      showSearch: false,
      dataSource: [],
      showTabWhileRequired: false,
      tableColumnsConfig: [
        {
          title: '报表',
          key: 'reportName',
          dataIndex: 'reportName',
        },
        {
          title: '原编码',
          key: 'reportCode',
          dataIndex: 'reportCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
  ];

  initTabKey() {
    const appLen = this.list.appCodeList.length;
    const modelLen = this.list.modelCodeList.length;
    const subLen = this.list.subCodeList.length;
    const reportLen = this.list.reportCodeList.length;
    if (appLen === 0 && modelLen > 0) {
      this.tabKey = '2';
    } else if (appLen === 0 && modelLen === 0 && subLen > 0) {
      this.tabKey = '3';
    } else if (appLen === 0 && reportLen > 0) {
      this.tabKey = '6';
    } else if (appLen === 0 && modelLen === 0 && subLen === 0) {
      this.tabKey = '4';
    } else {
      //Else Empty block statement
    }
  }

  mounted() {
    this.initTabKey();
    this.refreshDataSource();
  }

  toogleShow(item) {
    this.$set(item[0], 'show', !item[0].show);
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  @Watch('list')
  onListChange() {
    this.refreshDataSource();
  }

  get subClassificationList() {
    const res: any = {};
    this.list.subCodeList.forEach((el: any) => {
      if (res[el.parentSchemaCode]) {
        res[el.parentSchemaCode].push(el);
      } else {
        res[el.parentSchemaCode] = [el];
      }
    });
    return res;
  }

  getCodeList() {
    let existEmptyAppcode: boolean = false;
    let existEmptyModelcode: boolean = false;
    let existEmptySubCode: boolean = false;
    let exitstEmptyReportCode: boolean = false;
    let existValidAppcode: boolean = false;
    let existValidModelcode: boolean = false;
    let existValidSubCode: boolean = false;
    let exitstValidReportCode: boolean = false;
    if (this.list.appCodeList.length > 0) {
      // 应用
      existEmptyAppcode = this.list.appCodeList.some(
        (item: any) => !item.newCode,
      );
      existValidAppcode = this.list.appCodeList.some(
        (item: any) => !/^[a-zA-Z][a-zA-Z0-9_]{0,27}$/.test(item.newCode),
      );
    }

    if (this.list.modelCodeList.length > 0) {
      // 模型
      existEmptyModelcode = this.list.modelCodeList.some(
        (item: any) => !item.newCode,
      );
      existValidModelcode = this.list.modelCodeList.some(
        (item: any) => !/^[a-zA-Z][a-zA-Z0-9_]{0,23}$/.test(item.newCode),
      );
    }

    if (this.list.subCodeList.length > 0) {
      // 子表
      existEmptySubCode = this.list.subCodeList.some(
        (item: any) => !item.newCode,
      );
      existValidSubCode = this.list.subCodeList.some(
        (item: any) => !/^[a-zA-Z][a-zA-Z0-9_]{0,27}$/.test(item.newCode),
      );
    }

    if (this.list.reportCodeList.length > 0) {
      // 报表
      exitstEmptyReportCode = this.list.reportCodeList.some(
        (item: any) => !item.newCode,
      );
      exitstValidReportCode = this.list.reportCodeList.some(
        (item: any) => !/^[a-zA-Z][a-zA-Z0-9_]{0,27}$/.test(item.newCode),
      );
    }

    if (
      existEmptyModelcode ||
      existEmptyAppcode ||
      existEmptySubCode ||
      exitstValidReportCode
    ) {
      let type = '应用';
      if (existEmptyAppcode) {
        this.tabKey = '1';
        type = '应用';
      } else if (existEmptyModelcode) {
        this.tabKey = '2';
        type = '模型';
      } else if (existEmptySubCode) {
        this.tabKey = '3';
        type = '子表';
      } else {
        this.tabKey = '6';
        type = '报表';
      }
      this.$message.error(type + '新编码不能为空');
      return null;
    }

    if (
      existValidAppcode ||
      existValidModelcode ||
      existValidSubCode ||
      exitstValidReportCode
    ) {
      let type = '应用';
      if (existValidAppcode) {
        this.tabKey = '1';
        type = '应用';
      } else if (existValidModelcode) {
        this.tabKey = '2';
        type = '模型';
      } else if (existValidSubCode) {
        this.tabKey = '3';
        type = '子表';
      } else {
        this.tabKey = '6';
        type = '报表';
      }

      this.$message.error(
        type +
          `编码格式必须以字母开头不超过${
            !existValidAppcode ? (!existValidModelcode ? 28 : 24) : 28
          }个字符，仅支持字母、数字、下划线`,
      );
      return null;
    }
    return this.list;
  }

  additionalRefresh() {
    this.tabPaneConfig[0].showTabWhileRequired =
      this.type.appCodeRepeat || this.type.recycleCodeRepeat;
    this.tabPaneConfig[1].showTabWhileRequired = this.type.modelCodeRepeat;
    this.tabPaneConfig[2].showTabWhileRequired = this.type.modelCodeRepeat;
  }

  getFormModelItem(item) {
    return item.filter((el) => el.sheetName.indexOf(this.searchText) > -1);
  }

  searchSubCodeText: string = '';

  getSubCodeItem(item) {
    return item.filter((el) => el.modelName.indexOf(this.searchText) > -1);
  }

  get notMultiList() {
    return false;
  }

  /**
   * 校验时出现重复编码或其他属性时，显示的提示信息
   */
  get duplicationInfo() {
    return '检测到编码重名，修改后导入将生成新的应用或业务模型';
  }
}
</script>
<style lang="less" scoped>
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
      i {
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
</style>
