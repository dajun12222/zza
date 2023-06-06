<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import HLabel from 'cloudpivot-form/form/src/common/components/label.vue';
import { labelText } from 'cloudpivot-form/form/src/schema/system-data-item-codes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Modifier',
  components: {
    HLabel: HLabel,
  },
})
export default class Modifier extends Vue {
  @Prop()
  control!: any; // 当前控件的控制器

  render(h: Function) {
    return h('h-label', { props: { text: labelText } });
  }
}
</script>
