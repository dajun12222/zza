<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div :style="warpStyle">
    <img
      :src="picSrc"
      alt=""
      width=""
      height=""
      :style="style"
      :onerror="`this.onerror = '';
        this.src = '${defaultImg}';`"
      @click.stop="onClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// import DesignerNodeVue from '../../designer-node-vue';

import {
  filter,
  rotate,
  getCamelCaseStyle,
} from '@cloudpivot-shared/ui-property-editor';
import { getImgUrl } from '../../style-service';

import * as changeRem from '../../change-rem';

@Component({
  components: {},
})
export default class UiImage extends Vue {
  @Prop()
  src!: string;

  @Prop()
  alt!: string;

  @Prop({
    default: () => ({}),
  })
  baseSetter!: any;

  @Prop({
    default: () => ({}),
  })
  border!: any;

  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  sizeLimit!: any;

  @Prop({
    default: () => ({}),
  })
  shadow!: any;

  @Prop({
    default: () => ({}),
  })
  filter!: any;

  @Prop({
    default: () => ({}),
  })
  rotate!: any;

  @Prop({
    default: () => ({}),
  })
  margin!: any;

  @Prop()
  visible!: any;

  @Prop({
    default: '',
  })
  uid!: string;

  // eslint-disable-next-line max-len
  defaultImg: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAAAgCAYAAAD0Z1G3AAAD4klEQVR4nO2ba3OqOhSG3wSUi5CKnV5s//8v64d2alWKkUu45Hw4JRsrOnbLqSfIM+MMBOLKmJe1VlaQrFYriYGBjqCXHsBAvzAvPYBzeHl52Wu7ubkBY+wCoxkANPdQz8/PuLu7g2EYlx7KwBdaC4pSCtu2MZ1OLz2UgS+0FlTNaDS69BAGvuiFoAb+PwyCGuiUQVADnTIIaqBTtK5D/RQhBDjnSNMUZVmCEALTNGHbNnzfP1p+yPMcURQhyzKUZXnUztPT0953nWNbJ65GUGEYYrPZwDRNBEEAy7IgpcR2u8Xn5yc457i9vYXjOHt94zjGcrkEIQSz2QyO40AIgeVyqcQxn88PiuIc27pxFSGvnlBKKe7v7+E4DiilMAwDjDEEQQApJT4+PpCm6U7foiiwWq0AAL7vw3VdEEJgWRZmsxkAKHF0bVtHei8oIQQ2mw0AwPO8Vi/SbF+v15Dyz355HMfq3LbtnX62bYMQAgCtYjjXto70XlCcc3V8LKTU14qiQJZlqr2qKnVci6cJpf/+hG151bm2daT3gmp6jmMVddP8k042J7XZ3hTX97Y273OubR3pvaBqz0EIafUwNU1BNL2N67rKC8VxvNMnTVMVoiaTSee2daT3gqr5SW7SnHxKqXqjYbvdgnOOqqqQZZlK1j3PaxXUubZ1pPdlA8Mw1FNfluXBpX0znDVDEACMx2M8PDzg7e0N6/Ua6/UahBCMx2MEQXAwP+rCtm7oPfoTsG1bLemLojg4qXme7/RpIoTAYrEAYwy+7/+qbd3ofcjzPE8dJ0nSeo+UUl2zLGsvgQ7DEFVVoaoqlGV5cgjrwrZu9MJDNSf4+0psPB7D931sNhtwzuF53l5Y4ZyrincQBAftRFGEKIrUOSEElFJQSmFZFhhjO16oS9u6oL2HKstyp0odxzGyLNsR2XQ6he/7kFLi/f0dSZIobxNFEcIwVJXsNg/BGGtNlqWUKMsSeZ6Dc47X11cIIXbuOde2bhCd/0aVpikWi0XrNc/z9p74unJdb/BSSmGaJhzHged5qjzQRpZlCMNwTzDfGY1GeHx83Gs/x7ZOaC2o3yBNU4RhiKIowBiD67owTRNSSvXJ8xxhGKrkej6fa79a+1v68Vj8RxRFgcVigTzPEQQBGGNKKHX+ZBgGbNve8Ya678edwyCoIzS3QSzLOnpvnWPV7zldK4OgjvCTPbZ6YXAogb8WrvdROgHLsuC6LuI4xmq1Qp7nKocihKCqKgghsN1ukSQJGGNX/6/lISk/gSRJEMcxhBA7hc16pWbbNiaTyVWHuprhFzgBx3F68XrubzDkUAOd8g/gUEcc9aQ+QwAAAABJRU5ErkJggg==';

  get picSrc() {
    if (!this.src) {
      return '';
    }
    if (
      this.src.startsWith('/api/file/') ||
      this.src.includes('access_token')
    ) {
      const appCode = this.$uiEngine?.currentApp?.info.appCode || 'common';
      return getImgUrl(this.src, appCode);
    }
    return this.src;
  }

  get warpStyle() {
    if (this.size.height && this.size.height.indexOf('%') > -1) {
      return {
        height: this.size.height,
      };
    }
    return {};
  }

  get style() {
    let style: any = {};
    const complexStyle = ['margin', 'border', 'shadow', 'visible'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    filter.toStyle(this.filter, style);
    rotate.toStyle(this.rotate, style);
    Object.assign(style, this.size, this.sizeLimit);
    style = changeRem.toChangeRem(style);
    return style;
  }

  onClick() {
    this.$emit('click', this.uid);
  }
}
</script>
