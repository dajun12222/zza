<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<style lang="less">
#moda-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
<template>
  <div id="modal-container">
    <div
      :is="c"
      v-for="(c, i) in queue"
      :key="`modal-${i}`"
      :style="{ 'z-index': i, 'pointer-events': c.visible ? 'all' : 'none' }"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'modal-constructor',
})
export default class ModalConstructor extends Vue {
  queue = [];

  load(path) {
    return import(path);
  }

  async open(path, options = {}) {
    let item, itemIdx;
    const key = this.generateKey();

    if (
      this.queue.some((item, i) =>
        item.path === path ? ((itemIdx = i), true) : false,
      )
    ) {
      item = this.queue[itemIdx];
      item.key = key;
      item.visible = true;
      this.queue.splice(itemIdx, 1, item);
    } else {
      item = {
        comp: await this.load(path),
        visible: true,
        key,
        path,
        options,
      };

      this.queue.push(item);
    }

    return item;
  }

  close(key) {
    let item, itemIdx;
    if (
      this.queue.some((item, i) =>
        item.key === key ? ((itemIdx = i), true) : false,
      )
    ) {
      item = this.queue[itemIdx];
      item.visible = true;
      this.queue.splice(itemIdx, 1, item);
    }
    if (!key) {
      throw new Error(`component:${key} not found!`);
    }
  }

  generateKey() {
    const ts = String(Date.now());
    let k = ts;
    let c = 0;
    while (!!this.queue.find((item) => item.key === k)) {
      k = `${ts}_${++c}`;
    }
    return k;
  }
}
</script>
