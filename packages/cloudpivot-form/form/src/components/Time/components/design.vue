<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fan
 * @Date: 2020-04-19 19:33:49
 * @description: 
 * @LastEditors: Fan
 -->
<script lang="ts">
import DateTime from 'cloudpivot-form/form/src/common/components/date-time.vue';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'Time',
  components: {
    DateTime,
  },
})
export default class Time extends Vue {
  render(h: Function) {
    return h('date-time', {
      props: { opts: { disabled: true, placeholder: '请选择' } },
    });
  }
}
</script>
