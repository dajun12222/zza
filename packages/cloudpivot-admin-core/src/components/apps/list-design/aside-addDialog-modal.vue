<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <template v-if="fromForm">
      <div class="input-modal" @click.stop="modalVisible = true">
        <span class="txt">{{
          value && value.length > 0 ? '已设置' : '未设置'
        }}</span>
        <i class="aufontAll h-icon-all-ellipsis-o"></i>
      </div>
    </template>
    <span
      v-else
      class="icons"
      title="添加字段"
      @click.stop="modalVisible = true"
    >
      <i class="aufontAll h-icon-all-plus-o"></i>
    </span>
    <field-select-modal
      ref="field-select-modal"
      :isShowModal="modalVisible"
      :dataItemList="filterField"
      :excludeDataItemTypeArr="excludeDataItemTypeArr"
      :initItemSelected="dialogList"
      :canDraggable="true"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';
import FieldSelectModal from 'cloudpivot/common/src/components/shared/field-select-modal/index.vue';
import { DataItemType } from 'cloudpivot-form/form/schema';

const ListdesignModule = namespace('Apps/Listdesign');

@Component({
  name: 'Dialog',
  components: {
    AIcon: Icon,
    APopover: Popover,
    ACheckbox: Checkbox,
    AButton: Button,
    AModal: Modal,
    AInputSearch: Input.Search,
    InputSearch,
    FieldSelectModal,
  },
})
export default class Dialog extends Vue {
  @ListdesignModule.State('showFieldArray') showFieldArray: any;

  @ListdesignModule.Mutation('onEdit') onEdit: any;

  @Prop() propDataList!: Array<any>;

  @Prop() fieldBlock!: number;

  @Prop({ default: false }) fromForm!: boolean;

  @Prop() value!: any;

  dialogList: any[] = [];

  modalVisible: boolean = false;

  dialogListDefault: any[] = [];

  excludeDataItemTypeArr: any[] = [
    DataItemType.ApprovalOpinion,
    DataItemType.Time,
  ];

  get filterField() {
    return this.dialogList.filter((item) => {
      if (item.defaultProperty) {
        return true;
      } else {
        return !this.excludeDataItemTypeArr.includes(item.propertyType);
      }
    });
  }

  /* add弹窗-确定 */
  comfirmLevel1Popover(data) {
    this.$emit('addcomfirm', this.fieldBlock, data);
    // 更新弹出框的数据
    this.updateDialogListDefault();
    this.onEdit(true);
    this.modalVisible = false;
  }

  // /* add弹窗-取消 */`
  closeLevel1Popover() {
    (this.$refs['field-select-modal'] as any).checkedItemChange([]);
    const arr = JSON.parse(JSON.stringify(this.dialogListDefault));
    this.dialogList = arr;
    this.modalVisible = false;
  }

  // 更新默认数据
  updateDialogListDefault() {
    this.dialogListDefault = this.dialogList;
  }

  /**
   * 下拉选择值赋值
   */
  @Watch('propDataList', {
    immediate: true,
  })
  linsteningdialogData(v: any) {
    let value = v;
    if (this.fromForm) {
      value.forEach((item) => {
        this.$set(item, 'checked', false);
        if (item.propertyType === 8) {
          item.subSchema.properties = item.subSchema.properties.filter(
            (i) => !i.defaultProperty && !i.isSystem,
          );
          item.subSchema.properties.forEach((i) => {
            this.$set(i, 'checked', false);
          });
        }
      });
      const selectItems = [];
      if (Array.isArray(this.value)) {
        this.value.forEach((item) => {
          if (!~item.indexOf('.')) {
            const selectItem = value.find((i) => i.code === item);
            selectItem.checked = true;
            selectItems.push(selectItem);
          } else {
            const codes = item.split('.');
            const parentItem = selectItems.find((i) => i.code === codes[0]);
            const selectItem = parentItem.subSchema.properties.find(
              (i) => i.code === codes[1],
            );
            const subSelectItems = parentItem.subSchema.properties.filter(
              (i) => i.checked,
            );
            selectItem.checked = true;
            subSelectItems.push(selectItem);
            const notSelectItems = parentItem.subSchema.properties.filter(
              (i) => !i.checked,
            );
            parentItem.subSchema.properties = [
              ...subSelectItems,
              ...notSelectItems,
            ];
          }
        });
      }
      const notSelectItems = value.filter((item) => !item.checked);
      value = [...selectItems, ...notSelectItems];
    } else {
      // value.forEach((item) => {
      //   this.$set(item, 'published', true);
      //   if (item.propertyType === 8) {
      //     item.childColumns.forEach((i) => {
      //       this.$set(i, 'checked', item.checked && i.isQueryColumn);
      //     });
      //   }
      // });
    }
    this.dialogList = JSON.parse(JSON.stringify(value));
    this.dialogListDefault = JSON.parse(JSON.stringify(value));
  }

