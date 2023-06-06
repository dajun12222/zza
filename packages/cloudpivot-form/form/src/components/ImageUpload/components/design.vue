<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HImage from 'cloudpivot-form/form/src/common/components/image.vue';
@Component({ name: 'ImageDesign', components: { HImage } })
export default class ImageDesign extends Vue {
  @Prop()
  control!: any; // 当前控件的控制器

  render(h: Function) {
    return h('h-image', {
      props: {
        disabled: true,
        text: '点击或拖拽上传',
      },
    });
  }
}
</script>
