/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import pc from './components/pc-sheet.vue';
import mobile from './components/mobile-sheet.vue';
const info: ComponentInfo = {
  title: '子表',
  type: 'sheet',
  icon: 'h-icon-all-table-o',
  dataItemType: DataItemType.Sheet,
  formControllerType: FormControlType.Sheet,
  group: '布局控件',
};

export default {
  info,
  schema,
  conduct,
  components: {
    pc,
    mobile,
  },
} as ComponentAsset;
