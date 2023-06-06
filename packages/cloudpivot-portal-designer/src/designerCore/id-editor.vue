<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div type="flex" class="id-editor">
    <a-row class="id-label">
      <a-col>
        <label>{{ $t('designer.base.ID') }}</label>
      </a-col>
    </a-row>
    <a-row class="id-content">
      <a-col class="id-input">
        <a-input
          id="idContent"
          v-model="value"
          class="idContent"
          @keypress.enter="(e) => rename(e.target.value)"
          @blur="(e) => rename(e.target.value)"
        />
      </a-col>
      <a-col class="id-icon">
        <a-icon type="copy" @click="onCopyId" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Col, Icon, Row, Input } from '@h3/antd-vue';

import { register } from '@cloudpivot-shared/ui-designer-common';

@Component({
  components: {
    ARow: Row,
    ACol: Col,
    AInput: Input,
    AIcon: Icon,
  },
})
export default class IDEditor extends Vue {
  value = '';

  @Prop({
    default: '',
  })
  uid!: string;

  @Watch('uid', {
    immediate: true,
  })
  onUidChange() {
    this.value = this.uid;
  }

  get store() {
    return register.store as any;
  }

  // get active() {
  //   return this.store.active as DesignerNode;
  // }

  mounted() {
    this.setReadOnly();
  }

  updated() {
    this.setReadOnly();
  }

  setReadOnly() {
    const idContent = document.getElementById('idContent');
    idContent.setAttribute('readonly', 'true');
  }

  rename(newId: string) {
    if (!newId || newId === this.uid) {
      this.value = this.uid;
      return;
    }

    try {
      this.store.app.rename(this.uid, newId);
      this.store.setActive(newId);
    } catch {
      this.value = this.uid;
      this.$message.error(
        this.$t('designer.tips.IDExists', {
          id: newId,
        }).toString(),
      );
    }
  }

  onCopyId() {
    const ele: any = document.querySelector('.idContent');
    ele.select();
    document.execCommand('copy');
    this.$message.success(this.$t('designer.tips.copySuccess').toString());
  }
}
</script>

<style lang="less" scoped>
.id-editor {
  margin-top: 16px;
  padding: 0 16px;
  .id-label {
    margin-right: 8px;
    display: flex;
    margin-bottom: 4px;
    line-height: 20px;
    font-size: 12px;
    color: #111218;
    font-weight: 600;
  }
  .id-content {
    display: flex;
  }
  .id-input {
    width: 100%;
    margin-right: 12px;
    .idContent[readonly] {
      cursor: not-allowed;
      height: 30px;
      background: #f1f2f6;
      border-radius: 2px;
      font-size: 13px;
      font-weight: 400;
      color: #111218;
      border: unset;
      &:hover,
      &:focus,
      &:active {
        border: unset;
        box-shadow: unset;
      }
    }
  }
  .id-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: @text-color;
  }
}
</style>
