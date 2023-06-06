import ModifyPwd from './modify-pwd.vue';
import { Component, Vue } from 'vue-property-decorator';
import { OAuthApi } from 'cloudpivot/api';

@Component({
  name: 'modify-password',
  components: {
    ModifyPwd,
  },
})
export default class ModifyPassword extends Vue {
  isModifyPwdShow: boolean = false;

  showPop() {
    const isSinglePwd = localStorage.getItem('singlePwd');
    if (isSinglePwd && isSinglePwd === 'true') {
      this.isModifyPwdShow = true;
    } else {
      this.isModifyPwdShow = false;
    }
  }

  closePop() {
    this.isModifyPwdShow = false;
    localStorage.removeItem('singlePwd');
  }

  // 退出登录
  logout() {
    this.closePop();
    const env = (window as any).config;
    const redirectIP = env.redirectHost;
    const token: string = localStorage.getItem('token') || '';

    OAuthApi.logout({
      redirect_uri: `${redirectIP}/login`,
      T: token,
    }).then((res: any) => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expireTime');
      sessionStorage.removeItem('user');
      localStorage.removeItem('login_jump');
      localStorage.removeItem('singlePwd');
      this.$router.replace({ name: 'login' });
    });
  }
}
