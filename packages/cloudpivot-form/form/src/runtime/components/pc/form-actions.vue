<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-actions">
    <!-- 表单留痕按钮 -->
    <!-- <a-tooltip v-if="showTrack">
      <template slot="title">
        {{ $t("cloudpivot.list.pc.FormTrack") }}
      </template>
      <a-icon class="form-track" type="history"
        @click="proxyAction(showTrack)"
      />
    </a-tooltip> -->
    <!-- {{actions}} -->
    <div
      v-show="toShowPrints && setPdfConf"
      class="prints-drop-down animated fadeIn"
      :style="printBtnListStyle"
    >
      <div class="item-print" @click="printBtn('系统默认模板')">
        {{ $t('cloudpivot.list.pc.sysDefaultTemplate') }}
      </div>

      <template v-for="(item, index) in printTemplates">
        <a-tooltip :key="index" placement="top">
          <span slot="title">{{ item.name }}</span>
          <div :key="index" class="item-print" @click="printBtn(item)">
            {{ item.name }}
          </div>
        </a-tooltip>
      </template>
    </div>

    <template v-for="(ac, index) in actionsList">
      <template>
        <template>
          <a-tooltip :key="ac.code" placement="top">
            <template v-if="ac.custom && ac.hint" #title>
              <span>{{ ac.hint }}</span>
            </template>
            <a-button
              v-show="
                ac.visible !== false &&
                ac.code !== 'formTrack' &&
                ac.code !== 'FORMTRACK'
              "
              :ref="ac.code + 'Action'"
          :key="ac.code"
              :disabled="ac.disabled === true"
              :type="
                ac.code === 'submit' || ac.code === 'agree' || (( 
                  ac.code === 'edit' ||
                  (ac.code === 'save' && !notSubmit)) &&
                index === 0)
                  ? 'primary'
                  : 'default'
              "
              :class="[ac.code]"
              @click="(e) => proxyAction(ac, e)"
            >
              {{ ac.text }} 
            </a-button>
          </a-tooltip>
        </template>
        <template v-if="ac.code === 'submit' && isShowSubmitAndCreateBtn">
          <a-button
            :key="index"
            class="submit-and-create"
            @click="submitAndCreate"
          >
            {{ $t('cloudpivot.list.pc.Submit&Creating') }}
          </a-button>
        </template>
      </template>
    </template>
    <!-- <template v-if="actions.length > actionsNum">
      <a-popover
        overlayClassName="btn-more"
        :visible="isVisibleShow"
        :overlayStyle="{ width: '173px' }"
        @visibleChange="visibleChange"
      >
        <template slot="content">
          <template v-for="(ac2, index2) in btnMoreData">
            <div
              v-show="
                ac2.visible !== false &&
                ac2.code !== 'formTrack' &&
                ac2.code !== 'FORMTRACK'
              "
              :key="index2"
              class="btn-more-text"
              @click="(e) => proxyAction(ac2, e)"
            >
              <template v-if="ac2.custom && ac2.hint">
                <a-tooltip placement="right">
                  <template #title>
                    <span>{{ ac2.hint }}</span>
                  </template>
                  <span>{{ ac2.text }}</span>
                </a-tooltip>
              </template>
              <template v-else>
                <span>{{ ac2.text }}</span>
              </template>
            </div>
          </template>
        </template>
        <i
          v-if="
            !(btnMoreData.length === 1 && btnMoreData[0].code === 'formTrack')
          "
          class="icon aufontAll h-icon-all-ellipsis-o"
          @click="showBtn"
        ></i>
      </a-popover>
    </template> -->
  </div>
</template>

<script lang="ts">
import { Button, Icon, Popover, Tooltip } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FormActionButton } from '../../form-action-modal';
import { utils } from 'cloudpivot/common';

@Component({
  name: 'form-actions',
  components: {
    AButton: Button,
    ATooltip: Tooltip,
    AIcon: Icon,
    APopover: Popover,
  },
})
export default class FormActions extends Vue {
  @Prop()
  actions!: FormActionButton[];

  @Prop({ type: Boolean }) toShowPrints!: Boolean;

  @Prop({ default: false }) isShowSubmitAndCreateBtn!: Boolean;

  @Prop({ type: Boolean }) setPdfConf!: Boolean;

  @Prop({
    default: () => [],
  })
  printTemplates!: any[];

  printBtnListStyle = {}; // 打印按钮下拉框 样式

  footerStyleWidth: number = 500; //操作按钮容器的宽度

  actionsNum: number = 0; //展示在主界面按钮的数量

  onAction(ac: any) {
    this.$emit('action', ac);
  }

  submitAndCreate() {
    this.$emit('submitAndCreate');
  }

