/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';

const MINUS: Formula.Identifier<Formula.IdentifierType.OPERATOR> = {
  name: '-',
  type: Formula.IdentifierType.OPERATOR,
  inputType: [
    {
      paramType: Formula.ParamType.NUMBER,
      sourceType: Formula.SourceType.ANY,
    },
    {
      paramType: Formula.ParamType.NUMBER,
      sourceType: Formula.SourceType.ANY,
    },
  ],
  outputType: {
    paramType: Formula.ParamType.NUMBER,
    sourceType: Formula.SourceType.EDIT,
  },
  calculate: (identifier, params, compiler) => {
    const _params = compiler._pretreatment(identifier, params);
    const [prev, next] = _params;
    const value = prev.value.minus(next.value);
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default MINUS;
