/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-13 15:10:17
 * @LastEditTime: 2020-04-22 16:23:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/Date/index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../typings';
import { DataItemType, FormControlType } from '../../../schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from './components/pc-input-date.vue';
import mobile from './components/mobile-input-date.vue';

const info: ComponentInfo = {
  title: '日期',
  type: 'calendar',
  icon: 'h-icon-all-calendar-o',
  dataItemType: DataItemType.Date,
  formControllerType: FormControlType.Date,
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
