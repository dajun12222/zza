/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import axios from 'axios';

import * as BizSqlTypes from './biz-sql.typings';

/**
 * 创建业务数据库连接池条目
 * @param params
 */
export function createBizSql(
  params: BizSqlTypes.createParams,
): Promise<Common.Data> {
  return axios.post('/api/bizservice/dbconnpool/create', params);
}
/**
 * 删除业务数据库连接池条目
 * @param params
 */
export function deleteBizSql(
  params: BizSqlTypes.deleteParams,
): Promise<Common.Data> {
  const Params = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      Params.push(`${key}=${params[key]}`);
    }
  }
  return axios.post(`/api/bizservice/dbconnpool/delete?${Params.join('&')}`);
}
/**
 * 通过编码获取数据库连接池条目信息
 * @param params
 */
export function getBizSqlByCode(
  params: BizSqlTypes.getByCodeParams,
): Promise<Common.Data> {
  return axios.get('/api/bizservice/dbconnpool/get_by_code', {
    params,
  });
}
/**
 * 通过ID获取数据库连接池条目信息
 * @param params
 */
export function getBizSqlById(
  params: BizSqlTypes.getByIdParams,
): Promise<Common.Data> {
  return axios.get('/api/bizservice/dbconnpool/get_by_id', {
    params,
  });
}
/**
 * 获取数据库连接池列表
 */
export function getBizSqlList(): Promise<Common.Data> {
  return axios.get('/api/bizservice/dbconnpool/list');
}
/**
 * 更新数据库连接池条目信息
 * @param params
 */
export function updateBizSql(
  params: BizSqlTypes.updateParams,
): Promise<Common.Data> {
  return axios.post('/api/bizservice/dbconnpool/update', params);
}

export function searchBizSql(
  params: BizSqlTypes.searchParams,
): Promise<Common.Data> {
  return axios.get('/api/bizservice/dbconnpool/search', { params });
}

export function getAppManagers(selectUserIds): Promise<Common.Data> {
  return axios.get(
    '/api/system/list_manager_user?managerType=2&selectUserIds=' +
      selectUserIds,
  );
}

export function getAlldbtype(): Promise<Common.Data> {
  return axios.get('/api/bizservice/dbconnpool/get_all_dbtype');
}

export function getOtherDstype(): Promise<Common.Data> {
  return axios.get('/api/bizservice/dbconnpool/get_other_dstype');
}
