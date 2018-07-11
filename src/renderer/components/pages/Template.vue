<template lang="pug">
  Layout.ivu-layout-has-sider
    siderbar
    router-view(name="content")
</template>

<script>
  import siderbar from '../parts/Sidebar'
  export default {
    name: "viewTemplate",
    components: {siderbar}
  }
</script>