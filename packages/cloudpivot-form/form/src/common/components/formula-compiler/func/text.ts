/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { toText, formatParamValue } from '../utils';

const TEXT: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'TEXT',
  type: Formula.IdentifierType.FUNC,
  inputType: [
    {
      paramType: Formula.ParamType.ANY,
      sourceType: Formula.SourceType.ANY,
    },
  ],
  outputType: {
    paramType: Formula.ParamType.TEXT,
    sourceType: Formula.SourceType.EDIT,
  },
  calculate: (identifier, params) => {
    const [_param] = params;
    const value = toText(formatParamValue(_param)).value;
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default TEXT;
