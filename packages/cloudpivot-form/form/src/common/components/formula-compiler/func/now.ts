/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { dateFormat } from '../utils';

const NOW: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'NOW',
  type: Formula.IdentifierType.FUNC,
  inputType: [],
  parameterless: true,
  outputType: {
    paramType: Formula.ParamType.DATE,
    sourceType: Formula.SourceType.EDIT,
  },
  calculate: (identifier) => {
    const value = dateFormat(new Date(), 'YYYY-MM-DD HH:mm');
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default NOW;
