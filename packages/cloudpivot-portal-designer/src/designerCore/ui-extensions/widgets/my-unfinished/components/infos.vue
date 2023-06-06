<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="infos">
    <div class="left">
      <!-- <div  @click="goto('my-unread-workitem')" :class="['info-item', 'ToDoTask', block.icon]"> -->
      <div
        :class="['info-item','ToDoTask', !ToDoTask ? '' : 'ToDoTask_s']"
        @click="toggleclick('ToDoTask')"
      >
        <div>
          <p>{{ $t('languages.common.workBenchInfo.ToDoTask') }}</p>
          <h3>{{ infoData.workItemCount }}</h3>
        </div>
      </div>

      <!-- <div class="info-item FinishedTask2" @click="goto('my-finished-workitem')"> -->
      <div
        :class="[
          'info-item','FinishedTask2',
          !FinishedTask2 ? '' : 'FinishedTask2_s',
        ]"
        @click="toggleclick('FinishedTask2')"
      >
        <div>
          <p>{{ $t('languages.common.workBenchInfo.FinishedTask2') }}</p>
          <h3>{{ infoData.finishWorkItemCount }}</h3>
        </div>
      </div>

      <!-- <div class="info-item ToReadTask" @click="goto('my-unread-workitem')"> -->
      <div
        :class="['info-item', 'ToReadTask',!ToReadTask ? '' : 'ToReadTask_s']"
        @click="toggleclick('ToReadTask')"
      >
        <div>
          <p>{{ $t('languages.common.workBenchInfo.ToReadTask') }}</p>
          <h3>{{ infoData.circulateItemCount }}</h3>
        </div>
      </div>

      <!-- <div class="info-item FinishedRead" @click="goto('my-read-workitem')"> -->
      <div
        :class="[
          'info-item','FinishedRead',
          !FinishedRead ? '' : 'FinishedRead_s',
        ]"
        @click="toggleclick('FinishedRead')"
      >
        <div>
          <p>{{ $t('languages.common.workBenchInfo.FinishedRead') }}</p>
          <h3>{{ infoData.finishCirculateItemCount }}</h3>
        </div>
      </div>

      <div
        :class="['info-item','reminder', !reminder ? '' : 'reminder_s']"
        @click="toggleclick('reminder')"
      >
        <div>
          <p>{{ $t('languages.common.workBenchInfo.reminder') }}</p>
          <h3>{{ infoData.workflowCount }}</h3>
        </div>
      </div>
      <div
        :class="[
          'right',
          'info-item',
          'attention',
          !attention ? '' : 'attention_s',
        ]"
        @click="goto('my-read-workitem')"
      >
        <div>
          <p>{{ $t('languages.common.workBenchInfo.attention') }}</p>
          <h3><h3>→</h3></h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { workbenchApi } from 'cloudpivot/api';

@Component({
  name: 'countInfos',
  components: {},
})
export default class countInfos extends Vue {
  @Prop() runMode!: string;

  ToDoTask: boolean = true;

  FinishedTask2: boolean = false;

  ToReadTask: boolean = false;

  FinishedRead: boolean = false;

  reminder: boolean = false;

  attention: boolean = false;

  infoData: any = {
    circulateItemCount: 0,
    toAdminItemCount: 0,
    workItemCount: 0,
    workflowCount: 0,
    finishWorkItemCount: 0,
    finishCirculateItemCount: 0,
  };

  async getWorkCount() {
    if (this.runMode !== 'runtime') {
      return;
    }
    const res = await workbenchApi.getWorkCount();
    if (res.errcode === 0) {
      this.infoData = res.data;
    }
  }

  toggleclick(e) {
    this.ToDoTask = false;
    this.FinishedTask2 = false;
    this.ToReadTask = false;
    this.FinishedRead = false;
    this.reminder = false;
    this.attention = false;
    this[e] = true;
    this.$emit('emitChange', {
      ToDoTask: this.ToDoTask,
      FinishedTask2: this.FinishedTask2,
      ToReadTask: this.ToReadTask,
      FinishedRead: this.FinishedRead,
      reminder: this.reminder,
      attention: this.attention,
    });
  }

