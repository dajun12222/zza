/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: nooldey <nooldey@gmail.com>
 * @Date: 2021-03-10 22:29:18
 * @Last Modified by: nooldey
 * @Description:
 *    1. 将全局样式和页面样式插入到页面中，插入的位置处于 id=app 的根节点前，以确保样式在应用挂载前注入；
 *    2. 同时对样式进行根节点限制，在指定范围内有效
 *    3. 将样式根节点信息存入本地存储，以供其他样式注入确定优先级
 */

import { insertStyleScope } from '@cloudpivot-shared/ui-engine-vue/src/style-helper';

export const customStyleId = 'custom-page-style';
export const rootDom = '.designer-page';

/**
 *
 * @param appStyle 应用级自定义样式
 * @param pageStyle 页面级自定义样式
 * @param parentDom 样式生效区域的根节点ID
 */
export function addStyle(
  appStyle: string = '',
  pageStyle: string = '',
  parentDom: string = rootDom,
) {
  const styleCtx = insertStyleScope(appStyle + pageStyle, parentDom);

  const wrapDom = document.body;
  const id = parentDom[0] === '#' ? parentDom : '#app';
  const styleId = id.substr(1) + '_style';
  let styleScript = wrapDom.querySelector('#' + styleId);
  if (!styleScript) {
    styleScript = document.createElement('style');
    styleScript.id = styleId;

    const nextDom = wrapDom.querySelector(id) as HTMLDivElement;
    if (nextDom) {
      nextDom.insertBefore(styleScript, nextDom.firstChild);
    }
    // if (nextDom) {
    //   wrapDom.insertBefore(styleScript, nextDom);
    // } else {
    // }
  }
  styleScript.innerHTML = styleCtx;
}
