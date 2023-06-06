<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import * as monaco from 'monaco-editor';

@Component({
  name: 'monaco-editor',
})
export default class MonacoEditor extends Vue {
  @Prop() value!: string;

  @Prop({
    default: 'css',
  })
  language!: string;

  @Prop({
    default: 'vs-dark',
  })
  theme!: string;

  codeEditor?: monaco.editor.IStandaloneCodeEditor;

  @Watch('value', {
    immediate: true,
  })
  onValueChange(val: string) {
    if (this.codeEditor) {
      this.codeEditor.setValue(val || '');
    }
  }

  // @Watch('theme',{
  //     immediate : true
  // })
  // onThemeChange(theme : string){
  //     if(this.codeEditor && theme){
  //         this.codeEditor.setTheme(theme);
  //     }
  // }

  // @Watch('language',{
  //     immediate : true
  // })
  // onLanguageChange(language : string){
  //     if(this.codeEditor && language){
  //         this.codeEditor.setModelLanguage(language);
  //     }
  // }

  resize() {
    if (this.codeEditor) {
      this.codeEditor.layout();
    }
  }

  init() {
    this.codeEditor = monaco.editor.create(this.$el as HTMLElement, {
      value: this.value,
      language: this.language,
      theme: this.theme,
      automaticLayout: true,
      scrollbar: {
        horizontalScrollbarSize: 7,
        verticalScrollbarSize: 7,
      },
    });

    this.codeEditor.onDidBlurEditorWidget(() => {
      if (this.codeEditor) {
        const val = this.codeEditor.getValue();
        this.$emit('blur', val);
      }
    });
  }

  mounted() {
    if (this.codeEditor) {
      this.codeEditor = undefined;
    }

    this.$nextTick(() => {
      this.init();
    });
  }

  beforeCreate() {}

  // beforeDestroy () {
  //   console.log('销毁编辑器');
  // if (this.codeEditor) {
  //   this.codeEditor.dispose();
  // }
  // }
}
</script>

<style lang="less" scoped></style>
