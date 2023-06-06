<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="applications-content">
    <div class="applications-search">
      <InputSearch
        v-model="appSearchKeyWords"
        :placeholder="placeholder"
        :allowClear="true"
        :isAsync="true"
        @search="onSearch"
      />
      <div class="search-content">
        <div v-show="appSearchKeyWords" class="search-panel">
          <div
            v-for="searchResultItem in searchResult"
            :key="searchResultItem.code"
            @click="goToDetail(searchResultItem)"
          >
            <application-item
              :key="searchResultItem.id"
              :applicationItem="searchResultItem"
            />
          </div>
          <div v-show="searchResult.length === 0" class="no-data">
            <img src="@/assets/images/search-no-data2.png" alt="" />
            <p>{{ $t('languages.common.NoSearchResult') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="applications-content-inner">
      <div class="applications-content-inner">
        
        <template v-for="(item,i) in notAllApps">
          <div v-if="isShow(item)" :key="i" class="itemContent">
            <p>{{ item.name }}</p>
            <template v-for="(el, index) in item && item.children">
              <div
                v-if="el.remarks && JSON.parse(el.remarks).includes('pc')"
                :key="index"
                class="app-item"
                @click="goToDetail(el)"
              >
                <application-item :applicationItem="el" />
              </div>
              
            </template>
            <div style="clear:both;"></div>
          </div> 
        </template> 
      </div>
    </div>
  </div>
</template> 

<script lang="ts">
import '@/config/h3-form';
import { listApi } from 'cloudpivot/api';
import InputSearch from './inputSearch.vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: 'applications',
  components: {
    applicationItem: () => import('./application-item.vue'),
    InputSearch,
  },
})
export default class applications extends Vue {
  @WorkflowCenterModule.Mutation('setIsAppList') setIsAppList: any;

  @WorkflowCenterModule.Mutation('setAppName') setAppName: any;

  @WorkflowCenterModule.Mutation('setAppCode') setAppCode: any;

  @WorkflowCenterModule.Mutation('setModalCode') setModalCode: any;

  @WorkflowCenterModule.Mutation('setAppChange') setAppChange: any;

  appList: any = [];

  notAllApps:any = [];

  appSearchKeyWords: string = ''; //搜索关键字

  placeholder: string = '搜索应用名称';

  searchResult: any[] = []; //应用搜索结果

  mounted() {}

  isShow(item:any){
    let status:boolean = false;
    if(item && item.children && item.children.length > 0){
      item.children.map((t:any) => {
        if(t.remarks && JSON.parse(t.remarks).includes('pc')){
          status = true;
        }
      })
    }
    return status;
  }

  created() {
    //获取应用列表
    this.getAppGroupList();
  }

  async getAppGroupList() {
    const res = await listApi.listByGroup({ isMobile: false, isPortal: true });
    if (res.errcode === 0) {
      if (Array.isArray(res.data)) {
        const notAllApps = res.data.filter((x) => {
          return x.code !== 'all';
        });
        this.appList = [];
        notAllApps.forEach((item) => {
          item.children = item.children ? item.children : [];
          item.children.forEach((ele) => {
            ele.appGroupName = item.name;
            this.appList.push(ele);
          });
        });
        this.notAllApps = notAllApps;
      }
    }
  }

  @Watch('$route', {
    immediate: true,
  })
  onRouteNameChange(val) {
    this.setIsAppList(false);
  }

