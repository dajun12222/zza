/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Handler from '../handler';

export default class ListCustomTemplate extends Handler {
  // ============================ 静态&类属性/函数

  /**
   * html 和 data 校验
   */
  static validateHtml(html) {
    const validation = { result: false, message: '' };
    // 如果为空, 如果类型不对
    if (typeof html !== 'string' || !(html = html.trim())) {
      validation.message = `: html text could not be "${html}"`;
    } else if (false) {
      validation.message = `${Handler.errorLogPrefix}: html text could not be ${html}`;
    } else {
      validation.result = true;
    }

    validation.message = validation.message
      ? `${Handler.errorLogPrefix}${validation.message}`
      : '';
    return validation;
  }

  static validateData(data) {
    const validation = { result: false, message: '' };
    // 如果类型不对, 或者为空
    if (String(data) !== '[object object]' || !data) {
      validation.message = `: Parameter <data> should be an object!`;
    }
    // 如果找不到版本信息
    else if (!data.version) {
      validation.message = `: Template version info not found!`;
    }
    // 都找不到问题就置为true
    else {
      validation.result = true;
    }

    validation.message = validation.message
      ? `${Handler.errorLogPrefix}${validation.message}`
      : '';
    return validation;
  }

  /**
   * html 和 data 转换
   */
  static htmlToData(html: any) {
    // 获取校验结果
    const validation = this.validateHtml(html);
    if (!validation.result) {
      throw validation.message;
    }
  }

  static dataToHtml(data: any) {
    // 获取校验结果
    const validation = this.validateData(data);
    if (!validation.result) {
      throw validation.message;
    }
  }
}
