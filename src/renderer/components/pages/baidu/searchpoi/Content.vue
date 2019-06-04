<template lang="pug">
Layout.ivu-layout-has-sider(:style="{ background: '#fff'}")
  stepsBar(v-bind:steps="steps", v-bind:currentStep="currentStep")
  Layout(:style="{ background: '#fff'}")
    contentHeader
    Layout(:style="{ background: '#fff'}")
      Row.code-row-bg(type='flex', justify='start', :style="{padding: '12px'}" style="-webkit-app-region: no-drag")
        Input#commitSearch(
          v-model="keywords" icon="ios-upload-outline"  
          v-on:on-keydown.13="commitSearch" 
          placeholder="输入查询关键字,以小写逗号隔开" 
          size="large"  clearable style="width: 250px"  
          :disabled="polygon===null" 
          v-on:on-click="inputKeyworsFile"
        )
        Button(icon="ios-search" v-on:on-click="commitSearch" style="")
      Content
        div(style="position:relative")
          Input(
            v-model="cityName"
            v-on:on-keydown.13="citySearch" 
            placeholder="输入城市查询边界，如输入：深圳市" 
            size="large" 
            style="width: 250px;position: absolute;top: 20px;right: 50px;z-index: 10;" 
            clearable
          )
          #container(:style="{height:'calc(100vh - 110px)'}", style="-webkit-app-region: no-drag")
</template>


<script>
import stepsBar from "../../../parts/Steps";
import contentHeader from "../../../parts/Header";
import PlaceSearcher from "./PlaceSearch";
import { remote } from "electron";
import { Parser } from "json2csv";
import fs from "fs";
import { ipcRenderer } from "electron";
export default {
  components: { contentHeader, stepsBar },
  data() {
    return {
      map: null,
      cityName: null,
      keywords: null,
      polygon: null,
      placeSearcher: new PlaceSearcher(),
      currentStep: 0,
      steps: [
        {
          id: 1,
          title: "绘制感兴趣区域",
          content:
            "在右侧输入框搜索城市边界，或使用地图右下角多边形绘制工具进行绘制（点击绘制的多边形可删除）"
        },
        {
          id: 2,
          title: "输入关键字",
          content: "在左侧输入框中输入爬取POI的关键字，使用空格间隔多个关键字。支持以文件形式输入，要求UTF-8格式，以换行符分割每个关键字。"
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
    citySearch: function() {
      let bdary = new BMap.Boundary();
      let name = this.cityName;
      bdary.get(name, rs => {
        //获取行政区域
        this.map.clearOverlays(); //清除地图覆盖物
        let count = rs.boundaries.length; //行政区域的点有多少个
        for (let i = 0; i < count; i++) {
          let ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: '#ff0000'
          }); //建立多边形覆盖物
          this.map.addOverlay(ply); //添加覆盖物
          this.map.setViewport(ply.getPath()); //调整视野
          this.polygon = ply;
          this.currentStep = 1;
          break;
        }
      });
    },

    inputKeyworsFile: function() {
      remote.dialog.showOpenDialog(
        {
          title: '打开关键词文件',
          filters: [{name: 'Txt Files', extensions: ['txt', 'csv']}],
          properties: ['openFile']
        },
        filePath => {
          console.log(filePath)
          fs.readFile(filePath[0], (err, data) => {
            if (err) throw err;
            this.keywords = data.toString().split('\n').join(' ')
          });
        }
      );
    },

    commitSearch: async function() {
      if (this.polygon === null || this.keywords === null) {
        this.$Notice.error({ title: '请绘制感觉兴趣区以及搜索关键字' });
        return false;
      }
      this.$Notice.success({ title: "开始爬取" });
      this.currentStep = 2;

      let d = new Date().Format('yyyy-MM-dd hh-mm-ss');
      // 获取临时文件夹的位置
      let tempFilePath = ipcRenderer.sendSync('getPath', 'temp') + `\\${d}.csv`;
      let allUidList = []; //存放爬取得到的poi的uid，用于检验重复poi
      let keywords = Array.from(new Set(this.keywords.split(' '))); // 分割关键字并去重
      for (let i in keywords) {
        let result = await this.placeSearcher.search(this.polygon, keywords[i]);
        this.save2temp(tempFilePath, result, allUidList);
        this.$Notice.success({ title: "已完成：" + keywords[i] });
        console.log(allUidList.length);
        console.log(keywords[i])
      }
      this.$Loading.finish();
      this.openSaveDailog(tempFilePath);
    },

    save2temp: function(path, result, allUidList) {
      const fields = [
        "uid",
        "name",
        "address",
        "city",
        "location.lat",
        "location.lng",
        "detail_info.tag",
        "detail_info.type"
      ];
      // 去除重复poi
      let poi2Save = [];
      Object.values(result["poiDict"]).forEach(poi => {
        if (allUidList.indexOf(poi["uid"]) === -1) {
          poi2Save.push(poi);
          allUidList.push(poi["uid"]);
        }
      }); //-- 去除重复poi

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(poi2Save);
      fs.writeFile(path, csv, { flag: "a" }, err => {
        if (err) throw err;
      });
    },

    openSaveDailog: function(tempFilePath) {
      this.$Modal.confirm({
        title: "成功",
        content: "POI爬取成功",
        okText: "保存到文件",
        cancelText: "取消",
        onOk: () => {
          remote.dialog.showSaveDialog(
            {
              title: "另存为csv文件",
              filters: [{ name: "CSV", extensions: ["csv"] }]
            },
            filename => {
              fs.rename(tempFilePath, filename, function(err) {
                if (err) throw err;
              });
            }
          );
        }
      });
    }
  },
  mounted() {
    this.map = new BMap.Map("container");
    this.map.centerAndZoom(new BMap.Point(106.770409, 37.431362), 5);
    this.map.addControl(
      new BMap.NavigationControl({ type: BMAP_NAVIGATION_CONTROL_SMALL })
    );
    this.map.enableScrollWheelZoom();
    //实例化鼠标绘制工具
    let drawingManager = new BMapLib.DrawingManager(this.map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: true, //是否显示工具栏
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
        drawingModes: [BMAP_DRAWING_POLYGON]
      },
      polygonOptions: { strokeWeight: 2, strokeColor: "#ff0000" }
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener("overlaycomplete", e => {
      this.polygon = e.overlay;
      this.currentStep = 1;
    });
    this.map.addEventListener("click", e => {
      if (this.polygon !== null) {
        this.currentStep = 0;
        this.polygon = null;
        this.map.clearOverlays();
      }
    });
  },
  computed: {}
};
</script>

<style>
.no-border {
  border: 0px;
}
#commitSearch {
  margin-left: 0px;
}
.BMapLib_Drawing{
  top: 20px !important;
}
.BMapLib_box{
  width: 42px !important;
}
.BMapLib_Drawing_panel{
  height: 35px;
  border: 1px solid #dddee1 !important;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.3) !important;
}
.BMapLib_hander{
  display: none !important;
}
.BMapLib_Drawing .BMapLib_polygon_hover{
  background-position: -271px -5px !important;
}
.BMapLib_polygon{
  background-position: -271px -5px !important;
}
</style>
