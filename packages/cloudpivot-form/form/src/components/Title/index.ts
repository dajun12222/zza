/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: your name
 * @Date: 2020-04-13 15:10:17
 * @LastEditTime: 2020-04-25 20:14:38
 * @LastEditors: Fan
 * @Description: In User Settings Edit
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/Date/index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
const info: ComponentInfo = {
  title: '表单标题',
  type: 'formTitle',
  icon: '',
  dataItemType: DataItemType.ShortText,
  formControllerType: FormControlType.Title,
  group: '',
};

export default {
  info,
  schema,
  conduct,
  components: {
    design,
    // pc,
    // mobile,
  },
} as ComponentAsset;
