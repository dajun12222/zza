<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    v-model="visible"
    title="数据范围"
    width="640px"
    :maskClosable="false"
    wrapClassName="conditions-setter-modal"
    :destroyOnClose="true"
    :zIndex="1026"
    @cancel="closeModal"
    @ok="backData"
  >
    <template v-for="(dataConditions, index) in dataConditionsList">
      <query-conditions-group
        :key="`${index}_${time}`"
        :ref="`group_${index}`"
        :dataConditions="dataConditions"
        :dataItemControls="dataItemControls"
        :index="index"
        @delGroup="delGroup"
      />
    </template>
    <div class="add-group">
      <span @click="addConditionsGroup">
        <span class="add-or-icon aufontAll h-icon-all-plus-o"></span>
        <span>添加或条件</span>
      </span>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator';
import { observeModal } from 'cloudpivot/common/src/utils/dom';
import { Modal } from '@h3/antd-vue';
import { DataItemType } from 'cloudpivot-form/form/schema';

import {
  toFormControl,
  toFormControlType,
} from './utils/conditions-setter-util';
import { renderer } from 'cloudpivot-form/form';

import { listApi } from 'cloudpivot/api';

import QueryConditionsGroup from './query-conditions-group.vue';

interface ConditionType {
  propertyCode?: string;
  propertyType?: number;
  propertyValue?: string;
  queryFilterType?: string;
}

@Component({
  name: 'query-conditions-setter-modal',
  components: {
    AModal: Modal,
    QueryConditionsGroup,
  },
})
export default class QueryConditionsSetterModal extends Vue {
  @Prop() value!: any;

  @Prop({
    default: () => {
      return [];
    },
  })
  conditionsList!: ConditionType[][];

  @Prop()
  dataSource!: string;

  @Prop()
  bizModel!: string;

  visible: boolean = false;

  dataItemControls: any[] = [];

  dataConditionsList: any[] = [];

  ignoreDataItem: DataItemType[] = [
    DataItemType.LongText,
    DataItemType.Attachment,
    DataItemType.Sheet,
    DataItemType.ApprovalOpinion,
  ];

  time: string = new Date().toString();

  @Provide()
  getSourceType() {
    return;
  }

  @Watch('value')
  onValueChange(v: any) {
    this.visible = v;
    if (v) {
      this.dataItemControls = [];
      this.dataConditionsList = [];
      this.initDataItemList(this.bizModel).then(() => {
        this.initConditionGroups();
      });
      this.$nextTick(() => {
        observeModal('conditions-setter-modal');
      });
    } else {
      this.dataItemControls = [];
      this.dataConditionsList = [];
    }
  }

  closeModal() {
    this.dataItemControls = [];
    this.dataConditionsList = [];
    this.$emit('closeModal');
  }

  getData() {
    const res: any[] = [];
    this.dataConditionsList.forEach((el, index) => {
      const ref: any =
        this.$refs['group_' + index] && this.$refs['group_' + index][0];
      if (ref && ref.getValue) {
        const ResVal = ref.getValue();
        if (ResVal.length) {
          res.push(ResVal);
        }
      }
    });

    return res;
  }

  backData() {
    this.$emit('confirm', this.getData());
  }

