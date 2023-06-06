/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export enum DisplayOption {
  Table = 0, // 列表
  Calendar = 1, // 日历
  Timeline = 2, // 时间轴
  Board = 3, // 看板
  Gantt = 4, // 甘特图
}

export enum SortDirection {
  Asc = 'asc', // 升序
  Des = 'desc', // 降序
}

export const DataScopeType = [
  {
    label: '我的',
    value: 0,
  },
  {
    label: '部门的',
    value: 1,
  },
  {
    label: '相关的',
    value: 2,
  },
  {
    label: '我的|部门的|相关的',
    value: 3,
  },
  {
    label: '全部的',
    value: 4,
  },
];
