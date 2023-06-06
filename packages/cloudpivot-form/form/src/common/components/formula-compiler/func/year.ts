/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { getDateInstanceFromParam, getFieldName } from '../utils';
import { generateError } from '../error';

const YEAR: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'YEAR',
  type: Formula.IdentifierType.FUNC,
  inputType: [
    {
      paramType: Formula.ParamType.DATE,
      sourceType: Formula.SourceType.ANY,
    },
  ],
  outputType: {
    paramType: Formula.ParamType.NUMBER,
    sourceType: Formula.SourceType.EDIT,
  },
  calculate: (identifier, params, compiler) => {
    const _params = compiler._pretreatment(identifier, params);
    const [_param] = _params;
    const _date = getDateInstanceFromParam(_param.value);
    if (!_date) {
      throw generateError(
        `函数 ${identifier.name}() 中时间参数${getFieldName(
          _param,
        )}转成时间时出现错误`,
      );
    }
    const value = _date.getFullYear();
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default YEAR;
