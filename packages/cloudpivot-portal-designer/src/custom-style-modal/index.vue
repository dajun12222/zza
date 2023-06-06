<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <MonacoEditor
    ref="editor"
    :value="script"
    :style="style"
    class="editor"
    @blur="onBlur"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Modal } from '@h3/antd-vue';
import MonacoEditor from '../monaco-editor/index.vue';
import { register } from '@cloudpivot-shared/ui-designer-common';

@Component({
  components: {
    MonacoEditor,
    AModal: Modal,
  },
})
export default class CustomStyleModal extends Vue {
  script = '';

  // style source: app / page / ...
  @Prop({ default: 'page' }) target!: string;

  @Prop({ default: 0 }) width!: number;

  @Prop()
  store!: any;

  @Watch('target')
  onTargetChange(val: string) {
    if (val) {
      this.loadScript();
    }
  }

  loadScript() {
    if (this.target === 'app') {
      this.script = this.store?.appStyle || '';
      return;
    }
    
    if (this.target === 'page') {
      this.script = this.store?.customStyle || '';
    }
  }

  get style() {
    const sliderWidth = 247 + 299;
    const width = this.width
      ? `${this.width}px`
      : `calc(100vw - ${sliderWidth}px)`;
    const style = {
      height: '100%',
      minHeight: '500px',
      width,
    };
    return style;
  }

  async mounted() {
    this.loadScript();
    // 切换页面，内容更新后，要更新页面样式
    const subscription = (this as any).$uiEngine.pageUpdated.subscribe(() => {
      this.loadScript();
    });
    this.$once('hook:beforeDestroy', () => {
      subscription.unsubscribe();
    });
  }

  onBlur(value) {
    if (this.script !== value) {
      this.script = value;
      if (this.target === 'app') {
        this.store.setAppStyle(this.script);
        // this.$emit('saveApp');
      } else {
        this.store.setCustomStyle(this.script);
        this.store.dirty = true;
      }
    }
  }

  handleCancel() {
    this.closeModal();
  }

  closeModal() {
    this.$emit('close');
  }
}
</script>
