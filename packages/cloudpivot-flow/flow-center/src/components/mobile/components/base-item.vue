<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="card-item"
    :class="hasCheckbox ? 'item-add' : ''"
    @click="$emit('click')"
  >
    <slot v-if="hasleft" name="left"></slot>
    <slot v-if="hasCheckbox" name="checkbox"></slot>
    <section class="item-content">
      <div class="head-wrap">
        <img
          v-if="beTrust && !currentTrustor"
          class="delegation-icon"
          src="../assets/images/entrusted.png"
        />
        <img
          v-else-if="beTrust && currentTrustor"
          class="delegation-icon"
          src="../assets/images/entrust.png"
        />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h3
          v-if="searchWord"
          class="item-content-title"
          v-html="splitKeyword(title)"
        ></h3>
        <h3 v-else class="item-content-title">
          {{ title }}
        </h3>
      </div>
      <p class="item-content-summary">
        <span>{{ summary }}</span>
        <slot name="badge"></slot>
        <slot name="activitie"></slot>
      </p>
      <p v-if="itemTitle" class="item-content-summary">
        <span>{{ itemTitle }}</span>
        <slot name="template"></slot>
      </p>
      <time class="item-content-time">
        <slot name="time"></slot>
        {{ showTime }}
        <div v-if="isShowUrged" class="tag-wrapper">
          <span class="urged">{{
            $t('cloudpivot.flowCenter.mobile.beUrged')
          }}</span>
        </div>
        <div v-if="isShowAssist" class="tag-wrapper">
          <span class="assist-tag" :style="{ width: assistWrapWidth }">
            {{ assistName || '协办' }}中
          </span>
        </div>
      </time>
      <div
        class="item-content-user clearfix"
        :class="{ place: avatar || username }"
      >
        <img
          v-if="avatar && avatar.includes('http')"
          :src="avatar"
          class="content-user-avatar"
        />
        <img
          v-else-if="avatar || avatarPlacehold"
          :src="avatar ? getDownloadUrlNew(avatar) : defaultAvatar"
          class="content-user-avatar"
        />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span
          v-if="searchWord && searchUser"
          class="content-user-name"
          v-html="splitKeyword(username)"
        ></span>
        <span v-else class="content-user-name">{{ username }}</span>
      </div>
    </section>
    <slot name="right"></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import { utils } from 'cloudpivot/common';
@Component({
  name: 'CardItem',
})
export default class CardItem extends Vue {
  @Prop() title!: string;

  @Prop() summary!: string;

  @Prop() itemTitle?: string;

  @Prop() time!: string;

  @Prop() avatar!: any;

  @Prop() username!: string;

  @Prop() hasleft!: boolean;

  @Prop() hasCheckbox?: boolean;

  @Prop({ default: false }) isShowUrged!: boolean;

  @Prop({ default: false }) beTrust?: boolean;

  @Prop({ default: false }) currentTrustor?: boolean;

  @Prop() searchWord?: string; // 搜索关键字

  @Prop() searchUser?: boolean; // 搜索关键字不高亮参与者时

  // 是否为头像占位，当头像空白时
  @Prop() avatarPlacehold?: boolean;

  @Prop({ default: false }) isShowAssist!: boolean;

  @Prop({ default: '' }) assistName!: string;

  showTime: string = '';

  defaultAvatar: any = require('../assets/images/avatar.png');

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  get assistTextLength() {
    return utils.calcStrLength((this.assistName || '协办') + '中');
  }

  //动态计算标签的宽度
  get assistWrapWidth() {
    const baseFontSize = 75;
    if (this.assistTextLength <= 6) {
      return Number(168 / baseFontSize).toFixed(2) + 'rem';
    } else if (this.assistTextLength > 6 && this.assistTextLength <= 8) {
      return Number(205 / baseFontSize).toFixed(2) + 'rem';
    } else {
      return Number(205 / baseFontSize).toFixed(2) + 'rem';
    }
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  created() {
    if (this.time) {
      const _time = this.time;
      // this.showTime = _time.substr(0, 16);
      this.showTime = _time;
    }
  }

  /**
   * 高亮匹配文字
   */
  splitKeyword(title: any) {
    if (this.searchWord && title) {
      const reg: RegExp = new RegExp(`${this.searchWord}`, 'g');
      const arr: any = title.replace(
        reg,
        `<span class="highlight">${this.searchWord}</span>`,
      );
      return arr;
    }
    return title;
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot/common/styles/mixins.less';

@user-img: 56px;

.card-item {
  display: flex;
  .px2rem(margin, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  background: @white-background;
  .item-content {
    flex: 1;
    text-align: left;
    overflow: hidden;
    .head-wrap {
      display: flex;
      .delegation-icon {
        .px2rem(width, 40px);
        .px2rem(height, 40px);
        .px2rem(margin-right, @horizontal-padding-md);
        .px2rem(margin-top, 4px);
      }
    }
    &-title {
      word-break: break-all;
      .px2rem(margin-bottom, @horizontal-padding-sm);
      .px2rem(font-size, @font-size-md);
      .px2rem(line-height, @line-height-base);
      .lineclamp(1);
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    /deep/.highlight {
      color: @primary-color;
    }
    &-summary {
      .px2rem(margin-bottom, @horizontal-padding-sm);
      .px2rem(font-size, @font-size-sm);
    }
    &-time {
      .px2rem(font-size, @font-size-xxs);
      .px2rem(line-height, 33px);
      .px2rem(height, 36px);
      color: @text-color-describe;
      display: flex;
      align-items: center;
    }
    &-user {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &.place {
        .px2rem(margin-top, 20px);
      }
    }
  }
  .content-user-avatar {
    .px2rem(width, @user-img);
    .px2rem(height, @user-img);
    border-radius: 50%;
    object-fit: cover;
  }
  .content-user-name {
    display: inline-block;
    .px2rem(margin-left, @horizontal-padding-md);
  }

  .tag-wrapper {
    display: inline-block;
    .px2rem(width, 84px);
    .px2rem(height, 36px);
    .px2rem(margin-left, 16px);
    &:first-child {
      .px2rem(margin-left, 30px);
    }

    .urged {
      display: inline-block;
      background: #fdeae9;
      .px2rem(width, 168px);
      .px2rem(height, 72px);
      .px2rem(border-radius, 36px);
      .px2rem(font-size, 40px);
      .px2rem(line-height, 72px);
      color: #f0353f;
      text-align: center;
      transform: scale(0.5);
      transform-origin: left;
      transform-origin: 0 0;
    }

    .assist-tag {
      display: inline-block;
      background: rgba(163, 203, 255, 0.2);
      .px2rem(width, 168px);
      .px2rem(height, 72px);
      .px2rem(border-radius, 36px);
      .px2rem(font-size, 40px);
      .px2rem(line-height, 72px);
      .px2rem(padding-left, 20px);
      .px2rem(padding-right, 20px);
      color: #2970ff;
      text-align: center;
      transform: scale(0.5);
      transform-origin: left;
      transform-origin: 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.item-add {
  align-items: center;
  padding-left: 0.2rem;
}
</style>