  @Watch('modalVisible')
  modalVisibleChange(v) {
    if (v) {
      this.linsteningdialogData(this.propDataList);
    }
  }

  checkedItemChange(dataList) {
    const unselectList = this.dialogList.filter((item) => {
      return !dataList.some((res) => res.propertyCode === item.propertyCode);
    });
    this.dialogList = dataList.concat(unselectList);
    this.dialogListDefault = JSON.parse(JSON.stringify(this.dialogList));
    (this.$refs['field-select-modal'] as any).checkedItemChange([]);
  }

  beforeDestroy() {
    this.$off('addcomfirm');
  }

  get title() {
    if (this.fromForm) {
      return '选择弹出框字段';
    }
    switch (this.fieldBlock) {
      case 0:
        return '设置查询条件';
      case 1:
        return '设置展示字段';
      case 2:
        return '设置排序字段';
      default:
        break;
    }
  }
}
</script>

<style lang="less">
.aside-dialog {
  .h-icon-all-plus-o {
    &:hover {
      color: #2970ff;
    }
  }

  .left {
    color: #111218;
    font-size: 14px;
    margin-left: 8px;
    line-height: 22px;
  }

  .data-list {
    overflow: hidden;

    .span {
      color: #111218;
    }

    .check-item {
      float: left;
      width: calc(25% - 4px);
      min-width: 127px;
      margin-right: 4px;
      margin-top: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .data-right {
    width: 244px;
    height: 100%;
  }
  .data-box {
    width: 100%;
    border-radius: 2px;
    border: 1px solid #dddddd;
    display: flex;
    max-height: 548px;
    height: calc(100vh - 248px);
    overflow: hidden;
    > .data-left {
      flex: 1;
      height: 100%;
      min-width: 400px;
      padding: 16px 0px 32px;
      .data-left-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dashed #eeeeee;
        margin: 0 16px;
        padding-bottom: 16px;
        .choose-wrap {
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          color: #111218;
          &:hover {
            color: #2970ff;
          }
          .choose-type {
            padding-right: 4px;
          }
          i {
            padding-top: 5px;
            font-weight: normal;
          }
        }
        .check-all {
          .left {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 700;
            color: #111218;
          }
        }
        .data-left-search {
          width: 240px;
          height: 32px;
        }
      }

      .data-left-list {
        padding: 0 10px 0 16px;
        overflow-y: scroll;
        height: calc(100% - 49px);
      }

      .data-list {
        padding-left: 13px;
        .data-list-sub-title {
          font-size: 14px;
          font-weight: 700;
          color: #111218;
          position: relative;
          margin-top: 23px;
          &::before {
            content: '';
            left: -13px;
            top: 6px;
            width: 3px;
            height: 10px;
            background-color: #2970ff;
            position: absolute;
          }
        }
      }
    }
    > .data-right {
      width: 244px;
      height: 100%;
      // min-height: 378px;
      // max-height: calc(100vh - 300px);
      // overflow-y: scroll;
      min-width: 140px;
      padding: 21px 0px 16px 0px;
      border-left: 1px solid #dddddd;
      .data-right-title {
        color: #111218;
        font-size: 14px;
        font-weight: 700;
        padding: 0 16px;
        margin-bottom: 21px;
        position: relative;
        > span {
          font-weight: 400;
        }
        .clear-all {
          color: #2970ff;
          position: absolute;
          right: 16px;
          cursor: pointer;
        }
      }
      .data-right-items {
        height: calc(100% - 26px);
        padding: 0 0 0 6px;
        overflow-y: scroll;
        h4 {
          font-size: 14px;
          line-height: 20px;
          color: rgba(17, 18, 24, 0.5);
          margin-bottom: 8px;
          margin-left: 10px;
          &.system {
            margin-top: 15px;
          }
        }
      }
      .data-right-li {
        font-size: 14px;
        color: #111218;
        display: flex;
        justify-content: space-between;
        height: 36px;
        align-items: center;
        padding: 0 35px 0 10px;
        position: relative;
        .name-wrap {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          background: #eef4fd;
          i {
            color: #2970ff;
          }
        }
        .del {
          position: absolute;
          right: 18px;
          top: 5px;
          cursor: pointer;
        }
        &.chosen {
          background: #ffffff;
          box-shadow: 0px 2px 8px 0px rgba(168, 175, 186, 0.5);
          border-radius: 4px;
        }
        i {
          color: rgba(17, 18, 24, 0.5);
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
