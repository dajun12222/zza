/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
// 这个会有缓存
let locale = '';
let lang = null;
function getLang() {
  if (!!locale && locale === (window as any).localStorage.getItem('locale')) {
    return lang;
  }
  locale = (window as any).localStorage.getItem('locale') || 'zh';
  return (lang = require(`./${
    locale === 'zh' ? 'zh-CN' : 'en-US'
  }.ts`).default);
}

function $t(keys) {
  const lang2 = getLang();
  return keys.split('.').reduce((sum, key) => {
    return sum[key];
  }, lang2);
}

export default $t;
