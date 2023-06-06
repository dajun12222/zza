/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: panwl
 * @Date: 2020-04-13 15:09:39
 * @LastEditTime: 2020-04-22 14:58:08
 * @LastEditors: Please set LastEditors
 * @Description: 表单重构-长文本
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/LongText/index.ts
 */
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from './components/pc-input-textarea/input-textarea.vue';
import mobile from './components/mobile-input-text.vue';
const info: ComponentInfo = {
  title: '长文本',
  type: 'text-multiline',
  icon: 'h-icon-all-text-multiline',
  dataItemType: DataItemType.LongText,
  formControllerType: FormControlType.Textarea,
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
