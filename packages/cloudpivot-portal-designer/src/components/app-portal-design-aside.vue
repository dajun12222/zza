<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <aside class="aside-container">
      <div class="aside">
        <!-- 应用树形控件搜索 -->
        <div class="app-list-search">
          <InputSearch :isAsync="true" :placeholder="placeholder" />
        </div>

        <!-- 应用列表树形控件 -->
        <div class="app-list-tree">
          <div class="app-portal">
            <em class="icon aufontAll h-icon-all-home1"></em> 首页
          </div>
          <a-tree
            :multiple="false"
            :showLine="false"
            defaultExpandAll
            :treeData="appList"
            :replaceFields="{
              children: 'children',
              key: 'code',
            }"
          >
            <span
              slot="title"
              slot-scope="{ name, name_i18n, icon }"
              class="cus-title"
            >
              <em v-if="icon" :class="'icon aufontAll ' + icon"></em>
              {{
                isChinese
                  ? name
                  : JSON.parse(name_i18n)
                  ? JSON.parse(name_i18n)['en']
                  : name
              }}
            </span>
          </a-tree>
        </div>
      </div>
      <div class="hide-menu" :style="{ top: '10px' }">
        <img
          src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAANgAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgANgAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCf/bAEMBAQEBAgICBAICBAkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCf/dAAQAAv/aAAwDAQACEQMRAD8A/pgooor7A+fCtjQde1Xw1qsOsaNM0E8DBgVJGcHofUHoQeCKoS2V5BbxXc0TpFPu8t2UhX2nDbSeDg9cdKrUmk1Yauj/0P6YK9Y8C+BtOuNOfxz45drXQrVsADiS7kHSKIe5+83bn3K+T19G6yB8ZvClrc+HT5OqaHbiOTS14jeJestuvr03L16DsN31VaTVl07niUkmeU+OvHF/431JJ5Y1trO1XyrS1j4jgiHRQPU4GT39gAK4ilIKkqwwRSVrGKSsjOUm3dn/0f6YK0dJ1bUtC1KHV9Ima3uYGDJIvUH+oPQg8EcGs6ivsGj59M7/AMe+KND8YXNtrllZGy1GVT9vCY8mSTIxJGOoLclge/qck8BRRUxikrIcpXd2f//S/pgooor7A+fCu3+Hvgy48eeJ7fw/BKsIkbLs2eEHLYwOTgHA457iuIr3n9nL/kpVt/uv/wCgtWdVtRbRdNXkkz//2Q=="
        />
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { Tree } from '@h3/antd-vue';
import { listApi, listParams } from 'cloudpivot/api';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({
  name: 'app-portal-design-aside',
  components: {
    ATree: Tree,
    InputSearch,
  },
})
export default class appPortalDesignAside extends Vue {
  @Prop() appCode!: string;

  placeholder: string = '应用内搜索';

  appList: any[] = [];

  created() {
    this.getAppGroups();
  }

  // 判断当前是否是中文版本
  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  /**
   * 获取侧边栏树
   */
  async getAppGroups() {
    const params: listParams.FolderSchema = {
      appCode: this.appCode,
      isMobile: false, // 需要处理
    };
    const res = await listApi.getFolder(params);
    if (res.errcode === 0) {
      if (!Array.isArray(res.data)) {
        return;
      }

      this.appList = res.data.map((i) => {
        i = this.initData(i);
        return i;
      });

      //当分组下没有可见模型时不显示分组
      this.appList = this.appList.filter((x) => {
        if (x.type === 'Folder') {
          if (Array.isArray(x.children) && x.children.length > 0) {
            x.children = [];
          }
          x.type = 'BizModel';
          x.icon = 'h-icon-all-caret-right';
          return x;
        } else {
          return x;
        }
      });
    }
  }

  initData(item) {
    item.scopedSlots = {
      title: 'title',
    };
    if (item.children && item.children.length) {
      item.children = item.children.map((i) => {
        i = this.initData(i);
        return i;
      });
    }
    return item;
  }
}
</script>

<style lang="less">
.aside-container {
  height: 100%;
  border-right: 1px solid #eee;
  position: relative;
  .aside {
    background: #fff;
    width: 250px;
    height: 100%;
  }
  .app-list-search {
    padding: 12px 16px;
  }
  .app-list-tree {
    height: calc(100% - 140px);
    overflow: auto;
    .app-portal {
      padding-left: 18px;
      height: 40px;
      line-height: 40px;
      background: rgba(0, 30, 116, 0.06);
      font-size: 14px;
      font-weight: 600;
      color: #2970ff;
      .aufontAll {
        margin-right: 11px;
      }
    }
    .ant-tree li {
      padding: 0;
      background: #fff;
      .ant-tree-node-content-wrapper:hover,
      .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background: initial;
      }
      .ant-tree-node-content-wrapper {
        margin-left: -6px;
        height: 40px;
        line-height: 40px;
        position: relative;
        padding: 0;
      }
    }
    .cus-title {
      .aufontAll {
        margin-right: 11px;
      }
      .h-icon-all-caret-right {
        font-size: 12px;
        color: rgba(17, 18, 24, 0.5);
      }
    }
    .ant-tree-switcher_close {
      margin-left: 20px;
      margin-right: 10px;
      line-height: 40px;
    }
  }
  .hide-menu {
    top: 10px;
    right: -15px;
    position: absolute;
    z-index: 99;
    img {
      width: 14px;
      height: 30px;
    }
  }
}
</style>
