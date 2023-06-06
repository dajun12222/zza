/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import moment from 'moment';
export abstract class FormControlVerifyService {
  // 日期类型校验 校验规则在 control.options.verifyFormula字段上
  static verifyDate(rule: string, options: any, controlOptions: any) {
    if (!rule || rule.length === 0 || controlOptions.readonlyFormula) {
      return;
    }
    let ruleObj: any = {};
    if (this.isJSONString(rule)) {
      ruleObj = JSON.parse(rule);
    } else {
      const arr = rule.split('_');
      for (const r of arr) {
        const [key, val] = r.split(':');
        ruleObj[key] = val;
      }
    }
    if (+ruleObj.type === 1) {
      // 固定值模式
      if (ruleObj.rule === '~') {
        // 介于规则
        if (ruleObj.lDate && ruleObj.rDate) {
          controlOptions.minDate = ruleObj.lDate;
          controlOptions.maxDate = ruleObj.rDate;
          options.max = new Date(
            ruleObj.rDate.replace(/-/g, '/') + ' 23:59:59',
          );
          options.min = new Date(ruleObj.lDate.replace(/-/g, '/'));
        }
      } else {
        if (ruleObj.date) {
          let d: any = null;
          switch (ruleObj.rule) {
            case '=':
              options.max = new Date(
                new Date(ruleObj.date.replace(/-/g, '/')).getTime() +
                  86400000 -
                  1000,
              );
              options.min = new Date(ruleObj.date.replace(/-/g, '/'));
              break;
            case '>':
              d = new Date(
                new Date(ruleObj.date.replace(/-/g, '/')).getTime() + 86400000,
              );
              options.min = d;
              break;
            case '<':
              d = new Date(
                new Date(ruleObj.date.replace(/-/g, '/')).getTime() - 1000,
              );
              options.max = d;
              break;
            case '>=':
              options.min = new Date(ruleObj.date.replace(/-/g, '/'));
              break;
            case '<=':
              options.max = new Date(
                new Date(ruleObj.date.replace(/-/g, '/')).getTime() +
                  86400000 -
                  1000,
              );
              break;
            default:
              break;
          }
        }
      }
    } else {
      // 动态值模式
      if (+ruleObj.day === 1) {
        // 当天 类型
        const nowD = new Date();
        let tday: any = '';
        tday = new Date(
          nowD.getFullYear() +
            '/' +
            (nowD.getMonth() + 1) +
            '/' +
            nowD.getDate() +
            ' 00:00:00',
        ).getTime();
        //! 当天的对比 只精确到 天, 即时格式有时分秒 也不做比较 迭代28
        // if (
        //   !~controlOptions.format.indexOf("HH:mm:ss") &&
        //   ~controlOptions.format.indexOf("HH")
        // ) {
        //   tday = new Date(
        //     nowD.getFullYear() +
        //       "/" +
        //       (nowD.getMonth() + 1) +
        //       "/" +
        //       nowD.getDate() +
        //       " " +
        //       nowD.getHours() +
        //       ":" +
        //       nowD.getMinutes()
        //   ).getTime();
        // } else if (~controlOptions.format.indexOf("HH:mm:ss")) {
        //   tday = nowD.getTime();
        // } else {
        //   tday = new Date(
        //     nowD.getFullYear() +
        //       "/" +
        //       (nowD.getMonth() + 1) +
        //       "/" +
        //       nowD.getDate() +
        //       " 00:00:00"
        //   ).getTime();
        // }
        if (ruleObj.rule === '~') {
          // 介于规则
          if (('' + ruleObj.lInput).length && ('' + ruleObj.rInput).length) {
            const min = Math.min(+ruleObj.lInput, +ruleObj.rInput);
            const max = Math.max(+ruleObj.lInput, +ruleObj.rInput);
            const minDay = new Date(tday + min * 86400000);
            const maxDay = new Date(tday + max * 86400000 + 86400000 - 1000);
            // if (
            //   ~controlOptions.format.indexOf("HH") &&
            //   !~controlOptions.format.indexOf("HH:mm:ss")
            // ) {
            //   controlOptions.minDate =
            //     minDay.getFullYear() +
            //     "/" +
            //     (minDay.getMonth() + 1) +
            //     "/" +
            //     minDay.getDate() +
            //     " " +
            //     minDay.getHours() +
            //     ":" +
            //     minDay.getMinutes();
            //   controlOptions.maxDate =
            //     maxDay.getFullYear() +
            //     "/" +
            //     (maxDay.getMonth() + 1) +
            //     "/" +
            //     maxDay.getDate() +
            //     " " +
            //     maxDay.getHours() +
            //     ":" +
            //     maxDay.getMinutes();
            // } else if (~controlOptions.format.indexOf("HH:mm:ss")) {
            //   controlOptions.minDate =
            //     minDay.getFullYear() +
            //     "/" +
            //     (minDay.getMonth() + 1) +
            //     "/" +
            //     minDay.getDate() +
            //     " " +
            //     minDay.getHours() +
            //     ":" +
            //     minDay.getMinutes() +
            //     ":" +
            //     minDay.getSeconds();
            //   controlOptions.maxDate =
            //     maxDay.getFullYear() +
            //     "/" +
            //     (maxDay.getMonth() + 1) +
            //     "/" +
            //     maxDay.getDate() +
            //     " " +
            //     maxDay.getHours() +
            //     ":" +
            //     maxDay.getMinutes() +
            //     ":" +
            //     maxDay.getSeconds();
            // } else {
            //   controlOptions.minDate =
            //     minDay.getFullYear() +
            //     "/" +
            //     (minDay.getMonth() + 1) +
            //     "/" +
            //     minDay.getDate();
            //   controlOptions.maxDate =
            //     maxDay.getFullYear() +
            //     "/" +
            //     (maxDay.getMonth() + 1) +
            //     "/" +
            //     maxDay.getDate();
            // }
            controlOptions.minDate =
              minDay.getFullYear() +
              '/' +
              (minDay.getMonth() + 1) +
              '/' +
              minDay.getDate();
            controlOptions.maxDate =
              maxDay.getFullYear() +
              '/' +
              (maxDay.getMonth() + 1) +
              '/' +
              maxDay.getDate();
            ruleObj.lInput = controlOptions.minDate;
            ruleObj.rInput = controlOptions.maxDate;
            options.min = minDay;
            options.max = maxDay;
            if (ruleObj.defaultPrompt) {
              ruleObj.defaultPrompt = `${ruleObj.defaultPrompt}${ruleObj.lInput}~${ruleObj.rInput}`;
            }
          }
        } else {
          if (('' + ruleObj.input).length) {
            let t = '';
            let tipsDate = '';
            let d: any = null;
            switch (ruleObj.rule) {
              case '=':
                // var d = new Date(tday + ruleObj.input * 86400000);
                //! 当天的对比 只精确到 天, 即时格式有时分秒 也不做比较 迭代28
                // if (~controlOptions.format.indexOf("HH")) {
                //   if (~controlOptions.format.indexOf("HH:mm:ss")) {
                //     t = this._getDateFormat(d, "second");
                //     minD = maxD = new Date(t);
                //   } else {
                //     t = this._getDateFormat(d, "minute");
                //     minD = new Date(t + ":00");
                //     maxD = new Date(t + ":59");
                //   }
                // } else {
                //   t = this._getDateFormat(d, "day");
                //   minD = new Date(t + " 00:00:00");
                //   maxD = new Date(t + " 23:59:59");
                // }
                // t = this._getDateFormat(d, "day");
                const minD = new Date(tday + ruleObj.input * 86400000);
                const maxD = new Date(
                  tday + ruleObj.input * 86400000 + 86400000 - 1000,
                );
                tipsDate = this._getDateFormat(
                  new Date(tday + +ruleObj.input * 86400000),
                  'day',
                );
                options.min = minD;
                options.max = maxD;
                break;
              case '>':
                d = new Date(tday + +(ruleObj.input + 1) * 86400000);
                t = this._getDateFormat(d, 'day');
                tipsDate = this._getDateFormat(
                  new Date(tday + +ruleObj.input * 86400000),
                  'day',
                );
                controlOptions.minDate = t;
                options.min = d;
                //! 当天的对比 只精确到 天, 即时格式有时分秒 也不做比较 迭代28
                // if (~controlOptions.format.indexOf("HH")) {
                //   var d = new Date(
                //     tday + ((+ruleObj.input + 1) * 86400000 + 1000)
                //   );
                //   if (~controlOptions.format.indexOf("HH:mm:ss")) {
                //     t = this._getDateFormat(d, "second");
                //   } else {
                //     t = this._getDateFormat(d, "minute");
                //   }
                //   controlOptions.minDate = t;
                //   options.min = d;
                // } else {
                //   var d = new Date(tday + +(ruleObj.input + 1) * 86400000);
                //   t = this._getDateFormat(d, "day");
                //   controlOptions.minDate = t;
                //   options.min = d;
                // }
                break;
              case '<':
                //! 当天的对比 只精确到 天, 即时格式有时分秒 也不做比较 迭代28
                // if (~controlOptions.format.indexOf("HH")) {
                //   var d = new Date(
                //     tday + ((+ruleObj.input - 1) * 86400000 - 1000)
                //   );
                //   if (~controlOptions.format.indexOf("HH:mm:ss")) {
                //     t = this._getDateFormat(d, "second");
                //   } else {
                //     t = this._getDateFormat(d, "minute");
                //   }
                //   controlOptions.maxDate = t;
                //   options.max = d;
                // } else {
                //   var d = new Date(tday + (+ruleObj.input - 1) * 86400000);
                //   t = this._getDateFormat(d, "day");
                //   controlOptions.maxDate = t;
                //   options.max = d;
                // }
                d = new Date(
                  tday + (+ruleObj.input - 1) * 86400000 + 86400000 - 1000,
                );
                t = this._getDateFormat(d, 'day');
                controlOptions.maxDate = t;
                options.max = d;
                break;
              case '>=':
                d = new Date(tday + ruleObj.input * 86400000);
                //! 当天的对比 只精确到 天, 即时格式有时分秒 也不做比较 迭代28
                // if (~controlOptions.format.indexOf("HH")) {
                //   if (~controlOptions.format.indexOf("HH:mm:ss")) {
                //     t = this._getDateFormat(d, "second");
                //   } else {
                //     t = this._getDateFormat(d, "minute");
                //   }
                // } else {
                //   t = this._getDateFormat(d, "day");
                // }
                t = this._getDateFormat(d, 'day');
                controlOptions.minDate = t;
                options.min = d;
                break;
              case '<=':
                d = new Date(tday + ruleObj.input * 86400000 + 86400000 - 1000);
                //! 当天的对比 只精确到 天, 即时格式有时分秒 也不做比较 迭代28
                // if (~controlOptions.format.indexOf("HH")) {
                //   if (~controlOptions.format.indexOf("HH:mm:ss")) {
                //     t = this._getDateFormat(d, "second");
                //   } else {
                //     t = this._getDateFormat(d, "minute");
                //   }
                // } else {
                //   t = this._getDateFormat(d, "day");
                // }
                t = this._getDateFormat(d, 'day');
                controlOptions.maxDate = t;
                options.max = d;
                break;
              default:
                break;
            }
            ruleObj.input = tipsDate || t;
            if (ruleObj.defaultPrompt) {
              ruleObj.defaultPrompt = `${ruleObj.defaultPrompt}${ruleObj.input}`;
            }
          }
        }
      } else {
        if (ruleObj.rule === '~') {
          if (ruleObj.lSelect && ruleObj.rSelect) {
            options.min = `{${ruleObj.lSelect}}`;
            options.max = `{${ruleObj.rSelect}}`;
          }
        } else {
          if (ruleObj.select) {
            let t = '';
            switch (ruleObj.rule) {
              case '=':
                t = `{${ruleObj.select}}`;
                options.min = t;
                options.max = t;
                break;
              case '>':
                if (~controlOptions.format.indexOf('HH')) {
                  t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() + 1000)`;
                  options.min = t;
                } else {
                  t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() + 24*60*60*1000)`;
                  options.min = t;
                }
                break;
              case '<':
                if (~controlOptions.format.indexOf('HH')) {
                  t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() - 1000)`;
                  options.max = t;
                } else {
                  t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() - 24*60*60*1000)`;
                  options.max = t;
                }
                break;
              case '>=':
                t = `{${ruleObj.select}}`;
                options.min = t;
                break;
              case '<=':
                t = `{${ruleObj.select}}`;
                options.max = t;
                break;
              default:
                break;
            }
          }
        }
      }
    }
    controlOptions.verifyFormula = JSON.stringify(ruleObj);
  }

  static verifyTime(rule: string, options: any, controlOptions: any) {
    if (!rule || rule.length === 0 || controlOptions.readonlyFormula) {
      return;
    }
    let ruleObj: any = {};
    if (this.isJSONString(rule)) {
      ruleObj = JSON.parse(rule);
    } else {
      const arr = rule.split('_');
      for (const r of arr) {
        const [key, val] = r.split(':');
        ruleObj[key] = val;
      }
    }
    if (+ruleObj.type === 1) {
      // 固定值模式
      if (ruleObj.rule === '~') {
        // 介于规则
        if (ruleObj.lTime && ruleObj.rTime) {
          controlOptions.minDate = ruleObj.lTime;
          controlOptions.maxDate = ruleObj.rTime;
          options.max = moment(ruleObj.rTime, controlOptions.format);
          options.min = moment(ruleObj.lTime, controlOptions.format);
        }
      } else {
        if (ruleObj.time) {
          switch (ruleObj.rule) {
            case '=':
              options.max = moment(ruleObj.time, controlOptions.format);
              options.min = moment(ruleObj.time, controlOptions.format);
              break;
            case '>':
              if (controlOptions.format === 'HH:mm:ss') {
                options.min = moment(ruleObj.time, controlOptions.format).add(
                  1,
                  's',
                );
              } else {
                options.min = moment(ruleObj.time, controlOptions.format).add(
                  1,
                  'm',
                );
              }
              break;
            case '<':
              if (controlOptions.format === 'HH:mm:ss') {
                options.max = moment(
                  ruleObj.time,
                  controlOptions.format,
                ).subtract(1, 's');
              } else {
                options.max = moment(
                  ruleObj.time,
                  controlOptions.format,
                ).subtract(1, 'm');
              }
              break;
            case '>=':
              options.min = moment(ruleObj.time, controlOptions.format);
              break;
            case '<=':
              options.max = moment(ruleObj.time, controlOptions.format);
              break;
            default:
              break;
          }
        }
      }
    } else {
      if (ruleObj.rule === '~') {
        if (ruleObj.lSelect && ruleObj.rSelect) {
          options.min = `{${ruleObj.lSelect}}`;
          options.max = `{${ruleObj.rSelect}}`;
        }
      } else {
        if (ruleObj.select) {
          let t = '';
          switch (ruleObj.rule) {
            case '=':
              t = `{${ruleObj.select}}`;
              options.min = t;
              options.max = t;
              break;
            case '>':
              if (~controlOptions.format.indexOf('HH')) {
                t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() + 1000)`;
                options.min = t;
              } else {
                t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() + 24*60*60*1000)`;
                options.min = t;
              }
              break;
            case '<':
              if (~controlOptions.format.indexOf('HH')) {
                t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() - 1000)`;
                options.max = t;
              } else {
                t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() - 24*60*60*1000)`;
                options.max = t;
              }
              break;
            case '>=':
              t = `{${ruleObj.select}}`;
              options.min = t;
              break;
            case '<=':
              t = `{${ruleObj.select}}`;
              options.max = t;
              break;
            default:
              break;
          }
        }
      }
    }
    controlOptions.verifyFormula = JSON.stringify(ruleObj);
  }

  private static _getDateFormat(d: Date, type: 'minute' | 'second' | 'day') {
    let str =
      d.getFullYear() +
      '-' +
      (d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : '0' + (+d.getMonth() + 1)) +
      '-' +
      (d.getDate() >= 10 ? d.getDate() : '0' + +d.getDate());
    switch (type) {
      case 'minute':
        str =
          str +
          ' ' +
          (+d.getHours() >= 10 ? d.getHours() : '0' + +d.getHours()) +
          ':' +
          (+d.getMinutes() >= 10 ? d.getMinutes() : '0' + +d.getMinutes());
        break;
      case 'second':
        str =
          str +
          ' ' +
          (+d.getHours() >= 10 ? d.getHours() : '0' + +d.getHours()) +
          ':' +
          (+d.getMinutes() >= 10 ? d.getMinutes() : '0' + +d.getMinutes()) +
          ':' +
          (+d.getSeconds() >= 10 ? d.getSeconds() : '0' + +d.getSeconds());
        break;
      default:
        break;
    }
    return str;
  }

  // 数值类型校验 校验规则在 control.options.verifyFormula字段上
  static verifyNum(rule: string, options: any, controlOptions: any) {
    if (!rule || rule.length === 0) {
      return;
    }
    let ruleObj: any = {};
    if (this.isJSONString(rule)) {
      ruleObj = JSON.parse(rule);
    } else {
      const arr = rule.split('_');
      for (const r of arr) {
        const [key, val] = r.split(':');
        ruleObj[key] = val;
      }
    }
    if (+ruleObj.type === 1) {
      if (ruleObj.rule === '~') {
        if (('' + ruleObj.rInput).length && '' + ruleObj.lInput) {
          const min = Math.min(+ruleObj.lInput, +ruleObj.rInput);
          const max = Math.max(+ruleObj.lInput, +ruleObj.rInput);
          options.max = max;
          options.min = min;
        }
      } else {
        if (('' + ruleObj.input).length) {
          switch (ruleObj.rule) {
            case '=':
              options.max = +ruleObj.input;
              options.min = +ruleObj.input;
              break;
            case '>':
              options.min = +ruleObj.input + 0.0001;
              break;
            case '<':
              options.max = +ruleObj.input - 0.0001;
              break;
            case '>=':
              options.min = +ruleObj.input;
              break;
            case '<=':
              options.max = +ruleObj.input;
              break;
            default:
              break;
          }
        }
      }
    } else {
      if (ruleObj.rule === '~') {
        if (ruleObj.lSelect && ruleObj.rSelect) {
          options.max = `{${ruleObj.rSelect}}`;
          options.min = `{${ruleObj.lSelect}}`;
        }
      } else {
        if (ruleObj.select) {
          switch (ruleObj.rule) {
            case '=':
              options.max = `{${ruleObj.select}}`;
              options.min = `{${ruleObj.select}}`;
              break;
            case '>':
              options.min = `{${ruleObj.select}} + 0.0001`;
              break;
            case '<':
              options.max = `{${ruleObj.select}} - 0.0001`;
              break;
            case '>=':
              options.min = `{${ruleObj.select}}`;
              break;
            case '<=':
              options.max = `{${ruleObj.select}}`;
              break;
            default:
              break;
          }
        }
      }
    }
  }

  // 图片数量 上传最大和最小判断
  static verifyImageNumber(rule: string, options: any, controlOptions: any) {
    const arr = rule.split('_');
    const type = arr.shift();
    if (type !== 'batch') {
      return options;
    } else if (arr.length) {
      for (const item of arr) {
        const [key, val] = item.split(':');
        switch (key) {
          case 'min':
            options.minCount = +val;
            break;
          case 'max':
            options.maxCount = +val;
            break;
          default:
            break;
        }
      }
    } else {
    }
  }

  static isJSONString(str: string) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true;
      }
    } catch (e) {}
    return false;
  }
}
