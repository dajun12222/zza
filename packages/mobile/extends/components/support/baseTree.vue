<template>

    <a-directory-tree
        :selectedKeys="AuditTypeValue"
        style="width: 100%;"
        class="aDirectoryTree"
        :treeData="treeData"
        :replaceFields="replaceFields"
        allowClear
        placeholder="请选择审计问题"
        @select="select"
    />
 
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Tree } from "@h3/antd-vue";
 
    @Component({
        name: 'deptList',
        components: {
            ATree: Tree,
            ADirectoryTree: Tree.DirectoryTree,
            ATreeNode: Tree.TreeNode,
        },
    })
    export default class deptList extends Vue {
        //审计类别
       
    
        
    
        AuditTypeValue:any = [];
    
        @Prop({}) treeData:any;
    
       


        @Prop({ default: () => ({
            children: "children",
            title: "name",
            key: "dictionaryId",
            value: "dictionaryId",
        }) }) replaceFields?:any;
    
    
       
    
    
    
      
    
        created(){
           
        }

        async getList(){
        }
        
        isSelect(data:any){
        
            return data;
        }
        
        select(selectedKeys){
            let dictionaryId = this.replaceFields['value'];
            let AuditTypeList = this.allGroup(JSON.parse(JSON.stringify(this.treeData)));
            let result = AuditTypeList.find((item:any) => {
                return item[dictionaryId] === selectedKeys[0];
            })
            let result_arr = this.allGroup([result]);
            let result_att:any = [];
            result_arr.map((item) => {
                result_att.push(item[dictionaryId]);
            })
            let option = {
                //type: 'deptList',
                name: result['name'],
                dictionaryId: result[dictionaryId],
                dictionaryIds: result_att,
                //title: '发布部门',
            };
            this.AuditTypeValue = selectedKeys;
            this.$emit('select',option);
        }

        allGroup(option) {
            //所有分组,把树状结构拉成一维数组
            //let appMenu = this.appMenu;

            const retData = [] as any;
            const _helper = (data: any) => {
                if (!data) {
                    return;
                }
                data.forEach((item: any) => {
                    retData.push(item);
                    if (item && item.children) {
                        _helper(item.children);
                    }
                });
            };
            _helper(option);
            return retData;
        }
    }
    </script>
    <style lang="less" scoped>
   /deep/ .anticon {
        color: #1791ff;
    }
   /deep/ .ant-tree-title {
    color: #1791ff;
    height: auto;
    min-height: 24px;
    word-break: break-word;
    display: inline-block;
    max-width: 91%;
    white-space:pre-wrap;
   }

   .aDirectoryTree /deep/ .ant-tree-node-content-wrapper {
    position: relative;
    flex: auto;
    height: auto;
    min-height: 24px;
    // max-width: 80%;
    width: 100%;
    display: block;
    padding-left: 30px;
   }
   .aDirectoryTree /deep/  span.ant-tree-node-content-wrapper::before {
        top: 0;
        bottom: 0;
        height: initial !important;
    }

     
    .aDirectoryTree {
        /deep/ .ant-tree-treenode-switcher-open, /deep/ .ant-tree-treenode-switcher-close {
            position: relative;
        }
        /deep/ .ant-tree-switcher {
            position: absolute !important;
            left: 0;
        }
        /deep/ .ant-tree-node-selected{
            .ant-tree-title {
                color: #fff !important;
            }
            .anticon {
                color: #fff !important;
            }
            
            
        }
        /deep/ .ant-tree-treenode-selected{
            > .ant-tree-switcher {
                > .anticon {
                    color: #fff !important;
                }
               
            }
            
        }  
        
        /deep/ .ant-tree-treenode-selected {
            
            span.ant-tree-node-content-wrapper {
                
            }
            
            span.ant-tree-node-content-wrapper::before {
                top:0;
                bottom: 0;
                left: 0;
                right: 0;
                height: initial;
            }
            
            
        }
    }
 
    </style>