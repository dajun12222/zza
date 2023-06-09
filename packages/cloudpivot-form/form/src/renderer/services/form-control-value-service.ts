/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { getDataItemTypeByControlType } from '../../../../form/utils';
import moment from 'moment';
import {
  DataItemType,
  DataItemTypeValue,
  DateValueType,
  FormControl,
  FormControlType,
  FormControlTypeExtend,
  FormControlTypeMain,
  RendererFormControl,
} from '../typings';
import { dateFormatter } from '../utils/date-formatter';
import { format } from '../utils/number-formatter';

/**
 * 表单控件值服务
 */
export abstract class FormControlValueService {
  /**
   * 控件默认值
   * @param type
   * @param multi
   */
  static defaultValueOf(
    type: FormControlTypeMain | FormControlTypeExtend,
    multi?: boolean,
  ) {
    if (type === FormControlType.Logic) {
      return true;
    }
    return null;
  }

  static convert(
    type: FormControlTypeMain | FormControlTypeExtend,
    value: any,
    multi?: boolean,
  ) {
    if (value === null || value === undefined) {
      return value;
    }

    if (
      (multi && type === FormControlType.Dropdown) ||
      type === FormControlType.DropdownMulti
    ) {
      type = FormControlType.Checkbox;
    }

    switch (type) {
      case FormControlType.Text:
      case FormControlType.Radio:
      case FormControlType.Dropdown:
        if (typeof value === 'string' && value.length <= 200) {
          return value;
        } else if (typeof value !== 'object') {
          return value.toString();
        } else {
          //Else Empty block statement
        }
        break;

      case FormControlType.SequenceNo:
      case FormControlType.Textarea:
      case FormControlType.Description:
      case FormControlType.Title:
        if (typeof value === 'string') {
          return value;
        }
        break;

      case FormControlType.Number:
        if (value === '') {
          return null;
        }
        return Number(value);

      case FormControlType.Logic:
        return Boolean(value);

      case FormControlType.Date:
      case FormControlType.CreatedTime:
      case FormControlType.ModifiedTime:
        if (value instanceof Date) {
          return value;
        } else if (typeof value === 'string') {
          if (value) {
            try {
              const str = value
                .replace(/-/g, '/') // iOS兼容
                .replace(/T/g, ' '); //修复2019-09-17T06:21:07.000字符不能new Date的问题

              const date = new Date(str);
              if (date.getFullYear() > 0) {
                return date;
              }
            } catch {}
          }
        } else {
          //Else Empty block statement
        }
        break;
      case FormControlType.Time:
        if (value instanceof moment) {
          return value;
        } else if (typeof value === 'string') {
          if (value) {
            return moment(value, 'HH:mm:ss');
          }
        } else {
          //Else Empty block statement
        }
        break;

      case FormControlType.Checkbox:
        if (typeof value === 'string') {
          return value.split(';').filter((x) => !!x);
        } else if (
          Array.isArray(value) &&
          value.some((x) => typeof x === 'string')
        ) {
          return value;
        } else {
          //Else Empty block statement
        }
        break;

      case FormControlType.Location:
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {}
        }
        if (typeof value === 'object') {
          return value;
        }
        break;

      case FormControlType.Image:
      case FormControlType.Attachment:
      case FormControlType.Signature:
      case FormControlType.StaffSelector:
      case FormControlType.StaffMultiSelector:
      case FormControlType.DepartmentSelector:
      case FormControlType.DepartmentMultiSelector:
      case FormControlType.StaffDeptMixed:
      case FormControlType.CreateBy:
      case FormControlType.ModifyBy:
      case FormControlType.OwnerId:
      case FormControlType.OwnerParentId:
      case FormControlType.CreateByParentId:
      case FormControlType.Sheet:
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {}
        }
        if (
          Array.isArray(value) &&
          (value.some((x) => typeof x === 'object') || value.length === 0)
        ) {
          return value;
        }
        break;

      case FormControlType.ApprovalOpinion:
        if (typeof value === 'string') {
          return {
            content: value,
          };
        } else if (
          typeof value === 'object' &&
          typeof value.content === 'string'
        ) {
          return value;
        } else {
          //Else Empty block statement
        }
        break;

