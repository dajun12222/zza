<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OAuthApi from '../../apis/oauth';
@Component({
  name: 'login',
})
export default class Login extends Vue {
  created() {
    window.location.href = OAuthApi.OAuthLoginUrl;
  }

  render(h: any) {}
  // mounted() {
  //   this.$confirm({
  //     title: 'Do you Want to delete these items?',
  //     content: 'Some descriptions',
  //     onOk() {
  //     },
  //     onCancel() {
  //     },
  //     class: 'test',
  //   });
  // }
}
</script>
<style lang="less" scoped>
.login {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  text-align: left;
}
</style>
