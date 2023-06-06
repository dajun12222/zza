/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { toText, formatParamValue } from '../utils';

const REPLACE: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'REPLACE',
  type: Formula.IdentifierType.FUNC,
  inputType: [
    {
      paramType: Formula.ParamType.TEXT,
      sourceType: Formula.SourceType.ANY,
    },
    {
      paramType: Formula.ParamType.NUMBER,
      sourceType: Formula.SourceType.ANY,
    },
    {
      paramType: Formula.ParamType.NUMBER,
      sourceType: Formula.SourceType.ANY,
    },
    {
      paramType: Formula.ParamType.TEXT,
      sourceType: Formula.SourceType.ANY,
    },
  ],
  outputType: {
    paramType: Formula.ParamType.TEXT,
    sourceType: Formula.SourceType.EDIT,
  },
  calculate: (identifier, params) => {
    const _params = params.map((param) => formatParamValue(param));
    const [content, target] = _params.map((_param) => toText(_param).value);
    // todo
    const value = '';
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default REPLACE;
