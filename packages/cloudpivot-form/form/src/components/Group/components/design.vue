<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
function getLabel(control: any, locale: string) {
  if (!control || !control.options) {
    return '';
  }

  let name = control.options.name;
  const name_i18n = control.options.name_i18n;
  if (name_i18n) {
    // const map = JSON.parse(name_i18n);
    const map = name_i18n;
    if (map[locale]) {
      name = map[locale];
    }
  }

  return name;
}
@Component({ name: 'Logic' })
export default class Logic extends Vue {
  @Prop({ default: {} })
  control!: any;

  render(h: Function) {
    const locale = (this as any).$i18n ? (this as any).$i18n.locale : '';
    return h('h3', `${getLabel(this.control, locale)}`);
  }
}
</script>
