<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <MonacoEditor
    ref="editor"
    :value="script"
    language="javascript"
    :style="style"
    class="editor"
    @blur="onBlur"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { register } from '@cloudpivot-shared/ui-designer-common';
import MonacoEditor from '../monaco-editor/index.vue';
import { scriptParser } from '../utils/parse-script';
import { UiEngienLanguageService } from './ui-engine-language-service';

@Component({
  components: {
    MonacoEditor,
  },
})
export default class EventCustomAction extends Vue {
  @Prop()
  visible!: boolean;

  @Prop({ default: 'page' }) target!: string;

  @Prop({ default: 0 }) width!: number;

  script = '';

  languageService!: UiEngienLanguageService;

  @Prop()
  store!: any;

  get pageActions() {
    return this.store.customAction?.names || [];
  }

  get appActions() {
    return this.store.appAction?.names || [];
  }

  @Watch('target')
  onTargetChange(val: string) {
    if (val) {
      this.loadScript();
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

  loadScript() {
    if (this.target === 'app') {
      this.script = this.store?.appAction?.script || '';
      // 应用动作是没有画布的，需要关掉语言服务
      this.languageService.disable = true;
    } else {
      this.script = this.store?.customAction?.script || `/**
 * 页面js动作，会在页面事件加载完成时调用
 * 自定义事件需要写在onPageEnter方法中
 * 请不要删除onPageEnter方法,否则自定义事件不执行
 *  */
function onPageEnter() {
    
}`;
      this.languageService.disable = false;
    }
  }

  created() {
    this.languageService = new UiEngienLanguageService(this.$uiEngine);
  }

  async mounted() {

    this.loadScript();
    // 切换页面，内容更新后，要更新页面自定义动作
    const subscription = (this as any).$uiEngine.pageUpdated.subscribe(() => {
      this.loadScript();
    });
    this.$once('hook:beforeDestroy', () => {
      subscription.unsubscribe();
    });
  }

  validate(actions: any, names: string[]) {
    if (Array.isArray(actions)) {
      const duplicate = names.filter((name: string) => actions.includes(name));
      if (duplicate.length) {
        const target = this.target === 'app' ? '页面' : '应用动作';
        this.$message.warn(
          `以下动作在${target}中已定义，请检查：` + duplicate.join('，'),
        );
        return false;
      }
    }
    return true;
  }

  onBlur(value) {
    if (this.script === value) {
      return;
    }
    this.script = value;

    // 检查应用定义和页面定义是否存在重复的事件，并做提示
    const names = scriptParser(this.script);
    // const actions = this.target === 'page' ? this.pageActions : this.appActions;
    // if (!this.validate(actions, names)) {
    //   return;
    // }
    const customAction = {
      names,
      script: this.script,
    };
    this.target === 'app'
      ? this.store.setAppAction(customAction)
      : this.store.setCustomAction(customAction);
    if (this.target === 'page') {
      this.store.dirty = true;
    }
    // if (this.target === 'app') { this.$emit('saveApp'); }
  }
}
</script>

<style lang="less" scoped>
.event-modal {
  /deep/.ant-modal-content {
    height: 100%;
  }
  /deep/.ant-modal-body {
    height: calc(100% - 55px) !important;
  }
}
</style>
