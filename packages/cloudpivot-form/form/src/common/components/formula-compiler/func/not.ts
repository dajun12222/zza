/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';

const NOT: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'NOT',
  type: Formula.IdentifierType.FUNC,
  inputType: [
    {
      paramType: Formula.ParamType.BOOL,
      sourceType: Formula.SourceType.ANY,
    },
  ],
  outputType: {
    paramType: Formula.ParamType.BOOL,
    sourceType: Formula.SourceType.EDIT,
  },
  calculate: (identifier, params, compiler) => {
    const _params = compiler._pretreatment(identifier, params);
    const [_param] = _params;
    const value = !_param.value;
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default NOT;
