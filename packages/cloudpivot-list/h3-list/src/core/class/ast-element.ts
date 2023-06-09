/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ElementAttr } from '../schema/elements';

/**
 * 抽象语法树元素类
 */
export class ASTElement {
  readonly tagName: string;

  readonly tagIndex: number;

  readonly tagLength: number;

  readonly attrs: Array<ElementAttr> = [];

  readonly parent: ASTElement | null;

  readonly id: string | null = null;

  protected _children: Array<ASTElement> = [];

  innerHTML: string | null = null;

  constructor(
    tagName: string,
    tagIndex: number,
    tagLength: number,
    attrs: Array<ElementAttr>,
    parent: ASTElement | null,
  ) {
    this.tagName = tagName;
    this.tagIndex = tagIndex;
    this.tagLength = tagLength;
    this.attrs = attrs;
    this.parent = parent;

    if (attrs) {
      const attr: ElementAttr | undefined = attrs.find(
        (a: ElementAttr) => a.name === 'id',
      );
      if (attr) {
        this.id = attr.value;
      }
    }

    if (parent) {
      parent.children.push(this);
    }
  }

  get children() {
    return this._children;
  }
}
