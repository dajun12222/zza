/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class FileImport extends Vue {
  @Prop() uploadResult!: any;

  @Prop() validResult!: any;

  simulateInterval: any = null;

  isImportEnd: boolean = false;

  percent: number = 0;

  progressStatus: string = 'active';

  importStatusTxt: string = '导入中';

  importHint: string = '导入数据过程中请不要关闭页面，避免导入错误';

  get strokeColor() {
    const { progressStatus } = this;
    if (progressStatus !== 'exception') {
      return '#17BC94';
    }
    return '#F4454E';
  }

  mounted() {
    this.importStart();
  }

  close() {
    this.$emit('close', this.progressStatus === 'success');
  }

  importStart() {
    this.simulateImport();
    this.doImport(this.uploadResult, this.validResult);
  }

  /**
   * 模拟导入处理进度
   */
  simulateImport() {
    let percent = 1;
    this.simulateInterval = setInterval(() => {
      if (!this.isImportEnd) {
        if (percent <= 90) {
          percent += this.random();
          this.percent = percent;
        }
      } else {
        clearInterval(this.simulateInterval);
      }
    }, 1500);
  }

  /**
   * 产生随机整数
   */
  random() {
    return Math.ceil(Math.random() * 5);
  }

  //扩展点开始
  /**
   * 导入接口调用函数
   * @param uploadResult
   * @param validResult
   */
  doImport(uploadResult, validResult) {}
}
