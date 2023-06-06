/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export enum ControlPropertyType {
  FontSize = 'fontSize',

  FontStyle = 'fontStyle',

  Color = 'color',

  LineSize = 'lineSize',

  LineStyle = 'lineStyle',

  // VerticalAlign = 'verticalAlign',

  // HorizontalAlign = 'horizontalAlign',

  Border = 'border',

  TextAlign = 'textAlign',
}

export interface ControlProperty {
  key: string;

  name?: string;

  value: any;

  type: ControlPropertyType;

  tags?: string[];
}
