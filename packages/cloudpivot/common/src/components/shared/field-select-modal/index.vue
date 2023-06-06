<template>
  <a-modal
    v-model="isShowModal"
    :maskClosable="false"
    :width="866"
    centered
    wrapClassName="field-select-modal"
    :zIndex="998"
    :destroyOnClose="true"
    @cancel="closeModal"
  >
    <template slot="title">
      <h3 class="modal-title">
        <slot name="modal-title"></slot>
      </h3>
    </template>
    <div class="data-box">
      <field-list-box
        ref="field-list-box"
        :dataItemList="dataItemList"
        :excludeDataItemTypeArr="excludeDataItemTypeArr"
        :initItemSelected="itemSelected"
        @checkedItemChange="checkedItemChange"
      >
        <template slot="field-options">
          <slot name="field-options"></slot>
        </template>
      </field-list-box>
      <selected-field-box
        :initItemSelected="itemSelected"
        :excludeDataItemTypeArr="excludeDataItemTypeArr"
        :canDraggable="canDraggable"
        @clearAll="clearAll"
      />
    </div>
    <div slot="footer" class="h3-organization-footer">
      <div class="main-btn-group">
        <a-button
          type="default"
          :disabled="cancelBtnDisabled"
          @click="closeModal"
        >
          {{ cancelText || $t('languages.common.cancel') }}
        </a-button>
        <a-button type="primary" :disabled="okBtnDisabled" @click="submit">
          {{ okText || $t('languages.common.ok') }}
        </a-button>
      </div>
      <div class="extra-btn-group">
        <slot name="extra-btn-group"></slot>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Button, Modal } from '@h3/antd-vue';
import { Component, Prop } from 'vue-property-decorator';
import FieldListBox from './field-list-box.vue';
import FieldSelectModal from './script/field-select-modal';
import selectedFieldBox from './selected-field-box.vue';

@Component({
  name: 'field-select',
  components: {
    AModal: Modal,
    AButton: Button,
    FieldListBox,
    selectedFieldBox,
  },
})
export default class FieldSelect extends FieldSelectModal {
  @Prop({ default: false })
  isShowModal!: boolean;

  @Prop({ default: () => [] })
  dataItemList!: any[];

  @Prop({ default: () => [] })
  initItemSelected!: any[];

  @Prop({ default: () => [] })
  excludeDataItemTypeArr: any[];

  @Prop({ default: true })
  canDraggable: boolean;

  @Prop({ default: '' })
  okText!: string;

  @Prop({ default: '' })
  cancelText!: string;

  @Prop({ default: false })
  okBtnDisabled: boolean;

  @Prop({ default: false })
  cancelBtnDisabled: boolean;

  fieldItemSelected: any[] = [];

  get itemSelected() {
    return this.fieldItemSelected.length
      ? this.fieldItemSelected
      : this.initItemSelected;
  }

  checkedItemChange(dataList) {
    this.fieldItemSelected = dataList;
  }

  closeModal() {
    this.$emit('closeModal');
  }

  clearAll() {
    const itemSelected = [];
    this.dataItemList.forEach((item) => {
      if (this.getIsSystemField(item)) {
        this.$set(item, 'checked', false);
      } else {
        if (item.propertyType !== 8) {
          this.$set(item, 'checked', false);
        } else {
          if (this.getSubDataList(item).length) {
            this.$set(item, 'checked', false);
          }
          this.getSubDataList(item).forEach((i) => {
            this.$set(i, 'checked', false);
            if (item.childColumns) {
              this.$set(i, 'isQueryColumn', false);
            }
          });
        }
      }
    });
    itemSelected.push(...this.dataItemList);
    this.checkedItemChange(itemSelected);
  }

