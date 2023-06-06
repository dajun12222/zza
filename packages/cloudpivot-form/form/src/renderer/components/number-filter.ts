/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  NumberFormatType,
  NumberOptions,
  RendererFormControl,
} from '../typings';
import * as numberFormatter from '../utils/number-formatter';

export default function (control: RendererFormControl) {
  const val = control.controller ? control.controller.value : control.value;
  if (val === null || val === undefined) {
    return '';
  }
  const ft = (control.options as NumberOptions).format1;
  switch (ft) {
    case NumberFormatType.Int:
      return numberFormatter.int.formatter(val);

    case NumberFormatType.Ratio:
      return numberFormatter.ratio.formatter(val);
    case NumberFormatType.Ratio2:
      return numberFormatter.ratio.formatter(val, {
        precision: 1,
      });
    case NumberFormatType.Ratio3:
      return numberFormatter.ratio.formatter(val, {
        precision: 2,
      });
    case NumberFormatType.Ratio4:
      return numberFormatter.ratio.formatter(val, {
        precision: 3,
      });
    case NumberFormatType.Ratio5:
      return numberFormatter.ratio.formatter(val, {
        precision: 4,
      });

    case NumberFormatType.Tenths:
      return numberFormatter.currency.formatter(val, {
        precision: 1,
      });
    case NumberFormatType.Decimal:
      return numberFormatter.currency.formatter(val);
    case NumberFormatType.Decimal2:
      return numberFormatter.currency.formatter(val, {
        precision: 3,
      });
    case NumberFormatType.Decimal3:
      return numberFormatter.currency.formatter(val, {
        precision: 4,
      });
    case NumberFormatType.CurrencyRMB:
      return numberFormatter.currency.formatter(val, {
        symbol: '￥',
      });
    case NumberFormatType.CurrencyRMB2:
      return numberFormatter.currency.formatter(val, {
        symbol: '￥',
        precision: 3,
      });
    case NumberFormatType.CurrencyRMB3:
      return numberFormatter.currency.formatter(val, {
        symbol: '￥',
        precision: 4,
      });

    case NumberFormatType.CurrencyDollar:
      return numberFormatter.currency.formatter(val, {
        symbol: '$',
      });

    case NumberFormatType.CurrencyDollar2:
      return numberFormatter.currency.formatter(val, {
        symbol: '$',
        precision: 3,
      });
    case NumberFormatType.CurrencyDollar3:
      return numberFormatter.currency.formatter(val, {
        symbol: '$',
        precision: 4,
      });
    case NumberFormatType.CurrencyEuro:
      return numberFormatter.currency.formatter(val, {
        symbol: '€',
      });
    case NumberFormatType.CurrencyEuro2:
      return numberFormatter.currency.formatter(val, {
        symbol: '€',
        precision: 3,
      });
    case NumberFormatType.CurrencyEuro3:
      return numberFormatter.currency.formatter(val, {
        symbol: '€',
        precision: 4,
      });
    case NumberFormatType.CurrencyHK:
      return numberFormatter.currency.formatter(val, {
        symbol: 'HK$',
      });
    case NumberFormatType.CurrencyHK2:
      return numberFormatter.currency.formatter(val, {
        symbol: 'HK$',
        precision: 3,
      });
    case NumberFormatType.CurrencyHK3:
      return numberFormatter.currency.formatter(val, {
        symbol: 'HK$',
        precision: 4,
      });
    default:
    case NumberFormatType.None:
      return val;
  }
}
