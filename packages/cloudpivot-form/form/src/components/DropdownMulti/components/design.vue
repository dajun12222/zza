<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Input } from '@h3/antd-vue';
@Component({
  name: 'Dropdown',
  components: {
    AInput: Input,
  },
})
export default class Dropdown extends Vue {
  @Prop()
  control!: any; // 当前控件的控制器

  render(h: Function) {
    return h(
      'a-input',
      {
        props: {
          disabled: true,
          placeholder:
            this.control.options && this.control.options.emptyValue
              ? this.control.options.emptyValue
              : '请选择',
        },
      },
      [
        h('i', {
          props: {
            type: 'user',
          },
          slot: 'suffix',
          class: ['aufontAll', 'h-icon-all-down-o'],
        }),
      ],
    );
  }
}
</script>
