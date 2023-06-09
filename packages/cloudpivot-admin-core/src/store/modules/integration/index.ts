/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: nooldey <nooldey@gmail.com>
 * @Date: 2019-02-18 11:52:35
 * @Last Modified by: nooldey
 * @Last Modified time: 2019-02-18 15:51:11
 * 业务集成相关状态管理
 */
import Category from './category';
import Service from './service';
import Methods from './methods';
import OutdatasourceFolder from './outdatasourceFolder';
import OutdatasourceMethods from './outdatasourceMethods';
export default {
  namespaced: true,
  modules: {
    Category,
    Service,
    Methods,
    OutdatasourceFolder,
    OutdatasourceMethods,
  },
};
