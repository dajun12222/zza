<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="action-insert-delete">
    <p class="action-insert-delete-title">
      {{ actionType === 1 ? '新增动作：' : '删除动作：' }}
    </p>
    <p
      v-for="(str, index) in dataList"
      :key="index"
      class="action-insert-delete-item"
    >
      {{ str }}
    </p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as dataType from './typings/data-rule';
@Component({
  name: 'action-insert-delete',
  components: {},
})
export default class ActionInsertDelete extends Vue {
  @Prop() actionType!: dataType.ActionType;

  @Prop() insertEffectList!: any;

  @Prop() deleteEffectList!: any;

  dataList: string[] = [];

  created() {
    this.setDataList();
  }

  setDataList() {
    let data: any[] = [];
    if (this.actionType === dataType.ActionType.Insert) {
      data = this.insertEffectList;
    } else {
      data = this.deleteEffectList;
    }

    if (data.length === 0) {
      return;
    }
    this.dataList = [];

    data.forEach((item) => {
      let str = '';
      const type: dataType.TableType = item.targetTableType;
      const actionStr =
        this.actionType === dataType.ActionType.Insert ? '新增了' : '删除了';
      if (type === dataType.TableType.MainSheet) {
        str = `${actionStr}“${item.targetMainObjectName}”(${item.targetMainObjectId})的数据`;
      } else {
        str = `${actionStr}主表“${item.targetMainObjectName}”(${item.targetMainObjectId}) 下id为 ${item.targetObjectId}的数据`;
      }
      this.dataList.push(str);
    });
  }
}
</script>
<style lang="less" scoped>
.action-insert-delete {
  &-item {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 20px;
  }
  &-title {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
