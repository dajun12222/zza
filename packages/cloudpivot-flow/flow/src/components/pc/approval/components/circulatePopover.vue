<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="right"
    overlayClassName="circulations-popover"
  >
    <template slot="content">
      <div class="panel">
        <div class="listItem">
          <header>
            {{
              $t('cloudpivot.flow.pc.approvalLog.uncirculateNum', {
                num: getCirculations(node.circulations, 10).length,
              })
            }}
          </header>
          <ul>
            <li
              v-for="(circulation, idx) in getCirculations(
                node.circulations,
                10,
              )"
              :key="idx"
            >
              <a-avatar
                v-if="getImageUrl(circulation.approvaler)"
                class="form-approval__avatar"
                :size="38"
                icon="user"
                :src="getImageUrl(circulation.approvaler)"
              />
              <span v-else class="user_icon-wrapper">
                <em class="user_icon icon aufontAll h-icon-all-user-o"></em>
              </span>
              <div>
                <div>{{ circulation.approvaler.name }}</div>
                <div class="dept">
                  {{ circulation.dept }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="listItem">
          <header>
            {{
              $t('cloudpivot.flow.pc.approvalLog.circulatedNum', {
                num: getCirculations(node.circulations, 11).length,
              })
            }}
          </header>
          <ul>
            <li
              v-for="(circulation, idx) in getCirculations(
                node.circulations,
                11,
              )"
              :key="idx"
            >
              <a-avatar
                v-if="getImageUrl(circulation.approvaler)"
                class="form-approval__avatar"
                :size="38"
                icon="user"
                :src="getImageUrl(circulation.approvaler)"
              />
              <span v-else class="user_icon-wrapper">
                <em class="user_icon icon aufontAll h-icon-all-user-o"></em>
              </span>
              <div>
                <div>{{ circulation.approvaler.name }}</div>
                <div class="dept">
                  {{ circulation.dept }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <a>{{
        $t('cloudpivot.flow.pc.approvalLog.circulatedNum', {
          num: getCirculations(node.circulations, 11).length,
        })
      }}、{{
        $t('cloudpivot.flow.pc.approvalLog.uncirculateNum', {
          num: getCirculations(node.circulations, 10).length,
        })
      }}</a>
  </a-popover>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import { Popover } from '@h3/antd-vue';

@Component({
  name: 'circulate-popover',
  components: {
    APopover: Popover,
  },
})
export default class CirculatePopover extends Vue {
  @Prop()
  node!: any;

  visible: boolean = false;

  getCirculations(circulations, type) {
    return circulations.filter((item) => item.workActionType === type);
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  getImageUrl(user: any) {
    if (user.imgUrl && user.imgUrl.includes('http')) {
      return user.imgUrl;
    } else if (user.imgUrl) {
      return this.getDownloadUrlNew(user.imgUrl);
    } else {
      return '';
    }
  }
}
</script>

<style lang="less">
.circulations-popover .ant-popover-inner-content {
  padding: 0px;
}
.circulations-popover {
  .panel {
    display: flex;
    .listItem {
      width: 200px;
      header {
        height: 50px;
        padding: 16px 16px 12px;
      }
      ul {
        height: 410px;
        overflow: auto;
        li {
          display: flex;
          padding: 0px 16px 14px;
          .dept {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
          }
        }
      }
    }
    .listItem:first-child {
      border-right: 1px solid #e8e8e8;
    }
  }
}
</style>
