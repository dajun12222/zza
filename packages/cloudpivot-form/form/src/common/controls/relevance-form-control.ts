/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ControlCommand, FormSheet } from 'cloudpivot-forms';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { form, formApi } from 'cloudpivot/api';
import common from 'cloudpivot/common';
import * as typings from '../.././schema';
import {
  convertDataItemExp,
  DataItemType,
  DateItemOperatorType,
  FormControlType,
  RelevanceFormSelectMode,
  RendererFormControl,
} from '../.././schema';
import { ControlHelper, UploadStatus } from '../../renderer/controls';
import { FormControlValueService, ReverseQueryService } from '../services';
import { BaseControl } from './base-control';
import {
  queryData2Conditions,
  conditions2fields,
} from 'cloudpivot-list/list/src/components/pc/components/queryForm/query-form-util';
import { Inject } from 'vue-property-decorator';
import { dateFormatter } from 'cloudpivot-form/form/src/renderer/utils/index';
import commons from 'cloudpivot/common/mobile';
import { formatVal } from 'cloudpivot-list/list/src/components/pc/components/queryForm/query-form-util';

const GetDateHandle = commons.utils.GetDateHandle;

export abstract class RelevanceFormControl extends BaseControl<typings.RelevanceFormOptions> {
  @Inject({
    default: () => () => {},
  })
  formObjSource!: Function;

  abstract isMobileRelevanceEntrance: boolean;

  static service: RelevanceFormService;

  static loadListSelector: () => any;

  static loadFormStatus: () => any;

  static loadQueryForm: () => any;

  static loadFormItem: () => any;

  formTitleObj: FormTitle | null = null;

  commandSubscription?: Subscription;

  setDefaultValSub?: Subscription;

  queryConditions: any[] = [];

  setDefaultValTimer?: any;

  // 设置默认值只会执行一次
  isInit: boolean = true;

  get isModal() {
    return this.controlOpts.selectMode === RelevanceFormSelectMode.Popup;
  }

  get treeView() {
    return this.controlOpts.treeView; //是否为查询条件的树形结构，是树形样式的话直接不展示，在门户左边独立展示
  }

  get columns() {
    const _ctrl = this.ctrl as any;
    const cols =
      _ctrl.options && _ctrl.options.mappings
        ? Object.keys(_ctrl.options.mappings)
        : [];
    return [...cols, this.getDisplayField]; // 关联表单 显示字段属性
  }

  get showLink() {
    return this.controlOpts.linkMode &&
      this.controlOpts.linkMode.toString() === 'true'
      ? true
      : false;
  }

  async getDataModal() {
    let dataModal: any = '';
    if (!this.control.parentKey) {
      const ls = await this.getRelativeDataList();
      dataModal = ls.find((c: any) => c.code === this.control.key);
    } else {
      findDataModal: for (const d of await this.getRelativeDataList()) {
        if ((d as any).code === this.control.parentKey) {
          for (const d_sub of (d as any).subSchema.properties) {
            if (d_sub.code === this.control.key) {
              dataModal = d_sub;
              break findDataModal;
            }
          }
        }
      }
    }
    return dataModal;
  }

  // 返回 显示字段
  async getRelativePropertyCode() {
    const dataModal = await this.getDataModal();
    const field =
      dataModal && dataModal.relativePropertyCode
        ? dataModal.relativePropertyCode
        : this.control.options.displayField || 'name';
    return field;
  }

  get getDisplayField() {
    return (
      this.control.options.displayField ||
      this.control.options.relativePropertyCode ||
      'name'
    );
  }

  get formTitle() {
    let title = '';
    if (this.formTitleObj) {
      if (this.locale !== 'zh') {
        const name_i18n = this.formTitleObj.name_i18n;
        if (name_i18n) {
          const map =
            typeof name_i18n === 'string' ? JSON.parse(name_i18n) : name_i18n;
          if (map[this.locale]) {
            title = map[this.locale];
          }
        }
      }
      if (!title) {
        title = this.formTitleObj.name;
      }
    } else {
      title = this.locale === 'zh' ? '关联表单' : 'Relevance Form';
    }

    return title;
  }

  // 查看模式下 显示值
  get lookUpModalValue() {
    const field: any = this.ctrl.value.displayCode || this.getDisplayField;
    // console.log('start....value.....');
    // console.log(field);
    // console.log(this.ctrl);
    // console.log(this.ctrl.value);
    // console.log(this.ctrl.value[field]);
    // console.log(this.ctrl.value['id'][field]);
    
    // console.log(this.parseDisplayFieldValue(this.ctrl.value[field], field));
    // console.log('end....value.....');
    if(this.parseDisplayFieldValue(this.ctrl.value[field], field) && this.parseDisplayFieldValue(this.ctrl.value[field], field) !== '空'){
      return this.parseDisplayFieldValue(this.ctrl.value[field], field);
    }
    return this.ctrl.value['id'][field];
  }

  /**
   * 获取短码对应的原码
   * @param shortCode 短码
   */
  async getCodeResource(shortCode) {
    return formApi.getCodeResource({ shortCode });
  }

