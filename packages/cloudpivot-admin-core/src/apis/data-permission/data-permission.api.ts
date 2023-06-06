/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import axios from 'axios';

import * as DataPermissionType from './data-permission.typings';

export function getPermissions(
  params: DataPermissionType.getParams,
): Promise<Common.Data> {
  return axios.get('/api/app/bizperm/get', { params });
}

export function updatePermission(
  params: DataPermissionType.updateParams,
): Promise<Common.Data> {
  return axios.post('/api/app/bizperm/update', params);
}

export function deletePermission(
  params: DataPermissionType.deleteParams,
): Promise<Common.Data> {
  const Params = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      Params.push(`${key}=${params[key]}`);
    }
  }
  return axios.post(`/api/app/bizperm/delete?${Params.join('&')}`);
}

export function getPermProperties(
  params: DataPermissionType.getPropertyParams,
): Promise<Common.Data> {
  return axios.get('/api/app/bizperm/get_perm_properties', { params });
}

export function getDataItemList(
  params: Apps.Datamodel.DataItemListParams,
): Promise<Common.Data> {
  // 获取数据项列表
  return axios.get('/api/app/bizproperty/list', { params });
}