  submit() {
    this.$emit('submit', this.itemSelected);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.field-select-modal {
  .ant-modal-body {
    // max-height: 378px;
    // overflow-y: auto;
    padding: 24px 20px;
    margin: 0 4px;
  }

  .uploading-content {
    text-align: center;
    margin-bottom: 80px;

    img {
      padding: 30px;
    }

    div {
      margin-bottom: 10px;
    }
  }

  .modal-title {
    display: inline-block;
    font-size: 16px;
    font-weight: 700;
    color: #111218;
    margin-bottom: 0;
  }

  .gray {
    font-size: 12px;
    margin-left: 8px;
    color: rgba(0, 0, 0, 0.45);
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
      color: rgba(0, 0, 0, 0.85);
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

    .sub-item {
      width: 100%;
      margin-top: 16px;
      float: left;

      .sub-title {
        font-size: 14px;
        font-weight: 400;
        color: #111218;
        margin-left: 5px;
      }

      .line {
        background: #e8e8e8;
        width: 100%;
        height: 1px;
        margin-top: 8px;
      }

      .toggle {
        float: right;
        margin-right: 14px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.45);

        & > i {
          transform: rotate(180deg);
        }

        & > i.collapsed {
          transform: rotate(0);
        }
      }

      .sub-item-child {
        float: left;
        width: 33%;
        margin-top: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .ant-modal-footer {
    border-top: none;
    padding-top: 0;
  }
  .ant-btn {
    height: 32px;
  }
  .import-text {
    font-size: 14px;
    font-weight: 400;
    color: @highlightColor;
    cursor: pointer;
    .icon {
      font-size: 14px;
    }
  }

  .data-right {
    width: 244px;
    height: 100%;
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
        > span {
          font-weight: 400;
        }
      }
      .checked-item-search {
        padding: 0 16px;
        .ant-input-affix-wrapper {
          margin-bottom: 8px;
        }
      }
      // .ant-input-search {
      //   margin-top: 20px;
      // }
      .data-right-items {
        height: calc(100% - 82px);
        padding: 0 0 0 6px;
        overflow-y: scroll;
        .data-right-list {
          &.chosen {
            background: #ffffff;
            box-shadow: 0px 2px 8px 0px rgba(168, 175, 186, 0.5);
            border-radius: 4px;
          }
          &.ghost {
            &::before {
              content: ' ';
              display: block;
              width: 100%;
              height: 1px;
              background: #2970ff;
              position: absolute;
              top: -7px;
              left: 0px;
            }
            position: relative;
            margin-top: 7px;
            background: #ffffff;
            box-shadow: 0px 2px 8px 0px rgba(168, 175, 186, 0.5);
            border-radius: 4px;
          }
          &.sub {
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 8px;
            .data-right-li:hover {
              + div.subDraggable {
                background: #eef4fd;
              }
            }
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
        padding: 0 10px;
        &:hover {
          background: #eef4fd;
          i {
            color: @highlightColor;
          }
        }
        &.chosen {
          background: #ffffff;
          box-shadow: 0px 2px 8px 0px rgba(168, 175, 186, 0.5);
          border-radius: 4px;
        }
        &.ghost {
          &::before {
            content: ' ';
            display: block;
            width: 100%;
            height: 1px;
            background: #2970ff;
            position: absolute;
            top: -7px;
            left: 0px;
          }
          position: relative;
          margin-top: 7px;
          background: #ffffff;
          box-shadow: 0px 2px 8px 0px rgba(168, 175, 186, 0.5);
          border-radius: 4px;
        }
        .title {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #111218 !important;
          width: 100% !important;
          padding-top: unset !important;
          &.handles {
            padding-left: 21px;
            &::after {
              content: '\ff08\70b9\51fb\6807\9898\53ef\62d6\62fd\ff09';
              font-size: 12px;
              font-weight: 400;
              color: rgba(17, 18, 24, 0.5);
            }
          }
        }
        .handles {
          color: rgba(17, 18, 24, 0.25);
          padding-top: 1px;
          width: 26px;
          cursor: move;
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
        i {
          color: rgba(17, 18, 24, 0.5);
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
  }
  @media screen and (max-width: 866px) {
    .ant-modal {
      max-width: calc(100vw - 8px) !important;
      margin: unset;
    }
  }
}
</style>
