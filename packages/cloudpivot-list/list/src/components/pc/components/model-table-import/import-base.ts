/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ImportBase extends Vue {
  // 下载文件
  downloadFile(blob: any, fileName: string) {
    if ((window as any).navigator.msSaveOrOpenBlob) {
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = fileName;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