  get actionsList(){
    let actions = JSON.parse(JSON.stringify(this.actions));
    let acSubmit = actions.find((item:any) => {
      return item['code'] === 'submit';
    })
    let submitIndex = actions.findIndex((item:any) => {
      return item['code'] === 'submit';
    })
    if(submitIndex && submitIndex > -1){
      actions.splice(submitIndex,1);
      actions.unshift(acSubmit);
    }
    let acAgree = actions.find((item:any) => {
      return item['code'] === 'agree';
    })
    let agreeIndex = actions.findIndex((item:any) => {
      return item['code'] === 'agree';
    })
    if(agreeIndex && agreeIndex > -1){
      actions.splice(agreeIndex,1);
      actions.unshift(acAgree);
    }
    console.log('start....actions.......');
    console.log(actions);
    console.log('end....actions.......');
    return actions;
  }

  isShow: boolean = false;

  isVisibleShow: boolean = false;

  get notSubmit() {
    const action = this.actions.find((item: any) => {
      return item.code === 'submit';
    });
    console.log(this.actions, 'this.actions');
    return action;
  }

  /**
   * 展示更多按钮
   */
  showBtn() {}

  // 按钮点击代理
  proxyAction(ac: any, e) {
    // 打印按钮的下拉框 跟随 打印按钮
    // 当只有一个打印按钮时， 如果下拉框跟随按钮的话， 会遮住一部分， 这里直接-35px
    if (ac.disabled) {
      return;
    }
    if (ac.code === 'print' && !Object.keys(this.printBtnListStyle).length) {
      const pl = e.target;
      this.printBtnListStyle = { left: pl.offsetLeft - 35 + 'px' };
      this.$nextTick(() => {
        this.onAction(ac);
      });
    } else {
      this.onAction(ac);
    }
    this.isVisibleShow = false;
  }

  visibleChange(e) {
    this.isVisibleShow = e;
  }

  printBtn(item: any) {
    this.$emit('propPrintClick', item);
  }

  @Watch('actions')
  changActions() {
    if (
      Array.isArray(this.actions) &&
      this.actions.length >= 2 &&
      (this.actions[1].code === 'agree' ||
        this.actions[1].code === 'edit' ||
        this.actions[1].code === 'submit' ||
        this.actions[1].code === 'save')
    ) {
      this.exchange(this.actions, 0, 1);
    }
    console.log('actions======>', this.actions);
    setTimeout(() => {
      console.log(this.$refs['printAction']);
    });
    this.getFooterStyle();
  }

  created() {
    window.addEventListener('resize', this.getFooterStyle);
  }

  exchange(array: Array<any>, index1: number, index2: number) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  }

  get showTrack() {
    return this.actions.find(
      (item: any) => item.code === 'formTrack' || item.code === 'FORMTRACK',
    );
  }

  get btnMoreData() {
    return this.actions.filter((item, index) => {
      return index > this.actionsNum - 1;
    });
  }

  //计算操作按钮容器的宽度
  getFooterStyle() {
    const boxWidth: any = document.getElementsByClassName('footerStyle')[0];
    if (boxWidth) {
      this.footerStyleWidth = boxWidth.offsetWidth;
    }
    this.getActionsInfo();
  }

  //分配操作按显示在主界面或弹框
  getActionsInfo() {
    let conWidth: number = 66;
    this.actionsNum = 0;
    for (let con of this.actions) {
      if (con.visible !== false && con.code !== 'formTrack') {
        const length = utils.calcStrLength(con.text);
        conWidth += 7 * length + 40 > 88 ? 7 * length + 40 : 88;
        if (conWidth > this.footerStyleWidth) {
          break;
        }
      }
      this.actionsNum++;
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
.form-actions {
  // flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
  margin-left: 16px;
  text-align: right;
  position: relative;

  button {
    // margin-right: 8px;
    margin-left: 8px;
  }

  button.formTrack {
    margin-right: 0;
  }

  // 取消高亮
  .noHover {
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
  }
  .noHover:hover {
    border: 1px solid #5291ff;
    color: #5291ff;
  }

  .form-track {
    font-size: 16px;
    margin-top: 8px;
    margin-right: 16px;
    transform: rotateY(180deg);
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: @primary-color;
    }
  }
  .h-icon-all-ellipsis-o {
    font-size: 28px;
    width: 28px;
    height: 28px;
    color: rgba(17, 18, 24, 0.5);
    vertical-align: baseline;
    line-height: 34px;
    cursor: pointer;
    margin-right: 4px;
    &:hover {
      background: rgba(0, 30, 116, 0.06);
    }
  }
}
.prints-drop-down {
  min-width: 116px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(30, 85, 255, 0.15);
  background: #fff;
  position: absolute;
  // top: 55px;
  bottom: 100%;
  transform: translateY(-8px);
  z-index: 999;
  .item-print {
    text-align: left;
    height: 32px;
    line-height: 22px;
    padding: 5px 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    &:hover {
      cursor: pointer;
      background: rgba(240, 247, 255, 1);
      transition: 0.3s all;
    }
  }
}
.btn-more {
  padding: 4px 0;
  border-radius: 2px;
  overflow: hidden;
  .btn-more-text {
    width: 100%;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding: 0 11px;
    &:hover {
      background-color: rgba(0, 30, 116, 0.06);
    }
    span {
      width: 100%;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

<style>
.btn-more .ant-popover-inner-content {
  padding: 6px 0 11px 0;
  max-height: 328px;
  overflow-y: auto;
}
</style>
