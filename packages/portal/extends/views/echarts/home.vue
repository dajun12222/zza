<template>
  <el-content :active="active" @change="change">
    <elJobOverview v-if="active === 1" />
    <elProject v-if="active === 2" />
    <elAchievement v-if="active === 3" />
    <elEchartsIndex v-if="active === 4" />
    <elPeople v-if="active === 5" />
    <elDataResource v-if="active === 6" />
  </el-content>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import content from '@/../extends/components/maps/content.vue';
import jobOverview from './jobOverview.vue';
import dataResource from './dataResource.vue';
import echartsIndex from './index.vue';
import people from './people.vue';
import project from './project.vue';
import achievement from './achievement.vue';
@Component({
  name: 'echartsHome',
  components: {
    elContent: content,
    elJobOverview: jobOverview,
    elDataResource: dataResource,
    elEchartsIndex: echartsIndex,
    elPeople: people,
    elProject: project,
    elAchievement: achievement,
  },
})
export default class echartsHome extends Vue {
  active: number = 1;

  change(num: number) {
    this.active = num;
  }
}
</script>
<style lang="less" scoped>
.main .content {
  background: #f9fbff !important;
  border-radius: 2px !important;
  border: 1px solid #eeeeee !important;
  margin: 10px;
  width: auto !important;
  font-size: 14px;
}
/deep/ .resultContent {
  height: 85%;
  width: 93%;
  margin: auto;
}
/deep/ .lie {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
/deep/ .unitRank {
  flex-grow: 1;
}
@media screen and (min-width: 1280px) and (max-width: 1439px) {
  .main .content {
    font-size: 10px;
    /deep/ .unit {
      height: 370px;
      overflow-y: auto;
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 1599px) {
  .main .content {
    font-size: 10px;
    /deep/ .unit {
      height: 330px;
      overflow-y: scroll;
    }
  }
}

@media screen and (min-width: 1600px) and (max-width: 1919px) {
  .main .content {
    font-size: 14px;
    /deep/ .unit {
      height: 470px;
      overflow-y: scroll;
    }
  }
}

@media screen and (min-width: 1920px) {
  .main .content {
    font-size: 16px;
    /deep/ .unit {
      height: 550px;
      overflow-y: scroll;
    }
  }
}
@media screen and (min-width: 2560px) {
  .main .content {
    font-size: 18px;
    /deep/ .unit {
      height: 600px;
      overflow-y: scroll;
    }
  }
}
</style>
