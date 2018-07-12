<template lang="pug">
Sider#siderbar(hide-trigger :style="{background: '#fff', height: '100vh'}" width="250")
    .row
        div
            a#logoTag(href='#' @click="open('https://github.com/blackfish-wu/Mtool')" style="-webkit-app-region: no-drag")
                img(src="../../assets/logo.svg")
    Menu#menu(v-bind:active-name="activeName" v-on:on-select="menuSelect" theme="light" width="auto" :open-names="['1']"  style="-webkit-app-region: no-drag")
        MenuItem(v-for="(item,index) in menuItems" v-bind:name="index" v-bind:key="index") {{item.description}}
</template>
<script>
export default {
    name: "baiduSider",
    data(){
        return {
            
        }
    },
    methods:{
        menuSelect(name){
            let item = this.menuItems[name]
            this.$router.push(`${item.basePath}/${item.path}`)
        },
        open(link){
            this.$electron.shell.openExternal(link)
        }
    },
    computed:{
        menuItems(){
            if(this.$store.state.Maps.map==="baidu")
                return this.$router.options.routes[0].children
            else
                return this.$router.options.routes[1].children
        },
        activeName(){
            let name = 0
            let currentPath = this.$router.currentRoute.fullPath
            for(let i in this.menuItems){
                if(`${this.menuItems[i].basePath}/${this.menuItems[i].path}`===currentPath)
                    name = parseInt(i)
            }
            return name
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
#logoTag{
    display:block;
    margin: 30px 0;
}
</style>
