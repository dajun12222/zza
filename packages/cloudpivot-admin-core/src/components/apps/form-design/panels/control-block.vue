<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div :class="{ long: isDataItem }" :title="text" @click="addItem">
    <i v-if="options.icon" class="icon aufontAll" :class="[options.icon]"></i>
    {{ text }}
  </div>
</template>

<script lang="ts">
import 'cloudpivot-admin-core/src/directives/drag';
import { H3Draggable } from 'cloudpivot-admin-core/src/directives/drag';
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import { EventBus } from 'cloudpivot-form/form/src/schema/event-bus';

@Component({
  name: 'control-block',
})
export default class ControlBlock extends Vue implements H3Draggable {
  @Prop()
  options!: any;

  @Prop()
  isDataItem!: boolean;

  @Prop({
    default: false,
  })
  isUsed?: boolean;

  @Inject({
    default: () => {}
  })
  setMovingControl!: Function;

  @Inject({
    default: () => {}
  })
  setFollowOptions!: Function;

  get text() {
    const opts = this.options;

    let name = opts.name;

    if (opts.name_i18n) {
      const locales = JSON.parse(opts.name_i18n);
      if (locales[this.$i18n.locale]) {
        name = locales[this.$i18n.locale];
      }
    }

    if (this.isDataItem && opts.code && opts.code !== opts.name) {
      return `${name} [${opts.code}]`;
    }

    return name;
  }

  dispatchMouseUpEvent() {
    const e = document.createEvent('MouseEvents');
    e.initEvent('mouseup', true, true);
    document.dispatchEvent(e);
  }

  addItem() {
    if (this.isUsed || this.options.parentCode) {
      return;
    }
    this.setMovingControl(null);
    EventBus.$emit('addController', {
      json: this.options,
      blockType: this.isDataItem ? 'data-item' : 'control',
    });
  }

  onDragstart(evt: DragEvent) {
    this.setMovingControl({ key: '$control-add' });
    this.dispatchMouseUpEvent();

    // 添加拖动的样式
    (evt.target as any).style.background = '#F1F2F6';

    this.deviation.x = evt.offsetX;
    this.deviation.y = evt.offsetY;

    if (evt.dataTransfer) {
      this.setFollowOptions({
        text: this.text,
        icon: this.options.icon,
      });

      this.setDragFollowBlockPosition(evt);
      let img = document.querySelector('#drag-follow-img') as HTMLImageElement;
      if (!img) {
        img = document.createElement('img');
        img.src =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=';
      }
      evt.dataTransfer.setDragImage(img, 0, 0);

      evt.dataTransfer.setData('block', JSON.stringify(this.options));
      evt.dataTransfer.setData(
        'block-type',
        this.isDataItem ? 'data-item' : 'control',
      );
      if (this.isDataItem) {
        evt.dataTransfer.setData('dataitem-type-' + this.options.type, '');
        if (this.options.parentCode) {
          evt.dataTransfer.setData(
            'dataitem-parent-' + this.options.parentCode,
            '',
          );
        }
      } else {
        evt.dataTransfer.setData('control-type-' + this.options.type, '');
      }
    }
  }

  onDrag(evt: DragEvent) {
    this.setDragFollowBlockPosition(evt);
  }

  deviation = {
    x: 0,
    y: 0,
  };

  setDragFollowBlockPosition(evt) {
    const DragFollowBlock: HTMLElement = document.querySelector(
      '#drag-follow-block',
    ) as HTMLElement;
    if (DragFollowBlock) {
      DragFollowBlock.style.left = evt.pageX - this.deviation.x + 'px';
      DragFollowBlock.style.top = evt.pageY - this.deviation.y + 'px';
    }
  }

  onDragend() {
    const DragFollowBlock: HTMLElement = document.querySelector(
      '#drag-follow-block',
    ) as HTMLElement;
    if (DragFollowBlock) {
      DragFollowBlock.style.left = '-200px';
      DragFollowBlock.style.top = '-100px';
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-admin-core/src/styles/color/colors.less';
div {
  display: inline-block;
  align-items: center;
  font-size: 13px;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  width: 103px;
  height: 30px;
  color: @nav-font-color;
  background: @item-bg-color;
  border: 1px dashed #dde4eb;
  padding-left: 8px;
  cursor: move;
  margin-right: 8px;
  margin-bottom: 8px;
  line-height: 30px;
}

div.long {
  display: block;
  margin-bottom: 8px;
  width: calc(100% - 8px);
  height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

div > i {
  font-size: 14px;
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

div:not(.disabled) > i {
  color: @primary-color !important;
}

div:hover {
  &:not(.disabled) {
    border: 1px dashed @primary-color;
    font-weight: 600;
    background-color: #eef4fd;
    cursor: grab;
    i {
      font-weight: 400;
    }
  }
}
div:active {
  &:not(.disabled) {
    cursor: grab;
    border: 1px solid @primary-color;
    background-color: #eef4fd;
    color: @primary-color;
  }
}

div.dragging {
  &:not(.disabled) {
    color: @nav-font-color;
    background: @item-bg-color;
    border: 1px dashed #dde4eb;
    font-weight: 400;
    cursor: move;
  }
}

div.disabled {
  cursor: not-allowed;
  color: #d1d1d1;
}
</style>
