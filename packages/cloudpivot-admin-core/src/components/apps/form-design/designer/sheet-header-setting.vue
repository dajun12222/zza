<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="sheet-header-setting"
    :class="{ wrapper: !isChild }"
    @mouseleave="setOut"
  >
    <template v-if="!isChild">
      <div class="tips-wrapper" :class="{ 'show-tips': isFirstIn }">
        <em class="icon aufontAll h-icon-all-question-circle-o"></em>
        <div
          v-if="!hideTips"
          class="tips"
          :class="{ 'is-first-in': isFirstIn }"
        >
          <div class="img-wrapper"></div>
          <div class="btn">
            <div>💡 按住鼠标左键向右移动选择表头</div>
            <a-button v-if="isFirstIn" type="primary" @click="iknow">我知道了</a-button>
          </div>
        </div>
      </div>
    </template>
    <template v-if="!isChild">
      <div class="tr-wrapper">
        <div class="tr" :class="{ 'child-tr': isChild }">
          <div
            v-for="(item, key) in sheetColumns"
            :key="item.key + (item.groupName || item.options.name)"
            class="td"
            :class="{
              child: !item.child,
              group: item.child,
              active: overList.includes(item.index),
              'active-first': overList[0] === item.index,
              'active-last': overList[overList.length - 1] === item.index,
            }"
            @mousedown="setStart(item.index, key)"
            @mouseup="
              (e) => {
                setEnd(item.index, e);
              }
            "
            @mouseenter="setEnter(item.index)"
            @mousemove="setMouseover"
          >
            <div :ref="'ref' + item.groupName" class="name">
              <template v-if="item.groupName">
                <span>{{ item.groupName }}</span>
              </template>
              <template v-else>
                {{ item.options.name }}
              </template>

              <template v-if="item.groupName">
                <a-popover
                  placement="bottom"
                  overlayClassName="set-group-name-pop"
                >
                  <template slot="content">
                    <p @click.stop="reName(item)">重命名</p>
                    <p @click.stop="delGroup(item, key)">删除</p>
                  </template>
                  <em
                    class="icon aufontAll h-icon-all-setting-o"
                    @click.stop="() => {}"
                  ></em>
                </a-popover>
              </template>
            </div>
            <template v-if="item.child">
              <sheetHeaderSetting
                :columns="item.child"
                :isChild="true"
                @setChild="(val) => setChild(item, val)"
                @goScroll="goScroll"
                @clearTimeout="clearTimeout"
              />
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="tr" :class="{ 'child-tr': isChild }">
        <div
          v-for="(item, key) in sheetColumns"
          :key="item.key + (item.groupName || item.options.name)"
          class="td"
          :class="{
            child: !item.child,
            group: item.child,
            active: overList.includes(item.index),
            'active-first': overList[0] === item.index,
            'active-last': overList[overList.length - 1] === item.index,
          }"
          @mousedown="setStart(item.index, key)"
          @mouseup="
            (e) => {
              setEnd(item.index, e);
            }
          "
          @mouseenter="setEnter(item.index)"
          @mousemove="setMouseover"
        >
          <div :ref="'ref' + item.groupName" class="name">
            {{ item.groupName || item.options.name }}

            <template v-if="item.groupName">
              <a-popover
                placement="bottom"
                overlayClassName="set-group-name-pop"
              >
                <template slot="content">
                  <p @click.stop="reName(item)">重命名</p>
                  <p @click.stop="delGroup(item, key)">删除</p>
                </template>
                <em
                  class="icon aufontAll h-icon-all-setting-o"
                  @click.stop="() => {}"
                ></em>
              </a-popover>
            </template>
          </div>
          <template v-if="item.child">
            <sheetHeaderSetting
              :columns="item.child"
              :isChild="true"
              @setChild="(val) => setChild(item, val)"
              @goScroll="goScroll"
              @clearTimeout="clearTimeout"
            />
          </template>
        </div>
      </div>
    </template>

    <template v-if="!isChild">
      <div class="setting-footer">
        <div class="btns">
          <a-button @click="close">取消</a-button>
          <a-button type="primary" @click="confirm">确定</a-button>
        </div>
      </div>
    </template>

    <div
      v-show="modalVisible"
      class="pop-modal-shadow"
      @click="modalVisible = false"
    ></div>
    <div v-show="modalVisible" class="pop-modal" :style="popModalStyle">
      <p>{{ title }}</p>
      <a-input v-model="groupName" placeholder="请输入表头名称" />
      <div class="btn">
        <a-button size="small" @click="cancel">取消</a-button>
        <a-button size="small" type="primary" @click="ok">确定</a-button>
      </div>
    </div>

    <template v-if="!isChild && columns.length === 0">
      <div class="empty-columns">
        <img
          :src="require('../../../../assets/images/empty-columns.png')"
          alt=""
        />
        <p>子表未添加控件，请添加控件后再配置多级表头</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Modal, Input, Button, Popover } from '@h3/antd-vue';

