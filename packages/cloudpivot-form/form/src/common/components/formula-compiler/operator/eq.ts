/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { generateError } from '../error';
import {
  getParamTypeValue,
  validateParamNull,
  formatParamValue,
  getDateInstanceFromParam,
  checkFieldParamFromSublist,
  checkFieldParamFromRelevance,
  getFieldName,
} from '../utils';

const EQ: Formula.Identifier<Formula.IdentifierType.OPERATOR> = {
  name: '=',
  type: Formula.IdentifierType.OPERATOR,
  inputType: [
    {
      paramType: Formula.ParamType.ANY,
      sourceType: Formula.SourceType.ANY,
    },
    {
      paramType: Formula.ParamType.ANY,
      sourceType: Formula.SourceType.ANY,
    },
  ],
  outputType: {
    paramType: Formula.ParamType.BOOL,
    sourceType: Formula.SourceType.EDIT,
  },

  validate(identifier, params) {
    function typeIsEqual(type1, type2) {
      const eqTypeArr: string[] = [
        'text',
        'radio',
        'checkbox',
        'dropdown',
        'dropdownmulti',
      ];
      if (
        (eqTypeArr.indexOf(type1) > -1 && eqTypeArr.indexOf(type2) > -1) ||
        type1 === type2
      ) {
        return true;
      } else {
        return false;
      }
    }
    checkFieldParamFromSublist(identifier, params);
    checkFieldParamFromRelevance(identifier, params);
    if (
      params.some((param) => !typeIsEqual(params[0].paramType, param.paramType))
    ) {
      const [prev, next] = params;
      throw generateError(
        `操作符 "${
          identifier.name
        }" 要求参数类型一致，现在传入为 参数类型：${getParamTypeValue(
          prev.paramType,
        )} ${identifier.name} 参数类型：${getParamTypeValue(next.paramType)}`,
      );
    }
    return identifier.outputType;
  },
  calculate: (identifier, params) => {
    if (params.every((param) => validateParamNull(param))) {
      return {
        ...identifier.outputType,
        value: true,
      } as Formula.Param;
    }
    if (params.some((param) => validateParamNull(param))) {
      return {
        ...identifier.outputType,
        value: false,
      } as Formula.Param;
    }
    const _params = params.map((param) => formatParamValue(param));
    const [prev, next] = _params;
    let value = true;
    switch (prev.paramType) {
      case Formula.ParamType.NUMBER:
        value = prev.value.eq(next.value);
        break;
      case Formula.ParamType.BOOL:
      case Formula.ParamType.TEXT:
        value = prev.value === next.value;
        break;
      case Formula.ParamType.DATE:
        const prevDate = getDateInstanceFromParam(prev.value);
        const nextDate = getDateInstanceFromParam(next.value);
        if (!prevDate || !nextDate) {
          throw generateError(
            `操作符 "${identifier.name}" 中时间参数${
              !prevDate ? getFieldName(prev) : ''
            }${!nextDate ? getFieldName(next) : ''}转成时间时出现错误`,
          );
        }
        value = prevDate.getTime() === nextDate.getTime();
        break;
      default:
        break;
    }

    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default EQ;
