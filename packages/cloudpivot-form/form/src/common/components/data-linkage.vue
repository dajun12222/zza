<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    :title="$t('languages.Apps.FormDesignPage.DataLinkage')"
    width="700px"
    :visible="true"
    class="modal"
    :maskClosable="false"
    :keyboard="false"
    @cancel="closeModal"
  >
    <div>
      <a-row>
        <a-col :span="6"> 联动目标模型: </a-col>
        <a-col :span="18">
          <config-provider :locale="locale">
            <biz-models-selector
              :appCode="appCode"
              :value="bizModel"
              :isLinkData="true"
              :bizSchemaCode="currentAppCode"
              :folderId="appFunctionCode"
              appManagerFilter="true"
              placeholder="请选择"
              @change="onTreeChange"
              @select="onTreeSelect"
            />
          </config-provider>
        </a-col>
      </a-row>

      <a-row v-if="dataItem.type === 6 || dataItem.type === 10">
        <a-col :span="6"> 联动目标表单: </a-col>
        <a-col :span="18">
          <config-provider :locale="locale">
            <a-select
              v-model="currentTargetForm"
              style="width: 100%"
              @change="onFormChange"
            >
              <template v-for="item in targetFormList">
                <a-select-option :key="item.code" :value="item.code">
                  {{ item.name }}
                </a-select-option>
              </template>
            </a-select>
          </config-provider>
        </a-col>
      </a-row>

      <div class="conditions">
        <a-row class="subTitle"> 联动条件 </a-row>
        <a-row>
          <a-col :span="10" class="fieldlab"> 当前模型数据项 </a-col>
          <a-col :span="3" />
          <a-col :span="8" class="fieldlab"> 联动模型数据项 </a-col>
          <a-col :span="3" class="fieldlab" style="text-align: center">
            删除
          </a-col>
        </a-row>
        <a-row v-for="(row, index) in conditionList" :key="index">
          <a-col :span="10">
            <config-provider :locale="locale">
              <a-select
                v-model="row.currentDataItem"
                style="width: 100%"
                placeholder="请选择"
                :showSearch="true"
                optionFilterProp="children"
                @change="currentDataItemChange(row.currentDataItem, index)"
              >
                <a-select-opt-group>
                  <span slot="label" class="select-title">业务数据项</span>
                  <template v-for="item in row.currentDataItemList">
                    <a-select-option
                      v-if="!item.isSystem"
                      :key="item.code"
                      :value="item.code"
                      :title="item.name + '[' + item.code + ']'"
                      :disabled="item.disabled"
                    >
                      {{ `${item.name}[${item.code}]` }}
                    </a-select-option>
                  </template>
                </a-select-opt-group>
                <a-select-opt-group>
                  <span slot="label" class="select-title">系统数据项</span>
                  <template v-for="item in row.currentDataItemList">
                    <a-select-option
                      v-if="item.isSystem"
                      :key="item.code"
                      :value="item.code"
                      :title="item.name + '[' + item.code + ']'"
                      :disabled="item.disabled"
                    >
                      {{ `${item.name}[${item.code}]` }}
                    </a-select-option>
                  </template>
                </a-select-opt-group>
              </a-select>
            </config-provider>
          </a-col>
          <a-col :span="3" style="line-height: 32px; text-align: center">
            值等于
          </a-col>
          <a-col :span="8">
            <config-provider :locale="locale">
              <a-select
                v-model="row.targetDataItem"
                style="width: 100%"
                placeholder="请选择"
                :showSearch="true"
                optionFilterProp="children"
              >
                <a-select-opt-group>
                  <span slot="label" class="select-title">业务数据项</span>
                  <template v-for="item in row.targetDataItemList">
                    <a-select-option
                      v-if="!item.defaultProperty"
                      :key="item.code"
                      :value="item.code"
                      :title="item.name + '[' + item.code + ']'"
                    >
                      {{ `${item.name}[${item.code}]` }}
                    </a-select-option>
                  </template>
                </a-select-opt-group>
                <a-select-opt-group>
                  <span slot="label" class="select-title">系统数据项</span>
                  <template v-for="item in row.targetDataItemList">
                    <a-select-option
                      v-if="item.defaultProperty"
                      :key="item.code"
                      :value="item.code"
                      :title="item.name + '[' + item.code + ']'"
                    >
                      {{ `${item.name}[${item.code}]` }}
                    </a-select-option>
                  </template>
                </a-select-opt-group>
              </a-select>
            </config-provider>
          </a-col>
          <a-col :span="3" style="text-align: center; padding-top: 4px">
            <span
              v-if="conditionList.length > 1"
              class="delete"
              @click="deleteCondition(index)"
            >
              <i class="icon aufontAll h-icon-all-delete-o"></i>
            </span>
          </a-col>
        </a-row>
        <div class="add">
          <span>
            <span>
              <i class="icon aufontAll h-icon-all-plus-o"></i>
            </span>
            <span @click="addCondition('')">新增条件</span>
          </span>
        </div>
      </div>
      <div class="linkage">
        <a-row class="subTitle"> 联动填充 </a-row>
        <a-row>
          <a-col :span="10" class="fieldlab">
            <config-provider :locale="locale">
              <a-select v-model="targetItem" style="width: 100%" disabled>
                <a-select-option
                  :key="targetItem"
                  :value="targetItem"
                  :title="targetItem + '[' + targetItemKey + ']'"
                >
                  {{ `${targetItem}[${targetItemKey}]` }}
                </a-select-option>
              </a-select>
            </config-provider>
            <!-- <a-input :disabled="true" v-model="targetItem"></a-input> -->
          </a-col>
          <a-col :span="3" style="line-height: 32px; text-align: center">
            值等于
          </a-col>
          <a-col :span="11" class="fieldlab">
            <config-provider :locale="locale">
              <a-select
                v-model="targetDataItem"
                style="width: 100%"
                placeholder="请选择"
                :showSearch="true"
                optionFilterProp="children"
              >
                <a-select-opt-group>
                  <span slot="label" class="select-title">业务数据项</span>
                  <template v-for="item in targetDataItemList">
                    <a-select-option
                      v-if="!item.defaultProperty"
                      :key="item.code"
                      :value="item.code"
                      :title="item.name + '[' + item.code + ']'"
                    >
                      {{ `${item.name}[${item.code}]` }}
                    </a-select-option>
                  </template>
                </a-select-opt-group>
                <a-select-opt-group>
                  <span slot="label" class="select-title">系统数据项</span>
                  <template v-for="item in targetDataItemList">
                    <a-select-option
                      v-if="item.defaultProperty"
                      :key="item.code"
                      :value="item.code"
                      :title="item.name + '[' + item.code + ']'"
                    >
                      {{ `${item.name}[${item.code}]` }}
                    </a-select-option>
                  </template>
                </a-select-opt-group>
              </a-select>
            </config-provider>
          </a-col>
          <a-col :span="1" />
        </a-row>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="closeModal"> 取消 </a-button>
      <a-button
        type="primary"
        :disabled="$route.path.includes('apps/versionDetail/')"
        @click="cancelRelate"
      >
        取消联动
      </a-button>
      <a-button
        type="primary"
        :disabled="$route.path.includes('apps/versionDetail/')"
        @click="handleOk"
      >
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts">
import {
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Switch,
  Form,
  Row,
  Col,
  Select,
  Modal,
  Button,
} from '@h3/antd-vue';
import enUS from '@h3/antd-vue/lib/locale-provider/en_US';
import zhCN from '@h3/antd-vue/lib/locale-provider/zh_CN';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { formApi, listApi } from 'cloudpivot/api';
import { DataItemType, FormControlType } from '../../../schema';
import { DataItemState } from '../../stores/data-items.store';
import * as dataitemStore from '../../stores/data-items.store-helper';
import BizModelsSelector from './biz-models-selector/index.vue';
import StaffSelector from './form-staff-selector/pc/staff-selector.vue';

