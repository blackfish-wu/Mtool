<template lang="pug">
Layout.ivu-layout-has-sider(:style="{ background: '#fff'}")
    stepsBar(v-bind:steps="steps", v-bind:currentStep="currentStep")
    Layout(:style="{ background: '#fff'}")
        contentHeader
        Layout(:style="{ background: '#fff'}")
            Content
                Row(type="flex" justify="center" align="middle" style="height:80vh;-webkit-app-region: no-drag")
                    Col(span="6")
                        // Upload(multiple type="drag" v-on:on-before-upload="dropFile" v-on:before-upload="dropFile" action="''")
                        Card
                            div(@click="clickUpload" @ondrop="dropFile")
                                Row(type="flex" justify="center")
                                    Icon(type="plus" size="52" style="color:#3399ff")
                                Row(type="flex" justify="center")
                                    p 点击或拖拽文件
</template>

<script>
import stepsBar from '../../../parts/Steps'
import contentHeader from '../../../parts/Header'
import {remote} from 'electron'
import {Parser} from 'json2csv'
import fs from 'fs'
export default {
    components: {contentHeader, stepsBar},
    data(){
        return {
            map: null,
            cityName: null,
            keywords: null, 
            polygon: null,
            currentStep: 0,
            steps:[
                {
                    id: 1,
                    title: "加载文件",
                    content: "拖拽文件至点击上传文件，目前仅支持.csv .xlsx .xls格式"
                },
                {
                    id: 2,
                    title: "选择文本地址列",
                    content: "在左侧输入框中输入爬取POI的关键字，使用“,”间隔多个关键字"
                },
                {
                    id: 3,
                    title: "地址编码",
                    content: "点击开始编码，自动生成lat和lng列"
                }
            ]
        };
    },
    methods: {
        dropFile(e){
            console.log(e)
            return false;
        },
        clickUpload(e){
            console.log(e)
        }
    },
    mounted () {
        
    },
    computed: {
    }
}
</script>

<style>
    .no-border{
        border: 0px;
    }
    #commitSearch{
        margin-left: 0px;
    }
</style>
