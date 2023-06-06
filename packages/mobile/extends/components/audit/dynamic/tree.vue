<template>
  <div>
    <a-directory-tree
      :selectedKeys="AuditTypeValue"
      class="indexTree"
      :treeData="treeData"
      :replaceFields="replaceFields"
      allowClear
      @select="onSelect"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Tree } from '@h3/antd-vue';
// import { forEach } from 'lodash';
// import { map } from 'tinymce';
@Component({
  name: 'treeList',
  components: {
    ATree: Tree,
    ADirectoryTree: Tree.DirectoryTree,
    ATreeNode: Tree.TreeNode,
  },
})
export default class treeList extends Vue {
  // @Prop() treeData!: any; //检索条件tag需要的数据
  AuditTypeValue: any = [];

  keysObj: any = {};

  firstParentKey: any = {};

  a: any = [];

  @Prop({}) treeData: any;

  @Prop({
    default: () => ({
      children: 'children',
      title: 'name',
      key: 'dictionaryId',
      value: 'dictionaryId',
    }),
  })
  replaceFields?: any;

  intetorFun(data: any, key: any, string: string) {
    if (string) {
      this.firstParentKey = {
        [data.dictionaryId]: data.name,
      };
    }
    if (data.dictionaryId === key[0]) {
      this.keysObj = {
        [data.dictionaryId]: data.name,
      };
    }
    if (data.children && data.children.length !== 0) {
      data.children.forEach((item) => {
        if (item.dictionaryId === key[0]) {
          this.keysObj = {
            [data.dictionaryId]: data.name,
            [item.dictionaryId]: item.name,
            ...this.firstParentKey,
          };
        } else {
          this.intetorFun(item, key, '');
        }
      });
    }
    return this.keysObj;
  }

  getParentKey(key, treeData) {
    let parentKey = [];
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      // ‘firstTime’是设置的一个标记，根据这个标记把一级父节点的id记录在firstParentKey中
      parentKey = this.intetorFun(node, key, 'firstTime');
    }
    return parentKey;
  }

  onSelect(selectKeys, e) {
    this.keysObj = {};
    this.firstParentKey = {};
    this.AuditTypeValue = selectKeys;
    this.$emit(
      'arrKeys',
      this.getParentKey(selectKeys, this.treeData),
      selectKeys,
    );
  }
}
</script>
<style lang="less" scoped>
.indexTree {
  background: #fff;
  border-radius: 2px;
  padding: 5px 12px;
  color: #1791ff;
  /deep/.ant-tree-icon__customize {
    color: #1791ff;
  }
  /deep/.ant-tree-node-selected .ant-tree-title,
  /deep/.ant-tree-node-selected .ant-tree-icon__customize {
    color: #fff;
  }
  /deep/.ant-tree-title {
    color: #1791ff;
    height: auto;
    min-height: 24px;
    word-break: break-word;
    display: inline-block;
    max-width: 91%;
    white-space: pre-wrap;
  }
  /deep/ .ant-tree-node-content-wrapper {
    flex: auto;
    height: auto;
    min-height: 24px;
    // max-width: 80%;
    width: 100%;
    padding-left: 30px;
  }
  /deep/li span.ant-tree-node-content-wrapper::before,
  /deep/.ant-tree-child-tree > li span.ant-tree-node-content-wrapper::before {
    min-height: 24px;
    height: auto;
  }

  /deep/ .ant-tree-treenode-switcher-open,
  /deep/ .ant-tree-treenode-switcher-close {
    position: relative;
  }
  /deep/ .ant-tree-switcher {
    position: absolute !important;
    left: 0;
  }
  /deep/ .ant-tree-node-selected {
    .ant-tree-title {
      color: #fff !important;
    }
    .anticon {
      color: #fff !important;
    }
  }
  /deep/ .ant-tree-treenode-selected {
    > .ant-tree-switcher {
      > .anticon {
        color: #fff !important;
      }
    }
  }

  /deep/ .ant-tree-treenode-selected {
    span.ant-tree-node-content-wrapper {
      position: relative;
    }

    span.ant-tree-node-content-wrapper::before {
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
    }
  }
}
</style>
