<template>
  <div class="data-right">
    <div class="data-right-title">
      <span>
        <span class="count-title">{{ $t('cloudpivot.list.pc.selectedField') }}：</span>
        <span>
          {{
            $t('cloudpivot.list.pc.numbers', {
              num: selectedFieldCount,
            })
          }}
        </span>
      </span>
      <span class="clear-all-btn" @click="clearAll">{{
        $t('cloudpivot.list.pc.clear')
      }}</span>
    </div>
    <div class="checked-item-search">
      <InputSearch
        v-model="field"
        :placeholder="$t('cloudpivot.list.pc.placeInputSearch')"
        :allowClear="true"
        :isAsync="true"
      />
    </div>
    <drag-field-item-group
      type="main"
      :isFilter="!!field"
      :selectedFieldGroup="filterData"
      class="data-right-items"
      :excludeDataItemTypeArr="excludeDataItemTypeArr"
      :canDraggable="canDraggable"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import InputSearch from '../inputSearch.vue';
import DragFieldItemGroup from './drag-field-item-group.vue';
import FieldSelectModal from './script/field-select-modal';

@Component({
  name: 'selected-field-box',
  components: {
    InputSearch,
    DragFieldItemGroup,
  },
})
export default class SelectedFieldBox extends FieldSelectModal {
  @Prop({ default: () => [] })
  initItemSelected!: any[];

  @Prop({ default: () => [] })
  excludeDataItemTypeArr: any[];

  @Prop({ default: true })
  canDraggable: boolean;

  // field: string = '';

  get selectedFieldCount() {
    let count = 0;
    this.initItemSelected.forEach((item) => {
      if (item.checked && item.propertyType !== 8) {
        count++;
      } else if (item.checked && item.propertyType === 8) {
        this.getSubDataList(item).forEach((i) => {
          if (this.getSomeSelectItem(i, 'sub', this.excludeDataItemTypeArr)) {
            count++;
          }
        });
      } else {
      }
    });
    return count;
  }

  get filterData() {
    if (!this.field) {
      console.log(this.initItemSelected);

      return this.initItemSelected;
    } else {
      return this.initItemSelected.filter((item) => {
        if (!item.subSchema && !item.childColumns) {
          return this.getItemName(item).includes(this.field);
        } else {
          if (item.subSchema.properties) {
            item.subSchema.tempList = item.subSchema.properties.filter((el) =>
              this.getItemName(el).includes(this.field),
            );
          } else if (item.childColumns) {
            item.tempList = item.childColumns.filter((el) =>
              this.getItemName(el).includes(this.field),
            );
          } else {
          }
          return (
            this.getSubDataList(item, 'tempList').length > 0 &&
            this.getSubDataList(item, 'tempList').some((sub) => sub.checked)
          );
        }
      });
    }
  }

  clearAll() {
    this.initItemSelected.forEach((item) => {
      this.$set(item, 'checked', false);
      if (item.propertyType === 8) {
        this.getSubDataList(item).forEach((i) => {
          this.$set(i, 'checked', false);
        });
      }
    });
    this.$emit('clearAll');
  }
}
</script>
<style lang="less" scoped>
.data-right {
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
    display: flex;
    justify-content: space-between;

    > span {
      font-weight: 400;
      span.count-title {
        font-weight: 600;
      }
    }
    span.clear-all-btn {
      color: #2970ff;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .checked-item-search {
    padding: 0 16px;
    .ant-input-affix-wrapper {
      margin-bottom: 8px;
    }
  }
  .data-right-items {
    height: calc(100% - 82px);
    padding: 0 0 0 6px;
    overflow-y: scroll;
  }
}
</style>
