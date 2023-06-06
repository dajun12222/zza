/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Vue, Component, Prop } from 'vue-property-decorator';

import {
  DataItem,
  FormControl,
  FormControlType,
  FormSheet,
  FormSheetColumn,
} from '../typings';

@Component
export default class sheetHeaderMixins extends Vue {
  @Prop()
  readonly index!: number;

  @Prop()
  columns!: any[];

  @Prop()
  readonly control!: FormControl;

  @Prop()
  readonly parentControl!: FormSheet;

  @Prop()
  dragOverKey!: string;

  @Prop()
  setDragOverKey!: (key) => void;

  @Prop()
  headGroupAddItem!: Function;

  deleteVisible: boolean = false;

  deleteCtrl() {
    const delIndex = this.columns.findIndex(
      (col) => col.key === this.control.key,
    );
    this.parentControl.options.headGroup = this.delHeadGroupItem(
      delIndex,
      this.parentControl.options.headGroup || [],
    );
    this.emitColumnDelete(this.control.key);
    this.deleteVisible = false;
  }

  delHeadGroupItem(delIndex: number, groups: any[]) {
    let delIndexs: number[] = [];
    groups.forEach((group, index) => {
      const colspan: [number, number] = group.colspan;
      if (colspan[0] <= delIndex && delIndex <= colspan[1]) {
        group.colspan = [colspan[0], colspan[1] - 1];
        if (group.colspan[1] - group.colspan[0] < 0) {
          delIndexs.push(index);
        }
      } else if (delIndex < colspan[0]) {
        group.colspan = [colspan[0] - 1, colspan[1] - 1];
      }
      if (group.child) {
        group.child = this.delHeadGroupItem(delIndex, group.child);
      }
    });
    groups = groups.filter((item, index) => !delIndexs.includes(index));
    return groups;
  }

  emitColumnDelete(controlKey: string) {
    this.$emit('column-delete', controlKey);
  }

  // 修改多表头数据
  changeHeadGroup(movekey: string, toIndex: number, headGroup: any[]) {
    const formInedx: number = this.columns.findIndex(
      (col) => col.key === movekey,
    );
    let delArr: number[] = [];
    headGroup.forEach((group, index: number) => {
      const colspan: [number, number] = group.colspan;
      if (formInedx > colspan[1] && toIndex < colspan[0]) {
        // 移动到组之前，分组信息 + 1
        this.setGroupColspan(group, 1);
      } else if (formInedx < colspan[0] && toIndex > colspan[1]) {
        // 移动到组之后，分组信息 - 1
        this.setGroupColspan(group, -1);
      } else if (
        colspan[0] <= formInedx &&
        formInedx <= colspan[1] &&
        colspan[0] <= toIndex &&
        toIndex <= colspan[1]
      ) {
        // 组内移动
        if (group.child) {
          this.changeHeadGroup(movekey, toIndex, group.child);
        }
      } else if (
        (formInedx < colspan[0] || formInedx > colspan[0]) &&
        colspan[0] <= toIndex &&
        toIndex <= colspan[1]
      ) {
        // 移动到组内
        if (formInedx < colspan[0]) {
          this.addGroupItem(group, -1, movekey, toIndex);
        } else {
          this.addGroupItem(group, 1, movekey, toIndex);
        }
      } else if (
        (toIndex < colspan[0] || toIndex > colspan[0]) &&
        colspan[0] <= formInedx &&
        formInedx <= colspan[1]
      ) {
        // 移动到组外
        if (toIndex < colspan[0]) {
          this.popGroupItem(group, -1, movekey, toIndex);
        } else {
          this.popGroupItem(group, 1, movekey, toIndex);
        }
        if (group.colspan[1] - group.colspan[0] <= 0) {
          delArr.push(index);
        }
      } else {
      }
    });
    delArr.forEach((index) => {
      headGroup.splice(index, 1);
    });
  }

  // 数据项从多表头移出
  popGroupItem(group, number: number, movekey: string, toIndex: number) {
    const colspan: [number, number] = group.colspan;
    if (number === -1) {
      group.colspan = [colspan[0] + 1, colspan[1]];
    } else {
      group.colspan = [colspan[0], colspan[1] - 1];
    }
    if (group.child) {
      this.changeHeadGroup(movekey, toIndex, group.child);
    }
  }

  // 多表头添加数据项
  addGroupItem(group, number: number, movekey, toIndex) {
    const colspan: [number, number] = group.colspan;
    if (number === -1) {
      group.colspan = [colspan[0] - 1, colspan[1]];
    } else {
      group.colspan = [colspan[0], colspan[1] + 1];
    }
    if (group.child) {
      this.changeHeadGroup(movekey, toIndex, group.child);
    }
  }

  // 递归多表头
  setChildGroup(groups: any[], number: number) {
    groups.forEach((group) => {
      this.setGroupColspan(group, number);
    });
  }

  // 设置多表头数据
  setGroupColspan(group, number) {
    const colspan: [number, number] = group.colspan;
    group.colspan = [colspan[0] + number, colspan[1] + number];
    if (group.child) {
      this.setChildGroup(group.child, number);
    }
  }

  /**
   * 根据类型判断能否不能在子表中加入
   * 介于90~600之间的FormControlType值为产品内置系统组件、布局组件的分布范围、存在大量未使用值，可以但不建议被选择作为二开布局组件的控制器类型使用
   * 介于1200~1500之间的FormControlType值为产品预留二开布局组件的控制器类型可选值
   * FormControlType值在这两个范围之内的控件均不能再子表中加入
   */
  canNotAddToSheet(type, block?: any) {
    return (
      (type >= 90 && type <= 600) ||
      type === FormControlType.ApprovalOpinion ||
      (type === 8 && block && !block.dataItemType) ||
      (type > 1200 && type <= 1500)
    );
  }
}