  /**
   * 获取业务模型数据项，并构建控制器
   * @param bizModel
   */
  async initDataItemList(bizModel) {
    const schemaCode = bizModel;
    this.dataItemControls = await listApi
      .getDataItemList({
        schemaCode,
        isPublish: true,
      })
      .then(
        (res) => {
          if (res.errcode === 0) {
            const controls: any = {};
            res.data
              .filter(
                (item) =>
                  !this.ignoreDataItem.includes(item.propertyType) &&
                  !['workflowInstanceId', 'ownerDeptQueryCode'].includes(
                    item.code,
                  ),
              )
              .forEach((item) => {
                if (item.options) {
                  let dictionaryData = JSON.parse(item.options);
                  if (
                    !dictionaryData.dictionaryData &&
                    dictionaryData.options &&
                    dictionaryData.options.includes('checkedDictionary')
                  ) {
                    dictionaryData = JSON.parse(dictionaryData.options);
                  }
                  if (dictionaryData && dictionaryData.checkedDictionary) {
                    // 单选、多选、下拉单选、下拉多选使用了数据字典数据
                    const resOptions = dictionaryData.useDictionariesData.map(
                      (el: any) => el.name,
                    );
                    item.options = resOptions.join(';');
                    item.dictionariesData = JSON.stringify(dictionaryData);
                  } else if (dictionaryData && dictionaryData.dictionaryData) {
                  } else if (dictionaryData.options) {
                    item.options = dictionaryData.options;
                  } else {
                    //Else Empty block statement
                  }
                }
                const control = toFormControl(item);

                control.options.displayField = item.relativePropertyCode;

                if (control.type === 80) {
                  try {
                    control.options.relativePropertyCode = res.data.filter(
                      (el: any) => control.key === el.code,
                    )[0]['relativePropertyCode'];
                  } catch (error) {}
                }

                control.edit = true;
                controls[item.code] = control;
              });
            renderer.components.FormRendererHelper.mergeValue(
              Object.values(controls),
              {},
              true,
            );
            return Object.values(controls);
          }
          return [];
        },
        () => {
          return Promise.resolve([]);
        },
      );
    this.dataItemControls.forEach((item) => {
      this.$set(item, 'isUsed', false);
    });
  }

  /**
   * 根据属性值构建查询条件控制器集合
   */
  initConditionGroups() {
    this.conditionsList.forEach((conditions) => {
      const groupDataItemControls = [];
      conditions.forEach((condition) => {
        const dataItem = this.dataItemControls.find(
          (item) => item.key === condition.propertyCode,
        );
        const conditionDataItem = JSON.parse(JSON.stringify(dataItem));
        conditionDataItem.filterType = condition.queryFilterType;
        if (
          conditionDataItem.souceField.filterType !==
          conditionDataItem.filterType
        ) {
          conditionDataItem.souceField.filterType = condition.queryFilterType;
          conditionDataItem.type = toFormControlType(conditionDataItem);
        }
        if (
          [DataItemType.Date, DataItemType.Number, DataItemType.Time].includes(
            conditionDataItem.propertyType,
          ) &&
          ['Between', 'NotBetween'].includes(conditionDataItem.filterType)
        ) {
          conditionDataItem.options.defaultValue =
            condition.propertyValue.split(';');
          conditionDataItem.value = conditionDataItem.options.defaultValue;
        } else {
          conditionDataItem.options.defaultValue = condition.propertyValue;
          conditionDataItem.value = conditionDataItem.options.defaultValue;
        }
        groupDataItemControls.push(conditionDataItem);
      });
      this.dataConditionsList.push(groupDataItemControls);
    });
    if (!this.dataConditionsList.length) {
      this.dataConditionsList.push([]);
    }
  }

  addConditionsGroup() {
    const res = this.getData();
    const lastGroup = res[res.length - 1];
    if (res.length === this.dataConditionsList.length && lastGroup.length) {
      this.dataConditionsList.push([]);
    } else {
      this.$message.warning('请将空的条件组填写完整再进行添加');
    }
  }

  delGroup(index) {
    const conditions: any[] = [];
    this.dataConditionsList.forEach((el, index) => {
      const ref: any =
        this.$refs['group_' + index] && this.$refs['group_' + index][0];
      if (ref && ref.getValue) {
        const conditionsVal = ref.getConditions();
        if (conditionsVal.length) {
          conditions.push(conditionsVal);
        }
      }
    });
    this.dataConditionsList = conditions;
    this.time = new Date().toString();
    // this.dataConditionsList.splice(index, 1);
  }
}
</script>
<style lang="less" scoped>
.conditions-setter-modal {
  .add-group {
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #2970ff;
    line-height: 22px;
    margin: 0 auto;
    margin-top: 16px;
    > span {
      cursor: pointer;
      .add-or-icon {
        font-size: 12px;
        margin-right: 8px;
      }
    }
  }
}
</style>
<style lang="less">
.conditions-setter-modal {
  .ant-modal-body {
    min-height: 388px;
  }
}
</style>
