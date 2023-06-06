/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import rpc from '@cloudpivot-shared/utils/lib/rpc';
export const userId = window.localStorage.getItem('devInfo')
  ? JSON.parse(window.localStorage.getItem('devInfo') + '').userInfo.userId ||
    ''
  : '';

export const userName = window.localStorage.getItem('devInfo')
  ? JSON.parse(window.localStorage.getItem('devInfo') + '').userInfo.username ||
    ''
  : '';

export const sendMessage = (page, event) => {
  const params = {
    appCode: page.appCode,
    code: page.code,
    teamworkEditEvent: event,
    teamworkEditType: 'PAGE',
  };
  if (process.env.NODE_ENV !== 'production') {
    const baseUser = {
      editUserId: userId,
      editUserName: userName,
    };
    const WS = (window as any).WS;
    if (WS?.socket?.readyState === 1) {
      WS.socket.send(JSON.stringify(Object.assign(params, baseUser)));
    }
  } else {
    rpc.call('app_studio', 'sendMsg', params, () => {});
  }
};
