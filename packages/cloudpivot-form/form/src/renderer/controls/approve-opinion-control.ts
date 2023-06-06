/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import * as typings from '../typings';
import { UploadControl } from './';

export abstract class ApproveOpinionControl extends UploadControl<typings.ApprovalOpinionOptions> {
  // static service: ApproveOpinionService

  get content() {
    if (this.ctrl.value) {
      return this.ctrl.value.content || '';
    }
    return '';
  }

  opinions: { name: string; key: string }[] = [];

  fileList: any[] = [];

  //   /**
  //  * 是否支持设置常用审批意见
  //  */
  //   get supprotSelect() {
  //     return Boolean(this.controlOpts.showCommon);
  //   }

  //   /**
  //    * 是否支持设置常用审批意见
  //    */
  //   get supprotSetting() {
  //     return Boolean(this.controlOpts.showCommonSetting);
  //   }

  /**
   * 是否支持文件上传
   */
  get supprotUpload() {
    return Boolean(this.controlOpts.showUpload);
  }

  /**
   * 附件可以接受的类型
   */
  get accept() {
    return this.controlOpts.fileTypes;
  }

  search(value: string) {
    // const service = ApproveOpinionControl.service;
    // if (!service) {
    //   return;
    // }
    // service.search(value).then(data => {
    //   this.opinions = data.map(x => ({
    //     name: x.content,
    //     key: x.id
    //   }));
    // });
  }
}

export interface ApproveOpinionService {
  search(value: string): Promise<
    Array<{
      id: string;
      content: string;
    }>
  >;
}
