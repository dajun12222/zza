export class TreeNode {
  private id: string;

  private data: any;

  private children: TreeNode[];

  constructor(id: string, data: any, children?: TreeNode[] | null) {
    this.id = id;
    this.data = data;

    //树节点的子节点数组一定有数组结构，可能没有元素
    this.children = children || [];
  }

  /**
   * 获取以当前节点为根节点树的层级
   */
  static getDepth(node: TreeNode) {
    if (node.children.length) {
      return (
        1 +
        Math.max(
          ...node.children.map((child) => {
            return this.getDepth(child);
          }),
        )
      );
    } else {
      return 1;
    }
  }

  /**
   * 根据id查找子节点
   * 如果存在id匹配的子节点，返回改节点
   * 如果不存在，返回null
   */
  static getChildWithId(node: TreeNode, id: string) {
    if (!id) {
      return;
    }
    if (node.id === id) {
      return node;
    }
    if (node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        const resNode = this.getChildWithId(node.children[i], id);
        if (resNode) {
          return resNode;
        }
      }
    } else {
      return null;
    }
  }

  /**
   * 更新节点数据
   * @param data
   */
  refreshData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  getChildren() {
    return this.children;
  }

  getId() {
    return this.id;
  }

  setChildren(children: any[]) {
    this.children = children;
  }

  /**
   * 获取当前节点在整棵树中的父节点
   * @param root: 树的根节点
   */
  getParentNode(root: TreeNode) {
    //如果root中找不到当前节点，不用处理返回null
    if (
      !root.children ||
      root.children.length === 0 ||
      !TreeNode.getChildWithId(root, this.id)
    ) {
      return null;
    }

    if (root.getChildren().some((child) => child.getId() === this.id)) {
      return root;
    }
    root.children.forEach((child) => {
      //如果子节点树结构中拥有该id的子节点（层级可能比较深），向该分支深入处理
      if (TreeNode.getChildWithId(child, this.id)) {
        return this.getParentNode(child);
      }
    });
  }

  /**
   * 初始化树节点
   */
  static initTreeNode(
    originalData: any,
    generateDataFunc: any,
    idKeyMap: string,
    childrenKeyMap?: string,
  ) {
    const children: any[] = [];
    if (
      originalData[childrenKeyMap || 'children'] &&
      originalData[childrenKeyMap || 'children'].length > 0
    ) {
      originalData[childrenKeyMap || 'children'].forEach((item) => {
        children.push(
          this.initTreeNode(item, generateDataFunc, idKeyMap, childrenKeyMap),
        );
      });
    }
    return new TreeNode(
      originalData[idKeyMap],
      generateDataFunc(originalData),
      children,
    );
  }
}

export const treeTest = () => {
  const root = new TreeNode('1', { x: 123 }, [
    new TreeNode('2', { x: 321 }, []),
    new TreeNode('3', { x: 213 }, [new TreeNode('4', { x: 123123 }, [])]),
  ]);

  console.log(root);
  console.log('树深度', TreeNode.getDepth(root));
  console.log('树搜索', TreeNode.getChildWithId(root, '4'));
};