  fetch(
    page: number,
    pageSize: number,
    value: string,
    queryData: any[] = [],
    mobile?: boolean,
    view?: any, //传入一个对象
  ) {
    const schemaCode = this.controlOpts.schemaCode || '';
    const queryCode = this.controlOpts.queryCode || '';
    //若queryData为否则使用getParams中的返回值，反之则使用空数组
    const params: any[] = [];
    //只有非树形才有数据限定范围和查询条件,params 第一个为数据限定范围，第二个为查询条件,下一层为并且的或条件，在下一层为并列的且条件
    if (this.controlOpts.showStyle !== 'tree') {
      params[0] = this.searchFormula;
      params[1] = queryData.length
        ? queryData[0]
        : this.getParams(mobile).length
        ? [this.getParams(mobile)]
        : [
            [
              {
                propertyCode: 'sequenceStatus',
                propertyType: 0,
                propertyValue: 'DRAFT',
                queryFilterType: 'NotEq',
              },
            ],
          ]; //目前查询条件只有且条件，因此查询条件外套一层数组
      params[1].forEach((item) => {
        const field = item.find((i) => i.propertyCode === 'sequenceStatus');
        if (!field || !field.propertyValue) {
          item.push({
            propertyCode: 'sequenceStatus',
            propertyType: 0,
            propertyValue: 'DRAFT',
            queryFilterType: 'NotEq',
          });
        }
      });
    } else {
      params[0] = queryData[0] || [];
      params[1] = queryData[1]?.length ? [queryData[1]] : [];
    }
    console.log(params, 'params===>');
    const _ctrl = this.ctrl as any;
    const cols = this.columns;

    return RelevanceFormControl.service.search(
      schemaCode,
      queryCode,
      params,
      cols,
      page,
      pageSize,
      queryData,
      view,
    );
  }

  get searchFormula() {
    // @ts-ignore
    const _searchFormula = this.controlOpts && this.controlOpts.searchFormula;
    const searForm = _searchFormula && JSON.parse(_searchFormula);
    if (_searchFormula && Array.isArray(searForm)) {
      const result: any[] = [];
      searForm.forEach((item: any) => {
        result.push(item.conditions);
      });
      //每组查询条件的value改成propertyValue，
      result.forEach((item) => {
        item.forEach((el) => {
          el.propertyValue =
            typeof el.value === 'string' ? el.value : JSON.stringify(el.value);
          delete el.value;
          if (el.valueType) {
            if (el.valueType === 'DYNAMIC') {
              if (el.currentPropertyCode.indexOf('.') !== -1) {
                let arrSheet = el.currentPropertyCode.split('.');
                if (
                  (window as any).h3form[arrSheet[0]] &&
                  (window as any).h3form[arrSheet[0]].value
                ) {
                  let arrItem: any = (window as any).h3form[arrSheet[0]].value;
                  const rowIndex: number =
                    // @ts-ignore
                    this.control.controller.options.rowIndex || 0;
                  let itemValue = arrItem[rowIndex];
                  el.propertyValue = formatVal(
                    el.propertyType,
                    itemValue[arrSheet[1]],
                    el.propertyCode,
                    el.operatorType,
                  );
                }
              } else {
                if ((window as any).h3form[el.currentPropertyCode]) {
                  el.propertyValue = formatVal(
                    el.propertyType,
                    (window as any).h3form[el.currentPropertyCode].value,
                    el.propertyCode,
                    el.operatorType,
                  );
                } else {
                  const obj = this.formObjSource();
                  if (
                    obj &&
                    obj.bizObject &&
                    obj.bizObject[el.currentPropertyCode]
                  ) {
                    el.propertyValue = this.systemTransform(
                      el.propertyType,
                      obj.bizObject[el.currentPropertyCode],
                      el.propertyCode,
                      el.operatorType,
                      el,
                    );
                  }
                }
              }
              if (el.propertyType === 3) {
                if ([17, 18].includes(el.operatorType)) {
                  el.propertyValue = this.setDateByDateType(
                    el.propertyValue,
                    'YYYY-MM-DD',
                  );
                }
                el.propertyValue = formatVal(
                  el.propertyType,
                  el.propertyValue,
                  el.propertyCode,
                  el.operatorType,
                );
              }
            } else {
              el.propertyValue = this.formulaValueTransform(
                el.propertyType,
                el.propertyValue,
                el.propertyCode,
                el.operatorType,
              );
            }
          }
          delete el.currentPropertyCode;
          delete el.valueType;
          delete el.valueTypeShow;
        });
      });
      return result;
    } else {
      return _searchFormula ? searForm.conditions : []; //兼容历史数据
    }
  }

  formulaValueTransform(propertyType, value, propertyCode, filterType) {
    let res: any = value;
    switch (propertyType) {
      case DataItemType.Date:
      case DataItemType.Number:
        if ([17, 18].includes(filterType)) {
          if (typeof res === 'string') {
            res = JSON.parse(res);
          }
        }
        break;
      case DataItemType.StaffSingle:
      case DataItemType.StaffMulti:
      case DataItemType.DeptSingle:
      case DataItemType.DeptMulti:
      case DataItemType.StaffDeptMix:
      case DataItemType.Address:
        if (typeof res === 'string') {
          res = JSON.parse(res);
        }
        break;
      default:
        break;
    }
    res = formatVal(propertyType, res, propertyCode, filterType);
    return res;
  }

  systemTransform(propertyType, value, propertyCode, filterType, obj) {
    let res: any = value;
    switch (propertyType) {
      case DataItemType.StaffSingle:
      case DataItemType.StaffMulti:
      case DataItemType.DeptSingle:
      case DataItemType.DeptMulti:
      case DataItemType.StaffDeptMix:
        if (
          (obj.currentPropertyCode === 'createdDeptId' ||
            obj.currentPropertyCode === 'ownerDeptId') &&
          !res.id
        ) {
          res = '';
        } else {
          res = [res];
        }
        break;
      default:
        break;
    }
    res = formatVal(propertyType, res, propertyCode, filterType);
    return res;
  }

