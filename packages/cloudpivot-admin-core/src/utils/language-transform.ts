/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
const setLang = (currentName: string, nameI18n?: string) => {
  //
  const backObj = {
    name: '',
    name_i18n: '',
  };

  const lang: string = localStorage.getItem('locale') || 'zh';

  if (nameI18n) {
    const nameI18nObj: any = JSON.parse(nameI18n);
    if (lang === 'zh') {
      backObj.name = currentName;
      nameI18nObj.zh = currentName;
      backObj.name_i18n = JSON.stringify(nameI18nObj);
    } else {
      backObj.name = currentName;
      nameI18nObj[lang] = currentName;
      backObj.name_i18n = JSON.stringify(nameI18nObj);
    }
  } else {
    backObj.name = currentName;
    backObj.name_i18n = JSON.stringify({
      en: currentName,
    });
  }

  // nameI18nObj.en = name;

  // if (lang === 'en' || ) {

  // }
  return backObj;
};

const getLang = (name: string, nameI18n: string) => {
  const lang = localStorage.getItem('locale') || 'zh';

  if (!nameI18n) {
    return name;
  }
  let backName: string = '';
  let langI18n: any = {};
  try {
    langI18n = JSON.parse(nameI18n);
  } catch (error) {
    langI18n = {};
  }
  if (langI18n && langI18n[lang]) {
    backName = langI18n[lang];
  } else {
    backName = name;
  }
  return backName;
};

const initNameI18n = (currentName: string, nameI18n: string) => {
  if (nameI18n) {
    return nameI18n;
  }
  const backNameI18n = {
    en: currentName,
    zh: currentName,
  };
  return JSON.stringify(backNameI18n);
};

export default {
  setLang,
  getLang,
  initNameI18n,
};
