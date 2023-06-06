<template lang="en">
     <div style="background:#eee">
          <a-row class="aRow">
               <a-col :span="17" class="aCol" style="margin-right:10px">
                    <h2>{{ info.questionQualitative }}</h2>
                    <a-divider />
                    <table>
                         <tbody>
                              <tr>
                                   <th>
                                        一级目录
                                   </th>
                                   <td>
                                        <a>
                                             {{ info.oneQuestionDirectoryName || '' }}
                                        </a>
                                   </td>
                                   <th>
                                        二级目录
                                   </th>
                                   <td>
                                        <a>
                                             {{ info.twoQuestionDirectoryName || '' }}
                                        </a>
                                   </td>
                                   <th>
                                        三级目录
                                   </th>
                                   <td>
                                        <a>
                                             <template v-if="info && info.threeQuestionDirectoryName">
                                                  <template v-for="(i) in info.threeQuestionDirectoryName.split(';')">
                                                  {{ i }}
                                                  </template>
                                             </template>
                                        </a>
                                   </td>
                              </tr>
                              <tr>
                                   <th>
                                        定性标签
                                   </th>
                                   <td>
                                        <a>
                                             <template v-if="info && info.qualitativeTagsList && info.qualitativeTagsList.length > 0">
                                                  <template v-for="(item) in info.qualitativeTagsList">
                                                  {{ item.tagName }}
                                                  </template>
                                             </template>
                                        </a>
                                   </td>
                                   <th>
                                        适用标签
                                   </th>
                                   <td>
                                        
                                        <template v-if="info && info.applicableTags">
                                             <template v-for="(i) in info.applicableTags.split(';')">
                                             {{ i }}
                                             </template>
                                        </template>
                                        
                                   </td>
                                   <th>
                                        问题来源
                                   </th>
                                   <td>
                                        <a>
                                             {{ info.questionSource }}
                                        </a>
                                   </td>
                              </tr>
                              <tr>
                                   <th>
                                        创建时间
                                   </th>
                                   <td>
                                        <a>
                                             {{ info.createdTime && info.createdTime.slice(0, 10) || '' }}
                                        </a>
                                   </td>
                                   <th>
                                        更新时间
                                   </th>
                                   <td>
                                        <a>
                                             {{ info.modifiedTime && info.modifiedTime.slice(0, 10) || '' }}
                                        </a>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               
                    <div class="content">
                         <a-tabs defaultActiveKey="1" type="card">
                              <a-tab-pane key="1" tab="定性依据">
                                   <a-list
                                        class="demo-loadmore-list"
                                        :data-source="info.qualitativeBasisList"
                                        itemLayout="horizontal"
                                   >
                                        <a-list-item slot="renderItem" slot-scope="item">
                                             <a-list-item-meta>
                                                  <a
                                                       slot="title"
                                                       class="listItemMetaTitle"
                                                       href="#!"
                                                       v-html="item.basisName"
                                                       ></a>
                                                  <div slot="description">
                                                       <ul>
                                                            <li
                                                                 style="
                                                                 cursor: pointer;
                                                                 color: #000;
                                                                 margin-top: 10px;
                                                                 "
                                                            >{{ item.basisFullText }}</li>
                                                       </ul>
                                                  </div>
                                             </a-list-item-meta> 
                                        </a-list-item>
                                   </a-list>
                              </a-tab-pane>
                              <a-tab-pane key="2" tab="处罚依据">
                                   <a-list
                                        class="demo-loadmore-list"
                                        :data-source="info.penaltyBasisList"
                                        itemLayout="horizontal"
                                   >
                                        <a-list-item slot="renderItem" slot-scope="item">
                                             <a-list-item-meta>
                                                  <a
                                                       slot="title"
                                                       class="listItemMetaTitle"
                                                       href="#!"
                                                       v-html="item.basisName"
                                                       ></a>
                                                  <div slot="description">
                                                       <ul>
                                                            <li
                                                                 style="
                                                                 cursor: pointer;
                                                                 color: #000;
                                                                 margin-top: 10px;
                                                                 "
                                                            >{{ item.basisFullText }}</li>
                                                       </ul>
                                                  </div>
                                             </a-list-item-meta> 
                                        </a-list-item>
                                   </a-list>
                              </a-tab-pane>
                         </a-tabs>
                    <div>{{ info.fullTextNh }}</div>
               </div>
               </a-col>
               <!-- <a-col :span="1"></a-col> -->
               <a-col :span="6" class="aCol">
                    <a-card title="相关定性依据" size="small"  class="acard" >
                         <a-empty />
                    </a-card>
                    <a-card title="相关处罚依据" size="small" class="acard" >
                         <a-empty />
                    </a-card>
                    <a-card title="审计建议" size="small" class="acard" >
                         <p> {{ info.auditSuggestion }}</p>
                    </a-card>
               </a-col>
          </a-row> 
     </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '@/../extends/api';
