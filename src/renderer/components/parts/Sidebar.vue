<template lang="pug">
Sider#siderbar(hide-trigger :style="{background: '#fff', height: '100vh'}")
    .row(:style="{padding:'30px 35px'}")
        a(@click="open('https://electron.atom.io/docs/')")
            img(src="../../assets/logo.svg" width="120px")
    Menu(v-bind:active-name="menuname" theme="light" width="auto" :open-names="['1']"  style="-webkit-app-region: no-drag")
        MenuItem(name="0") POI抓取
        MenuItem(name="1") 逆向地理编码(开发中)
</template>
<script>
export default {
    computed: {
        menuname(){
            return this.$store.state.Title.menuname;
        }
    },
    methods:{
        open(link){
            this.$electron.shell.openExternal(link)
        }
    }
}
</script>
<style>
#siderbar{
    z-index: 5;
    box-shadow:2px 0px 20px #E6E6FA;
    text-align: center;
}
</style>
