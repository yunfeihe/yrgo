<template>
  <div>
    <i-notice-bar :i-class="'notice'" color="#fff" closable>可下拉刷新</i-notice-bar>
    <i-tabs :current="selectWeek" scroll @change="handleTabChange">
      <i-tab v-for="week in (maxWeek - 1)" :key="week + 1" :id="week + 1" :title="'第' + (week + 1) + '周'"></i-tab>
    </i-tabs>
    <i-panel :i-class="'course'">
      <i-grid class="course-row">
        <i-grid-item :i-class="['course-item']">时间</i-grid-item>
        <i-grid-item :i-class="['course-item']">1</i-grid-item>
        <i-grid-item :i-class="['course-item']">2</i-grid-item>
        <i-grid-item :i-class="['course-item']">3</i-grid-item>
        <i-grid-item :i-class="['course-item']">4</i-grid-item>
        <i-grid-item :i-class="['course-item']">5</i-grid-item>
        <i-grid-item :i-class="['course-item']">6</i-grid-item>
        <i-grid-item :i-class="['course-item']">7</i-grid-item>
      </i-grid>
      <i-grid v-for="(row, index) in courseData" :key="index" class="course-row">
        <i-grid-item :i-class="['course-item']">{{ courseTimeMap[index] }}</i-grid-item>     
        <i-grid-item 
          :i-class="'course-item ' + (course && selectWeek >= course.startWeek && selectWeek <= course.endWeek && course.className)" 
          v-for="(course, j) in row" :key="j">
            <template v-if="course && selectWeek >= course.startWeek && selectWeek <= course.endWeek">
              <div class="title">{{ course ? course.title : '' }}</div>
              <div class="teacher">{{course ? course.teacher : ''}}</div>
              <div class="room">{{ course ? course.room : '' }}</div>
            </template>
        </i-grid-item>
      </i-grid>
    </i-panel>
  </div>
</template>

<script>

import WXP from 'minapp-api-promise';
import { mapState } from 'vuex';

import config from '@/config';
import debug from '@/utils/debug';
import { throws } from 'assert';

export default {
  components: {
  },

  data () {
    return {
      // currentWeek: 1,
      selectWeek: 1,
      maxWeek:15,
      rawCourseData: [],
      courseTimeMap: [
        '1-2节',
        '3-4节',
        '5-7节',
        '8-9节',
      ]
    }
  },
  computed: {
    ...mapState(['hasAuth', 'userInfo']),
    courseData() {
      if (this.rawCourseData.length === 0) return [];
      const result = [];
      for (let dayTime = 0; dayTime < 4; dayTime += 1) {
        let temp = [];
        for(let weekIndex = 0; weekIndex < 7; weekIndex += 1) {
          const course = this.rawCourseData[weekIndex][dayTime];
          let className;
          if(course === null) className = 'course-empty';
          else if (course.special === "EVEN" && this.selectWeek % 2 === 0) className = 'course-normal';
          else if (course.special === 'ODD' && this.selectWeek % 2 !== 0) className = 'course-normal';
          else if (course.special === 'ALL') className = 'course-normal';
          else className = 'course-disable';
          course && (course.className = className);
          temp.push(course);
        }
        result.push(temp);
        temp = [];
      }
      return result;
    }

  },
  methods: {
    handleTabChange(evt) {
      debug.log('evt', evt);
      this.selectWeek = parseInt(evt.target.key);
    },
    async fetchCourse(forceFresh = false) {
      debug.log('start fetchCourse');
      try {
        if (!this.hasAuth) throw new Error('未授权');
        let course = wx.getStorageSync('course');
        if (forceFresh || !course) {
          debug.log('请求网络数据');
          const courseRes = await WXP.request({
            url: config.api.course,
            method: 'POST',
            data: {
              session: this.$store.session,
            },
          });
          const data = courseRes.data;
          if (data.code === 0) {
            course = data.data;
            wx.setStorageSync('course', course);
          } else if (data.code === 1) { //教务处账号密码错误
            wx.showToast({
              title: '教务处账号密码错误，请重新绑定',
              icon: 'none',
            })
          }
        }
        this.maxWeek = course.maxWeek;
        this.rawCourseData = course.courseData;
      } catch (err) {
        debug.log('err', err);
      }
    }
    
  },
  async onShow () {
    debug.log('onShow course', this.userInfo.isBinded);
    if(this.userInfo.isBinded) {
      this.fetchCourse();
    } else {
      wx.showToast({
        title: '请先绑定教务处账号',
        icon: 'none',
        duration: 2000,
      });
      debug.log('未绑定教务处账号');
    }
  },
  onReady() {
    debug.log('onReady course', this.userInfo.isBinded);
    if(!this.userInfo.isBinded) {
      wx.navigateTo({
        url: '/pages/user/pages/bind/main',
      });
      wx.showToast({
        title: '请先绑定教务处账号',
        icon: 'none',
        duration: 2000,
      });
      debug.log('未绑定教务处账号');
    }
  },
  async onPullDownRefresh() {
    debug.log('PullDownRefresh');
    await this.fetchCourse(true);
    wx.stopPullDownRefresh({});
  },
}
</script>

<style>
  .course {
    margin-top: 20rpx;
    font-size: 10px;
  }

  .course-item {
    padding: 0 !important;
    height: 150rpx;
    text-align: center;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    
  }

  .course-disable {
    background-color: #80848f;
    color: #bbbec4;
  }

  .course-normal {
    background-color: #2d8cf0;
    color: #fff;
  }

  .notice {
    background-color: #2d8cf0 !important;

    text-align: center;
  }


</style>
