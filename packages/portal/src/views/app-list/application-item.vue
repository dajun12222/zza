<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="item-box">
    <div class="item-icon-box">
      <template v-if="applicationItem.logoUrl">
        <img
          v-if="applicationItem.logoUrl.indexOf('http') > -1"
          :src="applicationItem.logoUrl"
          class="item-icon"
        />
        <img
          v-else
          :src="getDownloadUrlNew(applicationItem.logoUrl, 'application')"
          class="item-icon"
        />
        <!-- 应用和模型图片需要传参Model -->
      </template>

      <template v-else>
        <svg class="svg-icon svgIcon" aria-hidden="true">
          <use xlink:href="#h-icon-all-application1" />
        </svg>
      </template>
    </div>
    <div class="item-text">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <!-- <p
        v-if="applicationItem.remarks"
        :title="applicationItem.name"
        class="item-name"
        v-html="applicationItem.remarks"
      ></p> -->
      <p
        
        class="item-name"
        :title="
          isChinese
            ? applicationItem && applicationItem.name
            : (JSON.parse(applicationItem && applicationItem.name_i18n) &&
                JSON.parse(applicationItem && applicationItem.name_i18n).en) ||
              (applicationItem && applicationItem.name)
        "
      >
        {{
          isChinese
            ? applicationItem && applicationItem.name
            : (JSON.parse(applicationItem && applicationItem.name_i18n) &&
                JSON.parse(applicationItem && applicationItem.name_i18n).en) ||
              (applicationItem && applicationItem.name)
        }}
      </p>
      <p class="item-group-name">
        所属分组：{{ applicationItem.appGroupName }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  name: 'applicationItem',
  components: {},
})
export default class applicationItem extends Vue {
  @Prop()
  applicationItem!: any;

  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  /**
   * 自定义应用图片
   */
  getDownloadUrlNew(refId: string, type?: string) {
    return getDownloadUrlNew.getImageUrl(refId, type);
  }

  created() {}
}
</script>

<style lang="less" scoped>
.item-box {
  display: flex;
}
.item-icon-box {
  margin: 17px 12px 17px 16px;
  border-radius: 2px;
  // border: 1px solid #eeeeee;
  width: 40px;
  height: 40px;
  .item-icon {
    width: 40px;
    height: 40px;
    border-radius: 2px;
  }
  .svg-icon {
    width: 26px;
    height: 26px;
    margin: 6px 0 0 6px;
    padding: 0;
  }
}
.item-text {
  padding-top: 16px;
  width: 130px;
  .item-name {
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    font-weight: 600;
    color: #111218;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-group-name {
    height: 20px;
    font-size: 12px;
    color: rgba(17, 18, 24, 0.5);
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }
}
</style>
