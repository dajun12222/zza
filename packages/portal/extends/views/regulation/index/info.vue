<template lang="en">
<div style="background:#eee">
     <a-row class="aRow">
     <a-col :span="17" class="aCol" style="margin-right:10px">
          <h2>{{ info.regulationName }}</h2>
          <a-divider />
          <table>
               <tbody>
                    <tr>
                         <th>
                              发布部门
                         </th>
                         <td>
                              <a>
                                   <template v-if="info && info.publishingDepartment">
                                        <template v-for="(i) in info.publishingDepartment.split(';')">
                                        {{ i }}
                                        </template>
                                   </template>
                              </a>
                         </td>
                         <th>
                              发文字号
                         </th>
                         <td>
                              <a>
                                   {{ info.releaseNumber }}
                              </a>
                         </td>
                         <th>
                              效力级别
                         </th>
                         <td>
                              <template v-if="info && info.effectivenessLevel">
                                   <template v-for="(i) in info.effectivenessLevel.split(';')">
                                   {{ i }}
                                   </template>
                              </template>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              审计类别
                         </th>
                         <td>
                              <template v-if="info && info.auditCategories">
                                   <template v-for="(i) in info.auditCategories.split(';')">
                                   {{ i }}
                                   </template>
                              </template>  
                         </td>
                         <th>
                              发布日期
                         </th>
                         <td>
                              <a>
                                   {{ info.releaseDate && info.releaseDate.slice(0,10) || '' }}
                              </a>
                         </td>
                         <th>
                              实施日期
                         </th>
                         <td>
                              <a>
                                   {{ info.implementationDate && info.implementationDate.slice(0,10) || '' }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              时效性
                         </th>
                         <td>
                              <a>
                                   {{ info.timeliness }}
                              </a>
                         </td>
                         <th>
                              原文链接
                         </th>
                         <td>
                              <a class="link_ellipsis" :title="info.link">
                                   {{ info.link }}
                              </a>
                         </td>
                         <th>
                              法规附件
                         </th>
                         <td>
                              <a>
                                   {{ info.fileName }}
                              </a>
                         </td>
                    </tr>
               </tbody>
          </table>
          <a-collapse v-if="info.changesInThisLaw">
               <a-collapse-panel key="1" header="本法变迁">
                    <div class="change_con" style="display: block;">
                            <i class="icon c-time aufontAll h-icon-all-clock-circle"></i>
                            <ul>
                                   <li
                                        v-for="(item, idx) in info.changesInThisLaw"
                                        :key="idx"     
                                   >
                                        <span class="time">{{item.time}}</span>
                                        <div class="theme" :class="{'current':idx === 0}">
                                            <i class="c-dot"></i>{{idx === 0 ? item.originalTitle : item.changeTitle}}
                                        </div>
                                        <div class="relevance">
                                             <span>{{ item.revisionContent }}</span>
                                        </div>
                                   </li>
                            </ul>
                        </div>
               </a-collapse-panel>
          </a-collapse>
          <div class="content">
            <div v-if="info.fullText" v-html="info.fullText"></div>
            <iframe v-else :src="url" scrolling="no" frameborder="0" style="width: 100%; height: 100%;"></iframe>
         </div>
     </a-col>
     <a-col :span="6" class="aCol">
          <a-card title="相关政策法规" size="small"  class="acard" >
               <ul v-if="info && info.auditLawsRegulationsEntities" class="news_zhengce_ul">
                    <li
                         v-for="(item, idx) in info.auditLawsRegulationsEntities"
                         :key="idx"
                         @click="goDetail(item)"
                    >
                         <p class="time">{{item.regulationName}}</p>
                         <span>{{item.releaseDate ? item.releaseDate.slice(0,10) :''}}发布<i>｜</i>
                              {{item.implementationDate ? item.implementationDate.slice(0,10) : ''}}实施<i>｜</i>{{item.timeliness}}<i>｜</i>{{item.releaseNumber}}</span>
                    </li>
               </ul>
               <a-empty v-else />
          </a-card>
     </a-col>
</a-row> 
</div>   
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '@/../extends/api';
import { Row, Col, Divider,Card, Empty,Collapse } from '@h3/antd-vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

const qs = require('qs');
@Component({
  name: 'regulationInfo',
  components: {
    ARow: Row,
    ACol: Col,
    ADivider: Divider,
    ACard: Card,
    AEmpty: Empty,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
  },
})
export default class regulationInfo extends Vue {
//   @Prop({}) id: any;

//   @Watch('id', { deep: true, immediate: true })
//   onChangeID(newVal: any) {
//     if (newVal) {
//       this.getList();
//     }
//   }
activeKey:string = '1';

  info: any = {};
  
  url: string = '';

  id: any = '';

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

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
    const res: any = await api.queryInfo(option);
    if (res.errmsg === 'success') {
         this.info = res.data;
         if(res.data.refId) {
          let attrSrc = this.getDownloadUrl(res.data.refId);
          this.url = 'http://192.168.0.88:8001/view/url?url=' + encodeURIComponent(attrSrc)
         }
    } else {
      this.info = {};
    }
  }

  getDownloadUrl(refId: string) {
    let url = `${
      this.apiHost
    }/api/aliyun/download?refId=${getDownloadUrlNew.getRefId(refId)}`;
    if (this.token) {
      url += '&T=' + this.token;
    }
    return url;
  }

  goDetail(item: any) {
    this.id = item['id'];
    // this.showModel = true;
    let { href } = this.$router.resolve({
        name: "regulationInfo",
        query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
        }
    });
    console.log(href);
    window.open(href,'_blank');
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
    .change_con {
          padding: 10px 30px;
          position: relative;
          display: block;
          .c-time {
               font-size: 21px;
               position: absolute;
               top: 20px;
               left: 110px;
               color: #10c157;
               background: #fff;
          }
          ul {
               margin-left: 90px;
               border-left: 1px solid #c9c9c9;
               padding: 20px 20px 10px 20px;
               margin-top: 20px;
               li {
                    line-height: 26px;
                    margin-bottom: 20px;
                    position: relative;
                    .time {
                    font-size: 12px;
                    color: #666;
                    position: absolute;
                    left: -110px;
                    }
                    .theme {
                         font-size: 14px;
                         color: #008cff;
                         font-weight: bold;
                         position: relative;
                         margin-bottom: 20px;
                    }
                    .current .c-dot {
                         width: 15px;
                         height: 17px;
                         background: url(../../../style/image/icon-position.png) no-repeat;
                         border: 3px solid #fff;
                         border-radius: 50%;
                         position: absolute;
                         left: -31px;
                         top: 2px;
                    }
                    .relevance .c-dot {
                         display: none;
                         top: 3px;
                    }
                    .c-dot {
                         width: 10px;
                         height: 10px;
                         background: #10c157;
                         border: 3px solid #fff;
                         border-radius: 50%;
                         position: absolute;
                         left: -28px;
                         top: 5px;
                         box-sizing: content-box;
                         }
               }
          }
     }
    .content {
      flex: 1;
      overflow-y: auto;
    }
    .ant-card {
     height: 100%;
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
         /deep/ .ant-card-body {
               height: calc(100% - 45px);
               overflow: auto;
         }

    }
    .link_ellipsis {
          max-width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
    }
    .news_zhengce_ul {
          li {
               margin-bottom: 10px;
               border-bottom: 1px dashed #d1d1d1;
               padding: 10px 0;
               p {
                    color: #469de5;
                    font-weight: 600;
                    margin-bottom: 5px;
                    cursor: pointer;
               }
               span {
                    line-height: 27px;
                    font-size: 12px;
                    letter-spacing: 0px;
                    color:#8c8c8c;
                    i {
                         font-style: inherit;
                         padding: 0 5px;
                    }
               }
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
