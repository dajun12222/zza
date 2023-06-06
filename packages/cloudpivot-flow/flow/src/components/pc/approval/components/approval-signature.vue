<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-signature">
    <img :src="file.img" @click.stop="previewImage(file)" />

    <a-modal
      v-model="showPreview"
      :footer="null"
      :maskClosable="false"
      :keyboard="false"
      wrapClassName="approve-img-preview-modal"
      :destroyOnClose="true"
    >
      <img style="width: 100%" :src="file.img" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Modal } from '@h3/antd-vue';
import { observeModal } from 'cloudpivot/common/src/utils/dom';

@Component({
  name: 'approval-signature',
  components: {
    AModal: Modal,
  },
})
export default class ApprovalSignature extends Vue {
  @Prop()
  file!: any;

  showPreview: boolean = false;

  previewImage(file: any) {
    this.showPreview = true;
    this.$nextTick(() => {
      observeModal('approve-img-preview-modal');
    });
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
.approval-signature {
  img {
    width: 58px;
    height: 58px;
    border-radius: 4px;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>

<style lang="less">
.approve-img-preview-modal {
  .ant-modal-body {
    height: calc(((100vh - 48px) - 24px) - 152px);
    img {
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
