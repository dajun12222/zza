<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="login-input">
    <p v-show="showTitle" class="login-input-label">
      {{ lable }}
    </p>
    <input
      v-model="val"
      :type="inputType"
      :placeholder="placeholder"
      autocomplete="off"
      @focus="focus"
      @blur="blur"
      @change="chang"
    />
    <i
      v-if="type === 'password'"
      class="icon aufontAll icon-eye"
      :class="{
        'h-icon-all-eye-close': !showPassWord,
        'h-icon-all-eye-o': showPassWord,
      }"
      @click="switchType"
    ></i>
    <span class="icon-clear" :class="{ 'password-clear': type === 'password',}" @click="clearValue">
      <i
        v-show="val && showTitle"
        class="clear icon aufontAll"
        :class="{
          'send-clear': canSendMsg,
          'remaining-clear': sendingMessage,
        }"
        >&#xe994;</i>
    </span>
    <div v-if="type === 'verification'" class="send-verification">
      <span v-if="!canSendMsg && !sendingMessage" class="disable">发送验证码</span>
      <span
        v-else-if="canSendMsg && !sendingMessage"
        class="enable"
        @click="sendMsg"
        >发送验证码</span>
      <span v-else class="disable">{{ remainingTime }}s</span>
    </div>
  </div>
</template>
<script lang="ts">
enum inputType {
  text = 'text',

  password = 'password',

  verification = 'verification',
}

import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'login-input',
  components: {},
})
export default class LoginInput extends Vue {
  @Prop({
    default: '',
  })
  placeholder!: boolean;

  @Model('change')
  val!: string;

  @Prop({
    default: '',
  })
  lable!: string;

  @Prop({
    default: inputType.text,
  })
  type!: inputType;

  @Prop({
    default: false,
  })
  canSendMsg?: boolean;

  @Prop({
    default: false,
  })
  sendingMessage?: boolean;

  showTitle = false;

  showPassWord = false;

  inputType = inputType.text;

  remainingTime: number = 0; // 验证码冷却时间

  @Watch('sendingMessage')
  sendingMsg(val) {
    if (val) {
      this.remainingTime = 60;
      const sendMessageInterval = setInterval(() => {
        this.remainingTime--;
        if (!this.remainingTime) {
          this.sendingMessage = false;
          clearInterval(sendMessageInterval);
        }
      }, 1000);
    }
  }

  sendMsg() {
    this.$emit('sendMsg');
  }

  created() {
    this.inputType = this.type;
  }

  focus() {
    this.showTitle = true;
  }

  blur() {
    this.showTitle = false;
  }

  chang(e: any) {
    this.$emit('change', e.target.value);
  }

  switchType() {
    this.showPassWord = !this.showPassWord;
    this.inputType = this.showPassWord ? inputType.text : inputType.password;
  }

  clearValue() {
    this.$emit('change', '');
    // this.val = '';
  }
}
</script>
<style lang="less" scoped>
.login-input {
  position: relative;
  text-align: left;
  .login-input-label {
    color: @primary-color;
    font-size: 0.373rem;
    line-height: 0.533rem;
    position: absolute;
    top: 0;
  }
  input {
    width: 100%;
    border-bottom: 0.04rem solid rgba(230, 235, 246, 1);
    background-color: inherit;
    padding: 0.13rem 0;
    font-size: 0.43rem;
    padding-top: 0.68rem;
    &::-webkit-input-placeholder {
      color: #999;
    }
  }
  .icon-eye {
    position: absolute;
    right: 0;
    top: 0.6rem;
    color: rgba(204, 204, 204, 1);
  }
  .icon-clear {
    position: absolute;
    right: 0;
    top: 0.6rem;
    color: rgba(204, 204, 204, 1);
    display: inline-block;
    width: 20px;
    height: 20px;
   
    &.password-clear {
      right: 0.74rem;
    }
    &.send-clear {
      right: 2.4rem;
    }
    &.remaining-clear {
      right: 0.9rem;
    }
  }
  .send-verification {
    position: absolute;
    right: 0;
    top: 0.6rem;
    font-size: 0.43rem;
    .disable {
      color: rgba(17, 18, 24, 0.25);
    }
    .enable {
      color: #2970ff;
    }
  }
}
</style>
