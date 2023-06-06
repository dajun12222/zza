/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/* eslint-disable no-prototype-builtins */
export function toChangeRem(obj: any) {
  // 边框相关属性转rem
  let objStr = JSON.stringify(obj);
  const reg = /(\d)+(px)/gi;
  const newStr = objStr.match(reg);
  const fontSize: any = 37.5;
  if (newStr) {
    for (let i = 0, len = newStr.length; i < len; i++) {
      objStr = objStr.replace(
        newStr[i],
        parseFloat(newStr[i]) / fontSize + 'rem',
      );
    }
  }
  return JSON.parse(objStr);
}

/**
 *
 * 判断当前浏览器是否为mobile
 * 现阶段把支持touch 事件的都归类为移动端
 */
export const isMobile = (): boolean => {
  let isWap: boolean = false;
  const width = window.screen.width;
  if (
    width < 750 ||
    (document.hasOwnProperty('ontouchstart') &&
      document.hasOwnProperty('onmousedown'))
  ) {
    isWap = true;
  }
  return isWap;
};
