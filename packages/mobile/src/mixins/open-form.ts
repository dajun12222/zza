/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: nooldey <nooldey@gmail.com>
 * @Date: 2019-05-16 14:31:35
 * @Last Modified by: nooldey
 * @Last Modified time: 2019-05-16 15:12:08
 * 打开应用表单混入方法
 */

import Vue from 'vue';
import Component from 'vue-class-component';

/* interface for Bizmodel/Page item */
interface BizModelItem {
  code: string;
  favorites: boolean;
  id: string;
  name: string;
  type: string;
  openMode: string;
  mobileUrl: string;
  pcUrl: string;
  children?: Array<BizModelItem>;
}
/* interface end */

@Component
export default class OpenFormMixin extends Vue {
  currentApp?: any;

  app?: any;

  goFormList(bizmodel: BizModelItem) {
    // 跳转前记录当前APPcode
    const appCode: string =
      (this.currentApp && this.currentApp.code) || (this.app && this.app.code);
    if (appCode) {
      sessionStorage.setItem('modelSouceApp', appCode);
    }
    // 根据类型跳转
    const { type, mobileUrl, code, openMode } = bizmodel;
    if (type === 'BizModel') {
      this.$router
        .push({
          name: 'apps-form-list',
          params: {
            schemaCode: code,
          },
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else if (mobileUrl) {
      if (['NEW_PAGE_MODE', 'RECENT_PAGE_MODE'].includes(openMode)) {
        window.open(mobileUrl);
      } else {
        this.$router
          .push({
            path: mobileUrl,
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    } else {
      this.$h3.toast.show({ text: '页面地址未设置，请联系管理员！' });
    }
  }
}
