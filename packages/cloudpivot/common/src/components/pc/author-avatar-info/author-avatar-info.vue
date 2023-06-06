<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-12-11 20:51:43
 * @LastEditors: baidongsheng
 * @LastEditTime: 2021-12-25 16:31:10
-->
<template>
  <div>
    <a-popover
      :trigger="item.trigger || 'click'"
      placement="bottomLeft"
      @visibleChange="visibleChange"
    >
      <template slot="content">
        <AuthorCard
          class="author-card"
          :authorId="item.sourceId"
          :cardData="cardData"
        />
      </template>
      <div
        class="author"
        :class="{ 'only-img-author': item.onlyImg }"
        @click.stop="returnClick"
      >
        <div class="avatar-wrapper">
          <img
            v-if="item.imgUrl && item.imgUrl.includes('http')"
            :src="item.imgUrl"
          />
          <img v-else-if="item.imgUrl" :src="getDownloadUrlNew(item.imgUrl)" />
          <em v-else class="aufontAll icon h-icon-all-user-o"></em>
        </div>
        <span v-if="!item.onlyImg" class="cn">{{ item.sourceName }}</span>
      </div>
    </a-popover>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import OrgApi from '../api/organization';
import AuthorCard from '../author-card/author-card.vue';
import { Popover } from '@h3/antd-vue';
import getDownloadUrlNew from '../../../utils/getDownloadUrlNew';
@Component({
  name: 'author-avatar-info',
  components: {
    AuthorCard,
    APopover: Popover,
  },
})
export default class AuthorAvatarInfo extends Vue {
  @Prop({
    default: {
      sourceId: '',
      imgUrl: '',
      sourceName: '',
      onlyImg: false,
      trigger: 'click',
    },
  })
  item?: any;

  //   @Prop()sourceId?:string;
  //   @Prop()imgUrl!:any;
  //   @Prop()sourceName!:string;

  cardData: any = {}; //卡片数据

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  returnClick(event) {
    return;
  }

  /**
   * 获取数据
   */
  async authorChange(id: string) {
    console.log(id);

    this.cardData = {};
    const res = await OrgApi.getOrgUserInfo({ id: id });
    if (res.errcode === 0) {
      this.cardData = res.data;
    }
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  visibleChange(visible) {
    if (visible && Object.keys(this.cardData).length === 0) {
      this.authorChange(this.item.sourceId);
    }
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';

.avatar-wrapper {
  margin-right: 8px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2970ff;
  .user-avatar,
  img {
    min-width: 24px;
    min-height: 24px;
    max-width: 200%;
    max-height: 200%;
  }
  em {
    margin: 0;
    padding: 0;
    position: unset;
    transform: translate(0, 0);
    font-size: 12px;
    color: #fff;
  }
}
.author {
  overflow: inherit;
  position: relative;
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  background-color: #ececed;
  border-radius: 12px;
  padding-right: 8px;
  .author-card {
    left: 16px;
    top: 32px;
  }
  .cn {
    display: inline-block !important;
    width: calc(100% - 24px) !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    color: #111218;
    white-space: nowrap;
    &:hover {
      color: @highlightColor !important;
    }
  }
  &.only-img-author {
    padding-right: 0;
    .avatar-wrapper {
      margin-right: 0;
    }
  }
}
.icon-wrapper {
  display: inline-block;
  width: 24px;
  height: 24px;
  min-width: 24px;
  line-height: 24px;
  border-radius: 50%;
  background-color: rgba(17, 18, 24, 0.25);
  text-align: center;
  margin-right: 6px;
  i {
    line-height: 24px !important;
    color: #fff !important;
    font-size: 14px !important;
  }
}
</style>
