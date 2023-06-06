/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export interface ColumnOption {
  width: number;
  column: Column;
  parentColumn?: any;
}

/**
 * 列宽数据接口
 */
export interface WidthRecords {
  key: string;
  value: Array<Record>;
}

export interface Record {
  [key: string]: number;
}

export interface DisplayedColumn {
  dataIndex: string;
  displayFormat: number;
  id: string;
  isShortText: boolean;
  isShow: boolean;
  key: string;
  name_i18n: any;
  propertyType: number;
  vcTitle: string;
  width: number;
  childColumns?: any;
}

interface Column {
  id: string;
  [key: string]: any;
}
