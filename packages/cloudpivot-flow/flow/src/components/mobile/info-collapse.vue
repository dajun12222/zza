<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    v-if="
      node.bizComment &&
      node.bizComment.type !== 0 &&
      node.bizComment.type !== 9 &&
      !!node.bizComment.content
    "
    class="approval-info-wrapper"
  >
    <div
      :id="'info-collapse-' + node.workItemId"
      :class="{
        'info-collapse': true,
        expanded: expanded,
      }"
    >
      <div
        :id="'form-approval__text-' + node.workItemId"
        class="form-approval__text"
      >
        <span
          v-if="
            node.bizComment.type === 5 ||
            node.bizComment.type === 6 ||
            node.bizComment.type === 7
          "
          class="form-approval__participant"
        >
          {{
            `${getWorkflowActionStatus(
              node.bizComment.type,
              'node.bizComment.type',
            )}给`
          }}
          <template v-if="node.bizComment.type === 7">{{
            node.forwardReceiver
          }}</template>
          <template v-for="(user, userIdx) in node.bizComment.userInfos">{{ user.name
            }}<template v-if="userIdx < node.bizComment.userInfos.length - 1">、</template></template>
        </span>

        <span v-else class="form-approval__opinion">{{
          node.bizComment.title
        }}</span>

        {{ node.bizComment.content }}
        <span
          v-if="collapse && !expanded"
          class="collapse-button expanded"
          @click="changeExpanded"
        >
          展开
        </span>
        <span
          v-else-if="collapse && expanded"
          class="collapse-button not-expanded"
          @click="changeExpanded"
        >
          收起
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue } from 'vue-property-decorator';

@Component({
  name: 'approval-info',
  components: {},
})
export default class ApprovalInfo extends Vue {
  @Prop()
  node!: any;

  collapse: boolean = false;

  expanded: boolean = false;

  mounted() {
    const infoCollapseEle = (document as any).querySelector(
      `#info-collapse-${this.node.workItemId}`,
    );
    const textEle = (document as any).querySelector(
      `#form-approval__text-${this.node.workItemId}`,
    );
    this.collapse = this.canCollapse(infoCollapseEle, textEle);
  }

  canCollapse(infoCollapseEle, textEle) {
    if (!infoCollapseEle || !textEle) {
      return false;
    }
    const infoHeight = infoCollapseEle.offsetHeight;
    const textHeight = textEle.offsetHeight;
    return infoHeight !== textHeight;
  }

  changeExpanded() {
    this.expanded = !this.expanded;
  }
}
</script>

<style lang="less">
@import '~cloudpivot/common/styles/mixins.less';
@import '../style';
.approval-info-wrapper {
  .px2rem(margin-top, 24px);
  .px2rem(padding-top, 24px);
}

.info-collapse {
  .px2rem(max-height, 69px);
  overflow: hidden;
  position: relative;
  &.expanded {
    max-height: unset;
  }

  .form-approval__text {
    .hairline('top', #eeeeee);
    .px2rem(font-size, 30px);
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
  }

  .collapse-button {
    position: absolute;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), #fff 45%);
    color: #2970ff;
    text-align: right;
    .px2rem(font-size, 30px);
    .px2rem(padding-right, 16px);
    .px2rem(width, 150px);
    &.not-expanded {
      position: relative;
      white-space: nowrap;
    }
  }
}
</style>
