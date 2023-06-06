<template>
  <a-row>
    <a-list
      class="demo-loadmore-list"
      :data-source="dataContent.content"
      itemLayout="horizontal"
    >
      <!-- <div
      v-if="showLoadingMore"
      slot="loadMore"
      :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
    >
      <a-spin v-if="loadingMore" />
      <a-button v-else @click="onLoadMore">
        loading more
      </a-button>
    </div> -->
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions">
          <span v-if="item.applicableTag">
            <a-tag
              v-for="(v, i) in item.applicableTag.split('；')"
              :key="i + '1'"
              color="purple"
              >{{ v }}</a-tag>
          </span>
        </a>
        <a-button
          slot="actions"
          type="primary"
          @click="getSimilar(item.problemCode)"
          >相似问题</a-button>
        <a-list-item-meta>
          <a
            slot="title"
            class="listItemMetaTitle"
            href="#!"
            v-html="item.qualitativeProblem"
          ></a>
          <div slot="description">
            <ul>
              <li
                v-for="(v, i) in item.qualitativeBasisList"
                :key="i"
                style="
                  font-weight: bold;
                  cursor: pointer;
                  color: #000;
                  margin-top: 10px;
                "
                v-html="v"
                @click="getDetail(v)"
              ></li>
            </ul>
            <div class="listContent">
              <div class="description">
                <div v-if="item.penaltyBasis">
                  <span> 处罚依据：</span>
                  <span>
                    <a-tag
                      v-for="(v, i) in item.penaltyBasis.split('；')"
                      :key="i"
                      color="blue"
                      >{{ v }}</a-tag>
                  </span>
                </div>
              </div>
              <div class="description">
                <div v-if="item.qualitativeTag">
                  <span> 定性标签：</span>
                  <span>
                    <a-tag
                      v-for="(v, i) in item.qualitativeTag.split('；')"
                      :key="i"
                      color="blue"
                      >{{ v }}</a-tag>
                  </span>
                </div>
              </div>
              <div class="listDesc">
                <div>
                  <span> 问题目录：</span>
                  <span v-if="item.oneLevelDirectory">
                    <a-tag
                      v-for="(v, i) in item.oneLevelDirectory.split('；')"
                      :key="i + '1'"
                      color="cyan"
                      >{{ v }}</a-tag>
                  </span>
                  <span v-if="item.twoLevelDirectory">
                    <a-tag
                      v-for="(v, i) in item.twoLevelDirectory.split('；')"
                      :key="i + '2'"
                      color="cyan"
                      >{{ v }}</a-tag>
                  </span>
                  <span v-if="item.threeLevelDirectory">
                    <a-tag
                      v-for="(v, i) in item.threeLevelDirectory.split('；')"
                      :key="i + '3'"
                      color="cyan"
                      >{{ v }}</a-tag>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <elModal v-model="showModelInfo">
      <div style="font-size: 18px; text-align: center">
        <h4 class="basisDetailsH4" style="margin-bottom: 20px">{{ info.basisName || '' }}</h4>
      </div>
      <div class="basisDetails">
        <p v-html="info.basisDetails"></p>
      </div>
    </elModal>
    <elModal v-model="showModelSimilar">
      <a-table :columns="columns" 
          :data-source="SmilarData" 
          :pagination="false" 
          :rowKey="record => record.id"
      />
    </elModal>
  </a-row>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Tag, List, Table,Tooltip } from '@h3/antd-vue';
import elModal from '@/../extends/components/form/modal.vue';
import elTable from '@/../extends/components/table/table.vue';

import elInfo from '@/../extends/views/regulation/index/info.vue';
import api from '@/../extends/api';
@Component({
  name: 'newList1',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AList: List,
    ATag: Tag,
    ATable: Table,
    ATooltip: Tooltip,
    AListItem: List.Item,
    AListItemMeta: List.Item.Meta,
    elModal,
    elTable,
    elInfo,
  },
})
export default class newList1 extends Vue {
  [x: string]: any;

