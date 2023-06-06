<template>
  <a-modal
    :visible="show"
    title="详情"
    class="indexModal"
    @cancel="close"
    @ok="close"
  >
    <table class="modalDiv">
      <tbody>
        <tr v-for="(item, index) in modalData" :key="index">
          <template v-for="(items, i) in item">
            <th :key="'index' + i">{{ items.name }}</th>
            <td
              v-if="items.name === '动态附件' && items.con"
              :key="'i' + i"
              :colspan="items.cols"
            >
              <div v-html="items.con"></div>
              <span class="action">
                <i
                  class="icon aufontAll h-icon-all-download"
                  title="下载"
                  @click="download(items.con)"
                ></i>
              </span>
            </td>
            <td v-else :key="'i' + i" :colspan="items.cols">
              <div v-html="items.con"></div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal, Descriptions } from '@h3/antd-vue';
import axios from 'axios';
@Component({
  name: 'modalList',
  components: {
    AModal: Modal,
    ADescriptions: Descriptions,
  },
})
export default class modalList extends Vue {
  [x: string]: unknown;

  @Prop() modalData!: any;

  @Prop() id!: any;

  show: boolean = false;

  @Watch('modalData')
  showModal() {
    this.show = true;
  }

  close() {
    this.show = false;
  }

  async download(item: any) {
    let options: any = {
      method: 'POST',
      url: '/api/transfer/dynamic/downloadFile?dynamicId=' + this.id,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
    };
    axios.request(options).then(function (req: any) {
      let blob = new Blob([req], { type: 'application/docx' });

      let objectUrl = (
        (window as any).URL || (window as any).webkitURL
      ).createObjectURL(blob);
      let downFile = document.createElement('a');
      let fileName = item;
      downFile.style.display = 'none';
      downFile.href = objectUrl;
      downFile.download = fileName;
      document.body.appendChild(downFile);
      downFile.click();
      document.body.removeChild(downFile);
      window.URL.revokeObjectURL(objectUrl);
    });
  }
}
</script>
<style lang="less" scoped>
.indexModal {
  position: fixed;
  width: 100%;
  z-index: 100;
  /deep/.ant-modal-header {
    border-bottom: 0;
    padding: 24px 24px 0;
  }
  /deep/.ant-modal {
    width: 80% !important;
    min-width: 800px;
  }
  /deep/.ant-modal-body {
    padding-top: 20px;
    padding-bottom: 0;
  }
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
      width: 120px;
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
}
.action i {
  margin-left: 10px;
  margin-right: 5px;
  cursor: pointer;
}
</style>
