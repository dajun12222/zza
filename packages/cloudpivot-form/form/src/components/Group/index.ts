/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ComponentInfo, ComponentAsset } from '../../../../form/typings';
import { DataItemType, FormControlType } from '../../../../form/schema';
import schema from './schema';
import conduct from './conduct';
import design from './components/design.vue';
const info: ComponentInfo = {
  title: '分组标题',
  type: 'group',
  icon: 'h-icon-all-text-t',
  dataItemType: DataItemType.ShortText,
  formControllerType: FormControlType.Group,
  group: '布局控件',
};

export default {
  info,
  schema,
  conduct,
  components: {
    design,
  },
} as ComponentAsset;
