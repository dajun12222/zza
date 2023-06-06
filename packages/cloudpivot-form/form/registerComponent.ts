/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import components from './src/components'; // 云枢原生组件
import { register } from './utils/register';
/**
 * @desc 注册新组件
 * @params extendComponents 二开组件
 */
export default function (extendComponents: any[] = []) {
  const allComponents = [...components, ...extendComponents];
  for (const cmp of allComponents) {
    register.append(cmp);
  }
}
