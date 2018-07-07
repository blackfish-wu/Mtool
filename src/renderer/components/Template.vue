<template lang="pug">
  Layout.ivu-layout-has-sider
    sidebar
    mainContent
</template>

<script>
  import sidebar from './parts/Sidebar'
  import mainContent from './contents/BaiduMap'
  export default {
    name: 'landing-page',
    components: { sidebar, mainContent },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
</style>
