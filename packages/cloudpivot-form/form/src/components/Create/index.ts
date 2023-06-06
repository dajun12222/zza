/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-22 11:08:54
 * @LastEditTime: 2020-04-22 17:00:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \frontend\modules\cloudpivot\form\src\components\Create\index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../typings';
import { DataItemType, FormControlType } from '../../../schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from '../../common/components/system-control/pc/index.vue';
import mobile from '../../common/components/system-control/mobile/index.vue';
const info: ComponentInfo = {
  title: '创建人',
  type: 'create',
  icon: 'h-icon-all-user-o',
  dataItemType: DataItemType.StaffSingle,
  formControllerType: FormControlType.CreateBy,
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