const DataModelModule = namespace('Apps/DataModel');

@Component({
  name: 'DataLinkModal',
  components: {
    BizModelsSelector,
    StaffSelector,
    Input,
    InputNumber,
    DatePicker,
    ASwitch: Switch,
    ConfigProvider,
    AForm: Form,
    AFromItem: Form.Item,
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    ASelectOptGroup: Select.OptGroup,
    AModal: Modal,
    AButton: Button,
  },
})
export default class DataLinkModal extends Vue {
  @Prop({
    type: Object,
  })
  modalData!: any;

  @Prop({
    default: () => ({}),
  })
  dataItem!: DataItemState;

  @DataModelModule.State('bizSheetCode') bizSheetCode: any;

  bizModel = '';

  currentTargetForm = ''; // 联动目标表单

  targetFormList: any[] = []; // 联动表单列表 模型对应多个表单

  // 目标模型字段数据源
  targetFieldList: { main: any[]; sub: any[] } = { main: [], sub: [] };

  // 当前模型数据字段数据源
  currentFieldList: { main: any[]; origin: any[] } = { main: [], origin: [] };

  targetDataItem = '';

  targetDataItemList: any[] = [];

  targetItem = '';

  targetItemKey = '';

  dataItemTypeList: any[] = [];

  // 选人
  staffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    showModel: true,
    mulpitle: this.modalData.type === 'bizRadioOption' ? false : true,
    showSelect: true,
    placeholder: '请选择',
  };

  conditionList: any[] = [];

  onTreeChange(val) {
    this.bizModel = val;
    // 根据目标schemaCode获取表单列表
    const currentDataItem = this.currentFieldList.origin.find((item) => {
      const opItem = this.dataItem.parentCode
        ? `${this.dataItem.parentCode}.${this.dataItem.code}`
        : this.dataItem.code;
      return item.code === opItem;
    });
    if (
      currentDataItem.type === DataItemType.Attachment ||
      currentDataItem.type === DataItemType.Address
    ) {
      formApi.getFormList(this.bizModel).then((res: any) => {
        if (res.errcode === 0 && Array.isArray(res.data) && res.data.length) {
          this.targetFormList = res.data.map((x: any) => {
            return {
              name: x.name,
              code: x.code,
            };
          });
          this.currentTargetForm = this.targetFormList[0].code;
          this.initTargetForm(this.bizModel, this.currentTargetForm);
        }
      });
    } else {
      this.initTargetForm(this.bizModel);
    }
  }

  onFormChange(val) {
    this.conditionList = [];
    this.initTargetForm(this.bizModel, this.currentTargetForm);
  }

  initTargetForm(schemaCode: string, sheetCode: string = '') {
    this.getTargetItem(schemaCode, sheetCode).then((res) => {
      this.currentFieldList.main = this.currentFieldList.origin.filter(
        (x) =>
          this.filterType(x) &&
          ![
            'sequenceNo',
            'id',
            'sequenceStatus',
            'name',
            'modifiedTime',
            'createdTime',
          ].includes(x.code) &&
          x.code !==
            (this.dataItem.parentCode
              ? `${this.dataItem.parentCode}.${this.dataItem.code}`
              : this.dataItem.code),
      );
      this.currentFieldList.main.forEach((item) => {
        item.disabled = false;
      });
      this.targetDataItem = '';
      this.conditionList = [
        {
          currentDataItem: undefined,
          targetDataItem: undefined,
          currentDataItemList: this.currentFieldList.main.slice(),
          targetDataItemList: [],
        },
      ];
    });
  }

  appCode = '';

  appFunctionCode = '';

  currentAppCode = '';

  onTreeSelect(val: any) {
    this.appCode = val[0];
    if (val.length > 2) {
      this.appFunctionCode = val[1];
    }
  }

  getTargetItem(schemaCode: string, sheetCode: string = '') {
    return new Promise((resolve, reject) => {
      const params = {
        schemaCode,
      };
      if (sheetCode) {
        params['formCode'] = sheetCode;
      }
      listApi.getDataItemList(params).then((res: any) => {
        const self = this;
        let data: any[] = [];
        if (res.status || res.data.errcode === 0) {
          data = res.data.data;
        }
        if (res.errcode === 0) {
          data = res.data;
        }
        this.targetFieldList.main = data;

        const currentDataItem = this.currentFieldList.origin.find((item) => {
          const opItem = this.dataItem.parentCode
            ? `${this.dataItem.parentCode}.${this.dataItem.code}`
            : this.dataItem.code;
          return item.code === opItem;
        });
        if (currentDataItem) {
          setTimeout(() => {
            this.targetDataItemList = this.targetFieldList.main
              .slice()
              .filter((x) =>
                this.filterCondition(currentDataItem.type, x, currentDataItem),
              );
          }, 0);
        }
        resolve(1);
      });
    });
  }

  addCondition(val?: any) {
    if (val) {
      this.conditionList.push(val);
    } else {
      this.conditionList.push({
        currentDataItem: undefined,
        targetDataItem: undefined,
        currentDataItemList: this.currentFieldList.main.slice(),
        targetDataItemList: [],
      });
    }
  }

  deleteCondition(index: number) {
    // 删除时释放
    const item: any = this.conditionList[index];
    if (item.currentDataItem) {
      const { key } = this.formatKey(item.currentDataItem);
      const chosenItem = this.currentFieldList.main.find((item) => {
        return item.code === key;
      });
      chosenItem.disabled = false;
    }
    if (item.targetDataItem) {
      const { key } = this.formatKey(item.targetDataItem);
      const chosenItem = this.targetFieldList.main.find((item) => {
        return item.code === key;
      });
      chosenItem.disabled = false;
    }
    this.conditionList.splice(index, 1);
  }

  deepCopy(item) {
    const str = JSON.stringify(item);
    return JSON.parse(str);
  }

  defaultValue: number = -1;

  hasDefault = false;

  mounted() {
    //增加判断，添加数据联动的时候编码为空，编辑才做查询动作
    if (this.bizModel) {
      formApi.getFormList(this.bizModel).then((res: any) => {
        if (res.errcode === 0 && Array.isArray(res.data) && res.data.length) {
          this.targetFormList = res.data.map((x: any) => {
            return {
              name: x.name,
              code: x.code,
            };
          });
        }
      });
    }
  }

  created() {
    this.currentAppCode = this.$route.params.bizSchemaCode;
    const data = this.modalData.data;
    const dataItemTypeArr: any[] = [];
    for (const key in DataItemType) {
      if (DataItemType.hasOwnProperty(key)) {
        dataItemTypeArr.push({
          key,
          value: DataItemType[key],
        });
      }
    }
    // let _items = dataitemStore.getDataItems(this).filter((x) => x.used);
    let _items = dataitemStore.getDataItems(this).filter((x) => {
      return !['workflowInstanceId', 'ownerDeptQueryCode'].includes(x.code);
    });

    if (this.$route.path.includes('apps/versionDetail/')) {
      _items = dataitemStore.getDataItems(this);
    }
    let items = JSON.parse(JSON.stringify(_items));
    if (this.dataItem.parentCode) {
      const sheet = items.find((x) => x.code === this.dataItem.parentCode);
      if (sheet) {
        this.targetItem = `${sheet.name}.${this.dataItem.name}`;
        this.targetItemKey = `${sheet.code}.${this.dataItem.code}`;
        if (Array.isArray(sheet.properties)) {
          const sheetItems = sheet.properties.filter((x: any) => {
            const flag = x.used;
            x.name = `${sheet.name}.${x.name}`;
            x.code = `${this.dataItem.parentCode}.${x.code}`;
            return flag || this.$route.path.includes('apps/versionDetail/');
          }) as any;
          items = items.concat(sheetItems);
        }
      }
    } else {
      this.targetItem = `${this.dataItem.name}`;
      this.targetItemKey = `${this.dataItem.code}`;
    }

    items.forEach((x: any) => {
      x.disabled = false;
    });
    this.currentFieldList.origin = JSON.parse(JSON.stringify(items));
    this.currentFieldList.main = items.filter((res) => {
      return (
        this.filterType(res) &&
        ![
          'sequenceNo',
          'id',
          'sequenceStatus',
          'name',
          'modifiedTime',
          'createdTime',
        ].includes(res.code) &&
        res.code !==
          (this.dataItem.parentCode
            ? `${this.dataItem.parentCode}.${this.dataItem.code}`
            : this.dataItem.code)
      );
    });

    if (data.value) {
      try {
        this.setBizmodel(data);
        this.hasDefault = true;
      } catch {}
    } else {
      this.addCondition();
    }
  }

  setBizmodel(data: any) {
    let obj: any = data.value;
    if (typeof data.value === 'string') {
      obj = JSON.parse(data.value);
    }

    this.bizModel = obj.targetModel;
    this.appCode = obj.appCode;
    this.appFunctionCode = obj.appFunctionCode;
    this.currentTargetForm = obj.formCode;
    this.getTargetItem(this.bizModel, this.currentTargetForm).then((res) => {
      if (obj.condition) {
        const op = obj.condition.split('&&').forEach((condition) => {
          const arr = condition.split(' ');
          if (arr.length > 0) {
            const currentDataItemKey = arr[0].substring(1, arr[0].length - 1);
            const { key: currentCode } = this.formatKey(currentDataItemKey);
            const item: any = {
              currentDataItem: currentDataItemKey,
              targetDataItem: arr[2].substring(1, arr[2].length - 1),
            };
            const currentDataItem = this.currentFieldList.main.find(
              (x) => x.code === currentCode,
            );
            if (currentDataItem) {
              currentDataItem.disabled = true;
              const { key } = this.formatKey(item.targetDataItem);
              const chosenItem = this.targetFieldList.main.find((item) => {
                return item.code === key;
              });
              if (chosenItem) {
                chosenItem.disabled = true;
              }
              const targetDataItemList = this.targetFieldList.main
                .slice()
                .filter((x) => this.filterCondition(currentDataItem.type, x));
              const currentDataItemList = this.currentFieldList.main.slice();
              item.targetDataItemList = targetDataItemList;
              item.currentDataItemList = currentDataItemList;
            } else {
              item.targetDataItemList = this.targetFieldList.main.slice();
              item.currentDataItemList = this.currentFieldList.main.slice();
            }

            const { key: currentKey } = this.formatKey(item.currentDataItem);
            item.currentDataItem = currentKey;
            const { key: targetKey } = this.formatKey(item.targetDataItem);
            item.targetDataItem = targetKey;

            item.currentDataItem = item.currentDataItem.split('|')[0];
            item.targetDataItem = item.targetDataItem.split('|')[0];

            // 导入修改了子表编码，兼容性处理
            const currentDataItemArr = item.currentDataItem.split('.');
            if (currentDataItemArr.length === 2) {
              const field = currentDataItemArr[1];
              const sheets: any[] = [];
              Object.values(this.modalData.items).forEach((el: any) => {
                if (el.type === 201) {
                  sheets.push(el);
                }
              });

              sheets.forEach((sheet) => {
                sheet.columns.forEach((column) => {
                  if (column.key === field) {
                    item.currentDataItem = column.parentKey + '.' + field;
                  }
                });
              });
            }

            this.addCondition(item);
          }
        });
      }
      if (obj.fillProperty) {
        const arr = obj.fillProperty.split(' ');
        const { key: targetDataItemKey } = this.formatKey(
          arr[2].substring(1, arr[2].length - 1),
        );
        this.targetDataItem = targetDataItemKey.split('|')[0];
      }
    });
  }

  /**
   * 弹框关闭
   */
  closeModal() {
    this.$emit('closeModal');
  }

  /**
   * 将数据传出
   */
  handleOk() {
    let backData: any = '';
    backData = this.bizmodeBack();
    if (!backData) {
      return;
    }

    this.$emit('backData', backData);
  }

  bizmodeBack() {
    if (!this.bizModel) {
      this.$message.error('请选择联动模型');
      return false;
    }
    if (!this.targetDataItem) {
      this.$message.error('联动填充项不能为空');
      return false;
    }
    //关联单选，多选联动模型需与关联模型相同
    if (this.targetDataItem.startsWith('RelevanceForm')) {
      const item = this.targetDataItemList.find((cond) => {
        return cond.code === this.targetDataItem;
      });
      if (item.relativeCode !== this.dataItem.relativeCode) {
        this.$message.error('联动填充项模型不相同');
        return false;
      }
    }

    if (this.conditionList.length > 0) {
      const flag = this.conditionList.some((cond) => {
        return !cond.currentDataItem || !cond.targetDataItem;
      });
      if (flag) {
        this.$message.error('条件配置项不能为空');
        return false;
      }
    } else {
      this.$message.error('条件配置项不能为空');
      return false;
    }

    const condition = this.conditionList
      .map((res) => {
        return `{${res.currentDataItem}} = {${res.targetDataItem}}`;
      })
      .join('&&');
    const obj = {
      targetModel: this.bizModel,
      condition,
      appCode: this.appCode,
      formCode: this.currentTargetForm,
      appFunctionCode: this.appFunctionCode,
      currentAppCode: this.currentAppCode,
      fillProperty: `{${this.targetItemKey}} = {${this.targetDataItem}}`,
    };

    obj.condition = this.formatCondition(obj.condition);
    obj.fillProperty = this.formatFillProperty(obj.fillProperty);
    return {
      value: JSON.stringify(obj),
      default: '',
    };
  }

  formatFillProperty(items) {
    const vm = this;
    const itemArr: string[] = items.split('=');
    const itemRes: any[] = [];
    itemArr.forEach((item: string, index: number) => {
      const currenCode = item.trim().slice(1, item.trim().length - 1);
      if (index === 1) {
        // 当前模型数据项
        const currentItem = vm.targetDataItemList.find((el) =>
          el.code.includes(currenCode),
        );
        if (currentItem.FormControlType) {
          itemRes.push(
            '{' +
              currenCode +
              '|' +
              currentItem.propertyType +
              '|' +
              currentItem.FormControlType +
              '}',
          );
        } else {
          itemRes.push('{' + currenCode + '|' + currentItem.propertyType + '}');
        }
      } else {
        //联动模型数据项
        itemRes.push('{' + currenCode + '}');
      }
    });
    return itemRes.join(' = ');
  }

  formatCondition(data) {
    const items = data.split('&&');
    const vm = this;
    const res: any[] = [];
    items.forEach((el: string) => {
      const itemArr: string[] = el.split('=');
      const itemRes: any[] = [];
      itemArr.forEach((item: string, index: number) => {
        const currenCode = item.trim().slice(1, item.trim().length - 1);
        if (index === 1) {
          // 当前模型数据项
          const currentItem = vm.targetFieldList.main
            .slice()
            .find((el) => el.code.includes(currenCode));
          itemRes.push('{' + currenCode + '|' + currentItem.propertyType + '}');
        } else {
          //联动模型数据项
          itemRes.push('{' + currenCode + '}');
        }
      });
      res.push(itemRes.join(' = '));
    });
    return res.join('&&');
  }

  checkSettings(obj: any): boolean {
    return true;
  }

  get locale() {
    switch (this.$i18n.locale) {
      case 'en':
        return enUS;
      case 'zh':
      default:
        return zhCN;
    }
  }

  // 当前项发生变化后，目标项控件过滤
  currentDataItemChange(val, index) {
    // 先判断目标控件类型，如果和当前选的一致，不清空，否则清空
    const currentItem: any = this.currentFieldList.main.find(
      (item) => item.code === val,
    );
    const targetKey = this.formatKey(this.conditionList[index].targetDataItem);
    const targetItem: any = this.targetFieldList.main.find(
      (item) => item.code === targetKey.key,
    );
    if (currentItem && targetItem) {
      if (currentItem.propertyType !== targetItem.propertyType) {
        this.conditionList[index].targetDataItem = undefined;
      }
    }
    this.currentFieldList.main.forEach((item: any) => {
      if (
        this.conditionList.findIndex((x: any) => {
          return x.currentDataItem === item.code;
        }) > -1
      ) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
    });

    const currentDataItem = this.currentFieldList.main.find((item) => {
      return item.code === val;
    });
    this.conditionList[index].targetDataItemList =
      this.targetFieldList.main.filter((x) =>
        this.filterCondition(currentDataItem.type, x),
      );
  }

  filterCondition(val: any, x: any, currentDataItem?: any) {
    //联动填充：如果数据项跟历史选中的联动填充控件相同，返回true: 防止历史数据选中，现在过滤掉显示编码情况
    if (currentDataItem && x.code === this.targetDataItem) {
      return true;
    }
    switch (Number(val)) {
      case DataItemType.ShortText:
        return (
          (!['workflowInstanceId', 'ownerDeptQueryCode'].includes(x.code) &&
            x.propertyType === DataItemType.ShortText) ||
          x.propertyType === DataItemType.Radio ||
          x.propertyType === DataItemType.Dropdown ||
          x.code === 'sequenceNo' ||
          x.code === 'id'
        );
      case DataItemType.LongText:
        return x.propertyType === DataItemType.LongText && !x.defaultProperty;
      case DataItemType.Date:
        return x.propertyType === DataItemType.Date;
      case DataItemType.Number:
        return x.propertyType === DataItemType.Number && !x.defaultProperty;
      case DataItemType.Radio:
        return (
          (!['workflowInstanceId', 'ownerDeptQueryCode'].includes(x.code) &&
            x.propertyType === DataItemType.ShortText) ||
          x.propertyType === DataItemType.Radio ||
          x.propertyType === DataItemType.Dropdown
        );
      case DataItemType.Dropdown:
        return (
          (!['workflowInstanceId', 'ownerDeptQueryCode'].includes(x.code) &&
            x.propertyType === DataItemType.ShortText) ||
          x.propertyType === DataItemType.Radio ||
          x.propertyType === DataItemType.Dropdown
        );
      case DataItemType.DropdownMulti:
      case DataItemType.Checkbox:
        return (
          x.propertyType === DataItemType.Checkbox ||
          x.propertyType === DataItemType.DropdownMulti
        );
      case DataItemType.Logic:
        return x.propertyType === DataItemType.Logic && !x.defaultProperty;
      case DataItemType.Time:
        return x.propertyType === DataItemType.Time && !x.defaultProperty;

      case DataItemType.StaffSingle:
        return x.propertyType === DataItemType.StaffSingle;
      case DataItemType.DeptSingle:
        return x.propertyType === DataItemType.DeptSingle;

      case DataItemType.StaffMulti:
        return x.propertyType === DataItemType.StaffMulti;

      case DataItemType.DeptMulti:
        return x.propertyType === DataItemType.DeptMulti;

      case DataItemType.StaffDeptMix:
        return [
          DataItemType.StaffDeptMix,
          DataItemType.DeptMulti,
          DataItemType.StaffMulti,
          DataItemType.DeptSingle,
          DataItemType.StaffSingle,
        ].includes(x.propertyType);
      case DataItemType.RelevanceForm:
        return (
          x.propertyType === DataItemType.RelevanceForm && !x.defaultProperty
        );

      case DataItemType.Attachment:
        return this.filterFuncEx(currentDataItem.formPropertyType, x);

      default:
        return x.propertyType === val;
    }
  }

  filterFuncEx(val: any, x: any) {
    switch (val) {
      case FormControlType.Attachment:
        return x.formPropertyType === FormControlType.Attachment;
      case FormControlType.Image:
        return x.formPropertyType === FormControlType.Image;
      case FormControlType.Signature:
        return x.formPropertyType === FormControlType.Signature;
      case FormControlType.Address:
        return x.formPropertyType === FormControlType.Address;
      default:
        break;
    }
  }

  filterType(res: any) {
    switch (Number(res.type)) {
      case DataItemType.ShortText:
      case DataItemType.LongText:
      case DataItemType.Date:
      case DataItemType.Number:
      case DataItemType.Radio:
      case DataItemType.Dropdown:
      case DataItemType.Checkbox:
      case DataItemType.DropdownMulti:
      case DataItemType.Logic:
      case DataItemType.Time:
      case DataItemType.StaffSingle:
      case DataItemType.StaffMulti:
      case DataItemType.StaffDeptMix:
      case DataItemType.DeptSingle:
      case DataItemType.DeptMulti:
      case DataItemType.RelevanceForm:
        return res;
      // return res && !res.isSystem;
      default:
        return !res;
    }
  }

  // 传入的参数格式key_dataItemType_fromControlType
  formatKey(keyStr: string) {
    const isOldStyle: boolean = /\w+\_(\d+|null)\_(\d+|null)/.test(keyStr);
    if (isOldStyle) {
      const _lastIndex = keyStr.lastIndexOf('_');
      const _last2rdIndex = keyStr.lastIndexOf('_', _lastIndex - 1);
      const key = keyStr.substring(0, _last2rdIndex);
      const dataItemType = keyStr.substring(_last2rdIndex + 1, _lastIndex);
      const formControlType = keyStr.substr(_lastIndex + 1);
      return {
        key,
        dataItemType,
        formControlType,
      };
    } else {
      return {
        key: keyStr,
        dataItemType: -1,
        formControlType: -1,
      };
    }
  }

  cancelRelate() {
    const self = this;
    this.$confirm({
      title: '数据联动',
      content: '取消联动会清空当前设置的联动数据,确定要取消该数据联动吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const backData: any = '';
        self.$emit('backData', backData);
      },
    });
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot/common/common';
.conditions,
.linkage {
  .subTitle {
    color: #000;
    opacity: 0.85;
    font-weight: 600;
  }
  .add {
    color: @primary-color;
    margin-bottom: 20px;
    text-align: center;
    margin-right: 24px;
    cursor: pointer;
    span {
      margin-right: 8px;
    }
  }
  .fieldlab {
    color: #000;
    opacity: 0.85;
    font-weight: 500;
  }
}
.ant-row {
  margin-bottom: 10px;
  .ant-col-6 {
    line-height: 32px;
  }
  // .ant-col-18{
  //   // line-height: 32px;
  // }
  .radio-col {
    line-height: 32px;
    .ant-radio-wrapper {
      margin-right: 42px;
    }
  }
  .condition-col {
    margin-top: 6px;
    .ant-select {
      margin-right: 8px;
      width: 106px;
    }
    .ant-input {
      padding: 0 11px;
    }
    .delete-wrap {
      float: right;
      line-height: 32px;
    }
    .select-wrap {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.add-option-wrap {
  // margin-right: -24px;
  min-height: 200px;
  overflow: hidden;
  .add {
    color: @primary-color;
    text-align: center;
    margin-right: 24px;
    cursor: pointer;
    span {
      margin-right: 8px;
    }
  }
  .radio-group {
    max-height: 254px;
    overflow: auto;
    /deep/.ant-radio-wrapper {
      margin-right: 0;
    }
    .input {
      width: 240px;
    }
    .delete {
      // float: right;
      margin-left: 8px;
    }
    .radio-item-wrap {
      margin-bottom: 16px;
      & > div {
        float: left;
      }
      .input-wrap {
        margin-left: 8px;
      }
      .radio-wrap,
      .delete-wrap {
        margin-top: 4px;
      }
    }
  }
  ul {
    max-height: 254px;
    overflow-y: auto;
    overflow-x: hidden;
    li {
      margin-bottom: 16px;
      & > div {
        float: left;
        margin-right: 12px;
        &:last-child {
          margin-top: 5px;
          cursor: pointer;
          margin-right: 12x;
        }
      }
      .input-wrap {
        width: 240px;
        .tips {
          color: #f5222d;
          font-size: 12px;
        }
        // .error{
        //   box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
        //   border-right-width: 1px !important;
        //   border-color: #f5222d;
        //   outline: 0;
        // }
      }
      .default {
        margin-top: 6px;
        /deep/.ant-radio-wrapper {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
