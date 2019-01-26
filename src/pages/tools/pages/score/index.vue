<template>
  <div>
    <i-notice-bar :i-class="'notice'" color="#fff" closable>可下拉刷新</i-notice-bar>
    <i-panel>
      <div class="score-list">
        <div class="score-item" v-for="(item, index) in scoreData" :key="index">
          <div class="season">{{ item.season }}</div>
          <div class="title">{{ item.title }}</div>
          <div :class="['score', item.score < 60 ? 'unpassed' : '']">{{ item.score }}</div>
        </div>
      </div>
    </i-panel>
  </div>
</template>

<script>

import WXP from 'minapp-api-promise';
import { mapState } from 'vuex';

import config from '@/config';

import debug from '@/utils/debug';
import { setTimeout } from 'timers';


export default {
  components: {
  },

  data () {
    return {
      scoreData: [],
    }
  },
  methods: {
    async fetchScore(forceFresh=false) {
      try {
        let scoreData = wx.getStorageSync('score');
        if (!scoreData || forceFresh) {
          const scoreRes = await WXP.request({
            url: config.api.score,
            method: 'POST',
            data: {
              session: this.$store.state.session
            },
          });
          const data = scoreRes.data;
          if (data.code === 0) {
            scoreData = data.data;
            wx.setStorageSync('score', scoreData);
          } else if (data.code === 1) {  //教务处密码错误
            debug.log('教务处密码错误');
            wx.showToast({
              title: '教务处密码错误',
              icon: 'none',
            });
            throw new Error('教务处密码错误');
          }
        }
        this.scoreData = scoreData;
      } catch (err) {
        debug.log('fetchScore error', err);
        wx.showToast({
          title: '请求数据失败',
          icon: 'none',
        })
      }
    },
  },
  onShow () {
    if(this.userInfo.isBinded) {
      this.fetchScore();
    } else {
      setTimeout(() => {
        wx.navigateBack({});
      }, 1000);
      wx.showToast({
        title: '请先绑定教务处账号',
        icon: 'none',
        duration: 2000,
      });
      debug.log('未绑定教务处账号');
    }
  },
  computed: {
    ...mapState(['userInfo']),
  },
  async onPullDownRefresh() {
    debug.log('PullDownRefresh');
    await this.fetchScore(true);
    wx.stopPullDownRefresh({});
  },
}
</script>

<style>
  .score-list {
    background-color: #fff;
    padding-top: 10rpx;
    font-size: 16px;
  }

  .score-item {
    display: flex;
    padding: 10rpx 10rpx;
    justify-content: space-between;
  }

  .score {
    color: green;
  }
  .score.unpassed {
    color: red;
  }

  .notice {
    background-color: #2d8cf0 !important;

    text-align: center;
  }
</style>