      case FormControlType.DateRange:
      case FormControlType.TimeRange:
      case FormControlType.NumberRange:
        if (Array.isArray(value)) {
          return value;
        }
        break;

      case FormControlType.ReverseRelevance:
      case FormControlType.RelevanceForm:
      case FormControlType.RelevanceFormEx:
      case FormControlType.Address:
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {}
        }
        if (typeof value === 'object') {
          return value;
        }
        break;
      default:
        break;
    }
    const dataItem = getDataItemTypeByControlType(type);
    if (dataItem) {
      const valueTypeName: string = DataItemType[dataItem];
      let val: any;
      if (valueTypeName && DataItemTypeValue[valueTypeName]) {
        val = DataItemTypeValue[valueTypeName](value, type);
        if (val) {
          return val;
        }
      }
    }
  }

  static transDefaultValue(
    Datetype: DateValueType,
    control: RendererFormControl,
  ) {
    switch (Datetype) {
      case DateValueType.Current:
        const d = new Date();
        if (!~control.options.format1.indexOf('DD')) {
          return new Date(
            d.getFullYear() + '/' + (d.getMonth() + 1) + '/01 00:00:00',
          );
        } else if (!~control.options.format1.indexOf('HH')) {
          return new Date(
            d.getFullYear() +
              '/' +
              (d.getMonth() + 1) +
              '/' +
              d.getDate() +
              ' 00:00:00',
          );
        } else if (~control.options.format1.indexOf('HH:mm:ss')) {
          return new Date();
        } else if (~control.options.format1.indexOf('HH')) {
          return new Date(
            d.getFullYear() +
              '/' +
              (d.getMonth() + 1) +
              '/' +
              d.getDate() +
              ' ' +
              d.getHours() +
              ':' +
              d.getMinutes() +
              ':00',
          );
        } else {
          //Else Empty block statement
        }
        return new Date();

      case DateValueType.DataItemDefault:
        return control.options.dataItemDefault;
      default:
        break;
    }
    return null;
  }

  static transDefaultTimeValue(
    Datetype: DateValueType,
    control: RendererFormControl,
  ) {
    switch (Datetype) {
      case DateValueType.Current:
        const d = new Date();
        if (~control.options.format1.indexOf('HH:mm:ss')) {
          return moment(d, 'HH:mm:ss');
        } else if (~control.options.format1.indexOf('HH:mm')) {
          return moment(d, 'HH:mm');
        } else {
          //Else Empty block statement
        }
        break;
      case DateValueType.DataItemDefault:
        return control.options.dataItemDefault;
      default:
        break;
    }
    return '';
  }

  static format(control: FormControl, value: any) {
    if (value === undefined || value === null) {
      return '';
    }

    switch (control.type) {
      case FormControlType.CreateBy:
      case FormControlType.ModifyBy:
      case FormControlType.OwnerId:
      case FormControlType.OwnerParentId:
      case FormControlType.CreateByParentId:
      case FormControlType.DepartmentSelector:
      case FormControlType.DepartmentMultiSelector:
      case FormControlType.StaffMultiSelector:
      case FormControlType.StaffSelector:
      case FormControlType.StaffDeptMixed:

      case FormControlType.Attachment:
      case FormControlType.Image:
        if (Array.isArray(value)) {
          return value.map((x: any) => x.name).join(';');
        }

        break;

      case FormControlType.RelevanceForm:
      case FormControlType.RelevanceFormEx:
        if (value.name) {
          return value.name;
        }

        break;

      case FormControlType.CreatedTime:
      case FormControlType.ModifiedTime:
      case FormControlType.Date:
        return dateFormatter(value, control.options.format1);

      case FormControlType.Number:
        return format(control.options.format1, value);

      case FormControlType.Location:
      case FormControlType.Address:
        if (typeof value === 'object') {
          return `${value.provinceName || ''} ${value.cityName || ''} ${
            value.districtName || ''
          } ${value.address || ''}`;
        } else {
          return '';
        }
      default:
        break;
    }

    return value.toString();
  }
}