  async convertForMappings(value: any) {
    const _ctrl = this.ctrl as any;
    if (
      !_ctrl.options ||
      !_ctrl.options.mappings ||
      !this.controlOpts.schemaCode
    ) {
      return value;
    }
    const dataitems = await RelevanceFormControl.service.dataitemsOf(
      this.controlOpts.schemaCode,
    );
    for (const a in value) {
      if (value.hasOwnProperty(a)) {
        if (value[a] && value[a]._isAMomentObject) {
          value[a] = value[a].format(value[a]._f);
        }
        if (
          value[a] &&
          Object.prototype.toString.call(value[a]) === '[object Date]'
        ) {
          value[a] = moment(value[a]).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }

    const item = JSON.parse(JSON.stringify(value));
    const formControls = this.getFormControls();
    for (const key in _ctrl.options.mappings) {
      if (_ctrl.options.mappings.hasOwnProperty(key)) {
        const target = _ctrl.options.mappings[key];
        let targetKey = Array.isArray(target) ? target[0] : target;
        this.emptyCtrl(targetKey);
        const idx = targetKey.indexOf('.');
        let control;
        if (idx === -1) {
          control = formControls.find((c) => c.key === targetKey);
        } else {
          const parentKey = targetKey.substring(0, idx);
          targetKey = targetKey.substr(idx + 1);
          const parent = formControls.find(
            (c) => c.key === parentKey,
          ) as any as typings.FormSheet;
          if (!parent || !parent.columns) {
            continue;
          }
          control = parent.columns.find((c) => c.key === targetKey);
        }
        if (!control) {
          continue;
        }

        // const targetItemType = ControlHelper.mapToDataItemType(control.type);
        const targetItem = this.getDataItem(control.key, control.parentKey);
        const dataitem = dataitems.find(
          (d: typings.DataItemLike) => d.code === key,
        );

        //子表
        if (control.type === typings.FormControlType.Sheet) {
          // 旧数据需要标记删除，提交时要给后台删除数据库中的数据
          let oldValue: any[] = [];
          if (control.value) {
            oldValue = control.value.filter((val) => {
              val.rowStatus = 'Deleted';
              return val.id;
            });
          }
          control.controller.removeList = oldValue;

          let rows: any[] = [];
          if (Array.isArray(item)) {
            // 关联表单多选， 子表取选中项子表的并集
            item.forEach((x: any) => {
              if (x[key]) {
                rows = rows.concat(x[key]);
              }
            });
          } else {
            item[key] = item[key] ? item[key] : [];
            rows = item[key];
          }
          const columns = (control as any as typings.FormSheet).columns;
          if (Array.isArray(rows) && rows.length > 0 && columns.length > 0) {
            const subSchema = (dataitem as typings.SheetDataItemLike).subSchema;

            for (const col of columns) {
              const subItem = subSchema
                ? subSchema.properties.find((p) => p.code === col.key)
                : null;

              const match =
                subItem &&
                subItem.propertyType ===
                  ControlHelper.mapToDataItemType(col.type);
              for (const row of rows) {
                delete row.id;

                if (row[col.key] !== undefined) {
                  if (match) {
                    if (key === 'sequenceStatus') {
                      if (
                        item[key] &&
                        !(this.$i18n.locale && this.$i18n.locale === 'en')
                      ) {
                        const text = form.sequenceStatusZh[item[key]];
                        if (text) {
                          item[key] = text;
                        }
                      }
                    } else {
                      // if (col.type === typings.FormControlType.RelevanceForm && col.options.mappings) {

                      // }
                      /**
                       * 子表支持附件映射，需要根据refId获取图片信息
                       */
                      if (
                        col.type === typings.FormControlType.Image ||
                        col.type === typings.FormControlType.Attachment
                      ) {
                        row[col.key] = this.convertFileData(row[col.key]);
                      } else {
                        row[col.key] = FormControlValueService.convert(
                          col.type,
                          row[col.key],
                          col.options.multi,
                        );
                      }
                    }
                  } else {
                    row[col.key] = FormControlValueService.defaultValueOf(
                      col.type,
                    );
                  }
                }
              }
            }
          }
          // 关联表单多选 子表合并特殊处理， 后续待优化
          if (Array.isArray(item)) {
            item.forEach((x) => {
              x[key] = rows;
            });
          }
        } else if (
          control.type === typings.FormControlType.Attachment ||
          control.type === typings.FormControlType.Image
        ) {
          item[key] = this.convertFileData(item[key]);
        } else {
          if (key === 'sequenceStatus') {
            if (
              item[key] &&
              !(this.$i18n.locale && this.$i18n.locale === 'en')
            ) {
              const text = form.sequenceStatusZh[item[key]];
              if (text) {
                item[key] = text;
              }
            }
          } else {
            item[key] = FormControlValueService.convert(
              control.type,
              item[key],
              control.options.multi,
            );
          }
        }
      }
    }
    if (Array.isArray(item)) {
      item.forEach((x) => {
        x.$format = true;
      });
    } else {
      item.$format = true;
    }
    return item;
  }

  getParams(isMobile?: boolean) {
    let conditions = this.controlOpts.conditions;
    try {
      conditions = conditions
        ? JSON.parse(this.controlOpts.conditions).queryText
        : '';
      if (conditions) {
        this.queryConditions = JSON.parse(
          this.controlOpts.conditions,
        ).$queryData;
      }
    } catch (error) {
      console.log(error);
    }
    if (!conditions) {
      return [];
    }

    const formControls = this.getFormControls();

    const params = conditions
      .split(';')
      .map((arr) => {
        const [f1, ...f0] = arr.split(':');
        let f2 = f0.join(':');
        if (!f2) {
          return null;
        }

        if (f2[0] === '{') {
          f2 = f2.substr(1, f2.length - 2);

          let ctrl: any;
          let control: typings.RendererFormControl | undefined;

          const idx = f2.indexOf('.');
          if (idx > -1) {
            const sheetKey = f2.substring(0, idx);
            const controlKey = f2.substr(idx + 1);

            const sheet = formControls.find(
              (c) => c.key === sheetKey,
            ) as any as typings.FormSheet;
            if (sheet) {
              control = sheet.columns.find((c) => c.key === controlKey) as any;
            }

            const sheetCtrl = this.findController(
              f2.substring(0, idx),
            ) as FormSheet;
            if (
              sheetCtrl &&
              this.ctrl.options &&
              typeof this.ctrl.options.rowIndex === 'number'
            ) {
              const row = sheetCtrl.rows[this.ctrl.options.rowIndex];
              ctrl = row.findChild(f2.substr(idx + 1));
            }
          } else {
            ctrl = this.findController(f2);
            control = formControls.find((c) => c.key === f2);
          }

          if (!ctrl || !control) {
            return null;
          }

          const type = ControlHelper.mapToDataItemType(control.type);
          const theCondition1 = this.queryConditions.find(
            (res) => res.propertyCode === f1,
          );
          let OpT: any = undefined;
          if (theCondition1 && theCondition1.op) {
            switch (theCondition1.op) {
              case 'NotEq':
                OpT = 2;
                break;
              case 'IS_NULL':
                OpT = 9;
                ctrl.value = '';
                break;
              case 'IS_NOT_NULL':
                OpT = 10;
                (ctrl.value as any) = null;
                break;
              default:
                break;
            }
          } else {
            OpT = theCondition1 ? theCondition1.filterType : 'Like';
          }
          let _formatVal;
          if (theCondition1) {
            _formatVal = formatVal(
              theCondition1.propertyType,
              ctrl.value,
              theCondition1.propertyCode,
              theCondition1.filterType,
            );
          } else {
            _formatVal = ctrl.value;
          }
          return {
            propertyCode: f1,
            propertyType: type,
            propertyValue: _formatVal,
            queryFilterType: OpT,
          };
        } else {
          const type: any = {};
          const theCondition = this.queryConditions.find(
            (res) => res.propertyCode === f1,
          );
          if (theCondition) {
            type.type = theCondition.propertyType;
          }
          let OpT: any = (theCondition && theCondition.op) || 'Eq';
          // if (theCondition && theCondition.op) {
          //   switch (theCondition.op) {
          //     case 'NotEq':
          //       OpT = 2;
          //       break;
          //     case 'IS_NULL':
          //       OpT = 9;
          //       f2 = '';
          //       break;
          //     case 'IS_NOT_NULL':
          //       OpT = 10;
          //       (f2 as any) = null;
          //       break;
          //     default:
          //       break;
          //   }
          // }
          return {
            propertyCode: f1,
            propertyValue: f2,
            ...type,
            queryFilterType: OpT,
          };
        }
      })
      .filter((x) => x !== null);
    params.forEach((el) => {
      if (this.isMobileRelevanceEntrance) {
        if (
          [DataItemType.Checkbox, DataItemType.DropdownMulti].includes(
            el.propertyType,
          )
        ) {
          el.propertyValue = el.propertyValue.join(';');
        }
      }
    });

    return params as RelevanceFormSearchParams[];
  }

  getConfig(isMobile?: boolean) {
    if (!RelevanceFormControl.service.getListQueryConditions) {
      return Promise.reject(new Error());
    }
    let queryCode = '';
    queryCode = this.controlOpts.queryCode || '';
    // if (isMobile) {
    //     queryCode = ''
    // } else {
    //     queryCode = this.controlOpts.queryCode || '';
    // }

    const schemaCode = this.controlOpts.schemaCode || '';
    // const
    const params: any = [];

    return RelevanceFormControl.service.getListQueryConditions(
      schemaCode,
      queryCode,
      params,
    );
  }

  open(paramsId?: any) {
    if (
      !this.ctrl.value ||
      !this.ctrl.value.id ||
      !RelevanceFormControl.service
    ) {
      return;
    }
    const sheetParams: any = (this.controlOpts as any).sheetParams;
    const schemaCode =
      this.controlOpts.schemaCode ||
      (this.ctrl.value && this.ctrl.value.schemaCode) ||
      '';
    const queryCode = this.controlOpts.queryCode || '';
    const sheetId = sheetParams.sheetid;
    const id = sheetParams.id;
    // 临时授权 可选、可读都能查看
    const isAuthorize = this.controlOpts.isAuthorize !== false;
    RelevanceFormControl.service.open(
      schemaCode,
      queryCode,
      id,
      sheetId,
      isAuthorize,
      this.id,
      paramsId ? { id: paramsId } : this.ctrl.value,
    );
  }

  async getListQueryConditions(isMobile?: boolean) {
    if (!RelevanceFormControl.service.getListQueryConditions) {
      return Promise.reject(new Error());
    }
    let queryCode = '';
    queryCode = this.controlOpts.queryCode || '';
    // if (isMobile) {
    //     queryCode = ''
    // } else {
    //     queryCode = this.controlOpts.queryCode || '';
    // }

    const schemaCode = this.controlOpts.schemaCode || '';
    // const
    const params = this.getParams(isMobile);
    console.log('params===>', params);

    const res: any = await RelevanceFormControl.service.getListQueryConditions(
      schemaCode,
      queryCode,
      params,
    );
    console.log(res);
    console.log(1, this.control);
    try {
      // 如果配置了查询条件，使用配置的，如果没有就使用关联目标视图中配置的查询条件
      const conditions = JSON.parse(this.control.options.conditions);
      // res.conditions = conditions.$queryData;
      // res.conditions.forEach((el: any) => {
      //   params.forEach((param: any) => {
      //     if (param.code === el.propertyCode) {
      //       el.defaultValue = param.value;
      //     }
      //   });
      // });
      res.conditions = queryData2Conditions(
        conditions,
        this.getFormControls(),
        this.formObjSource(),
        this.getParams(isMobile),
      );
      res.conditions = conditions2fields(res.conditions || [], this);
      res.conditions.forEach((el) => {
        if (this.isMobileRelevanceEntrance) {
          if (
            [DataItemType.Checkbox, DataItemType.DropdownMulti].includes(
              el.propertyType,
            )
          ) {
            el.defaultValue = el.defaultValue.join(';');
          }
        }
      });
    } catch (error) {}
    return res;
  }

  listenCommand() {
    this.commandSubscription =
      this.ctrl.commander &&
      this.ctrl.commander.subscribe((cmd: ControlCommand) => {
        switch (cmd.name) {
          case 'init':
            //#46646 只有新增时触发
            const isNew = (window as any).h3form
              ? !!(window as any).h3form.isNew
              : true;
            if (isNew && this.isInit) {
              const schemaCode = this.controlOpts.schemaCode || '';
              const queryCode = this.controlOpts.queryCode || '';
              if (!this.controlOpts.defaultVal || !schemaCode || !queryCode) {
                return;
              }

              if (this.controlOpts.defaultVal[0] === '[') {
                this.controlOpts.defaultVal = convertDataItemExp(
                  this.controlOpts.defaultVal,
                );
              }

              this.setDefaultValue(schemaCode, queryCode, cmd.args).then(
                (results) => {
                  for (const result of results) {
                    const sub = result.controller.valueChange.subscribe(() => {
                      clearTimeout(this.setDefaultValTimer);
                      this.setDefaultValTimer = setTimeout(
                        () =>
                          this.setDefaultValue(schemaCode, queryCode, cmd.args),
                        1000,
                      );
                    });
                    if (!this.setDefaultValSub) {
                      this.setDefaultValSub = sub;
                    } else {
                      this.setDefaultValSub.add(sub);
                    }
                  }
                },
              );
            }
            break;
          default:
            break;
        }
      });
  }

  async setDefaultValue(
    schemaCode: string,
    queryCode: string,
    index: number = 0,
  ) {
    const controls = this.getFormControls();
    const conds = super.parseConditions(controls, this.controlOpts.defaultVal);
    const filters = conds
      .filter((cond) => cond.controller)
      .map((cond) => {
        const ctrl = cond.controller;
        const type = cond.propertyType;
        let val: any = ctrl.value;

        if (val !== null) {
          switch (type) {
            case DataItemType.RelevanceForm:
              val = ctrl.value.id || '';
              break;
            case DataItemType.StaffSingle:
            case DataItemType.StaffMulti:
            case DataItemType.StaffDeptMix:
            case DataItemType.DeptMulti:
            case DataItemType.DeptSingle:
              val = ctrl.value.map((v: any) => ({
                id: v.id,
                type: v.unitType || v.type,
              }));
              val = JSON.stringify(val);
              break;
            case DataItemType.Number:
              if (Array.isArray(ctrl.value)) {
                val = ctrl.value.map((v: any) => v.toString()).join(';');
              } else {
                val = ctrl.value;
              }
              break;
            default:
              if (Array.isArray(ctrl.value)) {
                val = ctrl.value.map((v: any) => v.toString()).join(';');
              } else {
                val = ctrl.value;
              }
              break;
          }
        }

        let op = '';
        switch (cond.operatorType) {
          case DateItemOperatorType.Equal:
            op = 'Eq';
            break;
          case DateItemOperatorType.NotEqual:
            op = 'NotEq';
            break;
          case DateItemOperatorType.Contains:
            op = 'Like';
            break;
          case DateItemOperatorType.NotContains:
            op = 'NotLike';
            break;
          case DateItemOperatorType.GreaterThan:
            op = 'Gt';
            break;
          case DateItemOperatorType.LessThan:
            op = 'Lt';
            break;
          case DateItemOperatorType.IsNull:
            op = 'IS_NULL';
            break;
          case DateItemOperatorType.IsNotNull:
            op = 'IS_NOT_NULL';
            break;
          default:
            break;
        }

        return {
          op,
          propertyCode: cond.code,
          propertyType: type,
          propertyValue: val,
        };
      });

    const _ctrl = this.ctrl as any;
    const cols =
      _ctrl.options && _ctrl.options.mappings
        ? Object.keys(_ctrl.options.mappings).concat(
            this.control.options.displayField,
          )
        : [];
    if (RelevanceFormControl.service.queryDefaultValue) {
      const res = await RelevanceFormControl.service.queryDefaultValue(
        schemaCode,
        queryCode,
        cols,
        filters,
      );

      if (res.data.length > 0) {
        let item: any = {};
        if (_ctrl.inSheet) {
          const subSchemaCode = this.control.options.sheetParams.subSchemaCode;

          // 子表有关联表单筛选时走这
          if (sessionStorage.getItem('sheet-' + subSchemaCode)) {
            const Ctrl = this.findController(subSchemaCode);
            // eslint-disable-next-line no-proto
            const sheet = Object.create(Ctrl).__proto__;
            const arr: any = {};
            const mappings = _ctrl.options.mappings;
            for (const s in mappings) {
              if (
                Object.keys(sheet.value[index]).indexOf(
                  mappings[s].split('.')[1],
                ) > -1
              ) {
                arr[s] = sheet.value[index][mappings[s].split('.')[1]];
              }
            }
            item = await this.convertForMappings(arr);
          } else {
            item = res.data[index]
              ? res.data[index]
              : res.data[0]
              ? await this.convertForMappings(
                  res.data[index] ? res.data[index] : res.data[0],
                )
              : {};
          }
        } else {
          item = await this.convertForMappings(res.data[0]);
        }
        // 关联表单 显示它默认字段.
        if (
          this.control.options.displayField !== 'name' &&
          !~Object.keys(item).indexOf(this.control.options.displayField)
        ) {
          item[this.control.options.displayField] = item.name;
        }
        Object.keys(item).length ? this.setValue(item) : this.setValue(null);
      } else {
        this.setValue(null);
      }
      this.isInit = false;
    }
    return conds;
  }

  setControl() {
    this.listenCommand();
  }

  handleValueChange() {
    this.setLinkageValue();
  }

  get isScan() {
    return (
      (this.controlOpts as any).isScan &&
      (this.controlOpts as any).isScan === true
    );
  }

  setDateByDateType(type: any, format: string) {
    let start: string = '';
    let end: string = '';
    let date: Array<string> = [];
    if (typeof type === 'string') {
      type = Number(type);
    }
    switch (type) {
      /* 当天 */
      case 9:
        start = dateFormatter(moment().startOf('days').toString(), format);
        end = dateFormatter(moment().endOf('days').toString(), format);
        break;
      /* 最近一周 */
      case 1:
        start = dateFormatter(
          moment(GetDateHandle.getLatelyWeek()).startOf('days').toString(),
          format,
        );
        end = dateFormatter(moment().endOf('days').toString(), format);
        break;
      /* 最近一月 */
      case 2:
        start = dateFormatter(
          moment(GetDateHandle.getLatelyMonth()).startOf('days').toString(),
          format,
        );
        end = dateFormatter(moment().endOf('days').toString(), format);
        break;
      /* 最近一季度 */
      case 3:
        start = dateFormatter(
          moment(GetDateHandle.getLatelyQuarter()).startOf('days').toString(),
          format,
        );
        end = dateFormatter(moment().endOf('days').toString(), format);
        break;
      /* 最近一年 */
      case 4:
        start = dateFormatter(
          moment(GetDateHandle.getLatelyYear()).startOf('days').toString(),
          format,
        );
        end = dateFormatter(moment().endOf('days').toString(), format);
        break;
      /* 本周 */
      case 5:
        date = GetDateHandle.getThisWeek();
        start = date[0];
        end = dateFormatter(moment().endOf('week').toString(), format);
        break;
      /* 本月 */
      case 6:
        date = GetDateHandle.getThisMonth();
        start = date[0];
        end = dateFormatter(moment().endOf('month').toString(), format);
        break;
      /* 本季度 */
      case 7:
        date = GetDateHandle.getThisQuarter();
        start = date[0];
        end = dateFormatter(moment().endOf('quarter').toString(), format);
        break;
      /* 本年 */
      case 8:
        date = GetDateHandle.getThisYear();
        start = date[0];
        end = dateFormatter(moment().endOf('year').toString(), format);
        break;
      /* 默认值 */
      default:
        break;
    }
    return [start, end];
  }

  /**
   * 执行关联单选映射
   * 当关联单选1映射出关联单选2，再由关联单选2映射出其他的值是会进行触发
   * @returns
   */
  async setLinkageValue() {
    const _ctrl = this.ctrl as any;
    const field = this.getDisplayField;
    if (_ctrl.value && _ctrl.value.id) {
      const keyGroup: any = [];
      if (_ctrl.options.mappings) {
        const mappings = _ctrl.options.mappings;
        for (const key in mappings) {
          if (mappings.hasOwnProperty(key)) {
            keyGroup.push(key);
          }
        }
      }
      const d = keyGroup.filter((key: any) => {
        if (!(key in _ctrl.value)) {
          return true;
        } else if (_ctrl.value[key] === undefined) {
          return true;
        } else {
          //Else Empty block statement
        }
        return false;
      });

      const options = this.control.options;
      if (
        !_ctrl.value.$format &&
        (d.length ||
          !(field in _ctrl.value) ||
          _ctrl.value[field] === undefined)
      ) {
        let value: any = null;
        const dataitems = await RelevanceFormControl.service.dataitemsOf(
          options.schemaCode,
        );

        const { data, errcode, errmsg } = await formApi.load({
          sheetCode: options.queryCode,
          schemaCode: options.schemaCode,
          objectId: _ctrl.value.id,
        });
        if (errcode !== 0) {
          (this as any).$message.error(errmsg);
          return;
        } else {
          if (data && data.bizObject && data.bizObject.data) {
            if (
              this.control.type === 81 &&
              typeof this.ctrl.value === 'object'
            ) {
              const val = Object.assign({}, this.ctrl.value);
              this.interceptorValue(val);
              this.setValue(val);
            } else {
              value = data.bizObject.data;
              _ctrl.value = value;
              const formControls = this.getFormControls();
              const item = await ReverseQueryService.convertForMappings(
                value,
                dataitems,
                _ctrl.options.mappings,
                formControls,
              );
              this.interceptorValue(item);
              this.setValue(item);
            }
          }
        }
      } else {
        if (!_ctrl.value.$format) _ctrl.value.$format = false;
      }
    }
  }

  /**
   * 每次赋值前将要赋值的控件值设置为空
   * */
  emptyCtrl(key: string) {
    const formCtrl = this.getFormControls().find((ctrl) => ctrl.key === key);
    // 判断是否为子表
    if (formCtrl && formCtrl.type === typings.FormControlType.Sheet) {
      const sheetChild = (formCtrl.controller as any).children || [];
      sheetChild &&
        Array.isArray(sheetChild) &&
        sheetChild.map((child: any) => {
          const childCtrl = child.children;
          typeof childCtrl === 'object' &&
            Object.keys(childCtrl).map((key: string) => {
              childCtrl[key].value = key !== 'id' ? null : childCtrl[key];
            });
        });
    }
  }

  /**
   * 子表映射，需要清空内容为空的行
   */
  sheetRemoveEnpty(item: any) {
    // const formCtrl = this.getFormControls();
    // const sheet = formCtrl.filter((ctrl: RendererFormControl) => ctrl.type = FormControlType.Sheet) || [];
  }

  /**
   * 迭代35子表映射支持附件；附件映射图片不用做映射
   */
  interceptorValue(value: any) {
    if (this.ctrl && this.ctrl.options) {
      const mappings = (this.ctrl.options as any).mappings || undefined;
      if (mappings) {
        Object.keys(mappings).forEach((key: string) => {
          if (Array.isArray(mappings[key])) {
            if (Array.isArray(value)) {
              value.forEach((row, i) => {
                mappings[key].map((k: string) => {
                  this.isFileToImage(k, key, row);
                });
              });
            } else {
              mappings[key].map((k: string) => {
                this.isFileToImage(k, key, value);
              });
            }
          } else {
            if (Array.isArray(value)) {
              value.forEach((row, i) => {
                this.isFileToImage(mappings[key], key, row);
              });
            } else {
              this.isFileToImage(mappings[key], key, value);
            }
          }
        });
      }
    }
  }

  isFileToImage(key: string, relevanceKey: string, value: any) {
    let relevanceCtrl: boolean = false; // 关联的表单控件是否为图片
    const FormControlsList = this.getFormControls();
    let showCtrl: RendererFormControl | undefined;
    //判断当前控件是否子表
    if (key.indexOf('.') > -1) {
      const parentKey = key.split('.')[0];
      const childKey = key.split('.')[1];
      const parentCtrl = FormControlsList.find(
        (ctrl: RendererFormControl) => ctrl.key === parentKey,
      );
      // @ts-ignore
      if (parentCtrl && parentCtrl.columns) {
        // @ts-ignore
        showCtrl = parentCtrl.columns.find(
          (ctrl: RendererFormControl) => ctrl.key === childKey,
        );
      }
    } else {
      showCtrl = FormControlsList.find(
        (ctrl: RendererFormControl) => ctrl.key === key,
      );
    }
    if (showCtrl && showCtrl.type === FormControlType.Image) {
      // 判断映射过来的数据项是否为非图片类型的附件
      if (value && value[relevanceKey]) {
        value[relevanceKey].map((val: any, index: number) => {
          if (val.response && val.response.data) {
            relevanceCtrl = this.isImageByName(val.response.data);
          }
          // !relevanceCtrl ? value[relevanceKey][index] = null : value;

          !relevanceCtrl
            ? ((showCtrl as any).isFileTOImg = true)
            : ((showCtrl as any).isFileTOImg = false);
        });
      }
    }

    // 子表处理
    else if (showCtrl && showCtrl.type === FormControlType.Sheet) {
      const column = (showCtrl as any).columns;
      if (Array.isArray(column)) {
        column.forEach((colu: any) => {
          if (colu.type === FormControlType.Image) {
            // 判断子表每一个cell映射过来的是否为图片
            const sheetValue = value[relevanceKey];
            sheetValue &&
              sheetValue.map((val: any, index: number) => {
                if (
                  val[colu.key] &&
                  val[colu.key][0] &&
                  val[colu.key][0].response
                ) {
                  relevanceCtrl = this.isImageByName(
                    val[colu.key][0].response.data,
                  );
                }
                if (!relevanceCtrl) {
                  sheetValue[index][colu.key] = [];
                }
              });
          }
        });
      }
      //#84469 20221014-主表关联单选映射子表数据后，没有触发子表的关联单选控件的映射配置-6.10
      if ((showCtrl as any).controller) {
        setTimeout(() => {
          this.setRelevanceLinkageValue(showCtrl);
        }, 1000);
      }
    } else {
      //Else Empty block statement
    }
  }

  async setRelevanceLinkageValue(control: any) {
    const ctrl: any = control.controller;
    ctrl._cells.forEach((cell: any, rowIdx: number) => {
      cell.forEach((item: any) => {
        const control = item.control;
        if (
          control.value &&
          control.value.id &&
          control.value.schemaCode &&
          control.options &&
          control.options.mappings &&
          Object.keys(control.options.mappings).some(
            (key) => control.value[key] === undefined,
          )
        ) {
          formApi
            .load({
              schemaCode: control.value.schemaCode,
              objectId: control.value.id,
            })
            .then(({ data, errcode, errmsg }) => {
              if (
                data &&
                data.bizObject &&
                data.bizObject.data &&
                data.bizObject.data.id === control.value.id
              ) {
                let datas = data.bizObject.data;
                datas.$format = false;
                control.value = datas;
              }
            });
        }
      });
    });
  }

  // 根据文件名判断文件是否为图片
  isImageByName(value: any) {
    const image_types = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tif'];
    const mimeType = value.mimeType.split('/')[1] || '';
    return image_types.includes(mimeType);
  }

  unsubscribe() {
    if (this.commandSubscription) {
      this.commandSubscription.unsubscribe();
    }

    if (this.setDefaultValSub) {
      this.setDefaultValSub.unsubscribe();
    }
  }

  destroyed() {
    super.destroyed();

    this.unsubscribe();

    if (this.setDefaultValTimer !== undefined) {
      clearTimeout(this.setDefaultValTimer);
    }
  }

  /**
   * @Author: Fan
   * @Description: 显示字段 控件值解析
   * @URL:http://redmine.h3bpm.com/issues/31131
   * @param {type}
   * @return:
   * @Date: 2019-12-24 10:38:05
   */
  parseDisplayFieldValue(val: any, field: string) {
    if (val === null) {
      return '空';
    }

    if (val === '') {
      return '空';
    }
    if (typeof val === 'object') {
      try {
        if (val instanceof Date) {
          return common.utils.DateHandle.dateFormat(val, 'YYYY-MM-DD HH:mm:ss');
        } else if (moment.isMoment(val)) {
          return val.format('HH:mm:ss');
        } else if (Array.isArray(val)) {
          if (val.length === 1) {
            if (typeof val[0] === 'object') {
              return val[0].name;
            } else {
              return val[0];
            }
          } else {
            return val
              .reduce((c, item) => `${c}、${item.name ? item.name : item}`, '')
              .slice(1);
          }
        } else if (
          val &&
          (val.hasOwnProperty('adress') ||
            val.hasOwnProperty('provinceName') ||
            val.hasOwnProperty('cityName') ||
            val.hasOwnProperty('districtName'))
        ) {
          return `${val.provinceName || ''}${val.cityName || ''}${
            val.districtName || ''
          }${val.address || ''}`;
        } else {
          return val;
        }
      } catch (e) {
        return val;
      }
    } else {
      try {
        let a = JSON.parse(val);
        if (typeof a === 'object') {
          return `${a.provinceName || ''}${a.cityName || ''}${
            a.districtName || ''
          }${a.address || ''}`;
        } else {
          if (field === 'sequenceStatus') {
            switch (a) {
              case 'DRAFT':
                a = '草稿';
                break;
              case 'PROCESSING':
                a = '进行中';
                break;
              case 'COMPLETED':
                a = '已完成';
                break;
              case 'CANCELED':
                a = '已作废';
                break;
              default:
                break;
            }
            return a;
          }
          if (a === true) {
            return '是';
          } else if (a === false) {
            return '否';
          } else {
            //Else Empty block statement
          }
          if (field === 'createdTime') {
            if (!val) {
              return '';
            }
            let theDate = val;
            if (val.indexOf('T') > 0) {
              theDate = val;
            } else {
              theDate = val.replace(/-/g, '/');
            }
            return common.utils.DateHandle.dateFormat(
              new Date(theDate),
              'YYYY-MM-DD HH:mm:ss',
            );
          }
          return val;
        }
      } catch (e) {
        if (field === 'sequenceStatus') {
          switch (val) {
            case 'DRAFT':
              val = '草稿';
              break;
            case 'PROCESSING':
              val = '进行中';
              break;
            case 'COMPLETED':
              val = '已完成';
              break;
            case 'CANCELED':
              val = '已作废';
              break;
            default:
              break;
          }
        }
        if (val === true) {
          return '是';
        } else if (val === false) {
          return '否';
        } else {
          //Else Empty block statement
        }
        if (field === 'createdTime') {
          if (!val) {
            return '';
          }
          let theDate = val;
          if (val.indexOf('T') > 0) {
            theDate = val;
          } else {
            theDate = val.replace(/-/g, '/');
          }
          return common.utils.DateHandle.dateFormat(
            new Date(theDate),
            'YYYY-MM-DD HH:mm:ss',
          );
        }
        return val;
      }
    }
  }

  /**
   * 将数据库文件类型转换成file结构
   * @param value
   */
  convertFileData(value: any) {
    let result;
    if (value && Array.isArray(value)) {
      result = value.map((f: any) => ({
        uid: f.refId,
        name: f.name,
        status: UploadStatus.Done,
        size: f.fileSize,
        response: {
          data: f,
        },
      }));
    }
    return result;
  }
}

export interface RelevanceFormSearchParams {
  code: string;
  type: DataItemType;
  value: any;
}

export interface RelevanceFormSearchResult {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Segment<T> {
  total: number;

  data: T[];
}

export interface FormTitle {
  name: string;

  name_i18n: string | null;
}

export interface RelevanceFormService {
  search(
    schemaCode: string,
    queryCode: string,
    params: RelevanceFormSearchParams[],
    columns: string[],
    page?: number,
    pageSize?: number,
    query?: any[],
    view?: any,
  ): Promise<Segment<RelevanceFormSearchResult>>;
  /**
   *
   * @param schemaCode
   * @param queryCode
   * @param id 表单 bizObject id
   * @param sheetId 表单 shestId
   * @param isAuthorize 控件属性 是否临时授权
   * @param code 当前控件 key
   * @param value  控件值
   */
  open(
    schemaCode: string,
    queryCode: string,
    id: string,
    sheetId: string,
    isAuthorize: boolean,
    code: string,
    value: any,
  ): void;

  dataitemsOf(schemaCode: string): Promise<typings.DataItemLike[]>;

  getBizmodelTitle(schemaCode: string): Promise<any | null>;

  getListQueryConditions?(
    schemaCode: string,
    listCode: string,
    params: RelevanceFormSearchParams[],
  ): Promise<any | null>;

  getOptions?(
    schemaCode: string,
    listCode: string,
    params: any,
    sheetDataItem: string,
    orderByFields: string[],
    orderType: number,
    condition?: any,
    currentPage?: number,
  ): Promise<any | []>;

  queryDefaultValue?(
    schemaCode: string,
    queryCode: string,
    columns: string[],
    filters: any[],
  ): Promise<Segment<RelevanceFormSearchResult>>;

  scan(successFn: (data: string) => void, failFn?: Function): void;

  uploadImageFromCamera(
    successFn: (data: string[]) => void,
    failFn?: Function,
  ): void;

  loadForm(params: any): Promise<any | null>;

  externalLinkSheet(id: string, type: string): Promise<any | null>;

  shortCodeConfig(sCode: string): Promise<any>;
}