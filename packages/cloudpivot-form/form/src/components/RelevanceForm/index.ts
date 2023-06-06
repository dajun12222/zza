/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-13 15:08:42
 * @LastEditTime: 2020-04-25 17:50:32
 * @LastEditors: Fan
 * @Description: 短文本组件
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/ShortText/index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from './components/pc-relevance-form/relevance-form.vue';
import mobile from './components/mobile-relevance-form/relevance-form.vue';
export const info: ComponentInfo = {
  title: '关联单选',
  type: 'relevance-form',
  icon: 'h-icon-all-form-related-o',
  dataItemType: DataItemType.RelevanceForm,
  formControllerType: FormControlType.RelevanceForm,
  group: '高级控件',
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
