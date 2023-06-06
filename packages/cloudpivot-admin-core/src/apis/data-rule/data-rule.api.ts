/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import axios from 'axios';

import * as DataRuleType from './data-rule.typings';

const path = '/api/app/bizrule';

const newPath = '/api/app/bizdatarule';

/**
 * 获取数据规则列表
 */
export function list(params: DataRuleType.ListParams): Promise<Common.Data> {
  return axios.get(`${path}/list`, { params });
}

/**
 * 创建数据规则
 */
export function create(params: DataRuleType.RuleModel): Promise<Common.Data> {
  return axios.post(`${path}/create`, params);
}

/**
 * 获取所有数据规则类型
 */
export function listAllType() {
  return axios.get(`${path}/list_all_type`);
}

/**
 * 启用数据规则
 */
export function updateEnable(
  params: DataRuleType.UpdateEnableParams,
): Promise<Common.Data> {
  return axios.post(`${path}/updateEnable`, null, { params });
}

/**
 * 删除数据规则
 */
export function deleteDataRule(
  params: DataRuleType.IdParams,
): Promise<Common.Data> {
  const Params = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      Params.push(`${key}=${params[key]}`);
    }
  }
  return axios.post(`${path}/delete?${Params.join('&')}`);
}

/**
 * 获取单条数据规则详情
 */
export function getDetail(params: DataRuleType.IdParams): Promise<Common.Data> {
  return axios.get(`${path}/get`, { params });
}

/**
 * 更新数据规则
 * PUT /api/app/bizrule/update
 */
export function update(params: DataRuleType.RuleModel): Promise<Common.Data> {
  return axios.post(`${path}/update`, params);
}

// 新增数据规则
export function createDataRules(params: any): Promise<Common.Data> {
  return axios.post(`${newPath}/create`, params);
}
// 编辑数据规则
export function updateDataRules(params: any): Promise<Common.Data> {
  return axios.post(`${newPath}/update`, params);
}
// 删除数据规则
export function deleteDataRules(
  params: DataRuleType.IdParams,
): Promise<Common.Data> {
  const Params = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      Params.push(`${key}=${params[key]}`);
    }
  }
  return axios.post(`${newPath}/delete?${Params.join('&')}`);
}

/**
 * 检测数据规则
 * PUT /api/app/bizrule/update
 */
export function testRules(params: any): Promise<Common.Data> {
  return axios.post(`${newPath}/check`, params);
}

// 查询计算规则函数列表
export function getFuncList(params: any): Promise<Common.Data> {
  return axios.get(`${newPath}/calculate/function/list`, params);
}
