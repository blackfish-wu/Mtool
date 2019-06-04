<template lang="pug">
Layout.ivu-layout-has-sider(:style="{ background: '#fff'}")
    stepsBar(v-bind:steps="steps", v-bind:currentStep="currentStep")
    Layout(:style="{ background: '#fff'}")
        contentHeader
        Content(:style="{ background: '#fff', padding: '12px'}" style="-webkit-app-region: no-drag")
            div(v-if="currentStep === 0")
                Row(type="flex" justify="center" align="middle" style="height:80vh;")
                    Col(span="6")
                        // Upload(multiple type="drag" v-on:on-before-upload="dropFile" v-on:before-upload="dropFile" action="''")
                        Card
                            #drag-file(@click="addFile")
                                Row(type="flex" justify="center")
                                    Icon(type="plus" size="52" style="color:#3399ff")
                                Row(type="flex" justify="center")
                                    p 点击或拖拽文件
            div(v-if="currentStep === 1||currentStep === 2")
                Row(:style="{margin: '12px'}" type="flex" justify="space-between" align="middle")
                    Select(v-model="tableInfo.addressIndex" style="width:200px" placeholder="请选择地址文本所在列")
                        Option(v-for="item,index in tableInfo.columns" :value="index" :key="item.title") {{ item.title }}
                    Select(v-model="tableInfo.cityIndex" style="width:200px" placeholder="请选择城市所在列")
                        Option(v-for="item,index in tableInfo.columns" :value="index" :key="item.title") {{ item.title }}
                    Select(v-model="tableInfo.hasColumnName" style="width:150px" placeholder="是否包含列标题")
                        Option(:value="1" :key="1") 是
                        Option(:value="0" :key="0") 否
                    Button(@click="geocode") 开始正向地理编码
                Row(:style="{margin: '12px'}")
                    Col
                        Table(:style="{height:'80vh'}" :columns="tableInfo.columns"  :data="tableInfo.data")
</template>

<script>
import stepsBar from '../../../parts/Steps'
import contentHeader from '../../../parts/Header'
import Geocoder from './Geocoder'
import dragDrop from 'drag-drop'
import xlsx from 'node-xlsx'
import Papa from 'papaparse'
import iconv from 'iconv-lite'
import chardet from 'jschardet'
import {remote} from 'electron'
import fs from 'fs'
import { resolve } from 'url';
export default {
    components: {contentHeader, stepsBar},
    data(){
        return {
            currentStep: 0,
            geocoder: new Geocoder(),
            fileData: null,
            tableInfo:{
                addressIndex: null,
                cityIndex: null,
                columns: [],
                data: [],
                hasColumnName: null,
            },
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
        addFile(){
            const that = this
            remote.dialog.showOpenDialog({
                title:"选择打开的表格文件",
                properties: ["openFile"],
                filters: [{name:'Table', extensions:['csv','xlsx','xls']}]
            }, (filePath) => {
                // 
                if(filePath === undefined){
                    console.log("No destination folder selected");
                    return
                }else{
                    that.showData(filePath[0])
                }
            })
        },
        showData(path){
            const that = this
            const fileType=path.substr(path.lastIndexOf('.')+1, path.length) //文件类型
            if(fileType==="xlsx" || fileType==="xls"){
                const worksheet = xlsx.parse(path)
                that.addData2Table(worksheet[0].data)
                that.currentStep ++
            }else if(fileType==="csv" || fileType==="txt"){
                this.detectCoding(path).then((contentStr) => {
                    Papa.parse(contentStr, {
                        complete:(results) => {
                            that.addData2Table(results.data)
                            that.currentStep ++
                        }
                    })
                })
            }else{
                this.$Notice.error({title: '不支持该文件类型'})
            }
        },
        detectCoding(path){
            return new Promise((resolve) => {
                const rs = fs.createReadStream(path)
                let chunks = []
                let size = 0
                rs.on('data', (chunk) => {
                    chunks.push(chunk)
                    size += chunk.length
                })
                rs.on('end', () => {
                    const buf = Buffer.concat(chunks, size)
                    const encoding = chardet.detect(buf).encoding
                    const contentStr = iconv.decode(buf, encoding)
                    resolve(contentStr)
                })
            })
        },
        addData2Table(data){
            const that = this
            this.fileData = data
            data[0].forEach((cell) => {
                that.tableInfo.columns.push({title:cell, key:cell})
            })
            for(let i=1;i<20&&i<data.length;i++){
                let tempObj = {}
                data[i].forEach((cell, index) => {
                    tempObj[data[0][index]] = cell
                })
                that.tableInfo.data.push(tempObj)
            }
        },
        geocode(){
            if(this.tableInfo.addressIndex===null){
                this.$Notice.error({title:'请选择文本地址列'})
                return
            }
            this.currentStep = 2
            this.geocoder.geocode4tableData(this.fileData.slice(1), this.tableInfo.addressIndex, this.tableInfo.cityIndex)
            .then((result) => {
                console.log(result)
            })
        },
        saveData(){

        }
    },
    mounted () {
        let that = this
        dragDrop('#drag-file', function (files, pos, fileList, directories) {
            that.showData(files[0].path)
        })
        
    },
    computed: {

    },
    watch: {
        currentStep: (newStep, oldStep) => {
            if(newStep===0){
                this.tableInfo = {
                    addressIndex: null,
                    cityIndex: null,
                    columns: [],
                    data: [],
                }
            }else if(newStep===2){
                
            }
        }
    }
}
</script>

<style>

</style>
