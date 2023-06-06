<template>
  <div class="data-left">
    <div class="data-left-top">
      <div class="field-options">
        <slot name="field-options">
          <a-checkbox
            :checked="isAllChecked"
            :indeterminate="indeterminate"
            class="checkbox"
            @click="handleAllCheck"
          />
          <span class="left">{{ $t('cloudpivot.list.pc.checkAll1') }}</span>
        </slot>
      </div>
      <div class="data-left-search">
        <InputSearch
          v-model="field"
          :placeholder="$t('cloudpivot.list.pc.placeInputSearch')"
          :allowClear="true"
          :isAsync="true"
        />
      </div>
    </div>
    <div class="data-left-list">
      <div class="data-list">
        <template>
          <!-- 系统字段 -->
          <field-group
            v-if="filterSystemData.length"
            :title="$t('cloudpivot.list.pc.exportBox.systemField')"
            :groupDataitemList="filterSystemData"
            :excludeDataItemTypeArr="excludeDataItemTypeArr"
            type="sys"
            @checkedAll="checkedAll"
            @checkedItem="checkedItem"
          />
          <!-- 主表字段 -->
          <field-group
            v-if="filterMainData.length"
            :title="$t('cloudpivot.list.pc.exportBox.mainTableField')"
            :groupDataitemList="filterMainData"
            :excludeDataItemTypeArr="excludeDataItemTypeArr"
            type="main"
            @checkedAll="checkedAll"
            @checkedItem="checkedItem"
          />
          <!-- 子表字段组 -->
          <template v-for="(data, index) in filterChildDataItemList">
            <field-group
              v-if="
                field
                  ? getSubDataList(data, 'tempList').length
                  : getSubDataList(data).length
              "
              :key="index"
              :title="getItemName(data)"
              :groupDataitemList="
                field ? getSubDataList(data, 'tempList') : getSubDataList(data)
              "
              :excludeDataItemTypeArr="excludeDataItemTypeArr"
              type="sub"
              @checkedAll="checkedAll($event, data)"
              @checkedItem="checkedItem($event, data)"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Checkbox } from '@h3/antd-vue';
import { Component, Prop } from 'vue-property-decorator';
import InputSearch from '../inputSearch.vue';
import FieldGroup from './field-group.vue';
import FieldSelectModal from './script/field-select-modal';

@Component({
  name: 'field-list-box',
  components: {
    ACheckbox: Checkbox,
    InputSearch,
    FieldGroup,
  },
})
export default class FieldListBox extends FieldSelectModal {
  @Prop({ default: () => [] })
  dataItemList!: any[];

  @Prop({ default: () => [] })
  initItemSelected!: any[];

  @Prop({ default: () => [] })
  excludeDataItemTypeArr: any[];

  // field: string = '';

  get systemDataItemList() {
    return this.dataItemList.filter((i) => this.getIsSystemField(i));
  }

  get filterSystemData() {
    return this.systemDataItemList.filter((item) =>
      this.getItemName(item).includes(this.field),
    );
  }

  get mainDataItemList() {
    return this.dataItemList.filter(
      (i) => i.propertyType !== 8 && !this.getIsSystemField(i),
    );
  }

  get filterMainData() {
    return this.mainDataItemList.filter((item) =>
      this.getItemName(item).includes(this.field),
    );
  }

  get childDataItemList() {
    return this.dataItemList.filter((i) => i.propertyType === 8);
  }

  get filterChildDataItemList() {
    this.childDataItemList.forEach((item) => {
      if (item.childColumns) {
        item.childColumns.forEach((i) => {
          i.checked = item.checked && i.isQueryColumn;
        });
      }
    });
    if (!this.field) {
      return this.childDataItemList;
    }
    return this.childDataItemList.map((item) => {
      if (item.subSchema && item.subSchema.properties) {
        item.subSchema.tempList = item.subSchema.properties.filter((el) =>
          this.getItemName(el).includes(this.field),
        );
        return item;
      } else {
        item.tempList = item.childColumns.filter((el) =>
          this.getItemName(el).includes(this.field),
        );
        return item;
      }
    });
  }

  get isAllChecked() {
    return this.dataItemList.every((item) => {
      if (item.propertyType !== 8) {
        return (
          item.checked ||
          this.excludeDataItemTypeArr.includes(item.propertyType)
        );
      } else {
        return this.getAllSelect(
          this.getSubDataList(item),
          'sub',
          this.excludeDataItemTypeArr,
        );
      }
    });
  }

