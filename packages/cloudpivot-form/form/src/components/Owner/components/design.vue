<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import CreateStaffSelector from 'cloudpivot-form/form/src/common/components/createStaffSelector.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'OwnerId',
  components: {
    CreateStaffSelector,
  },
})
export default class OwnerId extends Vue {
  @Prop()
  control!: any; // 当前控件的控制器

  render(h: Function) {
    return h('create-staff-selector', { props: { opts: { disabled: true } } });
  }
}
</script>
