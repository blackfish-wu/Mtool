<template lang="pug">
  #drag-file
    p Drag your files here
</template>

<script>
import dragDrop from 'drag-drop'
export default {
  methods:{

  },
  mounted() {
    let that = this;
    dragDrop('#drag-file', function (files, pos, fileList, directories) {
      this.$Notice.success({title: '请绘制感觉兴趣区以及搜索关键字'+files.toString()})
      console.log('Here are the dropped files', files) // Array of File objects
      console.log('Dropped at coordinates', pos.x, pos.y)
      console.log('Here is the raw FileList object if you need it:', fileList)
      console.log('Here is the list of directories:', directories)
    })
  },
}
</script>

<style>
  #drag-file {
    background-color: blue;
    color:white;
    text-align: center;
    width:300px;
    height:300px;
  }
</style>