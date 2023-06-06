<template>
  <div class="group-item">
    <div class="group-item-title">
      {{ title }}
      <span v-if="type === 'sub'">{{
        $t('cloudpivot.list.pc.exportBox.subTableTag')
      }}</span>
    </div>
    <div class="group-check-all">
      <a-checkbox
        v-model="selectedAll"
        :indeterminate="indeterminate"
        class="checkbox"
        @click="onAllSelectChange(selectedAll)"
      />
      <span class="left">{{ $t('cloudpivot.list.pc.checkAll') }}</span>
    </div>
    <div class="group-item-content">
      <template v-for="item in groupDataitemList">
        <div
          v-if="
            !(getIsSystemField(item) && type !== 'sys') &&
            !excludeDataItemTypeArr.includes(item.propertyType) &&
            (item.published || item.code === 'participants_')
          "
          :key="item.code"
          class="group-item-child"
        >
          <a-checkbox
            v-model="item.checked"
            class="checkbox"
            @click="onItemSelectChange(item)"
          />
          <span class="left" :title="getItemTitle(item)">{{
            getItemName(item)
          }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Checkbox } from '@h3/antd-vue';
import { Component, Prop } from 'vue-property-decorator';
import FieldSelectModal from './script/field-select-modal';

@Component({
  name: 'field-group',
  components: {
    ACheckbox: Checkbox,
  },
})
export default class FieldGroup extends FieldSelectModal {
  @Prop({ default: '' })
  title!: string;

  @Prop({ default: () => [] })
  groupDataitemList!: any[];

  @Prop({ default: () => [] })
  excludeDataItemTypeArr: any[];

  @Prop({ default: 'main' })
  type!: string;

  get selectedAll() {
    return this.getAllSelect(
      this.groupDataitemList,
      this.type,
      this.excludeDataItemTypeArr,
    );
  }

  get indeterminate() {
    return (
      this.getSomeSelect(
        this.groupDataitemList,
        this.type,
        this.excludeDataItemTypeArr,
      ) && !this.selectedAll
    );
  }

  onAllSelectChange(val) {
    this.$emit('checkedAll', this.groupDataitemList);
  }

  onItemSelectChange(item) {
    this.$emit('checkedItem', item);
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.group-item {
  width: 100%;
  margin-top: 6px;
  float: left;
  .group-item-title {
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
  .group-check-all {
    margin-top: 13px;
    .left {
      margin-left: 8px;
      font-size: 14px;
      color: #111218;
      font-weight: 400;
    }
  }
  .group-item-content {
    .group-item-child {
      float: left;
      width: calc(25% - 4px);
      min-width: 127px;
      margin-right: 4px;
      margin-top: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .left {
        color: #111218;
        font-size: 14px;
        margin-left: 8px;
        line-height: 22px;
      }
    }
  }
  &:first-child {
    margin-top: unset;
  }
}
</style>
