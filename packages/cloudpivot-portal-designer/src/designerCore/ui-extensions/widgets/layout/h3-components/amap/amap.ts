/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * 功能 动态引入高德地图
 * @param 地图的key
 * @param 地图的版本号
 * @param 地图加载完成时的回调
 * @return void
 * @Author lizuping
 * @Date: 2020-04-26
 * @Last Modified by: lizuping
 * @Last Modified time: 2020-04-26 15:52:23
 * @example fuc(key,v,fuc)
 */
import API from '@cloudpivot-shared/domain-api';

let ks = true;
let hasLoad = false;
const arr: any[] = [];
let mapInfo: Record<string, string> | null = null;

async function getMapConfig () {
  return await API.Global.request({
    url: '/api/webapi/system/config_management/list_by_type?configType=MAP_KEY',
    method: 'get',
  });
}

async function loadJs (key: string, v: string, fuc: (amap: any) => void) {
  if (!mapInfo) {
    const res = await getMapConfig();
    mapInfo = {
      mapKey: res?.data?.find(i => i.propertyCode === 'mapKey')?.propertyValue || '',
      secretKey: res?.data?.find(i => i.propertyCode === 'secretKey')?.propertyValue || '',
    };
    if (!mapInfo.mapKey) {
      mapInfo = null;
      console.error('请到管理平台 -> 系统管理 -> 配置管理 -> 地图服务 设置高德地图Key和安全秘钥');
    }
  }
  const mapKey = mapInfo?.mapKey || key;
  (window as any)._AMapSecurityConfig = {
    securityJsCode: mapInfo?.secretKey,
  };
  if (!hasLoad) {
    arr.push(fuc);
  } else {
    fuc((window as any).AMap);
  }
  if (!ks) {
    return false;
  }
  const url =
    'https://webapi.amap.com/maps?v=' +
    v +
    '&key=' +
    mapKey +
    '&callback=AMapinit';
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.charset = 'utf-8';
  s.src = url;
  document.getElementsByTagName('head')[0].appendChild(s);
  ks = false;
  console.log(url, 'url');
  (window as any).AMapinit = function () {
    hasLoad = true;
    for (let i = 0; i < arr.length; i++) {
      arr[i]((window as any).AMap);
    }
  };
}

export default loadJs;
