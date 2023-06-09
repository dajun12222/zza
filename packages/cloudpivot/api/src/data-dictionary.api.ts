import axios from 'axios';
import * as Common from './common';

export class DictionaryApi {
  // 新增/保存数据字典
  saveDictionary(params: any): Promise<Common.Data> {
    return axios.post('/api/data_dictionary/saveDictionary', params);
  }

  // 获取字典分类
  getDictionaryClass(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getDictionaryClass', { params });
  }

  // 获取字典列表
  searchDictionary(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/searchDictionary', { params });
  }

  // 禁用/启用数据字典
  updateDictionaryStatus(params: any): Promise<Common.Data> {
    return axios.post('/api/data_dictionary/updateDictionaryStatus', params);
  }

  // 根据id查询字典数据
  // id=2c928ff579d6def90179d6e17a6f0001&searchWord=fff&page=1&size=10
  searchDictionaryRecord(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/searchDictionaryRecord', { params });
  }

  // 根据code查询字典数据
  // id=2c928ff579d6def90179d6e17a6f0001&searchWord=fff&page=1&size=10
  searchDictionaryRecordByCode(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/searchDictionaryRecordByCode', {
      params,
    });
  }

  // 新建字典分类
  saveDictionaryClass(params: any): Promise<Common.Data> {
    return axios.post('/api/data_dictionary/saveDictionaryClass', params);
  }

  // 获取字典列表
  getDictionaryIdAndNames(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getDictionaryIdAndNames', {
      params,
    });
  }

  // 获取字典分类
  getDictionaryClassDetail(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getDictionaryClassDetail', {
      params,
    });
  }

  // 批量删除分类
  deleteDictionaryClassBatch(params: any): Promise<Common.Data> {
    return axios.post(
      '/api/data_dictionary/deleteDictionaryClassBatch',
      params,
    );
  }

  // 根据字典类型获取数据字典
  getDictionaryByType(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getDictionaryByType', { params });
  }

  // 获取启用的字典数据
  getEnableRecordsByDictionaryId(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getEnableRecordsByDictionaryId', {
      params,
    });
  }

  getEnableRecordsByDictionaryCode(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getEnableRecordsByDictionaryCode', {
      params,
    });
  }

  getDictionaryById(params: any): Promise<Common.Data> {
    return axios.get('/api/data_dictionary/getDictionaryById', { params });
  }

  // 记录使用过的字典数据
  updateDictionaryRecordUsed(params: any): Promise<Common.Data> {
    return axios.post(
      '/api/data_dictionary/updateDictionaryRecordUsed',
      params,
    );
  }
}
