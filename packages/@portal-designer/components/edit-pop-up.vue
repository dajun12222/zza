<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="edit-pop-up">
    <div :id="contentId" class="pop-up-content" @click="showPopUp">
      <slot></slot>
      <div :id="popId" v-if="visible" class="pop-up" :style="showStyle">
        <slot name="content"> </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'edit-pop-up',
  components: {},
})
export default class editPopUp extends Vue {
  visible: boolean = false;

  position: { x: number; y: number } = {
    x: 0,
    y: 0,
  };

  showPopUp(event: any) {
    const shadow = document.createElement('div');
    shadow.className = 'edit-pop-up-shadow';
    shadow.id = 'edit-pop-up-shadow';
    shadow.addEventListener('click', () => {
      this.hiddenPopUp();
    });
    document.body.appendChild(shadow);

    this.visible = true;
    this.$nextTick(() => {
      let node = event.target;
      while (!node.classList.contains('pop-up-content')) {
        node = node.parentNode;
      }
      const rect = node.getBoundingClientRect();
      this.position = {
        x: rect.left - 8,
        y: rect.top,
      };
      document.body.appendChild(document.querySelector('#' + this.popId));
    });
  }

  hiddenPopUp() {
    document
      .querySelector('#' + this.contentId)
      .appendChild(document.querySelector('#' + this.popId));
    setTimeout(() => {
      this.visible = false;
    }, 30);
    if (document.querySelector('#edit-pop-up-shadow')) {
      document.querySelector('#edit-pop-up-shadow').remove();
    }
  }

  get showStyle() {
    const oPopUp: HTMLElement = document.querySelector('#' + this.popId);
    if (oPopUp) {
      if (this.position.y + oPopUp.offsetHeight > document.body.clientHeight) {
        return {
          bottom: 0,
          left: this.position.x + 'px',
        };
      }
    }
    return {
      left: this.position.x + 'px',
      top: this.position.y + 'px',
    };
  }

  timeId: number = +new Date();

  get contentId() {
    return 'contentId_' + this.timeId;
  }

  get popId() {
    return 'popId_' + this.timeId;
  }

  created() {
    this.timeId = +new Date() + Math.floor(Math.random() * 10000);
  }
}
</script>

<style lang="less" scoped>
.pop-up-content {
  padding: 0 8px;
}
.edit-pop-up {
  position: relative;
  .content {
    position: relative;
    z-index: 1025;
  }
}
</style>

<style lang="less">
.edit-pop-up-shadow {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1024;
}
.pop-up {
  position: absolute;
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  transform: translateX(-100%);
  margin-right: 8px;
  z-index: 1025;
}
</style>
