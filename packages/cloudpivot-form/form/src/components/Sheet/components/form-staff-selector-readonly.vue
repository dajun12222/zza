<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-staff-warp">
    <template>
      <div class="form-staff" :class="{ expanded: !collapsed }">
        <template v-for="item in data">
          <a-tooltip :key="item.id" placement="top">
            <template v-if="item.fullDepartment" slot="title">
              {{ item.fullDepartment }}
            </template>
            <div :key="item.id" class="form-staff-item">
              <div
                class="avatar-wrapper"
                :class="[
                  item.type === 1
                    ? 'org-avatar-wrapper'
                    : 'user-avatar-wrapper',
                ]"
              >
                <a-avatar
                  v-if="item.type === 3 && getDownloadUrlNew(item.imgUrl)"
                  icon="user"
                  size="small"
                  :src="getDownloadUrlNew(item.imgUrl)"
                />
                <em
                  v-else
                  class="aufontAll"
                  :class="[
                    item.type === 1
                      ? 'h-icon-all-process-o'
                      : 'h-icon-all-user-o',
                  ]"
                ></em>
              </div>

              <span class="user-name">{{ item.name }}</span>
            </div>
          </a-tooltip>
        </template>
      </div>

      <div style="text-align: right">
        <span v-if="showToggle" class="form-staff__more" @click="toggle">
          <span v-show="collapsed">{{
            $t('cloudpivot.form.renderer.expand')
          }}</span>
          <span v-show="!collapsed">{{
            $t('cloudpivot.form.renderer.collapse')
          }}</span>
          <i
            class="icon aufontAll h-icon-all-down-o"
            :class="{ expanded: !collapsed }"
          ></i>
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Avatar, Icon, Tag, Tooltip } from '@h3/antd-vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
@Component({
  name: 'form-staff-selector-readonly',
  components: {
    ATag: Tag,
    AIcon: Icon,
    AAvatar: Avatar,
    ATooltip: Tooltip,
  },
})
export default class FormStaffSelectorReadonly extends Vue {
  @Prop() data!: Array<any>;

  showToggle = false;

  collapsed = true;

  taskRef: any;

  toggle() {
    this.collapsed = !this.collapsed;
  }

  scroll() {
    const el = this.$el.querySelector('.form-staff') as HTMLDivElement;
    if (el) {
      this.showToggle = el.scrollHeight > el.offsetHeight + 3;
      if (el.offsetHeight === 0) {
        clearTimeout(this.taskRef);
        this.taskRef = setTimeout(() => {
          this.scroll();
        }, 1000);
      }
    }
  }

  mounted() {
    this.$nextTick(() => {
      this.scroll();
    });
  }

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  getDownloadUrlNew(img) {
    if (img && img.includes('http')) {
      return img;
    } else if (img) {
      return getDownloadUrlNew.getImageUrl(img);
    } else {
      return img;
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';

.user_icon {
  font-size: 22px;
  margin-right: 4px;
  color: #ffb131;
}

.form-staff {
  max-height: 115px;
  overflow: hidden;
  transition: all 0.15s ease;

  &.expanded {
    max-height: 100rem;
  }

  &__more {
    color: @primary-color;
    // position: absolute;
    display: inline-block;
    right: 0.5em;
    bottom: 0.5em;
    cursor: pointer;

    & > i {
      display: inline-block;
      margin-left: 2px;
      font-size: 12px;
      transition: transform 0.24s;

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }
}

.form-staff-item {
  display: inline-flex;
  align-items: center;
  background: #eceff2;
  padding-right: 8px;
  min-width: 72px;
  min-height: 32px;
  vertical-align: top;
  margin: 4px 0;
  cursor: pointer;
  border-radius: 16px;

  .avatar-wrapper {
    margin-right: 8px;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2970ff;
    &.org-avatar-wrapper {
      background-color: rgba(17, 18, 24, 0.5);
    }
    .user-avatar {
      min-width: 32px;
      min-height: 32px;
      max-width: 200%;
      max-height: 200%;
    }
    em {
      margin: 0;
      padding: 0;
      position: unset;
      transform: translate(0, 0);
      font-size: 16px;
      color: #fff;
    }
    /deep/.ant-avatar-sm {
      width: 32px;
      height: 32px;
    }
  }

  &:not(:last-child) {
    margin-right: 0.5em;
  }

  & > .ant-avatar {
    margin-right: 4px;
  }

  & > .user-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 5em;
  }
}
</style>
