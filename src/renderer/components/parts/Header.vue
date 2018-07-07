<template lang="pug">
    Row.code-row-bg(type='flex', justify='end', :style="{padding: '5px'}")
        ButtonGroup(size="large" style="-webkit-app-region: no-drag")
            Button.no-border(type='ghost', icon='ios-minus-empty' v-on:click="clickMinWd")
            Button.no-border(type='ghost', icon='ios-photos-outline' v-on:click="clickMaxWd")
            Button.no-border(type='ghost', icon='close' v-on:click="clickCloseWd")
</template>


<script>
var ipc = require('electron').ipcRenderer;
export default {
    name: "contentHeader",
    methods: {
        clickMinWd: ()=> ipc.send('window-min'),
        clickMaxWd: ()=> ipc.send('window-max'),
        clickCloseWd: ()=> ipc.send('window-close')
    }
}
</script>
<style>
    .no-border{
        border: 0px;
    }
</style>
