<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <!-- <div class="biz-rule-list"> -->
  <div class="biz-rule-list">
    <div class="form clearfix">
      <div class="title">业务规则</div>
      <div class="btn-group">
        <a-dropdown>
          <a-button class="btn" type="primary">
            {{ $t('languages.Apps.AddNew') }}
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item
              @click="
                opSelectModeModal({ id: 'dataOperation', bizRuleType: 0 }, true)
              "
            >
              <div>数据操作</div>
            </a-menu-item>
            <a-menu-item
              @click="
                opSelectModeModal(
                  { id: 'regularOperation', bizRuleType: 2 },
                  true,
                )
              "
            >
              <div>定时任务</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div class="table">
      <a-table
        id="dataitem"
        :columns="columns"
        class="table-user-list"
        :pagination="false"
        :loading="false"
        :dataSource="dataSource"
        rowKey="id"
      >
        <span slot="indexTitle">{{ $t('languages.NO') }}</span>
        <span slot="codeTitle" class="resize">规则编码</span>
        <span slot="nameTitle" class="resize">规则名称</span>
        <span slot="bizRuleTypeTitle" class="resize">规则类型</span>
        <span slot="available" class="resize">状态</span>
        <span slot="developModeTitle" class="resize">方式</span>
        <span slot="actionTitle" class="resize">{{
          $t('languages.Apps.Action')
        }}</span>
        <!-- 数据插槽 -->
        <!-- <p
          slot="index"
          slot-scope="text, record"
          v-if="!record.defaultProperty"
        >
          {{ text }}
        </p>
        <p
          slot="code"
          class="text-ellipsis"
          slot-scope="text, record"
          v-if="!record.defaultProperty"
          :title="text"
        >
          <span v-hight-light="{'keyWords': keyWords, 'value': text }">
          </span>
        </p>
        <p
          slot="name"
          class="text-ellipsis"
          slot-scope="text, record"
          v-if="!record.defaultProperty"
        >
          <span v-hight-light="{'keyWords': keyWords, 'value': text }">
          </span>
        </p>-->
        <span :key="record.id" slot="bizRuleType" slot-scope="text, record">
          <template v-if="text === 0">数据操作</template>
          <template v-if="text === 1">获取集合</template>
          <template v-if="text === 2">定时任务</template>
          <!-- {{ text }} -->
        </span>
        <span
          slot="availableType"
          slot-scope="text, record"
          class="is-enabled"
          :class="{ _enabled: record.enabled }"
        >
          {{ record.enabled ? '生效' : '未生效' }}
        </span>
        <span slot="developmentMode" slot-scope="text" class="develop-mode">
          <template v-if="!text">可视化方式</template>
          <template v-if="text === 1">编码方式</template>
        </span>
        <span
          slot="action"
          slot-scope="text, record"
          class="action right operation"
        >
          <em @click="goToEditPage(record)">编辑</em>
          <em v-if="!record.defaultRule" @click="deleteItem(record)">删除</em>
          <em @click="showQuote(record)">查看引用</em>
        </span>
      </a-table>
    </div>
    <!-- 查看引用 -->
    <a-drawer
      v-if="quoteVisible"
      title="查看引用"
      width="850"
      placement="right"
      :closable="true"
      :visible="quoteVisible"
      wrapClassName="quote-drawer"
      @close="onCloseQuote"
    >
      <p class="summary">
        当前业务规则引用了以下{{
          quoteTableData ? quoteTableData.length : 0
        }}个数据项
      </p>
      <a-table
        size="middle"
        class="quoteTable"
        :pagination="false"
        :columns="quoteTableColumns"
        :dataSource="quoteTableData"
      >
        <template slot="index" slot-scope="text, record, index">
          {{ index + 1 }}
        </template>
        <template slot="quotename" slot-scope="text, record">
          {{
            $route.params.bizSchemaCode === record.quoteCode ? '本模型' : text
          }}
        </template>
      </a-table>
    </a-drawer>

    <!-- 新建/编辑业务规则弹窗 -->
    <a-modal
      v-model="selectMode"
      :title="getSelectModeModalTitle()"
      :destroyOnClose="true"
      :keyboard="false"
      width="480px"
      class="rule-edit-modal"
      @close="
        () => {
          selectMode = false;
        }
      "
      @ok="opEdit"
    >
      <a-form-model
        ref="ruleForm"
        :rules="rules"
        :model="ruleData"
        layout="horizontal"
        class="rule-edit-box"
      >
        <a-form-model-item
          label="选择编辑方式"
          prop="editMode"
          class="rule-edit-type-input"
        >
          <a-radio-group v-model="ruleData.modalType" class="rule-edit-type">
            <a-radio key="graphical" :value="0">
              <div
                class="options-box"
                :class="{ selected: ruleData.modalType === 0 }"
              >
                <div class="options-icon">
                  <img
                    src="./../../../assets/images/graphical-mode.png"
                    alt="可视化方式"
                  />
                </div>
                <div class="options-content">
                  <div class="content-title">可视化方式</div>
                  <div class="content-tips">拖拽节点编辑业务规则</div>
                </div>
                <div v-if="ruleData.modalType === 0" class="selected-icon">
                  <img
                    src="./../../../assets/images/option-selected.png"
                    alt="选中"
                  />
                </div>
              </div>
            </a-radio>
            <a-radio key="encoding" :value="1">
              <div
                class="options-box"
                :class="{ selected: ruleData.modalType === 1 }"
              >
                <div class="options-icon">
                  <img
                    src="./../../../assets/images/encoding-mode.png"
                    alt="编码方式"
                  />
                </div>
                <div class="options-content">
                  <div class="content-title">编码方式</div>
                  <div class="content-tips">通过代码编辑业务规则</div>
                </div>
                <div v-if="ruleData.modalType === 1" class="selected-icon">
                  <img
                    src="./../../../assets/images/option-selected.png"
                    alt="选中"
                  />
                </div>
              </div>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          :label="'规则名称'"
          prop="ruleName"
          :fieldDecoratorOptions="rules.ruleName"
        >
          <a-input v-model="ruleData.ruleName" :required="true" />
        </a-form-model-item>
        <a-form-model-item
          :label="'规则编码'"
          prop="ruleCode"
          :fieldDecoratorOptions="rules.ruleCode"
        >
          <a-input
            v-model="ruleData.ruleCode"
            :required="true"
            :disabled="!Number(selectModeEdit)"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!--查看执行日志-->
    <BizRuleLogList v-if="showLog" @close="showLog = false" />
  </div>
  <!-- </div> -->
