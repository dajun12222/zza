/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export const parseUrlParam = (urls: string, param?: string) => {
  let url = urls;
  const searchIndex = url.indexOf('?');
  const jhIndex = url.indexOf('#');
  if (jhIndex > -1) {
    url = url.substr(0, jhIndex);
  }
  const allParam: any = {};
  const searchParams = url.slice(searchIndex + 1).split('&');
  for (let i = 0; i < searchParams.length; i += 1) {
    if (searchParams[i].indexOf('=') === -1) {
      continue;
    }
    const items = searchParams[i].split('=');
    if (param && items[0].trim().toLowerCase() === param.toLowerCase()) {
      return items[1].trim();
    }
    allParam[items[0].trim()] = items[1].trim();
  }
  if (!param) {
    return allParam;
  }
  return null;
};

export const parseSearch = (search: string) => {
  search = search.substr(1);
  const obj: any = {};
  search.split('&').forEach((arr) => {
    const [key, value] = arr.split('=');
    obj[key] = value;
  });
  return obj;
};

export const sliceString = (value: any, length: number) => {
  // const reg = /^ /;
  if (!value) {
    return '';
  }
  let charCode = -1;
  let realLength: number = 0;
  const len: number = value.length;
  for (let i: number = 0; i < len; i += 1) {
    charCode = value.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
    if (realLength > length) {
      return value.substring(0, i);
    }
  }
  return value;
};

export const deepCopy = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((res) => {
      if (typeof res === 'object') {
        return deepCopy(res);
      } else {
        return res;
      }
    });
  }
  if (Object.prototype.toString.call(value) === '[object Object]') {
    const copyObj: any = {};
    for (const item in value) {
      if (typeof value[item] === 'object') {
        copyObj[item] = deepCopy(value[item]);
      } else {
        copyObj[item] = value[item];
      }
    }
    return copyObj;
  }
  return value;
};

let index = 0;

// make unique code
export const uid = () => {
  const now = +new Date();
  return `h3-upload-${now}-${++index}`;
};

export class StaticUtils {
  private static _flag: number = 0;

  /**
   * 防抖
   * @param fun 要执行的方法
   * @param time
   */
  static debound(fun: Function, time: number = 500) {
    if (StaticUtils._flag !== null && StaticUtils._flag !== undefined) {
      window.clearTimeout(StaticUtils._flag);
    }
    StaticUtils._flag = window.setTimeout(function () {
      fun();
      if (StaticUtils._flag !== null && StaticUtils._flag !== undefined) {
        window.clearTimeout(StaticUtils._flag);
      }
      StaticUtils._flag = 0;
    }, time);
  }
}

export function _debounce(fn: any, delay = 50) {
  let timer: any = null;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      //@ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}

export const CompareVersion = (v1: string, v2: any): number => {
  if (!v1) {
    v1 = '';
  }
  if (v2) {
    const v1Arr = v1.split('.');
    const v2Arr = v2.split('.');
    const len = Math.max(v1Arr.length, v2Arr.length);
    // 调整两个版本号位数相同
    while (v1Arr.length < len) {
      v1Arr.push('0');
    }
    while (v2Arr.length < len) {
      v2Arr.push('0');
    }
    // 循环判断每位的大小
    for (let i = 0; i < len; i++) {
      const num1: any = parseInt(v1Arr[i]);
      const num2: any = parseInt(v2Arr[i]);

      if (!isNaN(num1) && !isNaN(num2)) {
        if (num1 > num2) {
          return 1;
        } else if (num1 < num2) {
          return -1;
        } else {
        }
      } else {
        if (v1Arr[i] > v2Arr[i]) {
          return 1;
        } else if (v1Arr[i] < v2Arr[i]) {
          return -1;
        } else {
        }
      }
    }
    return 0;
  } else {
    return 1;
  }
};
