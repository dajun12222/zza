<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <template v-if="!readonly">
      <h3-textarea
        v-if="isLangText"
        v-model="val"
        :placeholder="placeholder"
        :autosize="rows"
        :maxLength="maxLength"
        :disabled="readonlyFormula"
        @change="onChange"
      />
      <div v-else :class="{ disabled: readonlyFormula }">
        <h3-editor
          :id="`${id}editor`"
          v-model="val"
          :locale="locale"
          :disabled="readonlyFormula"
          @change="onChange"
        />
      </div>
    </template>

    <template v-else>
      <div v-if="isLangText" class="text">
        {{ val }}
      </div>
      <div v-else class="editor-html" v-html="val"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { TextInputControl } from '../../../controls';

@Component({
  name: 'input-textarea',
  components: {
    H3Textarea: () => import('../h3-textarea.vue'),
    H3Editor: () =>
      import(/* webpackChunkName: "h3-editor" */ './h3-editor.vue'),
  },
})
export default class InputTextarea extends TextInputControl {
  // @Prop({
  // 	default: TextAreaType.LongText
  // })
  // type! :TextAreaType

  onChange() {
    const val = this.val.length === 0 ? null : this.val;
    this.setValue(val);
  }
}
</script>

<style lang="less" scoped>
.text {
  white-space: pre-wrap;
  word-break: break-all;
}
.editor-html {
  line-height: normal !important;
  word-break: break-all;
  //   line-height: unset;
}

.textarea-warp {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 4px;

  & > textarea {
    border: none;
    box-shadow: none;
  }

  & > div {
    text-align: right;
    color: rgba(0, 0, 0, 0.25);
    bottom: 0;
    padding-right: 12px;
    user-select: none;
    font-size: 13px;

    & > .error {
      color: #f5222d;
    }
  }
}
</style>
<style lang="less">
.disabled .tox-statusbar,
.disabled .tox-edit-area__iframe,
.disabled .tox-menubar,
.disabled .tox-toolbar__primary {
  background: #f5f5f5 !important;
  cursor: not-allowed !important;
}
.disabled .tox .tox-tbtn--disabled svg {
  fill: rgba(34, 47, 62, 0.5) !important;
}
.disabled .tox-toolbar-overlord {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
</style>
