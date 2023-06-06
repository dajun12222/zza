<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<style lang="less" src="./at.less"></style>

<template>
  <div
    ref="wrap"
    class="atwho-wrap"
    tabindex="0"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    @input="handleInput('')"
    @keydown.capture="handleKeyDown"
    @blur="onAtwhoViewBlur"
  >
    <div v-if="atwho" :style="style" class="atwho-panel">
      <div class="atwho-inner">
        <div
          ref="view"
          class="atwho-view"
          @mousedown="setScroll"
          @mouseup="setScrollFalse"
          @scroll="onAtWhoViewScroll"
        >
          <ul class="atwho-ul">
            <li
              v-for="(item, index) in atwho.list"
              :key="index"
              :ref="isCur(index) && 'cur'"
              :class="isCur(index) && 'atwho-cur'"
              :data-index="index"
              class="atwho-li"
              @mouseenter="handleItemHover"
              @click="handleItemClick"
            >
              <slot :item="item" name="item">
                <span v-text="itemName(item)"></span>
              </slot>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <span ref="embeddedItem">
      <slot :current="currentItem" name="embeddedItem"></slot>
    </span>
  </div>
</template>
