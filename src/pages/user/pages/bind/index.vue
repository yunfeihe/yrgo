<template>
  <div>
    <i-panel title="教务处账号">
      <i-input :value="sid" id="sid" type="text" title="账号:" @change="handleChangeInput($event, 'sid')" autofocus
        placeholder="请输入您的教务处账号" />
      <i-input :value="password" id="password" type="text" title="密码:" @change="handleChangeInput($event, 'password')"
        placeholder="请输入您的教务处密码" />
      <!-- <i-input value="{{ value3 }}" type="textarea" title="详细地址" placeholder="请输入详细地址(最多50字)" maxlength="50" />
      <i-input value="{{ value4 }}" title="用户信息" disabled /> -->
    </i-panel>
    <i-panel title="请选择你的身份">
      <i-radio-group :current="currentRadio" @change="handleRadioChange">
        <i-radio :value="'学生'"></i-radio>
        <i-radio :value="'教师'"></i-radio>
        <i-radio :value="'管理员'"></i-radio>
      </i-radio-group>
    </i-panel>
    <div class="btns">
      <i-button type="primary" @click="handleBindBtn" :loading="isBinding">绑定</i-button>
      <i-button type="warning" @click="handleResetBtn">重置</i-button>
    </div>
    <div>
      {{ sid }} <br>
      {{ password }} <br>
      {{ idCode }}
    </div>
  </div>
</template>

<script>

import WXP from 'minapp-api-promise';
import { mapState } from 'vuex';
import config from '@/config';
import { setTimeout } from 'timers';

export default {
  components: {
  },

  data () {
    return {
      session: this.session,
      sid: 'test',
      password: 'test123',
      identityMap: {
        0: 'STUDENT',
        1: 'TEACHER',
        2: 'ADMIN',
      },
      idCode: 0,
      currentRadio: '学生',
      isBinding: false,
    };
  },
  computed: {
    ...mapState(['hasAuth']),
  },
  methods: {
    handleChangeInput(evt, key) {
      const newValue = evt.mp.detail.detail.value;
      this.$data[key] = newValue;
    },
    handleRadioChange(evt) {
      console.log('evt', evt);
      const ident = evt.target.value;
      if (ident === '学生') {
        this.idCode = 0;
        this.currentRadio = '学生';
      } else if (ident === '教师') {
        this.idCode = 1;
        this.currentRadio = '教师';
      } else if (ident === '管理员') {
        this.idCode = 2;
        this.currentRadio = '管理员';
      }
    },
    async handleBindBtn() {
      if (!this.hasAuth) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000,
        });
        setTimeout(() => {
          wx.navigateBack({});
        }, 1000);
        return;
      }
      try {
        this.isBinding = true;
        const requestRes = await WXP.request({
          url: config.api.bind,
          method: 'POST',
          data: {
            session: this.$store.state.session,
            sid: this.sid,
            password: this.password,
            idCode: this.idCode,
            identity: this.identityMap[this.idCode],
          }
        });
        const data = requestRes.data;
        if (data === undefined) throw new Error('绑定错误，data===undefined');
        if(data.code === -1) throw new Error('data.code = -1', '绑定错误');
        if (data.code === 0) {
          this.isBinding = false;
          const newUserInfo = {
            idCode: this.idCode,
            isBinded: true,
            sid: this.sid,
            identity: this.identityMap[this.idCode],
          };
          this.$store.commit('updateUserInfo', newUserInfo);
          wx.navigateBack();
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            duration: 2000,
          });
          
        } 
      } catch (err) {
        this.isBinding = false;
        wx.showToast({
          title: '绑定失败',
          icon: 'none',
          duration: 1500,
        });
        console.log('pages:bind 发生绑定错误', err);
      }
    },
    handleResetBtn() {
      console.log('reset');
      this.sid = '';
      this.password = '';
      this.idCode = 0;
      this.currentRadio = '学生';
    }
  },

}
</script>

<style>
  .btns {
    display: flex;
    flex-flow: row nowrap;
  }
  .btns i-button {
    width: 50%;
  }
</style>
