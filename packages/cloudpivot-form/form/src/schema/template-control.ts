/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  FormControlTypeExtend,
  FormControlTypeMain,
} from './form-control-type';

/**
 * 模板输出接口
 */
export interface TemplateControl {
  //控件ID
  id?: any;
  //节点名称
  nodeName?: string;
  //控件name
  name?: string;
  //控件class
  class?: string;
  //控件style
  style?: string;
  //控件HTML类型
  type?: string;
  //控件BPM类型
  BPMType?: FormControlTypeMain | FormControlTypeExtend;
  BPMOptions?: any;
  //控件默认值
  value?: string;
  //控件绑定表单数据项的key
  model?: string;
  //控件子组件
  children?: TemplateControl[];
}
