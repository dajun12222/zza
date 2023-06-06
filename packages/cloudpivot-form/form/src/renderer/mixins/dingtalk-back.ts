/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Vue } from 'vue-property-decorator';
import ControlBack from '../directives/control-back';

//全局
@Component({
  name: 'DingtalkBack',
  directives: {
    ControlBack,
  },
})
export default class DingtalkBackMixin extends Vue {
  showModal: boolean = false;

  show() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }
}
