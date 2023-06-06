<template>
  <div>
    <div v-if="type === 'sub'" class="data-right-li">
      <span
        :class="{ main_handles: !isFilter && canDraggable, title: true }"
        :style="{
          '--dragTips':
            '\'' + $t('cloudpivot.list.pc.exportBox.dragTips') + '\'',
        }"
      >
        <span
          :title="getItemTitle(data)"
          :class="$i18n.locale === 'en' ? 'en' : 'zh'"
        >
          {{ getItemName(data) }}
        </span>
      </span>
    </div>
    <draggable
      :list="type === 'sub' ? getSubDataList(data) : selectedFieldGroup"
      :options="dragOptions"
      :handle="`.${type}_handles`"
      tag="div"
      :class="`${type}_draggable`"
      chosenClass="chosen"
      ghostClass="ghost"
      @end="onEnd"
    >
      <div
        v-for="(item, index) in type === 'sub'
          ? isFilter
            ? getSubDataList(data, 'tempList')
            : getSubDataList(data)
          : selectedFieldGroup"
        :key="index"
        class="data-right-list"
        :class="{ sub: (item.subSchema || item.childColumns) && item.checked }"
      >
        <template v-if="!(item.subSchema || item.childColumns)">
          <div
            v-if="getSomeSelectItem(item, type, excludeDataItemTypeArr)"
            class="data-right-li"
          >
            <span
              v-if="!isFilter && canDraggable"
              :class="`icon aufontAll handles ${type}_handles`"
            >
              &#xe63e;
            </span>
            <span :title="getItemTitle(item)">{{ getItemName(item) }}</span>
            <em
              class="icon aufontAll h-icon-all-close"
              @click="deleteList(item)"
            ></em>
          </div>
        </template>
        <template v-else-if="item.checked">
          <drag-field-item-group
            :data="item"
            type="sub"
            :isFilter="isFilter"
            class="data-right-list"
            :excludeDataItemTypeArr="excludeDataItemTypeArr"
            :canDraggable="canDraggable"
          />
        </template>
      </div>
    </draggable>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import FieldSelectModal from './script/field-select-modal';

@Component({
  name: 'drag-field-item-group',
  components: {
    Draggable,
  },
})
export default class DragFieldItemGroup extends FieldSelectModal {
  @Prop({ default: () => [] })
  excludeDataItemTypeArr: any[];

  @Prop({ default: false })
  isFilter: boolean;

  @Prop({ default: () => {} })
  data: any;

  @Prop({ default: () => [] })
  selectedFieldGroup: any[];

  @Prop({ default: true })
  canDraggable: boolean;

  @Prop({ default: 'main' })
  type!: string;

  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100,
  };

  onEnd(data) {
    console.log(data);
  }

  deleteList(item) {
    this.$set(item, 'checked', false);
    if (this.type === 'sub') {
      const subChecked = this.getSomeSelect(
        this.getSubDataList(this.data),
        this.type,
        this.excludeDataItemTypeArr,
      );
      this.$set(this.data, 'checked', subChecked);
      if (this.data.childColumns) {
        this.$set(item, 'isQueryColumn', false);
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
/deep/.data-right-list {
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
    border-bottom: 1px solid #dddddd;
    border-top: 1px solid #dddddd;
    margin-bottom: 8px;
    .data-right-li:hover {
      + div.sub_draggable {
        background: #eef4fd;
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
    em {
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
    display: flex;
    height: 36px;
    line-height: 20px;
    padding: 12px 0 4px 0;
    &.main_handles {
      &::after {
        content: var(--dragTips);
        font-size: 12px;
        font-weight: 400;
        color: rgba(17, 18, 24, 0.5);
      }
      .zh {
        display: inline-block;
        width: unset;
        max-width: calc(100% - 108px);
      }
      .en {
        display: inline-block;
        width: unset;
        max-width: calc(100% - 125px);
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
  em {
    color: rgba(17, 18, 24, 0.5);
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
