<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-comment">
    <span class="comment-remark">{{ '【' + commentRemark + '】' }}</span>
    <span class="comment-text">{{ commnetText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'approval-comment',
  components: {},
})
export default class ApprovalComment extends Vue {
  @Prop()
  commentRemark!: string;

  @Prop()
  commnetText!: string;
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
.approval-comment {
  max-height: 160px;
  overflow: auto;
  word-break: break-all;
  font-size: 13px;
  line-height: 22px;
  padding: 6px 8px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e4e7ec;
  .comment-remark {
    color: #707481;
  }
  .comment-text {
    color: #121933;
  }
}
</style>
