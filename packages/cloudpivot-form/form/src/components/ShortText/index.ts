/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-13 15:08:42
 * @LastEditTime: 2020-04-23 20:03:57
 * @LastEditors: Fan
 * @Description: 短文本组件
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/ShortText/index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from './components/pc-input-text.vue';
import mobile from './components/mobile-input-text.vue';
export const info: ComponentInfo = {
  title: '单行文本',
  type: 'single-line',
  icon: 'h-icon-all-single-line-text',
  dataItemType: DataItemType.ShortText,
  formControllerType: FormControlType.Text,
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