@Component({
  name: 'sheetHeaderSetting',
  components: {
    AModal: Modal,
    AInput: Input,
    AButton: Button,
    APopover: Popover,
  },
})
export default class sheetHeaderSetting extends Vue {
  @Prop()
  columns!: any[];

  @Prop({
    default: false,
  })
  isChild?: boolean;

  @Prop()
  modalData?: any;

  headerGroup: any[] = [];

  modalVisible: boolean = false;

  groupName: string = '';

  title = '添加多级表头';

  // 获取设置的值
  confirm() {
    const data = this.getData(this.sheetColumns);
    this.$emit('confirm', data);
  }

  // 取消
  close() {
    this.$emit('cancel');
  }

  // 获取设置的值
  getData(data: any[]) {
    let res: any = [];
    data.forEach((el) => {
      if (el.groupName) {
        let item: any = {
          groupName: el.groupName,
          colspan: el.colspan,
        };
        if (el.child) {
          item.child = this.getData(el.child);
          if (item.child.length === 0) {
            delete item.child;
          }
        }
        res.push(item);
      }
    });
    return res;
  }

  cancel() {
    this.reset();
    this.modalVisible = false;
  }

  ok() {
    if (this.groupName === '') {
      this.$message.error('表头名称不能为空');
      return;
    }

    if (this.groupName.length > 40) {
      this.$message.error('分组名称不能超过40字');
      return;
    }

    if (this.title === '重命名') {
      this.reNameItem.groupName = this.groupName;
      this.reset();
      return;
    }

    let sliceCols = this.sheetColumns.filter((el) => {
      return this.startIndex <= el.index && el.index <= this.endIndex;
    });

    let res = this.sheetColumns.filter((el) => {
      return !(this.startIndex <= el.index && el.index <= this.endIndex);
    });
    res.splice(this.startKey, 0, {
      groupName: this.groupName,
      colspan: [this.startIndex, this.endIndex],
      child: sliceCols,
    });
    this.reset();
    this.sheetColumns = res;

    if (this.isChild) {
      this.$emit('setChild', res);
    }
  }

  setChild(item, val) {
    item.child = val;
  }

  reset() {
    this.modalVisible = false;
    this.groupName = '';
    this.startIndex = -1;
    this.endIndex = -1;
    this.startKey = -1;
    this.overList = [];
    this.reNameItem = null;
    this.title = '添加多级表头';
    this.clearTimeout();
  }

  // 开始位置
  startIndex: number = -1;

  // 结束位置
  endIndex: number = -1;

  startKey: number = -1;

  setStart(index: number, key) {
    this.startIndex = index;
    this.startKey = key;
    this.overList = [index];
  }

  // 划过的列
  overList: number[] = [];

  popModalStyle: any = {};

  // 正在重命名分组
  reNameItem: any = null;

  // 分组重命名
  reName(item) {
    this.title = '重命名';
    this.reNameItem = item;
    // @ts-ignore
    const ref: any = this.$refs['ref' + item.groupName][0];
    if (ref) {
      const rect = ref.getBoundingClientRect();

      const right =
        document.body.clientWidth - rect.right > 0
          ? document.body.clientWidth - rect.right
          : 0;
      this.popModalStyle = {
        top: rect.bottom + 8 + 'px',
        right: right + 'px',
      };

      if (right + 272 > document.body.clientWidth) {
        this.popModalStyle = {
          top: rect.bottom + 8 + 'px',
          left: 0,
        };
      }
      this.groupName = item.groupName;
      this.modalVisible = true;
    }
  }

  // 删除分组
  delGroup(item, index) {
    this.sheetColumns.splice(index, 1, ...item.child);
  }

  setEnd(index, event) {
    this.clearTimeout();

    if (this.overList.length <= 1) {
      this.reset();
      return;
    }

    this.scrollTimer = null;
    if (
      index > this.startIndex &&
      this.startIndex !== -1 &&
      this.startKey !== -1
    ) {
      this.endIndex = index;
      this.title = '添加多级表头';
      this.modalVisible = true;
    }

    let node = event.target;
    while (!node.classList.contains('td')) {
      node = node.parentNode;
    }
    const rect = node.getBoundingClientRect();

    const right =
      document.body.clientWidth - rect.right > 0
        ? document.body.clientWidth - rect.right
        : 0;
    this.popModalStyle = {
      top: rect.bottom + 8 + 'px',
      right: right + 'px',
    };

    if (right + 272 > document.body.clientWidth) {
      this.popModalStyle = {
        top: rect.bottom + 8 + 'px',
        left: 0,
      };
    }
  }

