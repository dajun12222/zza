<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    id="col-header"
    class="col-header"
    :class="outwardType"
    @click="textClick"
  >
    <div class="logo">
      <img v-if="logoSrc" :src="logoSrc" alt="logo" />
      <img v-else src="../yslogo.png" alt="logo" />
    </div>
    <div class="nav">
      <div
        v-for="(item, index) in navigator"
        :key="index"
        class="nav-item"
        :class="getClass(item)"
        @click="goTo(item)"
      >
        <div v-if="!!item.icon" class="nav-icon">
          <img
            v-if="item.icon.includes('http') || item.icon.includes('/api')"
            :src="item.icon"
            alt="icon"
          />
          <em v-else class="icon aufontAll" :class="item.icon"></em>
        </div>
        <div v-else class="nav-icon">
          <svg class="tabs-app-li-icon icon svgIcon" aria-hidden="true">
            <use xlink:href="#h-icon-all-application1" />
          </svg>
        </div>
        <!-- <span>{{ item.title }}</span> -->
        <span>{{ getTabTitle(item.title) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

import { Tooltip } from '@h3/antd-vue';

import { listApi } from 'cloudpivot/api';

@Component({
  components: {
    ATooltip: Tooltip,
  },
})
export default class colMenu extends Vue {
  @Prop()
  navigator!: any[];

  textClick(text) {
    if (this.runMode === 'design') {
      this.$emit('click', text);
    }
  }

  getClass(item) {
    if (item.portalPage === this.$route.name) {
      return 'active';
    }
    if (this.$route.params.pageCode === item.portalPage && item.portalPage) {
      return 'active';
    }
  }

  get logoSrc() {
    const refId: string = this.$store.state.themsConfig.portalLogo;
    return refId ? this.getDownloadUrlByRefId(refId) : '';
  }

  getDownloadUrlByRefId(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId, 'logo');
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {
    // console.log(this.navigator);
  }

  async goTo(item) {
    if (this.runMode !== 'runtime') {
      return;
    }
    const actionType = item.actionType;
    let url: string = '';
    switch (actionType) {
      case 'URL':
        // 链接到URL页面
        if (!item.URL) {
          return;
        }
        url = item.URL + '?return=' + location.pathname;
        break;
      case 'portalPage':
        // 链接到固定页面，分为系统固定的三种页面：工作台、流程中心、应用列表；
        // 这里通过固定链接URL打开，其他使用自定义页面编码打开
        switch (item.portalPage) {
          case 'defaultPortalDashboard':
            url =
              '/portal-page/defaultPortalDashboard' +
              '?return=' +
              location.pathname;
            break;
          case 'defaultWorkflowCenter':
            url = '/workflow-center' + '?return=' + location.pathname;
            break;
          case 'defaultApplicationList':
            url = '/app-list/applications' + '?return=' + location.pathname;
            break;
          default:
            // 自定义页面
            url = `/portal-page/${item.portalPage}`;
            break;
        }
        break;
      case 'app':
        // 链接到应用首页
        if (!item.app) {
          return;
        }
        url = `/application/${item.app}`;
        break;
      case 'bizModel':
        // 链接到模型
        if (!item.bizModel) {
          return;
        }
        const res: any = await listApi.getAppCodeByModelCode({
          schemaCode: item.bizModel as any,
        });
        if (res.errcode === 0) {
          url = `/application/${res.data.appCode}/application-list/${item.bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=`;
        }
        break;
      default:
        break;
    }

    if (item.openMode === 'curPage') {
      if (url.indexOf('https://') + url.indexOf('http://') > -1) {
        window.open(url, '_self');
      } else {
        this.$router.push(url);
      }
    } else {
      window.open(url, '_blank');
    }
  }

  get outwardType() {
    // 获取主题外观
    return this.$store.state.outwardType;
  }

  getTabTitle(title) {
    try {
      const tabTitle = JSON.parse(title);
      return tabTitle[this.$i18n.locale] || tabTitle['zh'];
    } catch (e) {
      return title;
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.col-header {
  // height: 100vh;
  // width: 200px;
  width: 100%;
  height: 100%;
  background: @headBGColor;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  box-shadow: 2px 0px 11px 0px rgba(199, 205, 215, 0.5), 1px 0px 0px 0px #eeeeee;
  &.dark {
    border-right: 0;
  }
  .logo {
    height: 64px;
    flex-basis: 64px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding-left: 32px;
    img {
      height: 24px;
    }
    flex-shrink: 0;
  }
  .nav {
    flex: 1;
    overflow: auto;
    .nav-item {
      display: flex;
      align-items: center;
      margin-top: 8px;
      height: 40px;
      font-size: 14px;
      line-height: 40px;
      padding-left: 24px;
      padding-right: 27px;
      cursor: pointer;
      color: #111218;
      .nav-icon {
        width: 16px;
        height: 16px;
        line-height: 16px;
        margin-right: 8px;
        > img,
        > svg {
          width: 16px;
          height: 16px;
          vertical-align: unset;
        }
        > em {
          font-size: 16px;
          font-weight: 600;
          color: #111218;
        }
      }
      > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        background: @hoveBGColor;
        color: #111218;
        .nav-icon {
          > em {
            color: #111218;
          }
        }
      }
      &.active {
        background: @activeBGColor;
        color: @highlightColor;
        .nav-icon {
          > em {
            color: @highlightColor;
          }
        }
      }
    }
  }
}
.dark {
  background: @subColor;
  .nav {
    .nav-item {
      color: #fff;
      .nav-icon {
        > em {
          color: #fff;
        }
      }
      &:hover {
        background: @hoverColor;
        color: #fff;
        .nav-icon {
          > em {
            color: #fff;
          }
        }
      }
      &.active {
        background: @activeBGColor;
        color: @highlightColor;
        .nav-icon {
          > em {
            color: @highlightColor;
          }
        }
      }
    }
  }
}
</style>
