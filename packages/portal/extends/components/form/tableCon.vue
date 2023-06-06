<template>
  <table class="modalDiv">
    <tbody>
      <tr v-for="(item, index) in modalData" :key="index">
        <template v-for="(items, i) in item">
          <th :key="'index' + i">{{ items.name }}</th>
          <td :key="'i' + i" :colspan="items.cols">{{ items.con }}</td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal, Descriptions } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
@Component({
  name: 'modalList',
  components: {
    AModal: Modal,
    elTable,
    ADescriptions: Descriptions,
  },
})
export default class modalList extends Vue {
  @Prop() modalData!: any;

  show: boolean = false;
}
</script>
<style lang="less" scoped>
.modalDiv {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  font-size: 12px;
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  th,
  td {
    padding: 8px 16px;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }
  th {
    width: 150px;
    background: #fafafa;
    font-weight: 400;
  }
  td {
    min-width: 170px;
    display: table-cell;
    word-break: break-word;
    overflow-wrap: break-word;
  }
}
</style>