  /**
   * 跳转到应用列表
   */
  goToDetail(item) {
    if (!item) {
      return;
    }
    const appName = {
      name: item.appName || item.name,
      name_i18n:
        (item.appName_i18n && item.appName_i18n.en) ||
        (item.appName_i18n &&
          JSON.parse(item.appName_i18n) &&
          JSON.parse(item.appName_i18n).en) ||
        item.appName ||
        (JSON.parse(item.name_i18n) && JSON.parse(item.name_i18n).en) ||
        item.name,
    };
    this.setAppName(appName);
    this.setAppCode(item.appCode || item.code);
    this.setModalCode(item.appCode ? item.code : '');
    this.setAppChange(true);
    if (this.$route.path.indexOf('app-portal-runtime') !== -1) {
      return;
    }
    if (
      this.$route.path.indexOf('/application-list/') === -1 &&
      item.type !== 'BizModel'
    ) {
      this.$router
        .push(
          `/application/${item.appCode || item.code}?return=${
            location.pathname
          }${location.search}`,
        )
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.$router
        .push(
          `/application/${item.appCode || item.code}/application-list/${
            item.code
          }?return=${location.pathname}${location.search}`,
        )
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * 前端搜索处理
   */
  getSearchResult() {
    return this.appList.filter((item) => {
      item.remarks = this.queryTitleLight(item.name);
      return item.name.includes(this.appSearchKeyWords);
    });
  }

  /**
   * 高亮
   */
  queryTitleLight(titleInfo) {
    if (!titleInfo) {
      return;
    }
    if (!this.appSearchKeyWords) {
      return;
    }
    const strReturn = titleInfo.replace(
      new RegExp(this.appSearchKeyWords, 'g'),
      `<span class="highlights">${this.appSearchKeyWords}</span>`,
    );
    return strReturn;
  }

  onSearch() {
    this.searchResult = this.getSearchResult();
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.applications-content {
  height: 100%;
  overflow: auto;
  background: #fff;
  padding-bottom: 16px;

  .applications-search {
      position: relative;
      //width: 308px;
      //padding-left: 8px;
      // margin-top: 52px;
      // margin-bottom: 15px;
      .search-content {
        position: relative;
        width:740px;
        margin: 0 auto;
        
      }
      .search-panel {
        position: absolute;
        top: -58px;
        left: 0px;
        width: 300px;
        height: 352px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        overflow: auto;
        /deep/.item-box {
          height: 66px;
          .item-icon-box {
            margin: 15px 12px 15px 16px;
            width: auto;
            height: auto;
            .item-icon {
              width: 36px;
              height: 36px;
              border-radius: 2px;
            }
            .svg-icon {
              width: 28px;
              height: 28px;
              margin: 3px;
              padding: 0;
            }
          }
          .item-text {
            padding-top: 12px;
            width: 225px;
          }
          .item-name {
            margin-bottom: 0;
          }
        }
        /deep/.item-box:hover {
          background: rgba(41, 112, 255, 0.1);
        }
      }
    }

  .applications-content-inner {
    padding-bottom: 15px;
    min-width: 1000px;
    margin: 0 auto;
    width: 70%;
    max-width: 1600px;
    overflow: auto;
    .itemContent {
      margin-bottom: 10px;
      > p {
        padding: 8px 8px 0 8px;
        font-size: 18px;
        color: rgba(17,18,24,0.65);
        line-height: 26px;
        font-weight: 400;
      }
    }
    .app-item {
      width: 204px;
      height: 74px;
      background: #ffffff;
      border-radius: 2px;
      //border: 1px solid #e4e7ee;
      float: left;
      margin: 6px 12px;
      cursor: pointer;
    }
    .app-item:hover {
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    }
    
    .app-item {
      width: 238px;
      height: 86px;
      background: #ffffff;
      border-radius: 2px;
     // border: 1px solid #e4e7ee;
      float: left;
      margin: 9px 8px;
      cursor: pointer;
    }
    .app-item:hover {
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    }
  }
  .no-data {
    width: 100%;
    display: flex;
    margin-top: 89px;
    flex-direction: column;
    align-items: center;
    > img {
      width: 160px;
      height: 160px;
    }
    > p {
      font-size: 14px;
      color: rgba(17, 18, 24, 0.5);
      line-height: 22px;
    }
  }
  /deep/ .highlights {
    color: @highlightColor !important;
  }
}
</style>
