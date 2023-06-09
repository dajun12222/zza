<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <monaco-editor ref="monacoEditor" v-model="html" class="editor" />
</template>

<script lang="ts">
import { TemplateExport } from 'cloudpivot-admin-core/src/template/templateExport';
import { schema } from 'cloudpivot-form/form';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FormHtmlParser } from './form-html-parser';

const reg_body = /<body>([\s\S]*)<\/body>/;

export interface ParseResult {
  layout: string[][];

  controls: { [key: string]: schema.FormControl };

  actions: Array<schema.FormAction>;

  elements: Array<schema.FormElement>;
}

@Component({
  name: 'editor',
  components: {
    MonacoEditor: () => import('./monaco-editor.vue'),
  },
})
export default class Editor extends Vue {
  html = '';

  @Prop()
  options!: ParseResult;

  @Watch('options', {
    immediate: true,
  })
  onOptionsChange(options: ParseResult) {
    if (!options) {
      this.html = '';
      return;
    }
    const hideLoading = this.$message.loading('正在生成HTML…', 0) as any;

    setTimeout(() => {
      const tplExport = new TemplateExport({
        configure: JSON.parse(JSON.stringify(options.controls)),
        layout: JSON.parse(JSON.stringify(options.layout)),
      });

      if (options.elements && options.elements.length > 0) {
        const html = options.elements
          .map((e) => this.convertElement(e, tplExport, options))
          .join('\n\n');

        this.html = html;
      } else {
        const html = tplExport.buildTemplateHTML('');
        this.html = this.getHtmlBody(html);
      }
      hideLoading();
    }, 0);
  }

  convertElement(
    e: schema.FormElement,
    tplExport: TemplateExport,
    options: ParseResult,
  ) {
    let inner: string | null = null;
    let before = '';
    let after = '';

    if (e.id === 'template') {
      before = '\n';
      inner = tplExport.buildTemplateControlHTML(
        tplExport.options.layout,
        tplExport.options.configure,
      );
    } else if (e.id === 'toolbar') {
      if (options.actions && options.actions.length > 0) {
        inner = options.actions
          .map((a) => `\t<action text="${a.text}" code="${a.code}"></action>`)
          .join('\n');

        before = after = '\n';
      }
    } else {
      //Else Empty block statement
    }

    if (inner === null) {
      inner = e.innerHTML || '';
    }

    let attrsHtml = '';

    if (e.attrs && e.attrs.length > 0) {
      attrsHtml = ' ' + e.attrs.map((a) => `${a.name}="${a.value}"`).join(' ');
    }

    return `<${e.tagName}${attrsHtml}>${before}${inner}${after}</${e.tagName}>`;
  }

  getHtmlBody(html: string) {
    const result = html.match(reg_body);

    if (!result) {
      return '';
    }

    return result[1] || '';
  }

  parse() {
    const hideLoading = this.$message.loading('正在解析HTML…', 0) as any;

    let html = this.html;

    if (reg_body.test(html)) {
      html = this.getHtmlBody(html);
    }

    return new Promise<ParseResult>((resolve, reject) => {
      setTimeout(() => {
        try {
          const parser = new FormHtmlParser(html);
          parser.parse();

          hideLoading();

          const els = parser.elements.map((e) => ({
            tagName: e.tagName,
            innerHTML: e.innerHTML,
            id: e.id,
            attrs: e.attrs,
          }));

          const result: ParseResult = {
            layout: parser.layout,
            controls: parser.controls,
            actions: parser.actions,
            elements: els,
          };

          resolve(result);
        } catch (err) {
          hideLoading();
          this.$message.error('HTML解析错误：' + err.message);
          reject(err);
        }
      }, 0);
    });
  }

  resize() {
    const monacoEditor = this.$refs.monacoEditor as any;
    if (monacoEditor) {
      monacoEditor.resize();
    }
  }
}
</script>

<style lang="less" scoped>
.editor {
  text-align: left;
  flex-grow: 1;
  min-height: 300px;
  min-width: 800px;
}
</style>
