<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import common from 'cloudpivot/common/pc';
import { WorkflowParticipantType } from '../../typings/workflow-enum';

import { workflow } from 'cloudpivot/api';

@Component({
  name: 'workflow-participants',
  components: {
    UserPopover: common.components.UserPopover,
  },
})
export default class WorkflowParticipants extends Vue {
  @Prop({ default: () => [] }) participants!: workflow.Participant[];

  @Prop() pSlot!: any;

  @Prop() i18nData?: any;

  @Prop() trustor?: any;

  @Prop() showTitle?: any;

  @Prop() isHiddenImg?: boolean; //是否隐藏头像

  @Prop() btnConfigList?: any; //按钮新名称

  render(h: any) {
    const participantRenders: any[] = [];
    let title: any = [];
    if (this.pSlot) {
      participantRenders.push(h('label', this.pSlot));
    }

    this.participants.forEach(
      (participant: workflow.Participant, index: number) => {
        participantRenders.push(
          h(common.components.UserPopover, {
            props: {
              user: { id: participant.id, name: participant.name },
              isHiddenImg: this.isHiddenImg,
            },
          }),
        );
        title.push(participant.name);
        // 预估处理人委托人信息
        if (
          participant.isTrust &&
          participant.trustorProcessor &&
          participant.trustorProcessor.id
        ) {
          if (this.i18nData && this.i18nData.trust) {
            participantRenders.push(
              `【${participant.trustorProcessor.name}${this.i18nData.trust}】`,
            );
            title.push(
              `【${participant.trustorProcessor.name}${this.i18nData.trust}】`,
            );
          } else {
            participantRenders.push(
              `${this.$t('cloudpivot.flow.pc.trust', {
                name: participant.trustorProcessor.name,
              })}`,
            );
            title.push(
              `${this.$t('cloudpivot.flow.pc.trust', {
                name: participant.trustorProcessor.name,
              })}`,
            );
          }
        }

        if (this.trustor) {
          if (this.i18nData && this.i18nData.trust) {
            participantRenders.push(
              `【${this.trustor.name}${this.i18nData.trust}】`,
            );
            title.push(`【${this.trustor.name}${this.i18nData.trust}】`);
          } else {
            participantRenders.push(
              `${this.$t('cloudpivot.flow.pc.trust', {
                name: this.trustor.name,
              })}`,
            );
            title.push(
              `${this.$t('cloudpivot.flow.pc.trust', {
                name: this.trustor.name,
              })}`,
            );
          }
        }
        if (participant.workItemType && participant.workItemType !== 5) {
          participantRenders.push(
            h(common.components.UserPopover, {
              props: {
                user: {
                  id: participant.sourceId,
                  name: participant.sourceName,
                },
                isHiddenImg: this.isHiddenImg,
              },
            }),
          );
          participantRenders.splice(participantRenders.length - 1, 0, '[');
          title.push(`[${participant.sourceName}`);

          switch (participant.workItemType) {
            case WorkflowParticipantType.ASSIST:
              if (this.btnConfigList && this.btnConfigList.assist) {
                participantRenders.push('的' + this.btnConfigList.assist + ']');
              } else if (this.i18nData && this.i18nData.assist) {
                participantRenders.push(this.i18nData.assist);
              } else {
                participantRenders.push(
                  `${this.$t('cloudpivot.flow.pc.Assist')}`,
                );
              }
              break;
            case WorkflowParticipantType.ADD_WORKITEM:
              if (this.btnConfigList && this.btnConfigList.adjust) {
                participantRenders.push('的' + this.btnConfigList.adjust + ']');
              } else if (this.i18nData && this.i18nData.addWorkitem) {
                participantRenders.push(this.i18nData.addWorkitem);
              } else {
                participantRenders.push(
                  `${this.$t('cloudpivot.flow.pc.AddWorkitem')}`,
                );
              }
              break;
            case WorkflowParticipantType.CIRCULATE_ITEM:
              if (this.btnConfigList && this.btnConfigList.circulate) {
                participantRenders.push(
                  '的' + this.btnConfigList.circulate + ']',
                );
              } else if (this.i18nData && this.i18nData.circulate) {
                participantRenders.push(this.i18nData.circulate);
              } else {
                participantRenders.push(
                  `${this.$t('cloudpivot.flow.pc.Circulate')}`,
                );
              }
              break;
            case WorkflowParticipantType.FORWARD:
              if (this.btnConfigList && this.btnConfigList.forward) {
                participantRenders.push(
                  '的' + this.btnConfigList.forward + ']',
                );
              } else if (this.i18nData && this.i18nData.forward) {
                participantRenders.push(this.i18nData.forward);
              } else {
                participantRenders.push(
                  `${this.$t('cloudpivot.flow.pc.Forward')}`,
                );
              }
              break;
            default:
              break;
          }
          title.push(`${participantRenders[participantRenders.length - 1]}`);
        }

        if (index !== this.participants.length - 1) {
          participantRenders.push('、');
        }
      },
    );

    title = this.showTitle ? title.join('') : '';
    return h(
      'div',
      {
        class: {
          'workflow-participants': true,
        },
        attrs: {
          title: title,
        },
      },
      participantRenders.length ? participantRenders : '--',
    );
  }
}
</script>
