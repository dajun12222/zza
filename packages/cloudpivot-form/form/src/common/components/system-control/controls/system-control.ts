/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-22 16:49:33
 * @LastEditTime: 2021-09-17 12:27:23
 * @LastEditors: baidongsheng
 * @Description: In User Settings Edit
 * @FilePath: \frontend\modules\cloudpivot\form\src\common\components\system-control\controls\system-control.ts
 */

import { BaseControl } from '../../../controls/base-control';
import {
  CreatedTimeOptions,
  FormControlType,
  StyleControlOptions,
} from '../../../../typings';
import { dateFormatter } from 'cloudpivot-form/form/utils';

export class SystemControl extends BaseControl<StyleControlOptions> {
  get text() {
    let val = this.ctrl ? this.ctrl.value : null;
    const ct = this.control.type;
    if (
      ct === FormControlType.CreatedTime ||
      ct === FormControlType.ModifiedTime
    ) {
      if (!val) {
        val = new Date();
      }
      const format = (this.controlOpts as CreatedTimeOptions).format1;
      return dateFormatter(val, format);
    }

    if (Array.isArray(val)) {
      return val.length > 0 ? val[0].name : '';
    } else if (val && typeof val === 'object') {
      return val.name;
    } else {
      return val || this.$t('cloudpivot.form.runtime.biz.systemValue');
    }
  }

  get tips() {
    const { tips } = this.control.options;
    return tips;
  }
}