  @Prop({}) dataContent?: any;

  showModelInfo: boolean = false;

  showModelSimilar: boolean = false;

  showLoadingMore: boolean = false;

  id: any = '';

  info: any = {};

  SmilarData: any = [];

  columns: any = [
    {
      title: '问题编号',
      dataIndex: 'problemCode',
      key: 'problemCode',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '问题定性',
      dataIndex: 'qualitativeProblem',
      key: 'qualitativeProblem',
      // scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '定性依据',
      dataIndex: 'qualitativeBasis',
      key: 'qualitativeBasis',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '定性标签',
      dataIndex: 'qualitativeTag',
      key: 'qualitativeTag',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '数据来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          switch (value) {
            case 1:
              value = '基础问题库';
              break;
            case 2:
              value = '本地问题库';
              break;
            case 3:
              value = '新增问题库';
              break;
          }
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '相似评分',
      dataIndex: 'similar',
      key: 'similar',
      width: 100,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value.toFixed('2');
        } else {
          obj = '-';
        }
        return obj;
      },
    },
  ];

  async getDetail(item) {
    const formData: any = new FormData();
    formData.append('basisName', item.replace(/<.*?>/ig,''));
    const res: any = await api.queryBasisDetails(formData);
    if (res.data) {
      this.info = res.data;
      this.showModelInfo = true;
    } else {
      this.info = {};
      this.$message.error('暂无数据');
    }
  }

  async getSimilar(item) {
    const res: any = await api.similar(item);
    if (res.data) {
      this.SmilarData = res.data;
      this.showModelSimilar = true;
    } else {
      this.SmilarData = [];
      this.$message.error('暂无数据');
    }
  }
}
</script>
<style lang="less" scoped>
.newList {
  border-bottom: solid 1px #f1f1f1;
  padding-top: 12px;
  .title {
    cursor: pointer;
    display: inline-block;
    color: #1f7a9c;
    font-size: 18px;
    font-weight: 500;
  }
  .button {
    margin-top: 12px;
    button {
      margin-right: 12px;
      margin-bottom: 12px;
      color: #1e465b;
      font-size: 12px;
    }
  }
  .listDesc {
    display: flex;
    flex-direction: row;
    font-size: 12px;
  }
}
/deep/ .ant-modal {
  top: 20px;
  height: 96%;
  .ant-modal-content {
    height: 100%;
    .ant-modal-body {
      height: 85%;
      overflow-y: auto;
    }
  }
}
/deep/ .ant-list-item-meta-title > a {
  display: inline-block;
  margin-bottom: 10px;
  color: #1f7a9c;
  font-size: 18px;
}
/deep/ .description {
  margin-bottom: 5px;
  font-size: 12px;
}
/deep/ .listDesc {
  display: flex;
  flex-direction: row;
  font-size: 12px;
}
/deep/ .ant-tag {
  border-radius: 2px;
}
/deep/.listContent {
  margin-top: 10px;
}
/deep/ .ant-list-item-meta-description {
  font-size: 16px;
}
/deep/ .ant-tag {
  font-size: 14px;
  margin-bottom: 3px;
}
.demo-loadmore-list {
  .ant-btn {
    font-size: 14px;
    line-height: 32px;
    border-radius: 2px;
  }
}
.basisDetailsH4 {
  line-height: 1.4;
  margin: 15px 0;
}
.basisDetails {
  padding: 10px;
  font-size: 14px;
  line-height: 1.4;
}
/deep/.ant-table-column-title {
  font-size: 12px;
}
/deep/ .ant-table-row-cell-break-word {
  padding: 3px;
  font-size: 12px;
}
/deep/ .ant-list-item-action {
  width: 94%;
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}
/deep/ .ant-list-item-action-split {
  display: none;
}
/deep/ .ant-list-split .ant-list-item {
  background: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0px 0px 10px #eee;
  border-bottom: 0;
  text-align: left;
  padding: 12px;
}
</style>
