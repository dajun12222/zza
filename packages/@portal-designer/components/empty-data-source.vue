<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="empty">
    <div class="empty-content">
      <div v-if="showEmptyImg" class="empty-img">
        <img src="./assets/images/empty-data-source.png" alt="" />
      </div>
      <div class="empty-text">
        <span>{{ emptyText }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'edit-pop-up',
  components: {},
})
export default class emptyData extends Vue {
  @Prop()
  emptyImg: string;

  @Prop()
  emptyText: string;

  @Prop({ default: true })
  showEmptyImg: boolean;
}
</script>
<style lang="less" scoped>
.empty {
  position: relative;
  text-align: center;
  height: 100%;
  width: 100%;
  .empty-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .empty-img {
      height: 72px;
      margin-bottom: 12px;
      > img {
        width: 92px;
        height: 72px;
      }
    }
    .empty-text {
      height: 22px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(17, 18, 24, 0.5);
      line-height: 22px;
    }
  }
}
</style>
