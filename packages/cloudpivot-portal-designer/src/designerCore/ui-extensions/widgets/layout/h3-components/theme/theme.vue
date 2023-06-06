<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="theme-warp">
    <a-select
      :value="themeData.id"
      class="select-width"
      @change="handleChange"
    >
      <a-select-option
        v-for="(item, index) in options"
        :key="item.id"
        :value="item.id"
      >
        {{ item.title }}
        <a-icon
          v-if="index > 0"
          class="remove"
          type="close-circle"
          @click.stop="themeDelete(item)"
        />
      </a-select-option>
    </a-select>
    <a-popover
      v-model="visible"
      trigger="click"
      placement="bottomRight"
    >
      <template slot="content">
        <theme-ui
          v-model="themeData.theme"
          @change="setTheme"
        />
      </template>
      <template slot="title">
        <div class="title">
          <div class="name">
            {{ $t('widgets.themeSet.customTheme') }}
          </div>
          <div class="btn">
            <a-button
              size="small"
              type="primary"
              @click="resetTheme"
            >
              {{ $t('widgets.themeSet.reset') }}
            </a-button>
          </div>
        </div>
      </template>
      <a-button
        type="primary"
        class="theme-set"
        @click="themeSet"
      >
        <a-icon type="down" />
      </a-button>
    </a-popover>
    <a-button
      type="primary"
      @click.stop="addTheme"
    >
      {{ $t('widgets.themeSet.addTheme') }}
    </a-button>

    <a-modal
      :title="$t('widgets.themeSet.add')"
      :zIndex="zIndex"
      :visible="modaShow.add"
      @ok="addOk"
      @cancel="cancel('add')"
    >
      <a-list
        itemLayout="vertical"
        class="list-padding"
      >
        <a-list-item>
          <a-list-item-meta>
            <div slot="description">
              {{ $t('widgets.themeSet.themeName') }}:
            </div>
          </a-list-item-meta>
          <a-input v-model="addThemeName" />
        </a-list-item>
      </a-list>
    </a-modal>
    <a-modal
      :title="$t('widgets.themeSet.delete')"
      :zIndex="zIndex"
      :visible="modaShow.delete"
      @ok="shureDeleteTheme"
      @cancel="cancel('delete')"
    >
      <p>
        {{ $t('widgets.themeSet.deleteTheme') }} : {{ deleteTheme.title }}?
      </p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'; // Component Prop Watch Emit Model Provide Inject Mixins

import {
  Select,
  Modal,
  Icon,
  Popover,
  Button,
  List,
  Input,
} from '@h3/antd-vue';
// import themeUi from './themeUi.vue';
@Component({
  name: 'theme',
  components: {
    themeUi: () => import('./themeUi.vue'),
    AButton: Button,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    AList: List,
    AListItem: List.Item,
    AListItemMeta: List.Item.Meta,
    AIcon: Icon,
    AModal: Modal,
    APopover: Popover,
  },
})
export default class theme extends Vue {
  @Prop({
    default: () => [
      {
        id: 0,
        title: '',
        theme: {},
      },
    ],
  })
  value!: any[];

  zIndex: number = 999999;

  // 主题下拉选项
  options: any[] = [];

  initSet () {
    let selectedObj: any = false;
    if (this.value.length > 0) {
      this.options = this.value;
      this.options.forEach((obj, index) => {
        obj.selected = false;
        if (index === 0) {
          selectedObj = obj;
          selectedObj.title = this.$t('widgets.themeSet.default');
        }
        if (obj.selected) {
          selectedObj = obj;
        }
      });
    }
    if (selectedObj) {
      selectedObj.selected = true;
      this.themeData = selectedObj;
    }
  }

  created () {
    this.initSet();
  }

  // 增加的 主题的名称
  addThemeName: string = '';

  // 删除时 二次确认的 主题名称
  deleteTheme: any = {};

  // 当前主题对像
  themeData: any = {};

  // 用户下拉重新选择主题
  handleChange (val: any) {
    this.options.forEach(obj => {
      obj.selected = false;
      if (val === obj.id) {
        this.themeData = obj;
        obj.selected = true;
      }
    });
    this.$emit('change', this.options);
  }

  visible: boolean = false;

  modaShow: any = {
    add: false,
    delete: false,
  };

  cancel (str: string) {
    this.modaShow[str] = false;
  }

  // 增加主题
  addOk () {
    const n = this.options.length;
    const id = n > 0 ? this.options[n - 1].id + 1 : 0;
    this.options.push({
      id,
      theme: {},
      title: this.addThemeName,
      selected: false,
    });
    this.addThemeName = '';
    this.cancel('add');
    this.$emit('change', this.options);
  }

  // 用户修改某个主题
  setTheme (val: any) {
    this.options.forEach(obj => {
      if (this.themeData.id === obj.id) {
        obj.theme = val;
      }
    });
    this.$emit('change', this.options);
  }

  // 删除某个主题
  themeDelete (item: any) {
    this.modaShow.delete = true;
    this.deleteTheme = item;
    console.log(this.themeData, 'tesss');
  }

  // 确认删除某个主题
  shureDeleteTheme () {
    console.log(this.deleteTheme, 'fettdd');
    if (this.deleteTheme.selected) {
      this.themeData = this.options[0];
      this.themeData.selected = true;
    }
    const arr: any[] = [];
    this.options.forEach(obj => {
      if (this.deleteTheme !== obj) {
        arr.push(obj);
      }
    });
    this.cancel('delete');
    this.options = arr;
    this.$emit('change', this.options);
  }

  themeSet () {
    this.visible = true;
  }

  resetTheme () {
    this.themeData.theme = {};
    this.$emit('change', this.options);
  }

  addTheme () {
    this.modaShow.add = true;
    console.log('addTheme');
  }
}
</script>
<style lang="less" scoped>
.theme-warp {
  display: flex;
}

.theme-set {
  margin: 0 4px;
}
.list-padding {
  padding: 0;
}
.select-width {
  flex-grow: 1;
}
.add-warp {
  padding: 0 0 8px 4px;
}
.title {
  display: flex;
  text-align: right;
  .name {
    flex: 1;
  }
  .btn {
    flex: 1;
  }
}
.remove {
  float: right;
  cursor: pointer;
}
/deep/.ant-select {
  .remove {
    display: none;
  }
}
</style>
