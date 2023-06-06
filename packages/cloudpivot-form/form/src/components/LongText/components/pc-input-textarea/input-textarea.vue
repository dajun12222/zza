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
        @blur="onBlur"
      />
      <div :id="`${id}editors`" v-else :class="{ disabled: readonlyFormula }">
        <h3-editor
          :id="`${id}editor`"
          v-if="renderComponent"
          v-model="val"
          :locale="locale"
          :disabled="readonlyFormula"
          @change="onChange"
        />
      </div>
    </template>

    <template v-else>
      <div v-if="isLangText" class="text">
        <span>{{ val }}</span>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-else class="editor-html" v-html="val"></div>
    </template>
  </div>
</template>

<script lang="ts">
import * as typings from 'cloudpivot-form/form/schema';
import { TextInputControl } from 'cloudpivot-form/form/src/common/controls/input-controls/text-input-control';
import { Component } from 'vue-property-decorator';

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
  renderComponent: boolean = true;

  forceRerender() {
    // 从 DOM 中删除 组件
    this.renderComponent = false;
    const chArr: any = document.body.getElementsByClassName('ke-container');
    for (let i: number = 0; i < chArr.length; i++) {
      if (chArr[i] !== null) {
        chArr[i].parentNode.removeChild(chArr[i]);
      }
    }

    this.$nextTick(() => {
      // 在 DOM 中添加 组件
      this.renderComponent = true;
    });
  }

  mounted() {
    typings.EventBus.$on('activeKey', ({ data: any }) => {
      this.forceRerender();
    });
  }

  onBlur() {
    super.validate();
  }

  setValueTimer: any = null;

  onChange() {
    const val = this.val.length === 0 ? null : this.val;
    if (this.setValueTimer) {
      clearTimeout(this.setValueTimer);
    }
    this.setValueTimer = setTimeout(() => {
      // 延迟30毫秒再给controler赋值：防止输入过快，光标移动到输入框最后面和频繁赋值触发计算、映射性能问题
      this.setValue(val);
    }, 30);
    // this.setValue(val);
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
  overflow: auto;
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
.disabled {
  .tox-statusbar,
  .tox-edit-area__iframe,
  .tox-menubar,
  .tox-toolbar__primary {
    background: #f5f5f5 !important;
    cursor: not-allowed !important;
  }
  .tox .tox-tbtn--disabled svg {
    fill: rgba(34, 47, 62, 0.5) !important;
  }
  .tox-toolbar-overlord {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .ke-container {
    pointer-events: none;
  }
}
</style>
