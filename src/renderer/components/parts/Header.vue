<template lang="pug">
    Row.code-row-bg(type='flex', justify='end', :style="{padding: '5px'}")
        Dropdown(style="-webkit-app-region: no-drag", trigger="click", v-on:on-click="dropDownClick")
            Button.no-border(type='ghost', icon='gear-a', size="large")
            DropdownMenu(slot="list")
                DropdownItem(name="update") 检查更新
                DropdownItem(name="setting") 设置
        ButtonGroup(size="large",style="-webkit-app-region: no-drag")
            //- Button.no-border(type='ghost', icon='gear-a')
            Button.no-border(type='ghost', icon='ios-minus-empty' v-on:click="clickMinWd")
            Button.no-border(type='ghost', icon='ios-photos-outline' v-on:click="clickMaxWd")
            Button.no-border(type='ghost', icon='close' v-on:click="clickCloseWd")
</template>


<script>
var ipc = require("electron").ipcRenderer;
export default {
  name: "contentHeader",

  data() {
    return {
      checkUpdate: false
    };
  },

  mounted() {
    ipc.on("message", (event, { message, data }) => {
      if (message === "isUpdateNow") {
        if (confirm("是否现在更新？")) {
          ipc.send("updateNow");
        }
      }
    });
  },

  methods: {
    clickMinWd: () => ipc.send("window-min"),
    clickMaxWd: () => ipc.send("window-max"),
    clickCloseWd: () => ipc.send("window-close"),
    dropDownClick: function(name) {
      switch (name) {
        case "update":
          console.log("update")
          ipc.send("update");
          break;

        case "setting":
          break;

        default:
          break;
      }
    }
  }
};
</script>
<style>
.no-border {
  border: 0px;
}
</style>
