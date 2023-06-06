/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { generateError } from '../error';
import {
  checkFieldParamFromRelevance,
  checkFieldParamFromSublist,
  toText,
  formatParamValue,
} from '../utils';

const CONCATENATE: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'CONCATENATE',
  type: Formula.IdentifierType.FUNC,
  outputType: {
    paramType: Formula.ParamType.TEXT,
    sourceType: Formula.SourceType.EDIT,
  },
  validate(identifier, params) {
    checkFieldParamFromSublist(identifier, params);
    checkFieldParamFromRelevance(identifier, params);

    if (params.length < 1) {
      throw generateError(
        `函数 ${identifier.name}() 至少需要1个参数，但传入了${params.length}个参数`,
      );
    }
    return identifier.outputType;
  },
  calculate: (identifier, params) => {
    const _params = params.map((param) => formatParamValue(param));
    const value = _params.map((_param) => toText(_param).value).join('');
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default CONCATENATE;
