<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fan
 * @Date: 2020-04-18 21:03:04
 * @description: 
 * @LastEditors: Fan
 -->
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Input } from '@h3/antd-vue';

@Component({
  name: 'DateTime',
  component: {
    AInput: Input,
  },
})
export default class DateTime extends Vue {
  @Prop({ default: () => {} })
  opts!: any; // 当前控件的控制器

  render(h: Function) {
    return h('a-input', { props: { ...this.opts } }, [
      h('i', {
        props: {
          type: 'user',
        },
        slot: 'suffix',
        class: ['aufontAll', 'h-icon-all-clock-circle-o'],
      }),
    ]);
  }
}
</script>
