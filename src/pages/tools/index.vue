<template>
  <div>
    <i-panel v-if="hasAuth">
      <i-grid v-for="(row, index) in functionList" :key="index">
        <navigator v-for="(func, i) in row" :key="i" :url="func.path">
          <i-grid-item :i-class="'function'">
            <i-icon :type="func.icon" size="28" :color="func.color" />
            <i-grid-label>{{ func.title }}</i-grid-label>
          </i-grid-item>
        </navigator>
      </i-grid>
    </i-panel>
    <i-panel v-else>
        <i-button @click="handleLoginBtn">请登录</i-button>
    </i-panel>
  </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  components: {
  },

  data () {
    return {
      rawFunctionList: [
        {
          icon: 'activity',
          color: '#80848f',
          title: '查询课程表',
          path: '/pages/tools/pages/course/main',
        },
        {
          icon: 'barrage',
          color: '#80848f',
          title: '查询考试成绩',
          path: '/pages/tools/pages/score/main',
        },
        {
          icon: 'activity',
          color: '#80848f',
          title: '课程表',
          path: '/pages/tools/pages/course',
        },
        {
          icon: 'activity',
          color: '#80848f',
          title: '课程表',
          path: '/pages/tools/pages/course',
        },
      ],
    };
  },
  computed: {
    functionList() {
      const result = [];
      let temp = [];
      this.rawFunctionList.forEach((func, index) => {
        if(temp.length === 2) {
          result.push(temp);
          temp = [];
        }
        temp.push(func);
      });
      if(temp.length !== 0) result.push(temp);
      return result;
    },
    ...mapState(['hasAuth']),
  },
  methods: {
    handleLoginBtn() {
        wx.switchTab({
          url: '/pages/user/main'
        });
    },
  },
  created () {
  }
}
</script>

<style>
  .function {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
</style>
