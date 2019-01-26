<template>
  <div>
    
    <div class="userinfo">
      <i-card full 
        :thumb=" hasUserInfo ? userInfo.avatarUrl : '/static/images/avatar-not-logined.png'" 
        :extra=" hasUserInfo ? userInfo.nickName : '未登录' ">
        <view slot="content">
          <div v-if="!hasUserInfo" class="unlogin">
            <i-button 
              size="large"
              type="primary"
              open-type="getUserInfo"
              :i-class="'logginBtn'"
              @getuserinfo="handleGetUserInfo"
              @click="handleLoginClick"
              :loading="isLogining"
              >登陆</i-button>
          </div>
        </view>
      </i-card>

    <div class="function-list">
      <i-cell-group>
        <i-cell :title="isBindedInfo"  is-link url="/pages/user/pages/bind/main"></i-cell>
        <i-cell title="跳转到首页" is-link url="/pages/dashboard/index"></i-cell>
        <i-cell title="只有 footer 点击有效" is-link url="/pages/dashboard/index" only-tap-footer></i-cell>
        <i-cell title="开关">
          <switch slot="footer" checked />
        </i-cell>
      </i-cell-group>
    </div>

    </div>
  </div>
</template>

<script>

import WXP from 'minapp-api-promise';
import { mapState } from 'vuex';

export default {
  components: {
  },
  data () {
    return {
      isLogining: false,
    }
  },
  created () {
  },
  methods: {
    async handleGetUserInfo(res) {
      const userInfo = res.mp.detail.userInfo;
      if(userInfo) {
        this.$store.dispatch('initUserInfoLogin', userInfo);  
      } else {
        wx.showToast({
          title: '授权失败',
          icon: 'none',
        });
        this.$data.isLogining = false;
      }
      
    },
    async handleLoginClick(evt) {
      this.$data.isLogining = true;
    },
  },
  computed: {
    ...mapState(['userInfo', 'hasUserInfo']),
    isBindedInfo() {
      if(this.hasUserInfo && this.userInfo.isBinded) return `绑定教务处账号(已绑定${this.userInfo.sid})`;
      else return "绑定教务处账号(未绑定)";
    }
  }
  
}
</script>

<style>
.userinfo {
  margin-top: 20rpx;
}

.function-list {
  margin-top: 20rpx;
}

.logginBtn {
  margin: 0 20rpx;
}
</style>
