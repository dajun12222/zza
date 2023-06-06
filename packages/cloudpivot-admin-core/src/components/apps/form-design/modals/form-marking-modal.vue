<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <field-select-modal
      :isShowModal="true"
      :dataItemList="filterField"
      :excludeDataItemTypeArr="excludeDataItemTypeArr"
      :initItemSelected="dialogList"
      :canDraggable="canDraggable"
      :okBtnDisabled="$route.path.includes('apps/versionDetail/')"
      @closeModal="closeLevel1Popover"
      @submit="comfirmLevel1Popover"
    >
      <template slot="modal-title">
        <span>{{ title }}</span>
      </template>
    </field-select-modal>
  </div>
</template>
<script lang="ts">
import { Icon, Popover, Checkbox, Button, Modal, Input } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { listApi } from 'cloudpivot/api';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';
import FieldSelectModal from 'cloudpivot/common/src/components/shared/field-select-modal/index.vue';
import { DataItemType } from 'cloudpivot-form/form/schema';

const ListdesignModule = namespace('Apps/Listdesign');
const DataModelModule = namespace('Apps/DataModel');

@Component({
  name: 'FormMarkingModals',
  components: {
    AIcon: Icon,
    APopover: Popover,
    ACheckbox: Checkbox,
    AButton: Button,
    AModal: Modal,
    InputSearch,
    FieldSelectModal,
  },
})
export default class FormMarkingModals extends Vue {
  @DataModelModule.State('controlsMarking') controlsMarking: any;

  @ListdesignModule.Mutation('onEdit') onEdit: any;

  @Prop() modalData!: any;

  dialogList: any[] = [];

  dialogListDefault: any[] = [];

  isAllChecked: boolean = false;

  fieldItemSelected: any[] = [];

  excludeDataItemTypeArr: any[] = [
    DataItemType.ApprovalOpinion,
    DataItemType.Time,
  ];

  canDraggable: boolean = false;

  title: string = '选择留痕字段';

  get filterField() {
    return this.dialogList.filter((item) => {
      if (item.defaultProperty) {
        return ['owner', 'ownerDeptId'].includes(`${item.code}`);
      } else {
        return !this.excludeDataItemTypeArr.includes(item.propertyType);
      }
    });
  }

  get formCode() {
    return this.modalData.data.value.code;
  }

  get schemaCode() {
    return this.modalData.data.value.schemaCode;
  }

  @Inject({
    default: () => () => {},
  })
  getControls!: Function;

  created() {
    this.loadAllDataItem();
  }

  /* add弹窗-确定 */
  comfirmLevel1Popover(data) {
    const filterArry = data.filter((x) => {
      return x.checked && x.propertyType !== DataItemType.Sheet;
    });
    const sheetList = data.filter((x) => {
      return x.propertyType === DataItemType.Sheet;
    });
    let sheetArr = [];
    for (const con of sheetList) {
      const sheetArrData = con.subSchema.properties.filter((item) => {
        return item.checked;
      });
      sheetArr = [...sheetArr, ...sheetArrData];
    }
    const codeList: string[] = [];
    for (const con of filterArry) {
      codeList.push(con.code);
    }
    for (const s of sheetArr) {
      codeList.push(`${s.schemaCode}.${s.code}`);
    }
    const result = {
      trackDataCodes: codeList.join(';'),
    };
    // 更新弹出框的数据
    this.updateDialogListDefault(data);
    this.onEdit(true);
    this.$emit('backData', result.trackDataCodes);
  }

  // /* add弹窗-取消 */`
  closeLevel1Popover() {
    const arr = JSON.parse(JSON.stringify(this.dialogListDefault));
    this.dialogList = arr;
    this.$emit('closeModal');
  }

  // 更新默认数据
  updateDialogListDefault(data) {
    this.dialogListDefault = data;
  }

