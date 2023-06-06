import Axios from './axios';
const newPath = '/api/app/bizdatarule';
import * as Common from './common';

export class DataRuleApi {
  // 检测规则
  testRules(params: any): Promise<Common.Data> {
    return Axios.post(`${newPath}/check`, params);
  }

  // 查询计算规则函数列表
  getFuncList(params: any): Promise<Common.Data> {
    return Axios.get(`${newPath}/calculate/function/list`, params);
  }
}
