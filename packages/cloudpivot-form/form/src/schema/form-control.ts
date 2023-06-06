/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  FormControlTypeExtend,
  FormControlTypeMain,
} from './form-control-type';

import { FormControlOptions } from './control-options';

import { ElementAttr } from './form-element';

/**
 * 表单设计控件
 */
export interface FormControl {
  /**
   * 子表数据项是否新添加的
   */
  isNewAdd?: boolean;

  /**
   * 数据项code
   * 布局控件的key为type
   */
  key: string;

  /**
   * 控件选项
   */
  options: FormControlOptions;

  /**
   * 控件类型
   */
  type: FormControlTypeMain | FormControlTypeExtend;

  /**
   * 父级key
   */
  parentKey?: string;

  path?: string[];

  panels?: any[];

  columns?: any[];

  propertyType?: number;

  //初始控件布局宽度
  initSpanValue?: number;

  optionsType?: string;

  headGroup?: any;
}

/**
 * 子表统计控件
 */
export interface FormSheetStatistic extends FormControl {
  columnKey: string;
}

export interface FormSheetColumn extends FormControl {
  /**
   * 列宽：100
   */
  width: number | null;

  name_i18n?: any;

  name?: any;
}
export interface sheetCustomAction {
  text: string;
  code: string;
}

/**
 * 子表
 */
export interface FormSheet extends FormControl {
  /**
   * 列
   */
  columns: FormSheetColumn[];

  /**
   * 子表自定义按钮
   */
  actions?: sheetCustomAction[];

  /**
   * 统计
   */
  statistics: FormSheetStatistic[];
}

export interface FormTabs extends FormControl {
  panels: FormTabsPanel[];
}

export interface FormTabsPanel extends FormControl {
  layout: string[][];

  controls: { [key: string]: FormControl };

  formFramework?: number;

  prevFramework?: number;
}

export interface FormHtmlControl extends FormControl {
  tagName: string;

  innerHTML: string;

  attrs: Array<ElementAttr>;
}
