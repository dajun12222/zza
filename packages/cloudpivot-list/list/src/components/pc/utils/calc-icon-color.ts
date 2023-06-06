/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
const iconColorsArr: string[] = [
  '#0089FF',
  '#FF9F00',
  '#FB602D',
  '#6840FF',
  '#00B853',
];
const iconColorsLimit: number = 3;

const calc = (objectId: string): string => {
  const substr: string = objectId.substr(-iconColorsLimit);
  let long: number = 0;
  for (let i = 0; i < substr.length; i++) {
    const s = substr[i];
    const l = s.charCodeAt(0);
    long += l;
  }
  const left = long % iconColorsArr.length;
  return iconColorsArr[left];
};
export default calc;
