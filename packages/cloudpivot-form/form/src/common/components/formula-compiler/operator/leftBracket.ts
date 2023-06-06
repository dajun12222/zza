/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Form } from '@h3/antd-vue';
import { Formula } from '../type';

const LEFTBRACKET: Formula.Identifier<Formula.IdentifierType.OPERATOR> = {
  name: '(',
  type: Formula.IdentifierType.OPERATOR,
  calculate: (identifier, params, compiler) => {
    const _params = compiler._pretreatment(identifier, params);
    const [prev, next] = _params;
    // todo
    const value = null;
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default LEFTBRACKET;
