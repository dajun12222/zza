<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div id="table-bar" class="section-bar">
    <span class="bar-right">
      <template v-for="(el, index) in list">
        <span v-if="index < popIndex" :key="index">
          <a-button
            v-if="!el.children"
            :type="index === 0 ? 'primary' : 'default'"
            :class="utils.calcStrLength(el.name) > 8 ? 'ant-btn-large' : ''"
          >
            {{
              isChinese
                ? el.name
                : zhToEn[el.name_i18n[$i18n.locale]] ||
                  el.name_i18n[$i18n.locale]
            }}</a-button>
        </span>
      </template>
      <a-dropdown
        v-if="popIndex < list.length"
        :overlayClassName="'more-a-dropdown'"
        placement="bottomCenter"
        :destroyPopupOnHide="true"
      >
        <div class="trigger">
          <i class="icon aufontAll h-icon-all-ellipsis-o"></i>
        </div>
        <template #overlay>
          <a-menu>
            <template v-for="(el, index) in list">
              <a-menu-item v-if="index >= popIndex" :key="index">
                {{
                  isChinese
                    ? el.name
                    : zhToEn[el.name_i18n[$i18n.locale]] ||
                      el.name_i18n[$i18n.locale]
                }}
              </a-menu-item>
            </template>
          </a-menu>
        </template>
      </a-dropdown>
    </span>
    <OperationBar id="tool-block" :hasFormTrack="hasFormTrack" />
  </div>
</template>
<script lang="ts">
import { Icon, Menu, Button, Dropdown, Popover } from '@h3/antd-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import zhToEn from 'cloudpivot-list/list/src/components/pc/locales/zhToEn';
import OperationBar from 'cloudpivot-admin-core/src/components/apps/list-design/operation-bar.vue';
import { utils } from 'cloudpivot/common';

const ListdesignModule = namespace('Apps/Listdesign');

const DataModelModule = namespace('Apps/DataModel');

@Component({
  name: 'TableBar',
  components: {
    AIcon: Icon,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AButton: Button,
    ADropdown: Dropdown,
    APopover: Popover,
    OperationBar,
  },
})
export default class TableBar extends Vue {
  @ListdesignModule.State('operationAarry') operationAarry: any;

  @ListdesignModule.State('isShowPop') isShowPop: any;

  @ListdesignModule.Mutation('setShowPop') setShowPop: any;

  @DataModelModule.State('DatacustomButton') DatacustomButton: any;

  zhToEn: any = zhToEn;

  popIndex: number = Infinity;

  utils: any = utils;

  hasFormTrack: boolean = false;

  // 判断当前是否是中文版本
  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  mounted() {
    const resizeObserver = new ResizeObserver(() => {
      {
        this.resizeWindow();
      }
    });
    const leftContent = document.querySelector('.design-wrapper__left');
    resizeObserver.observe(leftContent);
  }

  hidePopover() {
    this.setShowPop(false);
  }

  get list() {
    const checkedBtn = JSON.parse(JSON.stringify(this.operationAarry))
      .map(
        (pl: any) =>
          // if (pl.data && typeof pl.data.name !== 'undefined') {
          //   pl.name = pl.data.name;
          // }
          pl,
      )
      .filter((el: any) => {
        console.log(el);
        if (el.actionCode === 'form_track') {
          this.hasFormTrack = true;
        }
        return el.checked === true && el.actionCode !== 'form_track';
      });
    if (this.DatacustomButton && this.DatacustomButton.ViewData) {
      const result = checkedBtn.concat(this.DatacustomButton.ViewData);
      this.resizeWindow(result);
      return result;
    }
    this.resizeWindow(checkedBtn);
    return checkedBtn;
  }

  resizeWindow(list?: any) {
    const tableBar: any = document.querySelector('#table-bar');
    let btnWidth = 0;
    if (tableBar) {
      btnWidth = tableBar.offsetWidth - 300;
    }

    this.popIndex = this.getPopIndex(btnWidth, list);
  }

  getPopIndex(btnWidth, list?: any) {
    let countWidth = 0;
    let count = 0;
    const tempList = list || this.list;
    while (countWidth < btnWidth && count < tempList.length) {
      const nameWidth: any = utils.calcStrLength(tempList[count].name);
      if (nameWidth >= 8) {
        countWidth += 7 * nameWidth + 44;
      } else {
        countWidth += 90;
      }
      count++;
    }
    if (count >= tempList.length) {
      return Infinity;
    } else {
      return count - 1;
    }
  }
}
</script>

<style lang="less" scoped>
.section-bar {
  min-width: 650px;
  // overflow: hidden;
  background: #fff;
  line-height: 55px;
  border-top: thin solid #e4e4e4;
  .title-2 {
    font-weight: 400;
    color: rgba(27, 27, 27, 0.85);
  }
  button {
    margin-left: 10px;
  }
  .bar-right {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    .bar-filter {
      vertical-align: middle;
      line-height: 32px;
      margin-right: 8px;
      cursor: pointer;
      .icon:hover {
        color: @primary-color;
      }
      .high-light {
        color: @primary-color;
      }
    }
    .trigger {
      width: 32px;
      height: 32px;
      border-radius: 2px;
      line-height: 32px;
      text-align: center;
      margin-left: 10px;
      margin-right: 20px;
      cursor: pointer;
      .icon {
        color: rgba(17, 18, 24, 0.5);
        font-size: 22px;
        position: relative;
        top: 2px;
      }
      &:hover {
        background: rgba(0, 30, 116, 0.06);
        .icon {
          color: #2970ff;
        }
      }
    }
  }
  .filter-box {
    position: absolute;
    top: 56px;
    width: calc(100% + 32px);
    margin-left: -16px;
    z-index: 666;
    margin-top: -8px;
    .content-box {
      padding: 10px 16px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      background: #fff;
      max-height: 510px;
      overflow-y: auto;
      z-index: 9;
    }
  }
}
.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
</style>

<style lang="less">
.more-a-dropdown {
  padding-top: 10px;
}
</style>
