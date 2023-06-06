<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div v-show="value" class="context-menu-wrapper" :style="style">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';

@Component({
  name: 'ContextmenuWrapper',
})
export default class ContextmenuWrapper extends Vue {
  @Prop() value!: boolean;

  @Prop() pos!: Object;

  get style () {
    return this.pos;
  }

  @Watch('value')
  onVisibleChange (visible: boolean) {
    console.log(visible);
    this.$nextTick(() => {
      if (visible) {
        document.body.append(this.$el);
      } else {
        this.$el.remove();
      }
    });
  }
}
</script>
<style lang="less" scoped>
.context-menu-wrapper {
  position: fixed;
  z-index: 1001;
  width: auto;
  height: auto;
  background: white;
}
</style>
