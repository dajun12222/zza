<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fu Zhuohang
 * @Date: 2022-01-04 18:06:33
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-07 17:28:03
 * @FilePath: \yunshu6.0\modules\cloudpivot\flow-center\src\components\mobile\my-instance\list.vue
 * @Description:
-->
<template>
  <div class="instances-content">
    <h3-scroll
      v-show="isEmpty"
      ref="scroll"
      :loadMore="loadMore"
      :pageSize="20"
      :noMoreMessage="$t('cloudpivot.flowCenter.mobile.loadAllWorkflow')"
    >
      <div>
        <instances-item
          v-for="(circulate, index) in myInstances"
          :key="index"
          :workitem="circulate"
        />
      </div>
    </h3-scroll>
    <Empty v-show="!isEmpty" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import * as H3Form from 'cloudpivot-form/form';

import { workflowCenterApi } from 'cloudpivot/api';

import common from 'cloudpivot/common';

import { components } from 'cloudpivot-flow/flow-center';

import Search from 'cloudpivot/common/src/components/mobile/global/search.vue';

@Component({
  name: 'apps',
  components: {
    Failed: common.components.mobile.LoadingFailed,
    NoSearchData: common.components.mobile.NoSearchData,
    Search,
    H3Scroll: H3Form.renderer.components.mobile.H3Scroll,
    InstancesItem: components.mobile.MyInstanceItem,
    Empty: common.components.mobile.Empty,
  },
})
export default class Apps extends Vue {
  isEmpty: boolean = true;

  myInstances: Array<any> = [];

  params = {
    size: 20,
    page: 1,
    workflowName: '',
    startTime: '',
    endTime: '',
    /* 流程实例状态 */
    instanceState: 'PROCESSING',
  };

  search(val: any) {
    // const scroll = this.$refs.scroll as any;
    // this.params = Object.assign(this.params, val);
    // scroll.mescroll.resetUpScroll();
    if (val === this.params.workflowName) {
      return;
    }
    Object.assign(this.params, val);
    this.isEmpty = true;
    this.loadMore({ num: 1 }, null);
  }

  loadMore(page: any, done: any) {
    const vm: any = this;
    vm.params.page = page.num;
    if (page.num === 1) {
      vm.myInstances = [];
    }
    workflowCenterApi
      .getMyInstanceList({
        ...vm.params,
        page: vm.params.page - 1,
        isMobile: true,
      })
      .then((res: any) => {
        if (done) {
          done(vm.params.size, res.data.totalElements);
        }
        vm.myInstances = vm.myInstances.concat(res.data.content);
        if (!vm.myInstances.length) {
          vm.isEmpty = false;
        } else {
          vm.isEmpty = true;
        }
      });
  }
}
</script>
