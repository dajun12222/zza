<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="manager-wrapper">
    <div class="header">
      <div class="header-left">
        <InputSearch
          v-model="field"
          :placeholder="$t('languages.common.workBenchInfo.placeholder1')"
          :isAsync="true"
          :allowClear="true"
        />
      </div>
      <div class="header-right">
        <span>{{
          $t('languages.common.workBenchInfo.tips3', {
            num: selectedApps.length,
          })
        }}</span>
      </div>
    </div>
    <div class="content">
      <div class="apps-all">
        <div class="apps-all-wrapper">
          <div
            v-for="(item, index) in searchAllApps"
            :key="index"
            class="app-item"
          >
            <app-icon :appData="item" />
            <div class="app-name">
              <span
                v-hight-light="{ keyWords: field, value: getDisplayName(item) }"
              ></span>
            </div>
            <a-checkbox
              :checked="item.selected"
              @change="select(item, index)"
            />
          </div>
        </div>
      </div>
      <div class="apps-selected">
        <draggable
          v-if="selectedApps.length > 0"
          :list="selectedApps"
          :options="dragOptions"
          class="drags-area"
          chosenClass="chosen"
          ghostClass="ghost"
          handle=".drag-icon"
        >
          <template v-for="(item, index) in selectedApps">
            <div :key="index" class="app-item">
              <div>
                <span class="drag-icon icon aufontAll h-icon-all-drag"></span>
              </div>
              <app-icon :appData="item" />
              <div class="app-name">{{ getDisplayName(item) }}</div>
              <div class="app-add">
                <span
                  class="icon aufontAll h-icon-all-close"
                  @click="unSelect(item, index)"
                ></span>
              </div>
            </div>
          </template>
        </draggable>
        <template v-else>
          <div class="none-selected-wrapper">
            <div class="none-selected">
              <img :src="require('../../../../../assets/img/drag-tips.png')" />
              <div class="img-text">
                {{ $t('languages.common.workBenchInfo.tips4') }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="middle-line"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Popover, Checkbox } from '@h3/antd-vue';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import Draggable from 'vuedraggable';
import AppIcon from './app-icon.vue';

@Component({
  components: {
    APopover: Popover,
    InputSearch,
    Draggable,
    AppIcon,
    ACheckbox: Checkbox,
  },
})
export default class SelectApp extends Vue {
  @Prop() allApps!: any[];

  @Prop() selectedApps!: any[];

  field: string = '';

  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100,
  };

  get searchAllApps() {
    return this.allApps.filter((item) =>
      this.getDisplayName(item).includes(this.field),
    );
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  select(item, index) {
    if (item.selected) {
      item.selected = false;
      const delIndex = this.selectedApps.findIndex((el) => el.index === index);
      this.$emit('unSelect', delIndex);
    } else {
      item.selected = true;
      this.$emit('select', { ...item, index });
    }
  }

  unSelect(item, index) {
    this.allApps[item.index].selected = false;
    this.$emit('unSelect', index);
  }

  getDisplayName(item) {
    let name: string = item.name;
    if (item.name_i18n) {
      const name_i18n =
        typeof item.name_i18n === 'object'
          ? item.name_i18n
          : JSON.parse(item.name_i18n);
      name = name_i18n[this.$i18n.locale] || name;
    }
    return name;
  }
}
</script>

<style lang="less" scoped>
.manager-wrapper {
  position: relative;
  .header {
    display: flex;
    padding: 16px 0 6px 0;
    line-height: 32px;
    .header-left {
      padding: 0 16px;
      width: 50%;
    }
    .header-right {
      padding: 0 16px;
      width: 50%;
    }
  }
  .content {
    display: flex;
    .apps-all {
      width: 50%;
      .apps-all-wrapper {
        height: 434px;
        padding: 0 16px;
        overflow: overlay;
      }
    }
    .apps-selected {
      width: 50%;
      padding: 0 16px;
      height: 434px;
      overflow: overlay;
      .none-selected-wrapper {
        display: flex;
        justify-content: center;
        height: 434px;
        .none-selected {
          padding-top: 77px;
          img {
            width: 204px;
            height: 204px;
          }
          .img-text {
            color: rgba(17, 18, 24, 0.5);
            line-height: 22px;
            text-align: center;
          }
        }
      }
    }
    .app-item {
      display: flex;
      align-items: center;
      height: 38px;
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
      .drag-icon {
        padding-right: 8px;
        color: rgba(17, 18, 24, 0.25);
        cursor: move;
      }
      /deep/.app-icon {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #eeeeee;
        margin: 0;
        img {
          height: 16px;
          width: 16px;
        }
        svg {
          height: 16px;
          width: 16px;
        }
      }
      .app-name {
        flex: 1;
        padding: 0 8px;
        font-size: 14px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .app-add .icon {
        color: rgba(17, 18, 24, 0.5);
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .middle-line {
    position: absolute;
    height: 100%;
    top: 0px;
    left: 50%;
    width: 1px;
    background: #dddddd;
  }
}
</style>
