<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Author: Fan
 * @Date: 2020-04-14 12:06:28
 * @LastEditTime: 2020-04-20 18:11:00
 * @LastEditors: Fan
 * @Description: In User Settings Edit
 * @FilePath: /frontend/modules/cloudpivot-form/form/src/components/ShortText/components/design.vue
 -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Input } from '@h3/antd-vue';
@Component({
  name: 'LocationDesign',
  components: {
    AInput: Input,
  },
})
export default class LocationDesign extends Vue {
  // @Prop({default:{}})
  // opts!:any
  render(h: Function) {
    return h(
      'a-input',
      {
        props: {
          disabled: true,
          placeholder: '请输入',
        },
      },
      [
        h('i', {
          props: {
            type: 'user',
          },
          slot: 'suffix',
          class: ['aufontAll', 'h-icon-all-position-o'],
        }),
      ],
    );
  }
}
</script>
<style scoped>
.location:before {
  content: '';
}
</style>
