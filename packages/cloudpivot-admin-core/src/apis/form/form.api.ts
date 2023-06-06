/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import axios from 'axios';
import { FormUpdate } from './form-typings';

const path = '/api/app/bizsheet';

export function errorHandle(res: any) {
  if (res.hasOwnProperty('errcode') && ![0].includes(res.errcode)) {
    return Promise.reject(res);
  }

  return res;
}

export function list(schemaCode: string) {
  return axios
    .get(`${path}/list`, {
      params: {
        schemaCode,
      },
    })
    .then(errorHandle);
}

export function get(schemaCode: string, sheetCode: string, copyCode?: string) {
  return axios
    .get(`${path}/get`, {
      params: {
        schemaCode,
        sheetCode,
        copyCode,
      },
    })
    .then(errorHandle);
}

export function remove(schemaCode: string, sheetCode: string) {
  return (
    axios.post(
      `${path}/delete?schemaCode=${schemaCode}&sheetCode=${sheetCode}`,
    ) as any
  ).then(errorHandle);
}

export function create(data: FormUpdate) {
  return axios.post(`${path}/create`, data).then(errorHandle);
}

export function printCreate(data: FormUpdate) {
  return axios.post(`${path}/print/create`, data).then(errorHandle);
}

export function update(data: FormUpdate) {
  return axios.post(`${path}/update`, data).then(errorHandle);
}

export function publish(data: FormUpdate) {
  return axios.post(`${path}/publish`, data).then(errorHandle);
}
export function getShortCode(schemaCode: string, sheetCode: string) {
  return axios
    .get(`${path}/getShortCode`, {
      params: {
        schemaCode,
        sheetCode,
      },
    })
    .then(errorHandle);
}

export function getShortCode_v2(params: any) {
  return axios
    .get(`${path}/getShortCode_v2`, {
      params,
    })
    .then(errorHandle);
}

/*
 * @params 获取组织机构最大层级数
 */
export function getOrgMaxNum() {
  return axios
    .get(`/api/organization/department/get_max_department_level`)
    .then(errorHandle);
}
