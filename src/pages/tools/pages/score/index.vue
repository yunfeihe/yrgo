<template>
  <div>
    
  </div>
</template>

<script>

import debug from '@/utils/debug';

export default {
  components: {
  },

  data () {
    return {
    }
  },
  methods: {
    
  },
  created () {
    debug.log('pages:home created');
    this.$store.dispatch('initUserInfoLogin');
  }
}
</script>

<style>

</style>
