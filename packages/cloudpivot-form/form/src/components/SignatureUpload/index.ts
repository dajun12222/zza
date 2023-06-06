/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-22 11:25:39
 * @LastEditTime: 2020-04-28 11:12:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \frontend\modules\cloudpivot\form\src\components\SignatureUpload\index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from './components/pc-signature.vue';
import mobile from './components/mobile-signature.vue';
export const info: ComponentInfo = {
  title: '手写签名',
  type: 'signature',
  icon: 'h-icon-all-edit-o',
  dataItemType: DataItemType.Attachment,
  formControllerType: FormControlType.Signature,
  group: '基础控件',
};

export default {
  info,
  schema,
  conduct,
  components: {
    design,
    pc,
    mobile,
  },
} as ComponentAsset;