  goto(type: string) {
    if (this.runMode !== 'runtime') {
      return;
    }
    if (type === 'my-read-workitem') {
      this.$router.push(
        '/workflow-center/my-unfinished-workitem?return=' + location.pathname,
      );
    } else {
      this.$router.push(
        '/workflow-center/' + type + '?return=' + location.pathname,
      );
    }
  }

  created() {
    this.getWorkCount();
  }
}
</script>

<style lang="less" scoped>
.infos {
  // display: flex;
  // justify-content: space-between;
  padding: 0;
  height: 114px!important;
  .left {
    // flex: 1;
    display: flex;
    //border: 1px solid #eeeeee;
    height: 80px;
    justify-content: space-between;
    // border-radius: 4px;
    .info-item {
      // background: #2970FF;
      text-align: center;
      position: relative!important;
      min-width: 75px;
      // flex: 1;
      height: 80px;
      width: 150px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: left;
      cursor: pointer;
      border-radius: 8px;
      margin-right: 17px;
      transition: transform 0.5s ease-out;
      div {
        display: flex;
        flex-direction: column;
        justify-content: left;
        align-items: flex-start;
        margin-left: 16px;
      }
      // box-shadow: 0px 0px 4px 0px rgb(120, 163, 249);
      h3 {
        font-size: 24px;
        color: #fff;
        font-weight: 600;
        margin: 0 !important;
      }
      p {
        font-size: 12px;
        color: #fff;
        opacity: 0.65;
      }
    }
    .ToDoTask {
      background: url('./ToDoTask.png') no-repeat;
      background-size: 100% 80px;
    }
    .FinishedTask2 {
      background: url('./FinishedTask2.png') no-repeat;
      background-size: 100% 80px;
    }
    .ToReadTask {
      background: url('./ToReadTask.png') no-repeat;
      background-size: 100% 80px;
    }
    .FinishedRead {
      background: url('./FinishedRead.png') no-repeat;
      background-size: 100% 80px;
    }
    .reminder {
      background: url('./reminder.png') no-repeat;
      background-size: 100% 80px;
    }
    .attention {
      background: url('./attention.png') no-repeat;
      background-size: 100% 80px;
    }
    .ToDoTask_s::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 7px 0 7px; /* 控制倒三角大小和形状 */
      border-color: #2F88F7 transparent transparent transparent; /* 控制倒三角颜色 */
      top: 80px;
      left: calc(50% - 10px);
    }
    .FinishedTask2_s::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 7px 0 7px; /* 控制倒三角大小和形状 */
      border-color: #25B0DD transparent transparent transparent; /* 控制倒三角颜色 */
      top: 80px;
      left: calc(50% - 10px);
    }
    .ToReadTask_s::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 7px 0 7px; /* 控制倒三角大小和形状 */
      border-color: #7FABFE transparent transparent transparent; /* 控制倒三角颜色 */
      top: 80px;
      left: calc(50% - 10px);
    }
    .FinishedRead_s::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 7px 0 7px; /* 控制倒三角大小和形状 */
      border-color: #25B3DC transparent transparent transparent; /* 控制倒三角颜色 */
      top: 80px;
      left: calc(50% - 10px);
    }
    .reminder_s::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 7px 0 7px; /* 控制倒三角大小和形状 */
      border-color: #2F88F7 transparent transparent transparent; /* 控制倒三角颜色 */
      top: 80px;
      left: calc(50% - 10px);
    }
    .attention_s::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 7px 0 7px; /* 控制倒三角大小和形状 */
      border-color: #26B1DE transparent transparent transparent; /* 控制倒三角颜色 */
      top: 80px;
      left: calc(50% - 10px);
    }

   
  }
  .right {
    // margin-left: 16px;
    min-width: 112px;
    width: 112px;
    height: 92px;
    margin-right: 0 !important;
    // border-radius: 4px;
    // border-top-left-radius: 0;
    // border-bottom-left-radius: 0;
    // border: 1px solid #eeeeee;
    // flex-basis: 92px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: linear-gradient(269deg, #05a3b0, #15b8c2 100%);
    div {
      overflow: hidden;
      img {
        filter: drop-shadow(#fff 40px 0);
        transform: translateX(-40px);
      }
    }
    p {
      margin-top: 3px;
    }
  }
}
</style>
