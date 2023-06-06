<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Input } from '@h3/antd-vue';
@Component({
  name: 'SignatureDesign',
  components: {
    ATextarea: Input.TextArea,
  },
})
export default class SignatureDesign extends Vue {
  // @Prop({default:{}})
  // opts!:any
  render(h: Function) {
    return h('a-textarea', {
      props: {
        disabled: true,
        placeholder: '请输入',
      },
    });
  }
}
</script>
