<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fan
 * @Date: 2020-04-19 20:12:19
 * @description: 
 * @LastEditors: Fan
 -->
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { InputNumber } from '@h3/antd-vue';
@Component({
  name: 'NumberDesign',
  components: {
    AInputNumber: InputNumber,
  },
})
export default class NumberDesign extends Vue {
  @Prop({ default: () => {} })
  control!: any;

  render(h: Function) {
    return h('a-input-number', {
      props: {
        disabled: true,
        placeholder:
          this.control.options && this.control.options.placeholder
            ? this.control.options.placeholder
            : '请输入',
        value:
          this.control.options && this.control.options.defaultValue
            ? this.control.options.defaultValue
            : '',
      },
    });
  }
}
</script>
