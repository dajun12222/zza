<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="set-display-field">
    <div class="field-count">
      <span>{{ displayFieldList.length }}</span>
      <span>/3</span>
    </div>
    <div class="field-box">
      <draggable
        v-model="displayFieldList"
        :options="dragItemOptions"
        handle=".handles"
        @end="onEnd"
      >
        <template v-for="(item, index) in displayFieldList">
          <div :key="index" class="field-item">
            <FieldSelector
              :field="item"
              :dataSource="dataSource"
              :bizModel="bizModel"
              :ignoreDataItem="ignoreDataItem"
              :fieldList="displayFieldList"
              :displayFieldInput="true"
              :fieldDataSource="fieldDataSource"
              @emitChange="valueChange2($event, item)"
            />
            <span class="handles">
              <em class="icon aufontAll h-icon-all-drag"></em>
            </span>
            <span class="delete" @click="delField(index)">
              <em class="icon aufontAll h-icon-all-delete1"></em>
            </span>
          </div>
        </template>
      </draggable>
    </div>
    <div class="add-btn" :class="{ 'Pt-4': !displayFieldList.length }">
      <span
        v-if="
          displayFieldList.length < 3 && (bizModel || dataSource !== 'bizModel')
        "
        class="usable"
        @click="addField"
      >
        <em class="icon aufontAll h-icon-all-plus"></em>
        <span>添加字段</span>
      </span>
      <span v-else class="disabled">
        <em class="icon aufontAll h-icon-all-plus"></em>
        <span>添加字段</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch, Vue } from 'vue-property-decorator';

import Draggable from 'vuedraggable';

import FieldSelector from './field-selector.vue';

import { listApi } from 'cloudpivot/api';

@Component({
  name: 'display-field-selector',
  components: {
    Draggable,
    FieldSelector,
  },
})
export default class DisplayFieldSelector extends Vue {
  @Prop({
    default: () => {
      return [];
    },
  })
  fieldList!: any;

  @Prop()
  dataSource!: string;

  @Prop()
  bizModel!: string;

  @Prop({
    default: () => {
      return [];
    },
  })
  ignoreDataItem!: any[];

  displayFieldList: any = [];

  dragItemOptions: any = {
    ghostClass: 'ghostClass',
    fallbackClass: 'dragClass',
  };

  lastSearchParams: any = {
    dataSource: '',
    bizModel: '',
  };

  canAddField: boolean = true;

  Cus_GetPopupContainer(triggerNode) {
    return triggerNode.parentNode;
  }

  listChange() {
    this.$emit('emitChange', this.displayFieldList);
  }

  created() {
    this.displayFieldList = this.fieldList;
  }

  @Watch('dataSource', { immediate: true })
  dataSourceChange(val) {
    this.displayFieldList = [];
    this.initDisplayFieldDataSource({
      dataSource: this.dataSource,
      bizModel: this.bizModel,
    }).then(() => {
      this.displayFieldList = this.fieldList;
    });
  }

  @Watch('bizModel', { immediate: true })
  bizModelChange(val) {
    if (this.dataSource === 'bizModel') {
      this.displayFieldList = [];
      this.initDisplayFieldDataSource({
        dataSource: this.dataSource,
        bizModel: this.bizModel,
      }).then(() => {
        this.displayFieldList = this.fieldList;
      });
    }
  }

  @Watch('fieldList', { immediate: true })
  onValueChange(val: string) {
    const params = {
      dataSource: this.dataSource,
      bizModel: this.bizModel,
    };
    if (JSON.stringify(this.lastSearchParams) !== JSON.stringify(params)) {
      this.lastSearchParams = params;
      this.initDisplayFieldDataSource({
        dataSource: this.dataSource,
        bizModel: this.bizModel,
      }).then(() => {
        this.displayFieldList = this.fieldList;
      });
    } else {
      this.displayFieldList = this.fieldList;
    }
  }

  addField() {
    this.displayFieldList.push('');
  }

  valueChange2(val, item) {
    const index = this.displayFieldList.findIndex(
      (el) => el.value === item.value,
    );
    this.displayFieldList.splice(index, 1, val);
    this.listChange();
  }

  delField(index) {
    this.displayFieldList.splice(index, 1);
    this.listChange();
  }

  onEnd() {
    this.listChange();
  }

  fieldDataSource: any = [];

  @Watch('displayFieldList.length')
  fieldNumberChange(val) {
    if (val < this.fieldDataSource.length) {
      this.canAddField = true;
    } else {
      this.canAddField = false;
    }
  }