  get indeterminate() {
    return this.dataItemList.some((item) => item.checked) && !this.isAllChecked;
  }

  checkedAll(itemList, parent?) {
    const itemSelected = [...this.initItemSelected.filter((i) => i.checked)];
    if (!parent) {
      const selectedAll = itemList.every((item) => item.checked);
      itemList.forEach((item) => {
        const index = itemSelected.findIndex(
          (i) => i.code === item.code && i.schemaCode === item.schemaCode,
        );
        this.$set(item, 'checked', !selectedAll);
        if (!~index) {
          itemSelected.push(item);
        }
      });
    } else {
      const index = itemSelected.findIndex(
        (i) => i.code === parent.code && i.schemaCode === parent.schemaCode,
      );
      let subDataItemList: any[] = [];
      if (this.field) {
        subDataItemList = this.getSubDataList(parent, 'tempList');
      } else {
        subDataItemList = this.getSubDataList(parent);
      }
      const selectedAll = this.getAllSelect(
        subDataItemList,
        'sub',
        this.excludeDataItemTypeArr,
      );
      subDataItemList.forEach((item) => {
        this.$set(item, 'checked', !selectedAll);
        if (parent.childColumns) {
          this.$set(item, 'isQueryColumn', item.checked || !parent.checked);
        }
      });
      if (this.field) {
        subDataItemList = this.getSubDataList(parent);
      }
      this.$set(
        parent,
        'checked',
        this.getSomeSelect(subDataItemList, 'sub', this.excludeDataItemTypeArr),
      );
      if (!~index) {
        itemSelected.push(parent);
      }
    }
    this.$emit('checkedItemChange', itemSelected);
  }

  checkedItem(item, parent?) {
    const itemSelected = [...this.initItemSelected.filter((i) => i.checked)];
    if (!parent) {
      const index = itemSelected.findIndex(
        (i) => i.code === item.code && i.schemaCode === item.schemaCode,
      );
      this.$set(item, 'checked', !item.checked);
      if (!~index) {
        itemSelected.push(item);
      }
    } else {
      const index = itemSelected.findIndex(
        (i) => i.code === parent.code && i.schemaCode === parent.schemaCode,
      );
      this.$set(item, 'checked', !item.checked);
      if (parent.childColumns) {
        this.$set(item, 'isQueryColumn', item.checked || !parent.checked);
      }
      const subDataItemList = this.getSubDataList(parent);
      this.$set(
        parent,
        'checked',
        this.getSomeSelect(subDataItemList, 'sub', this.excludeDataItemTypeArr),
      );
      if (!~index) {
        itemSelected.push(parent);
      }
    }
    this.$emit('checkedItemChange', itemSelected);
  }

  handleAllCheck() {
    const isAllChecked = !this.isAllChecked;
    const itemSelected = [];
    this.dataItemList.forEach((item) => {
      if (this.getIsSystemField(item)) {
        this.$set(item, 'checked', isAllChecked);
      } else {
        if (item.propertyType !== 8) {
          this.$set(item, 'checked', isAllChecked);
        } else {
          if (this.getSubDataList(item).length) {
            this.$set(item, 'checked', isAllChecked);
          }
          this.getSubDataList(item).forEach((i) => {
            this.$set(i, 'checked', isAllChecked);
            if (item.childColumns) {
              this.$set(i, 'isQueryColumn', isAllChecked);
            }
          });
        }
      }
    });
    itemSelected.push(...this.dataItemList);
    this.$emit('checkedItemChange', itemSelected);
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.data-left {
  flex: 1;
  height: 100%;
  // min-height: 378px;
  // max-height: calc(100vh - 300px);
  min-width: 400px;
  // overflow-y: scroll;
  padding: 16px 0px 32px;
  .data-left-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #eeeeee;
    margin: 0 16px;
    padding-bottom: 16px;
    .field-options {
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
    .left {
      margin-left: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #111218;
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
        background-color: @highlightColor;
        position: absolute;
      }
    }
    .sub-check-all {
      margin-top: 13px;
      .left {
        margin-left: 8px;
        font-size: 14px;
        color: #111218;
        font-weight: 400;
      }
    }
  }
}
</style>
