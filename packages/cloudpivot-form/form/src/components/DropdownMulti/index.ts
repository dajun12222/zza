/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
import pc from './components/pc-dropdown.vue';
import mobile from './components/mobile-dropdown.vue';
export const info: ComponentInfo = {
  title: '下拉多选框',
  type: 'drop-down-multi',
  icon: 'h-icon-all-a-Drop-downmultiple-o',
  dataItemType: DataItemType.DropdownMulti,
  formControllerType: FormControlType.DropdownMulti,
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
