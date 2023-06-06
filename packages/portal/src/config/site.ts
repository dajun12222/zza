/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import site from '../../extends/site';

const themsInfo = localStorage.getItem('themsInfo') || '{}';

const defaultSite = {
  title: '云枢',
  logo: require('@/assets/images/yslogo.png'),
};

const mix = Object.assign({}, defaultSite, site, JSON.parse(themsInfo));

export default mix;
