/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export const filters = {
  fileSize: (value: number) => {
    if (value < 1024 * 1024) {
      return (Math.round((value * 100) / 1024) / 100).toString() + 'KB';
    } else {
      return (
        (Math.round((value * 100) / (1024 * 1024)) / 100).toString() + 'MB'
      );
    }
  },
};
