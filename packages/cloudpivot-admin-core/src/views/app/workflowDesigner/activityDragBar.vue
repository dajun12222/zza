<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="activity-drag-bar"
    :class="`${direction} ${showCircle ? 'clicked' : 'notClicked'}`"
  >
    <span
      :class="`drag-circle drag-circle-${direction}`"
      @click="$emit('onConnectPoint')"
    ></span>
  </div>
</template>

<script lang="ts">
import {
  dragToDraw,
  sorbToRecentDot,
} from 'cloudpivot-admin-core/src/common/workflow/controllers/line';
import Line from 'cloudpivot-admin-core/src/common/workflow/Line';
import { H3AvtivityDraggable } from 'cloudpivot-admin-core/src/directives/drag';
import { LINE } from 'cloudpivot-admin-core/src/typings/line';
import * as TraceType from 'cloudpivot-admin-core/src/typings/traceType';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'ActivityDragBar',
})
export default class ActivityDragBar
  extends Vue
  implements H3AvtivityDraggable
{
  @WorkflowModule.State('traceManager') traceManager: any;

  @WorkflowModule.State('workflow') workflow: any;

  @WorkflowModule.State('activities') activities: any;

  @WorkflowModule.State('lines') lines: any;

  @WorkflowModule.State('tempLine') tempLine: any;

  @WorkflowModule.Mutation('setTempLine') setTempLine: any;

  @WorkflowModule.Mutation('addLine') addLine: any;

  @Prop() instance: any;

  @Prop() direction: any;

  @Prop() container: any;

  @Prop() showCircle!: boolean;

  resultLine: Line | undefined = undefined;

  onDragstart(evt: DragEvent) {
    //自动吸附逻辑
    const sorbPoint = sorbToRecentDot(this.instance, {
      x: evt.offsetX + this.instance.left,
      y: evt.offsetY + this.instance.top,
    });

    if (this.instance.activityType === 'END') {
      return;
    }
    if (this.direction && this.instance) {
      let startPoint;
      let startDirection;
      switch (this.direction) {
        case 'top':
          startPoint = {
            x: sorbPoint.x,
            y: this.instance.top,
          };
          startDirection = LINE.ArrowDirection.up;
          break;
        case 'bottom':
          startPoint = {
            x: sorbPoint.x,
            y: this.instance.bottom,
          };
          startDirection = LINE.ArrowDirection.down;
          break;
        case 'left':
          startPoint = {
            x: this.instance.left,
            y: sorbPoint.y,
          };
          startDirection = LINE.ArrowDirection.left;
          break;
        case 'right':
          startPoint = {
            x: this.instance.right,
            y: sorbPoint.y,
          };
          startDirection = LINE.ArrowDirection.right;
          break;
        default:
          break;
      }
      if (!startPoint || !startDirection) {
        return;
      }
      const line = new Line({
        ID: this.workflow.getNewShapeID(),
        startPoint,
        startActivity: this.instance,
        startDirection,
        endActivity: undefined,
        endPoint: undefined,
      });
      this.setTempLine(line);
    }
    this.container.addEventListener('mousemove', this.onDragover);
    document.addEventListener('mouseup', this.onDragend);
    evt.preventDefault();
  }

  onDragover(evt: any) {
    this.resultLine = undefined;
    if (!this.tempLine) {
      return;
    }
    const flag: any = dragToDraw(evt, this.tempLine, this.activities);
    if (
      flag.endActivity &&
      flag.endActivity.activityCode !== this.instance.activityCode
    ) {
      const _duplicate = this.lines.some((line: Line) => {
        const { startActivity, endActivity } = line;
        if (
          startActivity &&
          endActivity &&
          flag.endActivity &&
          startActivity.activityCode === this.instance.activityCode &&
          endActivity.activityCode === flag.endActivity.activityCode
        ) {
          return true;
        }
        return false;
      });
      if (!_duplicate) {
        // 找到了可连接的节点
        this.resultLine = new Line(flag);
      }
    }
    evt.preventDefault();
  }

  onDragend() {
    this.container.removeEventListener('mousemove', this.onDragover);
    document.removeEventListener('mouseup', this.onDragend);
    this.setTempLine(undefined);
    this.$nextTick(() => {
      if (this.resultLine && this.resultLine.endActivity) {
        this.addLine(this.resultLine);
        this.resultLine.calcCrossPoints(this.lines);
        /* NOTE: 记录添加线的痕迹管理 */
        this.traceManager.AddTrace(
          TraceType.Line.Add,
          this.resultLine,
          null,
          this,
        );
      }
      this.resultLine = undefined;
    });
  }
}
</script>

<style lang="less" scoped>
.activity-drag-bar {
  position: absolute;
  z-index: 9;
  // outline: 1px solid;
  cursor: pointer;
  &.notClicked {
    display: none;
  }
  &.top {
    top: -1px;
    left: 2px;
    right: 2px;
    height: 10px;
  }
  &.bottom {
    bottom: -1px;
    left: 2px;
    right: 2px;
    height: 10px;
  }
  &.left {
    left: -1px;
    top: 2px;
    bottom: 2px;
    width: 10px;
  }
  &.right {
    right: -1px;
    top: 2px;
    bottom: 2px;
    width: 10px;
  }

  .drag-circle {
    width: 8px;
    height: 8px;
    z-index: 991;
    position: absolute;
    cursor: pointer;
    border-radius: 50%;
    &:hover {
      outline: 3px solid rgba(41, 112, 255, 0.25);
    }
    &:after {
      width: 8px;
      height: 8px;
      border: 1px solid #2970ff;
      border-radius: 50%;
      content: '';
      display: block;
      background: #fff;
    }
    &-left {
      top: 50%;
      left: -4px;
      margin-top: -4px;
      // &:after {
      //   margin-top: 3px;
      //   margin-left: 6px;
      // }
    }
    &-right {
      top: 50%;
      right: -4px;
      margin-top: -4px;
      // &:after {
      //   margin-top: 3px;
      // }
    }
    &-top {
      top: -4px;
      left: 50%;
      margin-left: -4px;
      // &:after {
      //   margin-top: 6px;
      //   margin-left: 3px;
      // }
    }
    &-bottom {
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
      // &:after {
      //   margin-left: 3px;
      // }
    }
  }
}
</style>
