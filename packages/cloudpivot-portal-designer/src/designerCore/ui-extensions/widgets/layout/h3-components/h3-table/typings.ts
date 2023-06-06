/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export interface H3TableColumn {
  width: number;

  align: 'left' | 'center' | 'right';

  key: string;

  title: string;

  fixed: 'left' | 'right' | '';

  sorting: 'asc' | 'desc' | '';
}

export interface H3TableColumnGroup {
  title: string;

  children: Array<H3TableColumn | H3TableColumnGroup>;
}
