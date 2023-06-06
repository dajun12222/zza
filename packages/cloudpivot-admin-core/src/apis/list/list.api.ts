/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Axios from 'axios';

import { ListItem, SortParams, ShowOnParams } from './list-typings';

const bizproperty = '/api/app/bizproperty';
// const path = 'http://192.168.8.230:8080/api/app/query';

const path = '/api/app/query';
// 错误处理
export function errorHandle(res: any) {
  if (res.hasOwnProperty('errcode') && res.errcode !== 0) {
    return Promise.reject(res);
  }
  return res;
}

// 数据项列表
export function getDataItems(schemaCode: any, isPublish: boolean) {
  return Axios.get(`${bizproperty}/list`, {
    params: {
      schemaCode,
      isPublish,
    },
  }).then(errorHandle);
}
// 保存数据
export function updateListData(queryModel: any) {
  return Axios.post(`${path}/update`, queryModel);
}
/* 创建新列表 */
export function create(data: ListItem) {
  return Axios.post(`${path}/create`, data);
}

/* 列表的list */
export function getList(schemaCode: string) {
  return Axios.get(`${path}/list`, {
    params: {
      schemaCode,
    },
  }).then(errorHandle);
}

/* 列表删除 */
export function remove(schemaCode: string, code: string) {
  return (
    Axios.post(`${path}/delete?schemaCode=${schemaCode}&code=${code}`) as any
  ).then(errorHandle);
}

/* 列表排序 */
export function updateSortkey(data: SortParams) {
  return (Axios.post(`${path}/updateSortkey`, data) as any).then(errorHandle);
}

/* 点亮PC、移动端可见 */
export function updateShowOn(data: ShowOnParams) {
  return (Axios.post(`${path}/updateShowOn`, data) as any).then(errorHandle);
}

/* 列表编辑获取数据 */
export function get(schemaCode: string, code: string) {
  return Axios.get(`${path}/get_header`, {
    params: {
      schemaCode,
      code,
    },
  }).then(errorHandle);
}

/* 列表编辑跟新数据 */
export function updateHeader(data: ListItem) {
  return Axios.post(`${path}/update_header`, data).then(errorHandle);
}

/* 获取列表信息 */
export function getListInfo(
  schemaCode: string,
  code: string,
  clientType: string,
  viewSource?: boolean,
  formCode?: string,
) {
  return Axios.get(`${path}/get`, {
    params: {
      schemaCode,
      code,
      clientType,
      viewSource,
      formCode,
    },
  }).then(errorHandle);
}
