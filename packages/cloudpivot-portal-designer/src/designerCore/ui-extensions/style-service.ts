/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export function getImgUrl(src: string, appCode: string) {
  const stratIndex = src.indexOf('=') + 1;
  const endIndex =
    src.indexOf('&') !== -1 ? src.indexOf('&') : src.lastIndexOf('"');
  let refId: string = '';
  if (endIndex !== -1) {
    refId = src.substring(stratIndex, endIndex);
  } else {
    refId = src.substring(stratIndex);
  }
  const url = `/api/webapi/file/${appCode}/view?refId=${refId}`;
  return url;
}
