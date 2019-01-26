import Vue from 'vue';
import Vuex from 'vuex';
import WXP from 'minapp-api-promise';

import config from '@/config';
import debug from '@/utils/debug';

debug.log('config', config);

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: null,
        hasUserInfo: false,
        hasAuth: false,
        session: '',
    },
    actions: {
        async login({state, commit}) {
            try {
                if(!state.hasAuth) throw new Error('没有授权，尝试登陆');
                const loginRes = await WXP.login();      //向微信服务器请求登陆
                const requestRes = await WXP.request({   //向后端请求登陆
                    url: config.api.login,
                    method: 'POST',
                    data: {
                        wxCode: loginRes.code,
                    }
                });
                const data = requestRes.data; 
                if(data.code === undefined  || data.code === -1) throw new Error('code 为空 || code = -1 :actions login error');
                state.session = data.data.session;
                debug.log('登陆成功');
                commit('updateUserInfo', data.data.userInfo);
            } catch (err) {
                wx.showToast({
                    title: '登陆请求失败',
                    icon: 'none',
                });
                debug.log('login error: ', err);
            }
        },
        async initUserInfoLogin({state, commit, dispatch}, userInfo) {
            const res = await WXP.getSetting();
            if (res.authSetting['scope.userInfo']) {   //是否得到用户授权
                debug.log('得到授权');
                state.hasAuth = true;
                const userInfoRes = await WXP.getUserInfo();
                commit('initWXUserInfo', userInfoRes.userInfo);
                dispatch('login');
            } else {
                debug.log('未得到用户授权');
                wx.showToast({
                    title:'未登录',
                    icon: 'none',
                    duration: 1500,
                });
            }
        },
    },
    mutations: {
        initWXUserInfo(state, userInfo) {
            if(!state.userInfo) {
                state.userInfo = {};
                state.hasUserInfo = true;
            };
            Object.entries(userInfo).map((item) => {
                const [key, value] = item;
                Vue.set(state.userInfo, key, value);
            });
            console.log('')
        },
        updateUserInfo(state, newUserInfo) {
            if(null === state.userInfo) throw new Error('空userinfo');
            Object.entries(newUserInfo).forEach((item) => {
                const [key, value] = item;
                Vue.set(state.userInfo, key, value);
            });
            debug.log('updateUserInfo', state.session);
        }
    },
    getters: {

    },
});

export default store;