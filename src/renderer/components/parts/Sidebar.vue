<template lang="pug">
Sider#siderbar(hide-trigger :style="{background: '#fff', height: '100vh'}")
    .row
        div
            a(href='#' @click="open('https://github.com/blackfish-wu/Mtool')" style="-webkit-app-region: no-drag")
                img(src="../../assets/logo.svg")
    Menu#menu(v-bind:active-name="menuname" theme="light" width="auto" :open-names="['1']"  style="-webkit-app-region: no-drag")
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
#menu{
    border-top: 1px #E6E6FA;
}
a{
    display:block;
    margin: 30px 0;
}
</style>
