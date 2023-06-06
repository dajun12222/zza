/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export interface TableColumns {
  width: number; // 列宽
  align?: string; // 对齐方式
  title?: string; // 列展示
  dataIndex: string; // 对应列的key值
  hSlot?: string; // 表头自定义slot
  bSlot?: string; // 表体自定义slot
  colStyles?: any; // 列样式
}

export interface ColStyles {
  width: string;
  align?: string;
}
