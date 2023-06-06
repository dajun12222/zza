<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="designer-shortcut-list shortcut-list"
    :style="wrapStyle"
    @click="textClick"
  >
    <div class="header" :style="style">
      <b></b>
      <span>{{ $t('languages.common.workBenchInfo.Shortcut') }}</span>
    </div>
    <div
      class="shortcut-list-wrapper"
      :class="{ opacity: runMode !== 'runtime' }"
    >
      <template v-for="(item, index) in list">
        <div
          :key="index"
          class="list-item"
          :style="style"
          @click="openDetail(item)"
        >
          <span class="icon-wrapper">
            <em
              class="icon aufontAll"
              :class="item.icon || 'h-icon-all-catalogue-o'"
            ></em>
          </span>
          <div class="appNameTitle">
            <div class="title" :style="style">
              {{ item.name }}
              <!-- <span v-if="item.type === 5" class="is-flow">流程</span> -->
            </div>
            <div class="appName">{{ item.appName }}</div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="runMode !== 'runtime'" class="text-area-content">
      <div class="text-area">
        <span class="icon aufontAll warning">&#xe99a;</span>
        <span>{{ $t('languages.common.workBenchInfo.tips5') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { workbenchApi } from 'cloudpivot/api';

interface SHORTCUT {
  appCode: string;
  appName: string;
  appName_i18n: string;
  code: string;
  icon: string;
  id: string;
  name: string;
  name_i18n: string;
  type: string;
}

@Component({
  components: {},
})
export default class shortcutList extends Vue {
  @Inject({
    default: () => {},
  })
  showFormDetail: Function;

  @Prop({
    default: '',
  })
  backgroundColor!: string;

  @Prop({
    default: '',
  })
  backgroundImg!: string;

  @Prop({
    default: '',
  })
  borderRadius!: string;

  @Prop({
    default: '',
  })
  borderStyle!: string;

  @Prop({
    default: 0,
  })
  borderThickness!: number;

  @Prop({
    default: '',
  })
  borderColor!: string;

  @Prop({
    default: '',
  })
  textColor!: string;

  @Prop({
    default: '',
  })
  textThickness!: string;

  list: any[] = [];

  tips: string = '业务组件带有业务逻辑，仅可以自定义样式';

  get wrapStyle() {
    const style: any = {};

    if (this.backgroundImg) {
      // 背景颜色
      style['background-image'] = `url(${this.backgroundImg})`;
    }

    if (this.backgroundColor) {
      // 背景颜色
      style['background-color'] = this.backgroundColor;
    }

    if (this.borderRadius) {
      // 圆角
      const RadiusEnum = {
        none: '0px',
        small: '2px',
        medium: '4px',
        big: '8px',
      };
      style['border-radius'] = RadiusEnum[this.borderRadius];
    }

    if (this.borderStyle) {
      // 边框类型
      style['border-style'] = this.borderStyle;
    }
    // 边框粗细
    style['border-width'] =
      this.borderThickness > 0 ? this.borderThickness + 'px' : 0;

    if (this.borderColor) {
      // 边框颜色
      style['border-color'] = this.borderColor;
    }
    style['box-shadow'] ='0px 0px 5px #e5e5e5';
    return style;
  }

  get style() {
    const style: any = {};
    if (this.textColor) {
      style['color'] = this.textColor;
    }
    if (this.textThickness) {
      style['font-weight'] = this.textThickness;
    }
    return style;
  }

  textClick(text) {
    if (this.runMode === 'design') {
      this.$emit('click', text);
    }
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {
    if (this.runMode === 'runtime') {
      this.getList();
    } else {
      this.list = [
        {
          appCode: '',
          appName: '',
          appName_i18n: '',
          code: '',
          icon: 'h-icon-all-yingyong',
          id: '',
          name: '【示例模型】客户跟进管理流程表单',
          name_i18n: '{"en":"【示例模型】客户跟进管理流程表单"}',
          type: 5,
        },
        {
          appCode: '',
          appName: '',
          appName_i18n: '',
          code: '',
          icon: '',
          id: '',
          name: '【示例模型】敏捷开发项目管理表单',
          name_i18n: '{"en":"【示例模型】敏捷开发项目管理表单"}',
          type: 3,
        },
        {
          appCode: '',
          appName: '',
          appName_i18n: '',
          code: '',
          icon: 'h-icon-all-yingyong',
          id: '',
          name: '【示例模型】官网专题策划表单',
          name_i18n: '{"en":"【示例模型】官网专题策划表单"}',
          type: 3,
        },
        {
          appCode: '',
          appName: '',
          appName_i18n: '',
          code: '',
          icon: '',
          id: '',
          name: '【示例模型】官网专题策划表单',
          name_i18n: '{"en":"【示例模型】官网专题策划表单"}',
          type: 5,
        },
      ];
    }
  }

  async getList() {
    const res = await workbenchApi.getListFavoritesShortcut();
    if (res.errcode === 0) {
      this.list = res.data as SHORTCUT[];
    }
  }

  // 打开最近使用

  openDetail(obj) {
    let url: string = '';
    if (obj.type === 5) {
      const code = obj.code;
      url = `/form/detail?startWorkflowCode=${code}`;
      url += `&return=${
        location.pathname + encodeURIComponent(location.search)
      }`;
    } else {
      url = `/form/detail?schemaCode=${obj.code}&sheetCode=&queryCode=`;
      url += `&return=${
        location.pathname + encodeURIComponent(location.search)
      }`;
    }

    if (this.isDingTalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      this.showFormDetail(url);
    }
  }

  getDisplayName(item) {
    let name: string = item.name;
    if (item.name_i18n) {
      const name_i18n =
        typeof item.name_i18n === 'object'
          ? item.name_i18n
          : JSON.parse(item.name_i18n);
      name = name_i18n[this.$i18n.locale] || name;
    }
    return name;
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.shortcut-list {
  border: 1px solid @primaryColor;
  max-width: 100%;
  overflow: hidden;
  background-repeat: convert; 
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .header {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 600 !important;
    color: @textColor;
    padding-left: 24px;
    flex: 0;
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #e5e5e5;
    margin-bottom: 8px;
    > b {
      display: inline-block;
      width: 3px;
      height: 14px;
      background: linear-gradient(180deg, #017CC6 0%, #004E92 100%);
      margin-right: 8px;
      margin-top: 1px;
    }
  }
  .shortcut-list-wrapper {
    padding-top: 6px;
    flex: 1;
    overflow: auto;
    &.opacity {
      opacity: 0.2;
    }
    .list-item {
      margin: 0 auto;
      background: #F5FCFF;
      border-radius: 25px;
      padding: 8px 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 22px;
      margin-bottom: 18px;
      width: 90%;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        // em {
        //   color: @highlightColor !important;
        // }
        // .title {
        //   color: @highlightColor !important;
        // }
        // .appName {
        //   color: @highlightColor !important;
        //   opacity: 1;
        // }
        .is-flow{
          background: rgba(35, 110, 235, 0.1);
        }

        background: rgba(232,139,140,0.09);
        em {
          color: rgba(232,139,140,1);
        }
        .appName {
          background: #FFEAE3 !important;
          color: #F58664 !important;
        }
      }
      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        // width: 36px;
        // height: 36px;
        // border-radius: 100%;
        // background: rgba(35,110,235,0.05);
        margin-right: 16px;
      }
      em {
        font-size: 16px;
        color: @primaryColor;
        //margin-right: 6px;
      }
      .appNameTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 90%;
        .title {
          font-size: 14px;
          font-weight: 500;
          //color: @text-color;
          color: #111218;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          //max-width: calc(100% - 80px);
        }
        .appName {
          font-size: 10px;
          color: #37C5FF;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          //opacity: 0.5;
          padding: 0 4px;
          height: 20px;
          background: rgba(55,197,255,0.15);
          border-radius: 3px;
          font-weight: 400;
        }
      }
      
      .is-flow {
        // width: 32px;
        min-width: 32px;
        // flex: 0;
        padding: 0 4px;
        height: 16px;
        line-height: 16px;
        background: rgba(35, 110, 235, 0.05);
        border-radius: 2px;
        font-size: 12px;
        color: @primaryColor;
        text-align: center;
        display: inline-block;
        margin-left: 8px;
        margin-top: 1px;
      }
    }
   
  }
  .text-area-content {
    position: absolute;
    top: 0;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .text-area {
      background: #fffbe6;
      border-radius: 4px;
      border: 1px solid #ffe58f;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      .icon {
        color: #faad14;
        font-size: 14px;
        margin-right: 8px;
      }
    }
  }
}
</style>
