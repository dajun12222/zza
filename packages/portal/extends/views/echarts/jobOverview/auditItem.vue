<template>
  <div class="unitRank">
    <div>
      <div class="unitRankCon1tent">
        <el-block-bg title="项目审计" :year="false" :type="2">
          <div class="projectNumCon">
            <p style="color: #2275d3">
              项目数<span>{{
                bd_ysProjects.PROCESSING + bd_ysProjects.COMPLETED
              }}</span>个
            </p>
            <div>
              <div class="new">
                <div>
                  <p class="t">在审</p>
                  <p class="d">{{ bd_ysProjects.PROCESSING }}个</p>
                </div>
                <div>
                  <p class="t">审结</p>
                  <p class="d">{{ bd_ysProjects.COMPLETED }}个</p>
                </div>
              </div>
            </div>
          </div>
        </el-block-bg>
        <div></div>
        <el-block-bg title="财务收支审计" :year="false" :type="2">
          <div class="projectNumCon">
            <p style="color: #3ab2b2">
              项目数<span>{{
                project_records.PROCESSING + project_records.COMPLETED
              }}</span>个
            </p>

            <div class="new">
              <div>
                <p class="t">在审</p>
                <p class="d">{{ project_records.PROCESSING }}个</p>
              </div>
              <div>
                <p class="t">审结</p>
                <p class="d">{{ project_records.COMPLETED }}个</p>
              </div>
            </div>
          </div>
        </el-block-bg>
        <!-- <el-block-bg :year="false" :type="2" :titleShow="false">
          <div class="projectNumCon1">
            <p style="color: #73599b">
              审减金额：<span>{{
                Math.floor(
                  (auditCount.PROCESSING + auditCount.COMPLETED) * 100,
                ) / 100
              }}</span>万元
            </p>
            <div class="new">
              <div>
                <span class="t">预算：</span>
                <span class="d">{{ auditCount.PROCESSING }}万元</span>
              </div>
              <div>
                <span class="t">结算：</span>
                <span class="d">{{ auditCount.COMPLETED }}万元</span>
              </div>
            </div>
          </div>
        </el-block-bg> -->
      </div>
      <div class="unitRankCon1tent">
        <el-block-bg title="领导干部经济责任审计" :year="false" :type="2">
          <div class="projectNumCon">
            <p style="color: #43cd93">
              项目数<span>{{
                project_records_ec.PROCESSING + project_records_ec.COMPLETED
              }}</span>个
            </p>

            <div class="new">
              <div>
                <p class="t">在审</p>
                <p class="d">{{ project_records_ec.PROCESSING }}个</p>
              </div>
              <div>
                <p class="t">审结</p>
                <p class="d">{{ project_records_ec.COMPLETED }}个</p>
              </div>
            </div>
          </div>
        </el-block-bg>
        <div></div>
        <el-block-bg title="执法活动财务审计" :year="false" :type="2">
          <div class="projectNumCon">
            <p style="color: #3f94bb">
              项目数<span>{{
                law_enforcement.PROCESSING + law_enforcement.COMPLETED
              }}</span>个
            </p>
            <div>
              <div class="new">
                <div>
                  <p class="t">在审</p>
                  <p class="d">{{ law_enforcement.PROCESSING }}个</p>
                </div>
                <div>
                  <p class="t">审结</p>
                  <p class="d">{{ law_enforcement.COMPLETED }}个</p>
                </div>
              </div>
            </div>
          </div>
        </el-block-bg>
      </div>
      <div class="unitRankCon1tent">
        <el-block-bg title="专项审计" :year="false" :type="2">
          <div class="projectNumCon">
            <p style="color: #a66db2">
              项目数<span>{{
                special_audit.PROCESSING + special_audit.COMPLETED
              }}</span>个
            </p>
            <div class="new">
              <div>
                <p class="t">在审</p>
                <p class="d">{{ special_audit.PROCESSING }}个</p>
              </div>
              <div>
                <p class="t">审结</p>
                <p class="d">{{ special_audit.COMPLETED }}个</p>
              </div>
            </div>
          </div>
        </el-block-bg>
        <div></div>
        <el-block-bg title="绩效审计" :year="false" :type="2">
          <div class="projectNumCon">
            <p style="color: #2275d3">
              项目数<span>{{
                project_records_jx.PROCESSING + project_records_jx.COMPLETED
              }}</span>个
            </p>
            <div>
              <div class="new">
                <div>
                  <p class="t">在审</p>
                  <p class="d">{{ project_records_jx.PROCESSING }}个</p>
                </div>
                <div>
                  <p class="t">审结</p>
                  <p class="d">{{ project_records_jx.COMPLETED }}个</p>
                </div>
              </div>
            </div>
          </div>
        </el-block-bg>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import audit from './audit.vue';
