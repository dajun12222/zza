<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<style lang="less" src="./at.less"></style>

<template>
  <div
    ref="wrap"
    class="atwho-wrap"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    @input="handleInput('')"
    @keydown.capture="handleKeyDown"
  >
    <slot></slot>
  </div>
</template>
