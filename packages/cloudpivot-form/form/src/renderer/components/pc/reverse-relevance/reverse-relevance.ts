/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import common from 'cloudpivot/common/pc';
import { Component } from 'vue-property-decorator';
import { ReverseRelevanceControl } from '../../../controls';
import ReverseRelevanceLink from './reverse-relevance-link.vue';
import ReverseRelevanceList from './reverse-relevance-list.vue';

@Component({
  name: 'reverse-relevance',
  components: {
    ReverseRelevanceList,
    ReverseRelevanceLink,
    H3Panel: common.components.Panel,
  },
})
export default class ReverseRelevance extends ReverseRelevanceControl {
  get tips() {
    return this.control.options.tips;
  }
}