import * as echarts from 'echarts';
import api from '@/../extends/api';
@Component({
  name: 'auditItem',
  components: {
    elBlockBg: blockBg,
    elAudit: audit,
  },
})
export default class auditItem extends Vue {
  bd_ysProjects: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //投资项目审计

  project_records_ec: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //经济责任审计

  project_records: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //财务收支审计

  law_enforcement: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //执法活动审计

  special_audit: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //专项计划

  project_records_jx: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //绩效审计

  auditCount: any = {
    PROCESSING: 0,
    COMPLETED: 0,
  }; //审减金额

  created() {
    this.getList();
    this.getAudit();
  }

  mounted() {}

  async getList() {
    const res: any = await api.auditTypeProjectsDetails();
    if (res.errcode === 0) {
      //let option = res.data;
      this.bd_ysProjects = Object.assign(
        this.bd_ysProjects,
        res.data.bd_ysProjects,
      );
      this.project_records_ec = Object.assign(
        this.project_records_ec,
        res.data.project_records_ec,
      );
      this.project_records_jx = Object.assign(
        this.project_records_jx,
        res.data.project_records_jx,
      );
      this.project_records = Object.assign(
        this.project_records,
        res.data.project_records,
      );
      this.law_enforcement = Object.assign(
        this.law_enforcement,
        res.data.law_enforcement,
      );
      this.special_audit = Object.assign(
        this.special_audit,
        res.data.special_audit,
      );
    } else {
    }
  }

  async getAudit() {
    const res: any = await api.reviewAmountInfo();
    if (res.errcode === 0) {
      let option = res.data;
      let num: number = 0;
      option.map((item: any) => {
        item['name'] = item['type'];
        item['value'] = item['amount'];
        if (item && item['value']) {
          num = num + item['value'];
        }
      });
      this.auditCount = Object.assign(this.auditCount, {
        PROCESSING:
          Math.floor((parseInt(option[0]['amount']) / 10000) * 100) / 100,
        COMPLETED:
          Math.floor((parseInt(option[1]['amount']) / 10000) * 100) / 100,
      });
    } else {
    }
  }
}
</script>
<style lang="less" scoped>
@font-face {
  font-family: 'YinPinCuXie';
  src: url('../../../style/font/YinPinCuXie.ttf');
}
.unitRank {
  width: 100%;
  height: 45%;
  // margin-bottom: 7px;
  position: relative;
  > div {
    height: 100%;
    .unitRankCon1tent {
      display: grid;
      grid-template-columns: 49% 2% 49%;
      height: 30%;
      margin-top: 1%;
    }
    // .unitRankCon1 {
    //   height: 32%;
    // }
    .projectNum {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 50% 50%;
      // width: 269px;
      // height: 84px;
      background: #ffffff;
      box-shadow: 0px 2px 8px 0px rgba(183, 189, 207, 0.25);
      border-radius: 16px;
    }
    .projectNumCon {
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 66%;
      position: relative;
      align-items: center;
      > p {
        // padding-top: 5px;
        font-size: 0.857em;
        > span {
          font-weight: 600;
          font-size: 3em;
          margin: 0 5px;
          font-family: 'YinPinCuXie', sans-serif;
        }
      }
      .new {
        display: flex;
        > div {
          margin-left: 20px;
        }
      }
      > div {
        // padding-top: 5%;
        // padding-right: 0;

        > a,
        > span {
          display: block;
          // width: 115px;
          // height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #afd3ee;
          font-size: 0.857em;
        }

        .t {
          font-size: 0.857em;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #7386a0;
          // line-height: 14px;
        }
        .d {
          font-size: 1em;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #00347f;
          // line-height: 17px;
        }
      }
    }
    .projectNumCon1 {
      width: 100%;
      > p {
        padding-top: 1%;
        font-size: 0.857em;
        text-align: center;
        margin: auto;
        > span {
          font-weight: 600;
          font-size: 3em;
          font-family: 'YinPinCuXie', sans-serif;
        }
      }
      .new {
        display: flex;
        > div {
          margin: auto;
        }
      }
      > div {
        padding-top: 0px;
        padding-right: 0;

        .t {
          font-size: 0.857em;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #7386a0;
          // line-height: 14px;
        }
        .d {
          font-size: 1em;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #00347f;
          // line-height: 17px;
        }
      }
    }
  }
}
</style>
