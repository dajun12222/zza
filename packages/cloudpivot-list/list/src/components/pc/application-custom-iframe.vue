<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="application-define">
    <div class="mask" v-if="isShowIframe"></div>
    <iframe class="application-define__page" :src="analysisUrl"></iframe>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getUrlVar } from 'cloudpivot/common/src/utils/url';
@Component({ 
  name: 'application-define',
})
export default class ApplicationDefine extends Vue {

  @Prop()
  url!: string;

  get isShowIframe(){
    return (this.$store.state as any).isShowIframe;
  }

  get analysisUrl(){
    let returnUrl:string = this.url;
    let useToken:string = getUrlVar('token',returnUrl);
    console.log(useToken);
    if(useToken){
      let token:string = localStorage.getItem('token');
      returnUrl = returnUrl.replace('='+useToken,'='+token);
      returnUrl = returnUrl.replace('token=',useToken+'=');
    }
    return returnUrl;
  }
}
</script>
<style lang="less" scoped>
.application-define {
  position: relative;
  .application-define__page {
    width: 100%;
    height: calc(100vh - 80px);
    overflow: auto;
    border: none;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: calc(100vh - 80px);
  }
}
</style>
