/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';
import { generateError } from '../error';
import { dateFormat, getDateInstanceFromParam, toDecimal } from '../utils';

const NUMBER: Formula.Identifier<Formula.IdentifierType.FUNC> = {
  name: 'NUMBER',
  type: Formula.IdentifierType.FUNC,
  inputType: [
    {
      paramType: Formula.ParamType.ANY,
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
    let value = _param.value;
    switch (_param.paramType) {
      case Formula.ParamType.BOOL:
        value = value ? 1 : 0;
        break;
      case Formula.ParamType.TEXT:
        value = toDecimal(value);
        if (isNaN(value)) {
          generateError(`函数 ${identifier.name}() 的文本参数转化数字错误`);
        }
        break;
      case Formula.ParamType.DATE:
        value = toDecimal(
          dateFormat(getDateInstanceFromParam(value), 'YYYYMMDD'),
        );
        break;
      case Formula.ParamType.NUMBER:
      default:
        break;
    }

    return {
      ...identifier.outputType,
      value,
    } as Formula.Param;
  },
};

export default NUMBER;
