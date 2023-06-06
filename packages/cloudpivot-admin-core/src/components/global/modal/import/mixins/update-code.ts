/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class UpdateCode extends Vue {
  @Prop() list!: any;

  tabKey: string = '1';

  tabPaneConfig: any[] = [];

  searchText: string = '';

  search(listKey) {
    if (Array.isArray(this.list[listKey])) {
      return this.list[listKey].filter(
        (el) => el.name.indexOf(this.searchText) > -1,
      );
    } else {
      return this.list[listKey];
    }
  }

  refreshDataSource(listKey?: string) {
    this.tabPaneConfig.forEach((config) => {
      if (listKey && config.listKey !== listKey) {
        return;
      }
      if (!config.showSearch) {
        config.dataSource = this.list[config.listKey];
      } else {
        config.dataSource = this.search(config.listKey);
      }
    });
    this.additionalRefresh();
    this.$forceUpdate();
  }

  clearKeyword(listKey) {
    this.searchText = '';
    this.refreshDataSource(listKey);
  }

  inputChange() {
    this.$emit('inputChange', this.list);
  }

  // 切换tab
  tabClick(val) {
    this.tabKey = val;
    this.searchText = '';
  }

  valueChange(item) {
    item.isShow = false;
  }

  getSubList(subCodeList) {
    const res: any = {};
    if (!subCodeList || !Array.isArray(subCodeList)) {
      return res;
    }
    subCodeList.forEach((el: any) => {
      if (res[el.parentSchemaCode]) {
        res[el.parentSchemaCode].push(el);
      } else {
        res[el.parentSchemaCode] = [el];
      }
    });
    return res;
  }

  //扩展点开始
  /**
   * 校验时出现重复编码或其他属性时，显示的提示信息
   */
  get duplicationInfo() {
    return '';
  }

  /**
   * 是否有多个tab页来展示修改编码表格
   */
  get notMultiList() {
    return true;
  }

  //默认的表格中渲染的code为newCode
  tableScopeInfo: any = {
    code: 'newCode',
    placeholder: this.$t('languages.Apps.PlzFillInNewCode'),
    duplicationTips: '该编码已存在',
  };

  /**
   * tab页配置为必填时的额外显隐逻辑
   */
  get showTabWhileRequired() {
    return true;
  }

  /**
   * 更新tab配置的额外逻辑
   */
  additionalRefresh() {}
}
