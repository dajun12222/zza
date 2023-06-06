/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-22 11:08:54
 * @LastEditTime: 2020-04-22 15:26:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \frontend\modules\cloudpivot\form\src\components\StaffSelector\index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from '../../../../form/src/common/components/form-staff-selector/pc/index.vue';
import mobile from '../../../../form/src/common/components/form-staff-selector/mobile/index.vue';
export const info: ComponentInfo = {
  title: '混合选人',
  type: 'StaffDeptMixed',
  icon: 'h-icon-all-a-Mixedselection-o',
  dataItemType: DataItemType.StaffDeptMix,
  formControllerType: FormControlType.StaffDeptMixed,
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