  /**
   * 下拉选择值赋值
   */
  loadAllDataItem() {
    const params = {
      schemaCode: this.schemaCode,
      formCode: this.formCode,
    };
    listApi.getDataItemList(params).then((res: any) => {
      let data: any[] = [];
      if (res.status || res.data.errcode === 0) {
        data = res.data.data;
      }
      if (res.errcode === 0) {
        data = res.data;
      }

      this.dialogList = data;

      if (data) {
        //获取回显的数据
        const values = this.modalData.data.value.trackDataCodes;
        let codeList: string[] = [];
        if (values) {
          codeList = values.split(';');
        }
        if (codeList.length > 0) {
          for (const x of data) {
            this.$set(x, 'checked', false);
            if (x.propertyType === DataItemType.Sheet) {
              x.subSchema.properties.forEach((i) =>
                this.$set(i, 'checked', false),
              );
            }
            for (const con of codeList) {
              if (con.indexOf('.') < 0) {
                if (con === x.code) {
                  x.checked = true;
                }
              } else {
                if (x.propertyType === 8) {
                  const codes = con.split('.')[1];
                  for (const y of x.subSchema.properties) {
                    if (codes === y.code) {
                      x.checked = true;
                      y.checked = true;
                    }
                  }
                }
              }
            }
          }
        } else {
          for (const x of data) {
            this.$set(x, 'checked', false);
            if (x.propertyType === DataItemType.Sheet) {
              x.subSchema.properties.forEach((i) =>
                this.$set(i, 'checked', false),
              );
            }
          }
        }

        const arr = data.filter(
          (res: any) =>
            !res.checked &&
            res.propertyType !== 8 &&
            ['owner', 'ownerDeptId'].includes(`${res.code}`),
        );
        if (arr.length === 0) {
          this.isAllChecked = true;
        } else {
          this.isAllChecked = false;
        }
      }

      const sheetList = data.filter((x) => {
        return x.propertyType === DataItemType.Sheet;
      });

      //子表留痕初始化
      if (sheetList.length > 0) {
        for (const con of sheetList) {
          con.subSchema.properties = this.analysisJsonOrder(
            con.code,
            con.subSchema.properties,
          );

          const arr = con.subSchema.properties.filter((y) => {
            return !y.defaultProperty;
          });
          con.subSchema.properties = arr;
        }
      }

      this.dialogListDefault = JSON.parse(JSON.stringify(data));
    });
  }

  analysisJsonOrder(code: string, ColumnsNames: any) {
    const josnObj = this.controlsMarking;
    const arr = [];
    if (josnObj) {
      for (const con in josnObj) {
        if (josnObj[con].key === code) {
          for (const x of josnObj[con].columns) {
            for (const y of ColumnsNames) {
              if (x.key === y.code) {
                arr.push(Object.assign({}, y));
              }
            }
          }
        }
        //tab页下的子表单独处理
        if (josnObj[con].type === 500) {
          for (const x of josnObj[con].panels) {
            if (x.controls[code]) {
              for (const y of x.controls[code].columns) {
                const con = ColumnsNames.filter((c) => {
                  return y.key === c.code;
                });
                if (con.length > 0) {
                  arr.push(Object.assign({}, con[0]));
                }
              }
            }
          }
        }
      }
    }
    return arr;
  }

  beforeDestroy() {
    this.$off('addcomfirm');
  }
}
</script>

<style lang="less" scoped>
.field-select-modal {
  .ant-modal-body {
    // max-height: 378px;
    // overflow-y: auto;
    padding: 24px 20px;
    margin: 0 4px;
  }

  .left {
    color: #111218;
    font-size: 14px;
    margin-left: 8px;
    line-height: 22px;
  }

  .ant-modal-footer {
    border-top: none;
    padding-top: 0;
  }
  .ant-btn {
    height: 32px;
  }

  /**
    新版导出样式
  */
  .data-box {
    width: 100%;
    border-radius: 2px;
    border: 1px solid #dddddd;
    display: flex;
    max-height: 548px;
    height: calc(100vh - 248px);
    overflow-x: auto;
  }
  @media screen and (max-width: 866px) {
    .ant-modal {
      max-width: calc(100vw - 8px) !important;
      margin: unset;
    }
  }
}
</style>