  setMouseover(event) {
    if (this.startIndex === -1) {
      return;
    }

    // let node = event.target;
    // while (!node.classList.contains('td')) {
    //   node = node.parentNode;
    // }
    // const rect = node.getBoundingClientRect();
    if (document.body.clientWidth - 100 < event.x) {
      if (this.isChild) {
        this.$emit('goScroll');
      } else {
        this.goScroll();
      }
    } else {
      if (this.isChild) {
        this.$emit('clearTimeout');
      } else {
        this.clearTimeout();
      }
    }
  }

  scrollTimer: any = null;

  clearTimeout() {
    if (this.isChild) {
      this.$emit('clearTimeout');
      return;
    }
    clearTimeout(this.scrollTimer);
    this.scrollTimer = null;
  }

  goScroll() {
    if (this.isChild) {
      this.$emit('goScroll');
      return;
    }

    if (!this.scrollTimer) {
      const oDiv = document.querySelector('.tr-wrapper');
      if (oDiv) {
        this.setScrollLeft(oDiv);
      }
    }
  }

  setScrollLeft(oDiv) {
    this.scrollTimer = setTimeout(() => {
      oDiv.scrollLeft += 2;
      this.setScrollLeft(oDiv);
    }, 10);
  }

  setEnter(index) {
    if (this.startIndex === -1 || this.modalVisible) {
      return;
    }

    if (
      this.overList.length &&
      this.overList[this.overList.length - 1] + 1 === index
    ) {
      this.overList.push(index);
    } else if (
      this.overList.length &&
      this.overList[this.overList.length - 1] > index
    ) {
      this.overList.pop();
    }
  }

  setOut() {
    if (!this.modalVisible) {
      this.reset();
    }
  }

  sheetColumns: any[] = [];

  // 用户第一次设置多表头
  isFirstIn: boolean = false;

  hideTips: boolean = false;

  iknow() {
    this.isFirstIn = false;
    this.hideTips = true;
    setTimeout(() => {
      this.hideTips = false;
    }, 300);

    const isNotFirstSetHeaderGroup: string[] = JSON.parse(
      localStorage.getItem('isNotFirstSetHeaderGroup') || '[]',
    );
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    isNotFirstSetHeaderGroup.push(user.userId);
    localStorage.setItem(
      'isNotFirstSetHeaderGroup',
      JSON.stringify([...new Set(isNotFirstSetHeaderGroup)]),
    );
  }

  created() {
    if (!this.isChild) {
      const isNotFirstSetHeaderGroup: string[] = JSON.parse(
        localStorage.getItem('isNotFirstSetHeaderGroup') || '[]',
      );
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');

      if (!isNotFirstSetHeaderGroup.includes(user.userId)) {
        this.isFirstIn = true;
      }
    }
    this.initColumns();
  }

  initColumns() {
    if (!this.isChild) {
      this.sheetColumns = this.columns.map((el, index) => {
        let parseEl = JSON.parse(JSON.stringify(el));
        parseEl.index = index;
        return parseEl;
      });

      // 已经设置过多表头
      if (this.modalData) {
        this.initheadGroup();
      }
    } else {
      this.sheetColumns = this.columns;
    }
  }

  // 回显历史设置的多表头数据
  initheadGroup() {
    const loop = (group: any[], columns, sheetColumns) => {
      let res: any[] = [];
      const childColspans = this.childColspans(group);
      const groupStartIndexs = childColspans.map((el) => el[0]);
      columns.forEach((el) => {
        if (groupStartIndexs.includes(el.index)) {
          // 分组开始的列
          const item = group.find((item) => item.colspan[0] === el.index);
          const childList = sheetColumns.slice(
            item.colspan[0],
            item.colspan[1] + 1,
          );
          const child = item.child
            ? loop(item.child, childList, sheetColumns)
            : childList;
          res.push({
            groupName: item.groupName,
            colspan: item.colspan,
            child: child,
          });
        } else {
          if (this.isshow(el.index, childColspans)) {
            res.push(el);
          }
        }
      });
      return res;
    };
    this.sheetColumns = loop(
      this.modalData,
      this.sheetColumns,
      this.sheetColumns,
    );
  }

  childColspans(group): [number, number][] {
    return group.map((el) => el.colspan);
  }

