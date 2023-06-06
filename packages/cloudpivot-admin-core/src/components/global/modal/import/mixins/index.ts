/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Import extends Vue {
  @Prop() value!: boolean;

  @Watch('value')
  onValueChange(v: boolean) {
    this.show = v;
  }

  // 展示
  show: boolean = false;

  modalTitle: string = '导入';

  // 当前步骤
  curStep: number = 0;

  uploadResult: any = {};

  validResult: any = {};

  /**
   * 导入完成时点击完成安扭
   * @param refresh
   * 关闭弹窗后是否刷新页面
   * */
  close(refresh?: boolean) {
    if (refresh) {
      this.importEnd();
    }
    this.$emit('input', false);
    this.curStep = 0;
    this.resetModalTitle();
  }

  /**
   * 导入完成后立即向父组件发送刷新列表信号
   */
  importEnd() {
    this.$emit('importEnd');
  }

  /**
   * 下一步逻辑
   * */
  nextStep(result) {
    //@ts-ignore
    if (this.curStep === 0) {
      this.uploadResult = result;
    } else if (this.curStep === 1) {
      this.validResult = result;
    } else {
      //Else Empty block statement
    }
    this.curStep += 1;
  }

  /**
   * 上一步
   * */
  prevStep() {
    this.curStep -= 1;
  }

  setModalTitle(title) {
    this.modalTitle = title;
  }

  //扩展点开始
  /**
   * 重置弹窗标题
   */
  resetModalTitle() {
    this.modalTitle = '导入';
  }
}
