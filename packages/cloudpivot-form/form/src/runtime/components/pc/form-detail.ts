/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Modal } from '@h3/antd-vue';
import { FormSheet } from 'cloudpivot-forms';
import * as renderer from '../../../renderer';
import * as schema from '../../../schema';
import { FormDetail } from '../form-detail';

const TIMEOUT_300 = 300;

export abstract class PcFormDetail extends FormDetail {
  get isMobile() {
    return false;
  }

  /**
   * 表单中的子表是否编辑状态
   */
  sheetInEdit(ctrlId) {
    // @ts-ignore 是否开启子表查看模式
    const sheetView: boolean = window.config.openSheetViewPattern || false;
    if (!sheetView) {
      return true;
    }
    // @ts-ignore
    if (window.h3form) {
      // @ts-ignore
      const h3form = window.h3form;
      const inEdit = h3form.inEdit;
      if (
        h3form.formObj &&
        h3form.formObj.formPermission &&
        h3form.formObj.formPermission.dataPermissions
      ) {
        const sheetCtrlPermission =
          h3form.formObj.formPermission.dataPermissions[ctrlId];
        return inEdit || sheetCtrlPermission?.e;
      }
      return inEdit;
    }
    return false;
  }

  validate(onlyUpload?: boolean) {
    const formBody = document.querySelector('.form-body') as HTMLDivElement;

    const getOffsetTop = (el: any, body: any): any => {
      const offsetParent = el.offsetParent || body;
      const offsetTop = offsetParent.offsetTop;
      if (offsetTop === 0 && offsetParent !== body) {
        return getOffsetTop(offsetParent, body);
      } else {
        return offsetTop;
      }
    };
    const scrollTo = (key: string) => {
      const el = document.querySelector(`#${key}`) as HTMLDivElement;

      if (el && formBody) {
        const scrollTop = getOffsetTop(el, formBody);
        formBody.scrollTop = scrollTop;
      }
    };

    if (!onlyUpload) {
      const formRenderer = this.$refs.formRenderer as any;
      if (!formRenderer.validate()) {
        const errors = formRenderer.getErrors();
        if (errors) {
          let keys = Object.keys(errors);
          let msg = '';

          const formControls: renderer.RendererFormControl[] = [];
          renderer.components.FormRendererHelper.findFormControl(
            this.controls,
            formControls,
          );

          if (keys.length > 0) {
            const key = keys[0];

            const control = formControls.find((c) => c.key === key);

            if (control && control.type === schema.FormControlType.Sheet) {
              const map = errors[key];
              keys = Object.keys(map);
              const keys2 = Object.keys(map[keys[0]]);
              const err = formRenderer.getErrorMessage(
                keys2[0],
                map[keys[0]][keys2[0]][0],
                key,
              );
              msg = err;
              // key = key + keys[0];
              this.showErrorMsg(msg, control, keys2[0]);
            } else {
              msg = formRenderer.getErrorMessage(key, errors[key][0]);
              this.showErrorMsg(msg, control);
            }
            // this.$message.error(msg);
            scrollTo(key);
            return false;
          }
        }
      }
    }

    let upload = super.findUploadBy(renderer.UploadStatus.Uploading);
    if (upload) {
      this.$message.error(`${upload.options.name}正在上传！`, 3);
      scrollTo(upload.key);
      return false;
    }

    upload = super.findUploadBy(renderer.UploadStatus.Error);
    if (upload) {
      this.$message.error(`${upload.options.name}上传失败！`, 3);
      scrollTo(upload.key);
      return false;
    }

    const pleaseInput = this.$t('cloudpivot.form.runtime.modal.pleaseInput');

    if (!onlyUpload) {
      if (this.approval) {
        const ctrl = this.approval.controller as any;
        if (ctrl.required && (!ctrl.value || !ctrl.value.content)) {
          this.$message.error(`${pleaseInput}${this.approval.options.name}`, 3);
          return false;
        }
      }
      const formControls: renderer.RendererFormControl[] = [];
      renderer.components.FormRendererHelper.findFormControl(
        this.controls,
        formControls,
      );

      const rowEmpty = this.$t('cloudpivot.form.runtime.modal.rowEmpty');
      const isEmptyRow: boolean = formControls
        .filter(
          (c) =>
            c.type === schema.FormControlType.Sheet && c.options.isEmptyRow,
        )
        .some((c) => {
          const ctrl = this.formRenderer.controller.findChild(
            c.key,
          ) as FormSheet;
          const name = !(this.$i18n.locale && this.$i18n.locale === 'en')
            ? c.options.name
            : c.options.name_i18n
            ? c.options.name_i18n
            : 'Subtable';
          const tips = c.options.isEmptyRowTips;
          if (ctrl && !ctrl.display) {
            return false;
          }
          let sheetCtrlValue = ctrl ? ctrl.value : [];
          //查看模式下子表数据不存在controller里面，需要特殊处理获取
          if (!this.sheetInEdit(ctrl.id)) {
            sheetCtrlValue = ctrl ? (ctrl.__ctrl ? ctrl.__ctrl.value : []) : [];
          }

          if (ctrl && sheetCtrlValue.length === 0) {
            scrollTo(c.key);
            this.$message.error(tips ? tips : `${name}${rowEmpty}`, 3);
            return true;
          } else if (ctrl && sheetCtrlValue.length) {
            const isValue: boolean = sheetCtrlValue.every((s: any) => {
              const resArr: any[] = [];
              Object.keys(s).forEach((el) => {
                if (!['id', 'rowStatus'].includes(el)) {
                  resArr.push(s[el]);
                }
              });
              return resArr.join('').length > 0;
            });
            if (!isValue) {
              scrollTo(c.key);
              this.$message.error(tips ? tips : `${name}${rowEmpty}`, 3);
              return true;
            }
          } else {
          }
          return false;
        });

      if (isEmptyRow) {
        return false;
      }

      // renderer.FormControlType.
      let isRequire: boolean = formControls
        .filter((c) => c.type === renderer.FormControlType.Address)
        .some((c: any) => {
          const ctrl = this.formRenderer.controller.findChild(c.key);
          // const val: any = c.controller.value;
          if (
            ctrl &&
            ctrl.required &&
            (!ctrl.value || !ctrl.value.provinceAdcode)
          ) {
            //
            scrollTo(c.key);
            c.controller.setError('required');
            this.$message.error(`${pleaseInput}${c.options.name}`, 3);
            return true;
          }

          return false;
        });

      if (!isRequire) {
        isRequire = formControls
          .filter((c) => c.type === schema.FormControlType.Sheet && c.required)
          .some((c) => {
            const ctrl = this.formRenderer.controller.findChild(
              c.key,
            ) as FormSheet;
            if (ctrl && ctrl.rows.length === 0 && ctrl.display) {
              scrollTo(c.key);
              this.$message.error(`${pleaseInput}${c.options.name}`, 3);
              return true;
            }
            return false;
          });
      }

      if (isRequire) {
        return false;
      }
    }

    return true;
  }

