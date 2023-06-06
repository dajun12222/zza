/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export enum FormStatus {
  //草稿
  DRAFT = 0,
  // 进行中
  PROCESSING = 1,

  // 已取消
  CANCELLED = 2,

  // 已完成
  COMPLETED = 3,
}

export enum FormStatusZh {
  DRAFT = '草稿',
  PROCESSING = '进行中',
  CANCELLED = '已取消',
  COMPLETED = '已完成',
}

export enum FormStatusEn {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum FormStatusZhToEn {
  '草稿' = 'DRAFT',
  '进行中' = 'PROCESSING',
  '已取消' = 'CANCELLED',
  '已完成' = 'COMPLETED',
}
