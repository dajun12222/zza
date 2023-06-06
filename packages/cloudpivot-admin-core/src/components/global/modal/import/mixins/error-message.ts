/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DataUpload extends Vue {
  @Prop() errorParam!: any;

  // 扩展点开始
  /**
   * 文件不可用的判断逻辑（编码重复导致的不可用）
   * 默认之际返回errorParam中的fileInvalid
   */
  get fileInvalid() {
    return this.errorParam.fileInvalid;
  }
}
