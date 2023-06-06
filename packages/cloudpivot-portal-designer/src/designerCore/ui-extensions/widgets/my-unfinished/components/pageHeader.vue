<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fu Zhuohang
 * @Date: 2022-03-31 14:36:58
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-04-13 16:13:06
 * @FilePath: \yunshu6.0\packages\portal\src\views\workflow-center\workbenchInfo\workbenchComponents\pageHeader.vue
 * @Description:
-->
<template>
  <div class="page-header">
    <div class="name" :style="customStyle">
      <slot></slot>
    </div>

    <div class="right">
      <slot name="right">
        <div v-if="totalPage" class="btns">
          <span
            :class="{ disabled: currentPage === 0 }"
            class="icon aufontAll h-icon-all-left-o"
            @click="pageChange('prev')"
          ></span>
          <span
            :class="{ disabled: currentPage === totalPage - 1 }"
            class="icon aufontAll h-icon-all-right-o"
            @click="pageChange('next')"
          ></span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'pageHeader',
  components: {},
})
export default class pageHeader extends Vue {
  @Prop() totalPage?: number;

  @Prop() currentPage?: number;

  @Prop() customStyle!: any;

  pageChange(type: 'prev' | 'next') {
    this.$emit('pageChange', type);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 58px;
  line-height: 58px;
  .name {
    font-size: 16px;
    font-weight: 600 !important;
    line-height: 22px;
  }

  .btns {
    display: flex;
    span {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: #eef4fd;
      border-radius: 2px;
      line-height: 18px;
      font-size: 10px;
      text-align: center;
      margin-left: 4px;
      color: #2970FF;
      cursor: pointer;
      &.disabled {
        background-color: #f1f2f6;
        color: rgba(17, 18, 24, 0.25);
        cursor: no-drop;
      }
    }
  }
}
</style>
