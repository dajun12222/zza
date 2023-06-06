/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class FileValidate extends Vue {
  @Prop() fileName!: string;

  // 是否显示修改编码
  isShowUpdateCode: boolean = false;

  // 是否显示错误详情
  isShowErrorDetail: boolean = false;

  // 是否校验完成
  isValidated: boolean = false;

  // 文件检验是否通过
  fileInvalid: boolean = false;

  // 文件是否正确
  isFileOk: boolean = false;

  // 文件错误
  fileErrMsg: string = '文件校验不通过';

  mounted() {
    this.checkApp();
  }

  nextStep(overWrite) {
    this.$emit('nextStep', Object.assign(this.validResult, { overWrite }));
  }

  prevStep() {
    this.$emit('prevStep');
  }

  async save() {
    this.checkApp().then((res) => {
      if (!res) {
        this.nextStep(false);
      } else {
        this.updateCode();
      }
    });
  }

  coverAndImport() {
    this.nextStep(true);
  }

  updateCode() {
    this.$emit('setModalTitle', '导入-修改编码');
    this.isShowUpdateCode = true;
  }

  closeUpdateCode() {
    this.$emit('resetTitle');
    this.isShowUpdateCode = false;
  }

  directImport() {
    this.nextStep(false);
  }

  saveAndReturn() {
    this.checkApp().then((res) => {
      if (res) {
        this.updateCode();
      }
    });
  }

  //扩展点开始

  /**
   * 导入校验逻辑
   * @returns
   */
  async checkApp() {
    return false;
  }

  //显示修改编码组件的计算属性
  get showUpdateCodeView() {
    return this.isShowUpdateCode;
  }

  /**
   * 校验结果
   */
  get validResult() {
    return {};
  }

  // 编码重复错误提示
  coreRepeatErrMsg: string = '服务方法编码在当前系统已存在，是否要覆盖？';
}
