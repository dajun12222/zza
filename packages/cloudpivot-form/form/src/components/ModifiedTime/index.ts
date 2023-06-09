/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-22 11:08:54
 * @LastEditTime: 2020-04-22 17:09:50
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \frontend\modules\cloudpivot\form\src\components\ModifiedTime\index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from '../../../../form/src/common/components/system-control/pc/index.vue';
import mobile from '../../../../form/src/common/components/system-control/mobile/index.vue';
const info: ComponentInfo = {
  title: '修改时间',
  type: 'modifiedTime',
  icon: 'h-icon-all-clock-edit-o',
  dataItemType: DataItemType.Date,
  formControllerType: FormControlType.ModifiedTime,
  group: '系统控件',
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
