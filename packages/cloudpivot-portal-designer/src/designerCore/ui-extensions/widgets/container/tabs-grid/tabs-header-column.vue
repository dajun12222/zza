<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="tabs-heads-column"
    :class="{ showChangePageIcon: showChangePageIcon }"
  >
    <div
      v-if="showChangePageIcon"
      class="last-page"
      :class="{ disabled: lastPageBtnDisabled }"
      @click="lastPage"
    >
      <span class="opt-icon aufontAll">&#xe8ac;</span>
    </div>
    <div
      v-if="showChangePageIcon"
      class="next-page"
      :class="{ disabled: nextPageBtnDisabled }"
      @click="nextPage"
    >
      <span class="opt-icon aufontAll">&#xe88a;</span>
    </div>
    <div ref="tabsHeads" class="tabs-heads-column-box">
      <div ref="tabsHeadsBox">
        <div
          v-for="head in heads"
          :key="head.key"
          class="tabs-head"
          :class="{ active: activeKey === head.key }"
          :style="textStyle"
          :title="head.title"
          @click="setActiveKey($event, head.key)"
        >
          <div v-if="!!head.icon" class="header-icon">
            <div
              v-if="head.icon.includes('http') || head.icon.includes('/api')"
              class="img-icon"
            >
              <img :src="head.icon" alt="icon" />
            </div>
            <span v-else class="icon aufontAll" :class="head.icon"></span>
          </div>
          <!-- <span>{{ head.title }}</span> -->
          <span>{{ getTabTitle(head) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'tabs-heads-column',
  components: {},
})
export default class TabsHeads extends Vue {
  @Prop({
    default: () => [],
  })
  heads!: any[];

  @Prop()
  textStyle!: any;

  @Model('change')
  readonly activeKey!: string;

  setActiveKey(event: any, key: string) {
    if (this.showChangePageIcon) {
      const tabsHead = event.currentTarget as HTMLElement;
      const tabsHeads = this.$refs['tabsHeads'] as HTMLElement;
      if (tabsHead.offsetTop - 16 < tabsHeads.scrollTop) {
        tabsHeads.scrollTop = tabsHead.offsetTop - 16;
      } else if (
        tabsHead.offsetTop +
          tabsHead.offsetHeight -
          16 -
          tabsHeads.offsetHeight >
        tabsHeads.scrollTop
      ) {
        tabsHeads.scrollTop =
          tabsHead.offsetTop +
          tabsHead.offsetHeight -
          16 -
          tabsHeads.offsetHeight;
      } else {
      }
      const slib =
        tabsHeads.scrollTop + tabsHeads.offsetHeight - tabsHeads.scrollHeight;
      if (tabsHeads.scrollTop < 1) {
        this.lastPageBtnDisabled = true;
        this.nextPageBtnDisabled = false;
      } else if (slib < 1 && slib > -1) {
        this.lastPageBtnDisabled = false;
        this.nextPageBtnDisabled = true;
      } else {
        this.lastPageBtnDisabled = false;
        this.nextPageBtnDisabled = false;
      }
    }
    this.$emit('change', key);
  }

  showChangePageIcon: boolean = false;

  mounted() {
    setTimeout(() => {
      this.showChangePageIcon = this.getShowChangePageIcon();
    }, 500);
  }

  @Watch('heads')
  headsChange(value) {
    setTimeout(() => {
      this.showChangePageIcon = this.getShowChangePageIcon();
    }, 250);
  }

  lastPageBtnDisabled: boolean = true;

  lastPage() {
    if (this.lastPageBtnDisabled) {
      return;
    }
    const tabsHeads = this.$refs['tabsHeads'] as HTMLElement;
    tabsHeads.scrollTop -= tabsHeads.offsetHeight;
    if (tabsHeads.scrollTop < 1) {
      tabsHeads.scrollTop = 0;
      this.lastPageBtnDisabled = true;
      this.nextPageBtnDisabled = false;
    } else {
      this.lastPageBtnDisabled = false;
      this.nextPageBtnDisabled = false;
    }
  }

  nextPageBtnDisabled: boolean = false;

  nextPage() {
    if (this.nextPageBtnDisabled) {
      return;
    }
    const tabsHeads = this.$refs['tabsHeads'] as HTMLElement;
    tabsHeads.scrollTop += tabsHeads.offsetHeight;
    const slib =
      tabsHeads.scrollTop + tabsHeads.offsetHeight - tabsHeads.scrollHeight;
    if (slib < 1 && slib > -1) {
      tabsHeads.scrollTop = tabsHeads.scrollHeight;
      this.nextPageBtnDisabled = true;
      this.lastPageBtnDisabled = false;
    } else {
      this.nextPageBtnDisabled = false;
      this.lastPageBtnDisabled = false;
    }
  }

  getShowChangePageIcon() {
    const tabsHeads = this.$refs['tabsHeads'] as HTMLElement;
    const tabsHeadsBox = this.$refs['tabsHeadsBox'] as HTMLElement;
    if (tabsHeads && tabsHeadsBox) {
      console.log(tabsHeadsBox.offsetHeight, tabsHeads.offsetHeight);

      return tabsHeadsBox.offsetHeight > tabsHeads.offsetHeight;
    }
    return false;
  }

  getTabTitle(item) {
    try {
      const tabTitle = JSON.parse(item.title);
      return tabTitle[this.$i18n.locale] || tabTitle['zh'];
    } catch (e) {
      return item.title;
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.tabs-heads-column {
  padding: 20px 0;
  height: 100%;
  width: 84px;
  // border-bottom: 1px solid #e4e7ee;
  box-shadow: 1px 0px 0px 0px #e4e7ee;
  position: relative;
  .tabs-heads-column-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    > div {
      white-space: nowrap;
    }
  }
  .last-page,
  .next-page {
    position: absolute;
    left: 33px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    cursor: pointer;
    .opt-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #eef4fd;
      border-radius: 2px;
      line-height: 16px;
      font-size: 12px;
      text-align: center;
      color: @textColor;
      cursor: pointer;
      &.disabled {
        background-color: #f1f2f6;
        color: rgba(17, 18, 24, 0.25);
        cursor: no-drop;
      }
    }
    &.disabled .opt-icon {
      background-color: #f1f2f6;
      color: rgba(17, 18, 24, 0.25);
      cursor: no-drop;
    }
  }
  .last-page {
    top: 4px;
  }
  .next-page {
    bottom: 4px;
  }
  &.showChangePageIcon {
    padding: 20px 0;
  }
}

.tabs-head {
  height: 36px;
  width: 84px;
  padding: 8px 6px;
  border-radius: @border-radius-base @border-radius-base 0 0;
  position: relative;
  word-break: keep-all;
  align-items: center;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  font-size: 12px;
  color: #111218;
  line-height: 20px;
  .header-icon {
    display: inline-block;
  }
  .img-icon {
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .icon {
    margin-right: 5px;
    font-size: 12px;
    font-weight: 400 !important;
  }

  &.active {
    color: @highlightColor !important;
    font-weight: 600 !important;

    &::after {
      content: '';
      display: inline-block;
      height: 100%;
      background-color: @highlightColor;
      width: 2px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &:hover {
    color: @highlightColor !important;
  }
  + .tabs-head {
    margin-top: 8px;
  }
}
</style>