import { Row, Col, Divider,Tabs,List, Card, Empty } from '@h3/antd-vue';
const qs = require('qs');
@Component({
  name: 'problemInfo',
  components: {
    ARow: Row,
    ACol: Col,
    ACard: Card,
    ADivider: Divider,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AList: List,
    AListItem: List.Item,
    AListItemMeta: List.Item.Meta,
    AEmpty: Empty,
  },
})
export default class regulationInfo extends Vue {
  @Prop({}) id: any;

  @Watch('id', { deep: true, immediate: true })
  onChangeID(newVal: any) {
    if (newVal) {
      this.getList();
    }
  }

  info: any = {};

  current: any = 1;

  created(){
       this.id = this.$route.query.id || '';
       if(!this.id){
            this.$message.error('未获取到id');
            return;
       }
       this.getList();
  }

  async getList() {
     
    let option = qs.stringify({ id: this.id });
    const res: any = await api.questionsQueryInfo(option);
    if (res.errmsg === 'success') {
      this.info = res.data;
    } else {
      this.info = {};
    }
  }
}
</script>
<style lang="less" scoped>
.aRow {
     display: flex;
     height: 100%;
    padding: 18px;
    justify-content: space-between;
    flex-direction: row;
    width: 88%;
    margin: auto;
  .aCol {
     display: flex;
     flex-direction: column;
     background-color: #fff;
     height: 100%;
     border-radius: 5px;
     padding: 16px;
     box-shadow: 0px 0px 10px #d0e9f6;
    h2 {
      text-align: center;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.06);
      font-size: 12px;
      margin-bottom: 13px;
      tbody {
        tr {
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          th {
            width: 60px;
            height: 30px;
            background-color: #fafafa;
            border-right: 1px solid rgba(0, 0, 0, 0.06);
            text-align: center;
            color: rgb(144, 147, 153);
          }
          td {
            height: 30px;
            border-right: 1px solid rgba(0, 0, 0, 0.06);
            padding: 0 7px;
            a {
              color: rgba(0, 0, 0, 0.85);
              cursor: default;
            }
          }
        }
      }
    }
    .content {
      flex: 1;
      overflow-y: auto;
    }
    .ant-tabs {
     /deep/ .ant-tabs-bar {
          border: 0;
     }
     /deep/ .ant-tabs-nav.ant-tabs-nav-animated {
          display: flex;
          justify-content: center;
     }
     /deep/ .ant-tabs-tab {
          color: rgb(23, 145, 255);
          margin: 0px 10px;
          background: rgb(238, 238, 238);
          border-radius: 2px;
          padding: 0px;
          margin-right: 0px;
          width: 150px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 0;
     }
     /deep/ .ant-tabs-tab-active {
          background: rgb(23, 145, 255);
          color: #fff !important;
     }
     /deep/ .ant-tabs-tabpane{
          border: 1px solid rgb(199, 223, 245);
          padding: 10px;
     }
    }
    .ant-card {
     margin-bottom: 17px;
     box-shadow: 0px 0px 4px #eee;
         /deep/ .ant-card-head {
               background: #479ee5;
               color: #fff;
               font-size: 16px;
               min-height: 36px;
         }
         /deep/ .ant-card-head-title {
          padding: 8px 0;
         }

    }
  }
}
.ant-divider-horizontal {
  background: rgb(23, 145, 255);
  margin: 0px 0 13px;
  height: 0.115rem;
}
.ant-list-item-meta-title > a {
font-size: 16px;
color: rgb(8, 86, 153);
transition: all 0.3s;
}
</style>