  showErrorMsg(errorMsg: string, control: any, sheet = '') {
    let ctl = control;
    if (control.type === schema.FormControlType.Sheet && sheet) {
      ctl = control.columns.find((v: any) => v.key === sheet);
    }
    if (
      ctl &&
      (ctl.type === schema.FormControlType.Number ||
        ctl.type === schema.FormControlType.Date ||
        ctl.type === schema.FormControlType.Time)
    ) {
      const verifyFormula = ctl.options.verifyFormula;
      if (verifyFormula) {
        if (isJSONString(verifyFormula)) {
          const obj = JSON.parse(verifyFormula);
          const type = obj.dialogBox || 1;
          if (+type === 2) {
            this.dialogError(errorMsg);
            return;
          }
        } else {
          const arr = /dialogBox:\d/.exec(verifyFormula);
          if (arr) {
            const type = arr[0].split(':')[1];
            if (+type === 2) {
              this.dialogError(errorMsg);
              return;
            }
          }
        }
      }
    }
    this.messageError(errorMsg);
    // 校验失败获取赋予输入框焦点
    setTimeout(() => {
      const ctlNode: any = document.querySelector(`.${ctl.key}`) as any;
      let input: any;
      if (ctlNode) {
        //通过将数据项编码增加到短文本、数值组件的类class上，再通过类来选择
        input = (document.querySelector(`#${control.key}.error .${ctl.key}`) ||
          document.querySelector(`#${control.key} .error .${ctl.key}`)) as any;
        if (ctl.type === schema.FormControlType.Number) {
          input = document.querySelector(
            `#${control.key} .${ctl.key} input`,
          ) as any;
        }
      }
      const textarea: any = document.querySelector(
        '#' + control.key + ' textarea',
      ) as any;
      input && input.focus();
      if (!input) {
        textarea && textarea.focus();
      }
    }, TIMEOUT_300);
  }

  // 用提示框 展示错误信息
  messageError(err: string) {
    this.$message.error(err);
  }

  dialogError(err: string) {
    Modal.error({
      title: '错误提示',
      content: err,
    });
  }
}
function isJSONString(str: string) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
  } catch (e) {}
  return false;
}
