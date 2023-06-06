/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fu Zhuohang
 * @Date: 2022-02-10 11:26:38
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-02 15:25:55
 * @FilePath: \yunshu6.0\modules\cloudpivot\flow-center\src\components\pc\common\toolMixin.ts
 * @Description:
 */
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as platform from 'cloudpivot-platform/platform';

@Component
export default class toolMixin extends Vue {
  get isDingtalk() {
    return platform.IS_DINGTALK;
  }
}
