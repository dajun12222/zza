/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { FormControlOptions } from './form-control-options';

export class LayoutControlOptions implements FormControlOptions {
  /**
   * 控件名称
   */
  name = '';

  /**
   * 对齐
   */
  align: 'left' | 'center' | 'right' = 'left';

  /**
   * 控件样式
   */
  style: string | null = null;

  /**
   * 显示条件
   */
  displayFormula = '';

  /**
   * tip提示
   */
  tips: string = '';

    /*
    自定义
    */

  showData: boolean = false;
}

/**
 * 分组标题
 */
export class GroupTitleOptions extends LayoutControlOptions {
  /**
   * 默认展开
   */
  expand = true;
}

export class TabsOptions implements FormControlOptions {
  heads: Array<TabsHead> = [];
}

export interface TabsHead {
  key: string;

  title: string;

  active: boolean;
}
