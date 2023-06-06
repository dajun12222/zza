/**
 * 通过选择器获取element的父元素节点
 * @param el
 * @param selector
 */
export const closest = (el: HTMLElement, selector: string) => {
  const matchesSelector = el.matches;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement as HTMLElement;
  }
  return el;
};

/**
 * 实现弹窗设计规范，当弹窗大于窗口高度一定值时，距离顶部48px，底部24px，中间滚动
 * @param modalWrapperClass 需要监听的弹窗包装类（wrapperClassName)
 */
export const observeModal = (modalWrapperClass: string) => {
  const modalEle: HTMLElement = document.querySelector(
    '.' + modalWrapperClass + ' .ant-modal',
  );
  const modalBody: HTMLElement = document.querySelector(
    '.' + modalWrapperClass + ' .ant-modal-body',
  );

  //需要弹窗组件的底部和头部高度符合规范，即头部高度为72，底部高度为80，加起来为152
  modalBody.style.maxHeight = 'calc(100vh - 48px - 24px - 152px)';
  modalBody.style.overflow = 'overlay';

  const observer = new ResizeObserver(() => {
    {
      resizeModal(modalEle);
    }
  });
  observer.observe(modalEle);
};

const resizeModal = (modalEle: HTMLElement) => {
  if (modalEle && modalEle.clientHeight > window.innerHeight - 100) {
    modalEle.style.top = '48px';
  } else if (modalEle && modalEle.clientHeight < window.innerHeight - 100) {
    modalEle.style.top = '100px';
  } else {
  }
};

export default {
  closest,
  observeModal,
};
