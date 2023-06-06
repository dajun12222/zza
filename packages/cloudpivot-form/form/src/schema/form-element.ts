/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export interface ElementAttr {
  name: string;
  value: string;
}

export interface FormElement {
  tagName: string;

  id: string | null;

  innerHTML: string | null;

  attrs: Array<ElementAttr>;
}

export function createHTMLElement(el: FormElement): HTMLElement | null {
  const child = document.createElement(el.tagName);

  if (el.innerHTML) {
    child.innerHTML = el.innerHTML;
  }

  if (el.attrs) {
    for (const attr of el.attrs) {
      const a = document.createAttribute(attr.name);
      a.value = attr.value;
      child.setAttributeNode(a);
    }
  }

  return child;
}
