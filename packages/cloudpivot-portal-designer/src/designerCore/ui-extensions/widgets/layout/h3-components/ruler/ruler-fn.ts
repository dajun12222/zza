/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default function initPlugin (params: any) {
  const initParams = {
    el: '', // 容器 String
    height: 16, // 刻度尺高度 Number
    vHeight: 600,
    maxScale: 200, // 最大刻度 Number
    startValue: 0, // 开始的值 Number
    background: 'rgba(41,112,255,0.1)', // 刻度尺背景颜色 String
    color: '#ccc', // 刻度线和字体的颜色 String
    fontColor: '#ADADAD',
    division: 10, // 每一刻度的距离
    step: 10, // 每一刻度代表多少
    column: 10, // 大间距分多少列
    zoom: 1, // 缩放
    count: 0, // 标尺左移刻度
    fontSize: 11, // 刻度字号
    fontSpace: 7, // 字与刻度边的距离
    oddLine: 5, // 单数刻度线高
    evenLine: 5, // 双数刻度线高
    wholeLine: 16, // 整刻度线高
    sceneW: 0, // 页面分辨率
    sceneH: 0, // 页面分辨率
    isPage: false, // 是否页面激活
    offsetLeft: 0, // 相对画布的左偏移
    offsetTop: 0, // 相对画布的上偏移
  };
  Object.assign(initParams, params);

  if (!initParams.el) {
    return false;
  }
  const rulerWrap: HTMLElement = document.getElementById(
    initParams.el,
  ) as HTMLElement; // 获取容器
  // 最大刻度的小值是50
  initParams.maxScale = initParams.maxScale < 50 ? 50 : initParams.maxScale;

  if (initParams.startValue > initParams.maxScale) {
    initParams.startValue = initParams.maxScale;
  }

  let division = 0; // 每个刻度的距离 分割线
  // 刻度值数组
  let scaleValueList: number[] = [];
  const canvas = document.createElement('canvas'); // 创建canvas标签
  const canvas1 = document.createElement('canvas');
  const dw = document.createElement('div');
  const dh = document.createElement('div');
  dw.className = 'line-w';
  dh.className = 'line-h';
  rulerWrap.appendChild(canvas);
  rulerWrap.appendChild(dw);
  rulerWrap.appendChild(dh);
  rulerWrap.appendChild(canvas1);

  const dpr = window.devicePixelRatio;
  const offset = 0.5 * dpr;
  function init () {
    canvas.width = initParams.maxScale * dpr;
    canvas.height = initParams.height * dpr;
    canvas.style.width = initParams.maxScale + 'px';
    canvas.style.height = initParams.height + 'px';

    canvas1.width = initParams.vHeight * dpr;
    canvas1.height = initParams.height * dpr;
    canvas1.style.width = initParams.vHeight + 'px';
    canvas1.style.height = initParams.height + 'px';

    division = initParams.division * initParams.zoom;
    scaleValueList = [];
    for (
      let i = 0;
      i <= initParams.maxScale - initParams.startValue;
      i += initParams.step * division
    ) {
      scaleValueList.push(i);
    }
  }
  init();

  // canvas1.onmousemove = function(ev) {
  //   // const p = ev.clientY ;
  //   // let n = Math.round(p / 10) * 10;
  //   // n -= 5;
  //   dw.setAttribute('style', 'top:' + (ev.clientY - 38) + 'px;display:block');
  // };
  // canvas1.onmouseout = function() {
  //   dw.setAttribute('style', '');
  // };
  // canvas.onmousemove = function(ev) {
  //   // const p = ev.clientX + 5;
  //   // let n = Math.round(p / 10) * 10;
  //   // n -= 5;
  //   dh.setAttribute('style', 'left:' + (ev.clientX - 220) + 'px;display:block');
  // };
  // canvas.onmouseout = function() {
  //   dh.setAttribute('style', '');
  // };

  // 没有canvas就创建一个

  function drawLine (
    cxt: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    cxt.beginPath();
    cxt.save();
    cxt.strokeStyle = initParams.color;
    cxt.lineWidth = 1;
    cxt.lineCap = 'round';
    cxt.moveTo(x1, y1);
    cxt.lineTo(x2, y2);
    cxt.stroke();
    cxt.restore();
    cxt.closePath();
  }

  // 画刻度尺
  function drawRuler (cxt: CanvasRenderingContext2D, _count: number, v = false) {
    let count = _count;
    let offsetLeft = offset + initParams.offsetLeft * dpr;
    if (v) {
      offsetLeft = offset - initParams.offsetTop * dpr;
    }
    // const offsetTop = offset + initParams.offsetTop * dpr;
    // const fixedOffset = offset;
    const w = (v ? initParams.vHeight : initParams.maxScale) * dpr;
    const h = initParams.height * dpr;
    const odd = h - initParams.oddLine * dpr;
    const even = h - initParams.evenLine * dpr;
    const whole = h - initParams.wholeLine * dpr;
    const fontSpace = h - initParams.fontSpace * dpr + 2;
    count = count + initParams.count;
    const tempCount = count;
    // 清空画布
    cxt.clearRect(0, 0, w, h);
    drawLine(cxt, 0, h, w, h);

    // 画刻度线
    function forLine (i: number, ks: boolean) {
      let x = division * i - tempCount * division;
      x *= dpr;
      x = ks ? w - x : x;
      if (i % initParams.column === 0) {
        drawLine(
          cxt,
          x + offsetLeft,
          h + offset,
          x + offsetLeft,
          Math.floor(whole) + offset,
        );
      } else if (i % 2 === 0) {
        drawLine(
          cxt,
          x + offsetLeft,
          h + offset,
          x + offsetLeft,
          Math.floor(even) + offset,
        );
      } else {
        drawLine(
          cxt,
          x + offsetLeft,
          h + offset,
          x + offsetLeft,
          Math.floor(odd) + offset,
        );
      }
    }

    for (let i = 0; i < initParams.maxScale; i++) {
      forLine(i, v);
    }

    // 添加体重数字
    cxt.beginPath();
    cxt.font = `bold ${initParams.fontSize * dpr}px Microsoft YaHei`;
    cxt.fillStyle = initParams.fontColor;
    cxt.textAlign = 'left';
    cxt.textBaseline = 'bottom';
    scaleValueList.forEach(function (num, i) {
      const temp = num + initParams.startValue;
      let x = division * i * initParams.column - tempCount * division;
      x *= dpr;
      x = v ? w - x : x;
      x += 3;
      cxt.fillText(
        temp.toString(),
        x + offsetLeft,
        Math.floor(fontSpace) + offset,
      );
    });
    cxt.closePath();

    // 刻度尺背景
    if (initParams.isPage && initParams.background) {
      cxt.fillStyle = initParams.background;
      let start = 0;
      scaleValueList.some((num, i) => {
        if (num === -initParams.startValue) {
          let x = division * (i * initParams.column - tempCount);
          x *= dpr;
          x = v ? w - x : x;
          x += 3;
          start = x + offsetLeft;
          return true;
        }
        return false;
      });
      const end = !v
        ? (initParams.sceneW / initParams.division) * division * dpr
        : -1 * (initParams.sceneH / initParams.division) * division * dpr;
      cxt.fillRect(start, 0, end, h);
    }
  }

  const cxt = canvas.getContext('2d') as CanvasRenderingContext2D;
  const cxt1 = canvas1.getContext('2d') as CanvasRenderingContext2D;
  drawRuler(cxt, 0);
  drawRuler(cxt1, 0, true);

  function zoom (num: number, x: number, y: number) {
    initParams.zoom = num;
    // x -= 50;
    division = initParams.zoom * initParams.division;
    const c = x / initParams.division - x / division;
    drawRuler(cxt, c);
    const c1 = y / initParams.division - y / division;
    drawRuler(cxt1, c1, true);
  }
  function fn (n: number, d: number, x: number, y: number, ks = false) {
    if (ks) {
      if (initParams.zoom < n) {
        zoom(initParams.zoom + d, x, y);
        setTimeout(function () {
          fn(n, d, x, y, ks);
        }, 17);
      } else {
        zoom(n, x, y);
      }
    } else {
      if (initParams.zoom > n) {
        zoom(initParams.zoom - d, x, y);
        setTimeout(function () {
          fn(n, d, x, y);
        }, 16);
      } else {
        zoom(n, x, y);
      }
    }
  }

  function setZoom (n: number, x: number, y: number, screen?: any) {
    if (screen) {
      const { isPage, width, height } = screen;

      // 计算画布距离标尺的偏移
      const container = document.getElementById('page-wrapper');
      const _canvas = document.getElementById('get-container');
      const containerWidth = container?.clientWidth || 0;
      let offsetLeft = (containerWidth - width) / 2;
      offsetLeft = Math.max(0, offsetLeft);
      let offsetTop = (_canvas?.offsetTop || 0) - 16;
      if (_canvas && _canvas.classList && _canvas.classList.length > 0) {
        for (let i = 0; i < _canvas.classList.length; i++) {
          if (_canvas?.classList[i] === 'page-box-mobile') {
            offsetTop += 4;
            break;
          }
        }
      }
      offsetTop = Math.max(0, offsetTop);

      Object.assign(initParams, {
        sceneW: width,
        sceneH: height,
        isPage,
        offsetLeft,
        offsetTop,
      });
    }
    const d = Math.abs(n - initParams.zoom) / 10;

    if (n > initParams.zoom) {
      fn(n, d, x, y, true);
    } else {
      fn(n, d, x, y);
    }
  }
  /*  let z = 1;

    setInterval(() => {
        if (z === 1) {
            setZoom(z, 500, 500);
            z = 2;
        } else {
            setZoom(z, 500, 500);
            z = 1;
        }
    }, 2300); */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setRuler (obj: any, zoomConfig: any) {
    Object.assign(initParams, obj);
    init();
    drawRuler(cxt, 0);
    drawRuler(cxt1, 0, true);
  }
  function scrollTop (d: number) {
    canvas1.style.top = 15 - d + 'px';
  }
  function scrollLeft (d: number) {
    canvas.style.left = 15 - d + 'px';
  }

  return {
    setZoom: setZoom, // 缩放(z,x,y) z为缩放的等级，x,y为缩放的中心点
    setRuler: setRuler, // 重新设置标尺的参数
    scrollTop: scrollTop, // 标尺向上移动，
    scrollLeft: scrollLeft, // 标尺向下称动
  };
}
