/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Formula } from '../type';

declare type ErrorOptions = {
  text: string;
  token: string;
  line: string;
  loc: string;
  expected: string;
};

declare type ParseErrorFn = (errMsg: string, options?: ErrorOptions) => void;

declare class Parser {
  yy: {
    callField: (str: string) => Formula.FieldParam;
    callNumber: (str: string) => Formula.Param;
    callString: (str: string) => Formula.Param;
    callKeyword: (str: string) => Formula.KeywordParam;
    uminus: (param: Formula.Param) => Formula.Param;
    uplus: (param: Formula.Param) => Formula.Param;
    evaluateByOperator: (operatorKey: string, params: Formula.Param[]) => any;
    evaluateByFunction: (functionKey: string, params: Formula.Param[]) => any;
  };

  parse: (code: string) => any;
}
