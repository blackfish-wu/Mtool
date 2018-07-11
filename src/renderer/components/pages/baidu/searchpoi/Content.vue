<template lang="pug">
Layout.ivu-layout-has-sider(:style="{ background: '#fff'}")
    stepsBar(v-bind:steps="steps", v-bind:currentStep="currentStep")
    Layout(:style="{ background: '#fff'}")
        contentHeader
        Layout(:style="{ background: '#fff'}")
            Row.code-row-bg(type='flex', justify='space-between', :style="{padding: '12px'}" style="-webkit-app-region: no-drag")
                Input#commitSearch(v-model="keywords" v-on:on-keydown.13="commitSearch" placeholder="输入查询关键字,以小写逗号隔开" size="large"  clearable style="width: 250px")
                Input(v-model="cityName" v-on:on-keydown.13="citySearch" placeholder="输入城市查询边界，如输入：深圳市" size="large"  clearable style="width: 250px")
            Content
                #container(:style="{height:'calc(100vh - 110px)'}", style="-webkit-app-region: no-drag")
</template>


<script>
import stepsBar from '../../../parts/Steps'
import contentHeader from '../../../parts/Header'
import PlaceSearcher from './PlaceSearch'
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
                    title: "绘制感兴趣区域",
                    content: "在右侧输入框搜索城市边界，或使用地图右上角多边形绘制工具进行绘制"
                },
                {
                    id: 2,
                    title: "输入关键字",
                    content: "在左侧输入框中输入爬取POI的关键字，使用“,”间隔多个关键字"
                },
                {
                    id: 3,
                    title: "爬取POI",
                    content: "输入完关键字后，按回车键即可爬取POI"
                }
            ]
        };
    },
    methods: {
        citySearch: function(){
            let bdary = new BMap.Boundary();
            let name = this.cityName;
            let that = this;
            bdary.get(name, function(rs){         //获取行政区域
                that.map.clearOverlays();         //清除地图覆盖物
                let count = rs.boundaries.length; //行政区域的点有多少个
                for(let i = 0; i < count; i++){
                    let ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
                    that.map.addOverlay(ply);  //添加覆盖物
                    that.map.setViewport(ply.getPath());  //调整视野   
                    that.polygon = ply;
                    that.currentStep = 1;
                    break;
                }
            });   
        },
        commitSearch: async function(){
            if(this.polygon===null||this.keywords===null){
                this.$Notice.error({title: '请绘制感觉兴趣区以及搜索关键字'})
                return false
            }
            this.currentStep = 2
            let placeSearcher = new PlaceSearcher()
            this.$Loading.config({height:3})
            this.$Loading.start()
            let keywords = Array.from(new Set(this.keywords.split('，'))) // 分割关键字并去重
            this.$Loading.update(0);
            let result = {}
            for(let i in keywords){
                result[keywords[i]] = await placeSearcher.search(this.polygon, keywords[i])
                this.$Loading.update((i+1)/keywords.length);
            }
            this.$Loading.finish()
            this.openSaveDailog(result)
        },
        openSaveDailog: function(result){
            let content = "";
            let that = this;
            for(let keyword in result){
                content += `<p>关键字‘${keyword}’爬取得到的POI数量为: ${result[keyword].poiList.length}</p>`
            }
            this.$Modal.confirm({
                title:"POI爬取结果",
                content: content,
                okText: '保存到文件夹',
                cancelText: '取消',
                onOk: () => {
                    remote.dialog.showOpenDialog({
                        title:"选择保存的文件夹",
                        properties: ["openDirectory"]
                    }, (folderPath) => {
                        // 
                        if(folderPath === undefined){
                            console.log("No destination folder selected");
                            return;
                        }else{
                            console.log(folderPath);
                            that.saveData(result, folderPath)
                        }
                    })
                }
            })
        },
        saveData: function(result, path){
            const fields  = ['uid', 'name', 'address', 'city', 'location.lat', 'location.lng', 'detail_info.tag', 'detail_info.type'];
            const json2csvParser = new Parser({ fields })
            for(let keyword in result){
                const csv = json2csvParser.parse(result[keyword].poiList)
                fs.writeFile(path + "\\" + keyword +".csv", csv, (err) => {
                    if (err) throw err
                    console.log('It\'s saved!')
                })
            }
        }
    },
    mounted () {
        let that = this;
        this.map = new BMap.Map("container");
        this.map.centerAndZoom(new BMap.Point(106.770409, 37.431362), 5)
        this.map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}))
        this.map.enableScrollWheelZoom()
        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(this.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5),  //偏离值
                drawingModes: [BMAP_DRAWING_POLYGON]
            },
            polygonOptions: {strokeWeight: 2, strokeColor: "#ff0000"}
        })
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', function(e){
            that.polygon = e.overlay;
            that.currentStep = 1;
        })
        this.map.addEventListener("click",function(e){
            if(that.polygon !== null){
                that.currentStep = 0;
                that.polygon = null;
                that.map.clearOverlays();
            }
        })
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
