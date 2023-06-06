/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Subscription } from 'rxjs';

import { FormControl } from './form-control';

import * as forms from 'cloudpivot-forms';

export interface RendererControl {
  nodeName: string;

  id?: string;

  style?: string;

  class?: string;

  value?: any;

  tabsName?: string;

  show?: boolean;
}

/**
 * 表单控件
 */
export interface RendererFormControl extends RendererControl, FormControl {
  propertyType?: number;

  isRelevanceQuery?: boolean;

  souceField: forms.Control;

  controller: forms.Control;

  writable?: boolean;

  required?: boolean;

  edit: boolean;

  refSubscription: Subscription[];

  refSubscriptionTimer: any[];

  show?: boolean;

  conReadonlyValue?: any;
}

/**
 * 布局控件
 */
export interface RendererLayoutControl extends RendererControl {
  children: RendererControl[];
}

export interface DesignLayoutControl
  extends RendererLayoutControl,
    FormControl {}

/**
 * 对应a-col
 */
export interface LayoutCol extends RendererLayoutControl {
  span?: number;
}
