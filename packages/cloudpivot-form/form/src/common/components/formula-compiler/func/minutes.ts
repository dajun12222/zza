/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { getDateInstanceFromParam, getFieldName } from '../utils';
import { generateError } from '../error';
import round from 'lodash/round';

const MINUTES: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'MINUTES',
  type: Formula.IdentifierType.FUNC,
  inputType: [
    {
      paramType: Formula.ParamType.DATE,
      sourceType: Formula.SourceType.ANY,
    },
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
    const [prev, next] = _params;
    const prevDate = getDateInstanceFromParam(prev.value);
    const nextDate = getDateInstanceFromParam(next.value);
    if (!prevDate || !nextDate) {
      throw generateError(
        `函数 ${identifier.name}() 中时间参数${
          !prevDate ? getFieldName(prev) : ''
        }${!nextDate ? getFieldName(next) : ''}转成时间时出现错误`,
      );
    }
    const value = round(
      Math.abs((prevDate.getTime() - nextDate.getTime()) / (60 * 1000)),
      2,
    );
    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default MINUTES;