  // 是否显示列
  isshow(colIdx, childColspans) {
    if (
      childColspans.some((colspan) => {
        return colspan[0] < colIdx && colIdx <= colspan[1];
      })
    ) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="less">
.empty-columns {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
    margin-top: 24px;
  }
}
.set-group-name-pop {
  .ant-popover-content,
  .ant-popover-arrow {
    margin-top: -15px;
  }
  .ant-popover-inner-content {
    padding: 4px 0;
    width: 98px;
  }
  p {
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    &:hover {
      background-color: rgba(216, 229, 255, 1);
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>

<style lang="less" scoped>
.setting-footer {
  position: absolute;
  height: 80px;
  width: 100%;
  bottom: 0;
  .btns {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      margin: 0 8px;
    }
  }
}

.pop-modal-shadow {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}
.pop-modal {
  position: fixed;
  width: 272px;
  height: 130px;
  padding: 16px 16px 16px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(17, 18, 24, 0.15);
  z-index: 6;
  p {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 18px;
  }
  .btn {
    text-align: right;
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    button {
      margin-left: 8px;
    }
  }
}

.sheet-header-setting.wrapper {
  margin-left: 24px;
  width: calc(100% - 48px);
  height: 100%;
  .tr-wrapper {
    width: 100%;
    height: calc(100% - 104px);
    overflow: auto;
    border: 1px solid #d9d9d9;
    margin-top: 24px;
    position: relative;
  }
  // &>.tr{
  //   width: 100%;
  //   overflow: auto;
  // }
}

.tips-wrapper {
  position: absolute;
  top: 18px;
  left: 153px;
  z-index: 22;
  &.show-tips {
    cursor: pointer;
    em {
      color: #2970ff;
    }
    .tips {
      display: block !important;
    }
  }

  &:hover {
    cursor: pointer;
    em {
      color: #2970ff;
    }
    .tips {
      display: block;
    }
  }
}
.tips {
  display: none;
  position: absolute;
  left: -20px;
  top: 30px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(17, 18, 24, 0.15);
  background-color: rgba(198, 216, 255, 1);
  border-radius: 4px 4px 0 0;
  &.is-first-in {
    display: block;
  }
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 7px solid rgba(198, 216, 255, 1);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    left: 20px;
    top: -7px;
  }

  .img-wrapper {
    margin: 20px;
    width: 228px;
    height: 148px;
    background-image: url('~cloudpivot-admin-core/src/assets/images/tips.gif');
    background-size: cover;
  }
  .btn {
    text-align: right;
    background-color: #fff;
    padding: 0 20px 20px;
    div {
      line-height: 20px;
      font-size: 14px;
      text-align: left;
      padding: 14px 0 20px;
    }
  }
}

.tr {
  display: flex;
  // border-left: 1px solid #e8e8e8;
  width: 100%;
  &.child-tr {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: none;
    height: 100%;
    .td {
      border-bottom: none;
      height: 100%;
      &:last-child {
        border-right: none;
      }
    }
  }
  .td {
    flex: 1;
    background-color: #fafafa;
    text-align: center;
    line-height: 32px;
    white-space: nowrap;
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
    -webkit-touch-callout: none; /*系统默认菜单被禁用*/
    -webkit-user-select: none; /*webkit浏览器*/
    -khtml-user-select: none; /*早期浏览器*/
    -moz-user-select: none; /*火狐*/
    -ms-user-select: none; /*IE10*/
    user-select: none;
    font-weight: 600;
    &.child {
      text-align: left;
      padding: 0 8px;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      &:hover {
        background-color: rgba(242, 247, 255, 1);
      }
      .name {
        min-width: 88px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.active {
        box-sizing: content-box;
        background-color: rgba(216, 229, 255, 1);
        border-top: 1px dashed rgba(41, 112, 255, 1);
        border-bottom: 1px dashed rgba(41, 112, 255, 1);
        &.active-first {
          border-left: 1px dashed rgba(41, 112, 255, 1);
        }
        &.active-last {
          border-right: 1px dashed rgba(41, 112, 255, 1);
        }
      }
    }
    &.group {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      .name {
        width: 100%;
        position: relative;
        span {
          display: block;
          width: calc(100% - 24px);
          margin-left: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        em {
          position: absolute;
          right: 8px;
          font-size: 12px;
          // display: none;
          color: rgba(17, 18, 24, 0.5);
          top: 50%;
          transform: translateY(-50%);
          &:hover {
            color: #2970ff;
            cursor: pointer;
          }
        }
        // &:hover{
        //   em{
        //     display: inline-block;
        //   }
        // }
      }
      & > div:last-child {
        flex: 1;
      }
    }
  }
}
</style>