  async initDisplayFieldDataSource(props: any) {
    switch (props.dataSource) {
      case 'bizModel':
        const fieldListDataItems = JSON.parse(
          localStorage.getItem('fieldListDataItems') || '{}',
        );
        const schemaCode = props.bizModel;
        if (fieldListDataItems[schemaCode]) {
          this.fieldDataSource = fieldListDataItems[schemaCode];
        } else {
          this.fieldDataSource = await listApi
            .getDataItemList({
              schemaCode,
              isPublish: true,
            })
            .then(
              (res) => {
                if (res.errcode === 0) {
                  const d: any[] = [];
                  for (const item of res.data) {
                    d.push({
                      value: item.code,
                      name: item.name,
                      name_i18n: item.name_i18n,
                      type: item.propertyType,
                    });
                  }
                  return d;
                }
                return [];
              },
              () => {
                return Promise.resolve([]);
              },
            );
          fieldListDataItems[schemaCode] = this.fieldDataSource;
          localStorage.setItem(
            'fieldListDataItems',
            JSON.stringify(fieldListDataItems),
          );
        }
        break;
      case 'myUnfinished':
      case 'myFinished':
      case 'myRead':
      case 'myUnread':
      case 'myStart':
        const displayFieldDatasource = this.getWorkflowField(props.dataSource);
        this.fieldDataSource = displayFieldDatasource;
        break;
      default:
        break;
    }
  }

  getWorkflowField(type: string) {
    switch (type) {
      case 'myUnfinished':
        return [
          {
            value: 'instanceName',
            name: '流程名称',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'workflowName',
            name: '流程模板',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sequenceNo',
            name: '单据号',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'activityName',
            name: '当前节点',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'stayTime',
            name: '停留时间',
            name_i18n: null,
            type: 2,
          },
          {
            value: 'originatorName',
            name: '发起人',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'departmentName',
            name: '发起人组织',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'participantName',
            name: '处理人',
            name_i18n: null,
            type: 0,
          },
        ];
      case 'myFinished':
        return [
          {
            value: 'instanceName',
            name: '流程名称',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sequenceNo',
            name: '单据号',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'activityName',
            name: '审批节点',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'approvalName',
            name: '处理结果',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'finishTime',
            name: '处理时间',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'originatorName',
            name: '发起人',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'workflowInstanceState',
            name: '流程状态',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'participantName',
            name: '处理人',
            name_i18n: null,
            type: 0,
          },
        ];
      case 'myRead':
        return [
          {
            value: 'instanceName',
            name: '流程名称',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'workflowName',
            name: '流程模板',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sequenceNo',
            name: '单据号',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sourceName',
            name: '传阅来源',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'receiveTime',
            name: '接收时间',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'originatorName',
            name: '发起人',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'departmentName',
            name: '发起人组织',
            name_i18n: null,
            type: 0,
          },
        ];
      case 'myUnread':
        return [
          {
            value: 'instanceName',
            name: '流程名称',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'workflowName',
            name: '流程模板',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sequenceNo',
            name: '单据号',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sourceName',
            name: '传阅来源',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'receiveTime',
            name: '接收时间',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'originatorName',
            name: '发起人',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'departmentName',
            name: '发起人组织',
            name_i18n: null,
            type: 0,
          },
        ];
      case 'myStart':
        return [
          {
            value: 'instanceName',
            name: '流程名称',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'workflowName',
            name: '流程模板',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'sequenceNo',
            name: '单据号',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'startTime',
            name: '发起时间',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'finishTime',
            name: '完成时间',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'costTime',
            name: '耗时',
            name_i18n: null,
            type: 2,
          },
          {
            value: 'participants',
            name: '当前处理人',
            name_i18n: null,
            type: 0,
          },
          {
            value: 'stayTime',
            name: '已用时',
            name_i18n: null,
            type: 2,
          },
        ];
      default:
        break;
    }
  }
}
</script>

<style lang="less" scoped>
.set-display-field {
  position: relative;
  .field-count {
    position: absolute;
    display: inline-block;
    height: 20px;
    font-size: 12px;
    font-weight: 500;
    color: #111218;
    line-height: 20px;
    top: -24px;
    left: 54px;
  }
  .field-box {
    .field-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 30px;
      margin-bottom: 8px;
      /deep/.set-sort-field {
        width: calc(100% - 48px);
      }
      .handles,
      .delete {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        margin-left: 8px;
        text-align: center;
        color: rgba(17, 18, 24, 0.5);
        &:hover {
          cursor: pointer;
          color: rgba(17, 18, 24, 0.25);
        }
      }
    }
  }
  .add-btn {
    .usable {
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #2970ff;
      line-height: 20px;
      > em {
        font-size: 12px;
        margin-right: 4px;
      }
      &:hover {
        cursor: pointer;
        opacity: 0.75;
      }
    }
    .disabled {
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(17, 18, 24, 0.25);
      line-height: 20px;
      > em {
        font-size: 12px;
        margin-right: 4px;
      }
    }
  }
}
</style>
<style lang="less">
.Pt-4 {
  padding-top: 4px;
}
</style>
