/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export const dateFormatter = function (
  val: Date | string | null,
  format?: string,
) {
  if (!val) {
    return '';
  }

  if (format) {
    if (format.includes('APM')) {
      format = 'YYYY-MM-DD HH:mm';
    }
    const idx = format.indexOf(' ');
    if (idx === -1) {
      if (!['HH:mm:ss', 'HH:mm'].some((v) => v === format)) {
        format = format.toUpperCase();
      }
    } else {
      format = format.substr(0, idx).toUpperCase() + format.substr(idx);
    }
  } else {
    format = 'YYYY-MM-DD';
  }

  // const m = (moment as any)(val);
  // m.utcOffset(8);

  // let str = m.format(format);

  let str = '';

  const date = new Date(val);
  str = format.replace('YYYY', date.getFullYear().toString());

  const month = date.getMonth() + 1;
  str = str.replace('MM', month < 10 ? `0${month}` : month.toString());

  const d = date.getDate();
  str = str.replace('DD', d < 10 ? `0${d}` : d.toString());

  const hours = date.getHours();
  str = str.replace(/HH/i, hours < 10 ? `0${hours}` : hours.toString());

  const minutes = date.getMinutes();
  str = str.replace('mm', minutes < 10 ? `0${minutes}` : minutes.toString());

  const seconds = date.getSeconds();
  str = str.replace('ss', seconds < 10 ? `0${seconds}` : seconds.toString());

  return str;
};
