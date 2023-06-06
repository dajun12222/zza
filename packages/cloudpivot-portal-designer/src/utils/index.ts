/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * @Description:
 * @author AoFei Zhu
 * @date 2020-09-01 11:27:31
 */
export * from './filters'; // 过滤器

export * from './template-handler'; // 页面模板数据处理器

export * from './ws'; // websocket数据发送统一封装

export const clipboard = function (string) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', string);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy'); // execCommand()这个方法,只对可编辑区域有效果,如 input ,textarea 标签,
      resolve(true);
    }
    document.body.removeChild(input);
  });
};

export function base64ToBlob({
  b64data = '',
  contentType = '',
  sliceSize = 512,
} = {}) {
  return new Promise((resolve) => {
    // 使用 atob() 方法将数据解码
    const byteCharacters = atob(b64data);
    const byteArrays: Uint8Array[] = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const str = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers: number[] = [];
      for (let i = 0; i < str.length; i++) {
        byteNumbers.push(str.charCodeAt(i));
      }
      // 8 位无符号整数值的类型化数组。内容将初始化为 0。
      // 如果无法分配请求数目的字节，则将引发异常。
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    let result = new Blob(byteArrays, {
      type: contentType,
    });
    result = Object.assign(result, {
      // 这里一定要处理一下 URL.createObjectURL
      preview: URL.createObjectURL(result),
      name: 'XXX.png',
    });
    resolve(result);
  });
}

/**
 * 保存文件流
 * @param blob
 * @param fileName
 */
export const downFileByBlob = (blob: Blob, fileName: string) => {
  if ((window as any).navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.download = fileName;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }
};
/**
 * 立即执行的防抖
 */
export const debounce = (func: any, delay: number) => {
  let timer: any = null;
  return function (this: any, ...args: any) {
    const callNow = !timer;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
    }, delay);
    if (callNow) {
      func.apply(_this, args);
    }
  };
};

/**
 * 生成随机或者指定位数的英文数字组合
 * @param {number} max 生成随机位数的最大数
 * @return {string} 返回生成的英文数字组合
 */
export const randomWordCode = (max = 12) => {
  let str = '';
  // 默认赋值为第二个参数，如果是随机产生位数会通过下面的if改变。
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const Code = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  // 随机产生首位为小写字母的随机字符串
  str += Code[Math.round(Math.random() * (Code.length - 1))];
  for (let i = 0; i < max - 1; i++) {
    const index = Math.round(Math.random() * (arr.length - 1));
    str += arr[index];
  }
  return str;
};
