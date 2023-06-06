<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fu Zhuohang
 * @Date: 2022-04-06 16:14:11
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-04-13 15:58:23
 * @FilePath: \yunshu6.0\packages\portal\src\views\shared\empty.vue
 * @Description: 
-->

<template>
  <div class="empty">
    <div class="header">
      <div>
        <img src="@/assets/images/yslogo.png" />
      </div>
      <div v-if="isInIframe" class="close-btn" @click="closeIframe">
        <span class="icon aufontAll">&#xe996;</span>
      </div>
    </div>

    <div class="emtpy__body">
      <!--<img src="@/assets/images/no-data2.png">-->

      <img src="@/assets/images/no-data1.png" />
      <p>{{ $t('languages.common.noData') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Button } from '@h3/antd-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'empty',
  components: {
    AButton: Button,
  },
})
export default class Empty extends Vue {
  closeIframe() {
    let user: any = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
    }
    localStorage.removeItem(`${user.name}_latestSign`);

    window.parent.postMessage('hidden-close', origin);
  }

  get isInIframe() {
    return window.top !== window.self;
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/themes/default.less';

.header img {
  max-height: 30px !important;
}
.header .icon {
  cursor: pointer;
}

.emtpy__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  color: @light-color-2;
  img {
    width: 290px;
  }

  & > p {
    margin-top: 1em;
  }
}
</style>
