/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export function px2num(px: string): number {
  const temWidth = px.replace('px', '') as string;
  const w: number = parseInt(temWidth, 10) as number;
  return w;
}