</template>
<script lang="ts">
import {
  Dropdown,
  Menu,
  Table,
  Drawer,
  Button,
  Modal,
  FormModel,
  Input,
  Radio,
} from '@h3/antd-vue';
import { bizpropertyApi } from 'cloudpivot/api';
import { Component, Vue } from 'vue-property-decorator';
import BizRuleLogList from '../biz-rule/log/list.vue';

@Component({
  name: 'biz-rule-list',
  components: {
    ADropdown: Dropdown,
    AButton: Button,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ATable: Table,
    ADrawer: Drawer,
    AModal: Modal,
    AFormModel: FormModel,
    AFormModelItem: FormModel.Item,
    AInput: Input,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    BizRuleLogList,
  },
})
export default class BizRuleList extends Vue {
  dataSource = [];

  showLog: boolean = false;

  // 表格配置
  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: '7.7%',
      key: 'index',
      align: 'center',
    },
    {
      dataIndex: 'code',
      key: 'code',
      slots: { title: 'codeTitle' },
      scopedSlots: {
        customRender: 'code',
      },
      align: 'left',
      width: '15.4%',
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: {
        customRender: 'name',
      },
      key: 'name',
      align: 'left',
      width: '15.8%',
    },
    {
      dataIndex: 'bizRuleType',
      slots: { title: 'bizRuleTypeTitle' },
      scopedSlots: { customRender: 'bizRuleType' },
      key: 'bizRuleType',
      align: 'left',
      width: '15%',
    },
    {
      dataIndex: 'bizRuleTypeTitle',
      slots: { title: 'available' },
      scopedSlots: { customRender: 'availableType' },
      align: 'left',
      width: '13.9%',
    },
    {
      dataIndex: 'developmentMode',
      slots: { title: 'developModeTitle' },
      scopedSlots: { customRender: 'developmentMode' },
      align: 'left',
      width: '14.3%',
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      key: 'action',
      width: '17.9%',
    },
  ];

  quoteVisible: boolean = false;

  // 查看引用表格配置
  quoteTableColumns = [
    {
      title: '序号',
      with: 158,
      scopedSlots: { customRender: 'index' },
    },
    {
      title: '引用节点',
      dataIndex: 'nodeName',
      with: 208,
    },
    {
      title: '业务模型',
      dataIndex: 'quoteName',
      scopedSlots: { customRender: 'quotename' },
    },
    {
      title: '数据项',
      dataIndex: 'quotePropertyName',
    },
  ];

  // 查看引用表格配置
  nodes: Array<any> = [];

  get quoteTableData() {
    const result = [];
    this.nodes.forEach((node) => {
      if (Array.isArray((node as any).propertyModels)) {
        node.propertyModels.forEach((item) => {
          // @ts-ignore
          result.push({ nodeName: node.nodeName, ...item });
        });
      }
    });
    return result;
  }

  created() {
    this.loadData();
  }

  loadData() {
    const params = {
      schemaCode: this.schemaCode,
    };
    bizpropertyApi.listBySchemacode(params).then((res) => {
      if (res.errcode === 0) {
        this.dataSource = res.data.map((item, index) => {
          return {
            index: index + 1,
            ...item,
          };
        });
      }
    });
  }

  selectMode: boolean = false; // 是否打开选择模式弹窗

  selectModeEdit: string = '';

  selectModeRuleType: string = '';

  ruleData = {
    modalId: '',
    ruleName: '',
    ruleCode: '',
    modalType: 0,
    trueId: '',
  };

  rules = {};

  opSelectModeModal(rule, edit: boolean) {
    const { id, bizRuleType, code, name, editType } = rule;
    this.ruleData.modalId = id;
    this.selectModeEdit = `${Number(edit)}`;
    if (edit) {
      this.ruleData.ruleName = '';
      this.ruleData.ruleCode = '';
      this.ruleData.modalType = 0;
    } else {
      this.ruleData.ruleName = name;
      this.ruleData.ruleCode = code;
      this.ruleData.modalType = editType || 0;
    }
    this.selectModeRuleType = `${bizRuleType}`;
    this.selectMode = true;
    this.rules = {
      ruleName: [
        {
          required: true,
          message: '规则名称不能为空',
        },
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{0,50}$/gi,
          message: '规则名称仅支持输入中文、字母和数字，且仅支持50个字符以内',
        },
      ],
      ruleCode: [
        {
          required: true,
          message: '规则编码不能为空',
        },
        {
          pattern: /^[\d\w]{0,50}$/,
          message: '规则编码仅支持输入字母和数字，且仅支持50个字符以内',
        },
      ],
    };
  }

  getSelectModeModalTitle() {
    let selectModeEdit: string = '';
    let selectModeRuleType: string = '';
    switch (this.selectModeEdit) {
      case '0':
        selectModeEdit = '编辑';
        break;
      case '1':
        selectModeEdit = '新增';
        break;
      default:
        break;
    }
    switch (this.selectModeRuleType) {
      case '0':
        selectModeRuleType = '数据操作';
        break;
      case '1':
        selectModeRuleType = '获取集合';
        break;
      case '2':
        selectModeRuleType = '定时任务';
        break;
      default:
        break;
    }
    return `${selectModeEdit}${selectModeRuleType}`;
  }

  opEdit() {
    const ruleForm = this.$refs.ruleForm as any;
    ruleForm.validate((valid) => {
      if (valid) {
        const initRule = {
          enabled: false,
          id: '',
          name: this.ruleData.ruleName,
          code: this.ruleData.ruleCode,
          bizRuleType: +this.selectModeRuleType,
          node: '[{"x":327,"y":36,"width":158,"height":40,"nodeCode":"Start","isSelected":true,"nodeName":"开始","nodeType":"START","icon":"&#xe897;"},{"x":327,"y":196,"width":158,"height":40,"nodeCode":"End","isSelected":false,"nodeName":"结束","nodeType":"END","icon":"&#xe9a7;"}]',
          route:
            '[{"preNode":"Start","postNode":"End","points":["405, 76","405, 196"]}]',
          schemaCode: this.schemaCode,
          developmentMode: this.ruleData.modalType,
        };
        bizpropertyApi.businessruleCreate(initRule).then((res) => {
          if (res.errcode === 0) {
            this.ruleData.trueId = res.data.id;
            this.goToEditPage();
          } else {
            this.$message.error(res.errmsg);
          }
        });
        return true;
      } else {
        return false;
      }
    });
  }

  goToEditPage(ruleRecord?: any) {
    console.log('OK', this.ruleData);
    this.selectMode = false;
    const edit: boolean = Boolean(Number(this.selectModeEdit));
    let { modalId, ruleCode, ruleName, modalType, trueId } = this.ruleData;
    let bizRuleType = this.selectModeRuleType;
    if (ruleRecord) {
      modalId = ruleRecord.id;
      ruleCode = ruleRecord.code;
      ruleName = ruleRecord.name;
      modalType = ruleRecord.developmentMode || 0;
      bizRuleType = ruleRecord.bizRuleType;
    }

    switch (modalType) {
      case 0:
        this.opBizDesign(modalId, ruleCode || modalId, ruleName, edit, trueId);
        break;
      case 1:
        this.openWebIDE(modalId, ruleCode || modalId, ruleName, edit);
        break;
      default:
        break;
    }
  }

  opBizDesign(
    id: string,
    code: string,
    name: string,
    edit: boolean,
    trueId: string,
  ) {
    this.$router
      .push({
        name: 'biz-rule',
        params: { bizRuleCode: id },
        query: {
          isEdit: `${edit}`,
          code: code,
          name: name,
          id: trueId,
        },
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  deleteItem(items: any) {
    const vm: any = this;
    // const { published } = e;
    // const content = published ? this.$t('languages.Apps.DeleteTipsContent') : '';
    const params = {
      id: items.id,
    };
    vm.$confirm({
      title: '确定删除该业务规则么？',
      content: '',
      okText: this.$t('languages.Ok').toString(),
      cancelText: this.$t('languages.Cancel').toString(),
      onOk() {
        bizpropertyApi.businessruleDelete(params).then((res) => {
          if (res.errcode === 0) {
            vm.$message.success('删除成功！');
            vm.loadData();
          } else {
            vm.$message.error(res.errmsg);
          }
        });
      },
    });
  }

  showQuote(item) {
    bizpropertyApi.businessruleQuote({ id: item.id }).then((res) => {
      if (res.errcode !== 0) {
        return this.$message.error((res as any).errmsg);
      }
      this.nodes = res.data ? res.data.nodes : [];
      this.quoteVisible = true;
    });
  }

  onCloseQuote(item) {
    this.nodes = [];
    this.quoteVisible = false;
  }

  get schemaCode() {
    return this.$route.params.bizSchemaCode;
  }

  openWebIDE(id: string, code: string, name: string, edit: boolean) {
    this.$router
      .push({
        name: 'biz-rule-coding',
        params: { bizRuleCode: id },
        query: { isEdit: `${edit}`, code: code, name: name },
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
</script>
<style lang="less" scoped>
@import '../../../styles/table.less';
.biz-rule-list {
  .form {
    margin: 16px 0;
    .title {
      float: left;
      font-size: 18px;
      color: #111218;
      line-height: 26px;
    }
    .btn-group {
      float: right;
      .btn {
        margin-left: 8px;
        .icon {
          margin-right: 9px;
        }
      }
    }
  }

  .develop-mode {
    display: inline-block;
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #111218;
    line-height: 22px;
  }
  .action {
    .h-icon-all-delete-o {
      margin-left: 18px;
    }
    .h-icon-all-confluence-o {
      margin-left: 18px;
    }
  }
  .table {
    /deep/.ant-table-body {
      max-height: calc(100vh - 218px) !important;
      overflow-y: unset;
    }
  }
}
.quote-drawer {
  p.summary {
    margin: 3px 0 20px;
  }
}

.is-enabled {
  display: inline-block;
  line-height: 16px !important;
  text-align: center;
  width: 52px;
  height: 20px;
  background: rgba(17, 18, 24, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(17, 18, 24, 0.1);
  font-size: 12px;

  &._enabled {
    background: #e5efff;
    border: 1px solid #2970ff;
    color: #2970ff !important;
  }
}
.rule-edit-modal {
  .ant-form-item {
    margin-bottom: 16px;
    /deep/.ant-form-item-label {
      height: 22px;
      line-height: 22px;
      margin-bottom: 6px;
      > label {
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #111218;
        line-height: 22px;
        &::before,
        &::after {
          content: '';
        }
        &.ant-form-item-required::after {
          display: inline-block;
          margin-left: 2px;
          color: #f0353f;
          font-size: 14px;
          font-family: SimSun, sans-serif;
          line-height: 1;
          content: '*';
        }
      }
    }
    /deep/.ant-form-item-control-wrapper {
      height: 32px;
      line-height: 0;
      .ant-form-item-control {
        height: 100%;
        line-height: inherit;
      }
    }
    &:last-child {
      margin-bottom: 24px;
    }
  }
  /deep/.rule-edit-box {
    .rule-edit-type-input {
      .ant-form-item-label {
        margin-bottom: 8px;
      }
      .ant-form-item-control-wrapper {
        height: 80px;
      }
      .ant-form-item-control > span.ant-form-item-children {
        display: inline-block;
        line-height: 0px;
      }
      .rule-edit-type {
        line-height: 0px;
        label.ant-radio-wrapper {
          line-height: inherit;
          margin-right: 0;
          & + label.ant-radio-wrapper {
            margin-left: 24px;
          }
        }
        .ant-radio {
          display: none;
        }
        .options-box {
          position: relative;
          display: flex;
          padding: 18px 12px;
          width: 204px;
          height: 80px;
          background: #f9fbfc;
          border-radius: 2px;
          border: 1px solid #f9fbfc;
          .options-icon {
            width: 44px;
            height: 44px;
            margin-right: 8px;
            > img {
              width: 44px;
              height: 44px;
            }
          }
          .options-content {
            padding: 1px 0;
            .content-title {
              height: 20px;
              font-size: 12px;
              font-weight: 600;
              color: #111218;
              line-height: 20px;
            }
            .content-tips {
              margin-top: 4px;
              height: 18px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(17, 18, 24, 0.5);
              line-height: 18px;
            }
          }
          .selected-icon {
            position: absolute;
            top: -1px;
            right: -1px;
            width: 28px;
            height: 28px;
            > img {
              width: 28px;
              height: 28px;
            }
          }
          &.selected {
            border-color: #2970ff;
          }
        }
      }
    }
  }
}
</style>
