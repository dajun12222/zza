/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { viewRegister } from './utils/register';
/**
 * @desc 注册扩展视图类型
 * @params extendViews 扩展视图类型
 */
export default function (extendViews = {}) {
  Object.keys(extendViews).forEach((viewType) => {
    viewRegister.append(viewType, extendViews[viewType]);
  });
}
