<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <div class="ui-page-widget designer-page">
    <ui-layout :uid="uid" :padding="4" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import PageBase from '../page-base';

@Component({
  components: {},
})
export default class UiPageWidget extends Mixins(PageBase) {
  @Prop()
  uid!: string;
}
</script>

<style lang="less">
.ui-page-widget {
  // padding: 4px;
  overflow: auto;
  .ui-grid {
    background: #f6f7f9 !important;
    > .ui-container-empty {
      > p {
        margin-top: 16px !important;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  & > .ui-grid--wrapper {
    // padding-top: 4px !important;
    // padding-left: 4px !important;
    // padding-right: 4px !important;
  }
  .ui-grid-widget--operation {
    > span {
      cursor: pointer;
      &:hover {
        background: #eef4fd;
      }
    }
  }
  &::-webkit-scrollbar-track {
    background: #f6f7f9 !important;
  }
}
.ui-page .ui-design-element {
  background: #f6f7f9 !important;
}
.ui-design-element--border {
  display: none;
}
</style>
