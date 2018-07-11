import APIService from '../../../../assets/map/baidu/MapAPI'
import async from 'async'
import * as turf from '@turf/turf'

class PlaceSearcher {
  constructor () {
    this.service = new APIService()
  }

  search (polygon, keyword, keys = [ "MviPFAcx5I6f1FkRQlq6iTxc" ]) {
        return new Promise((resolve) => {
            let bounds = this._segmentBound(polygon, 10)
            let that = this
            async.mapLimit(bounds, 10, function (bound, callback) {
                that._placeSerarch(bound, keyword, keys, callback)
            }, function (err, result) {
                let poiDict = {}
                let successfulBounds = []
                let zeroBounds = []
                result.forEach((region) => { 
                    that._deDuplicates(poiDict, region.poiList)
                    successfulBounds = successfulBounds.concat(region.successfulBounds)
                    zeroBounds = zeroBounds.concat(region.zeroBounds)
                })
                resolve({
                    poiList: Object.values(poiDict), 
                    successfulBounds: successfulBounds, 
                    zeroBounds: zeroBounds,
                    keyword: keyword
                })
            })
        })
    }

    _deDuplicates(poiDict, poiList){
        poiList.forEach((poi) => {
            if(poi.hasOwnProperty("uid"))
                poiDict[poi["uid"]] = poi
        })
    }

    async _placeSerarch (bound, keyword, keys, callback) {
        let queue = [bound] // 使用矩形范围初始栈
        let zeroBounds = [] //用以存放返回值为0的矩形范围
        let successfulBounds = []
        let that = this
        let poiList = []
        while(queue.length !== 0){
            let tempBound = queue.pop() //取出一个查询范围
            let boundStr = tempBound.join(",")
            // 执行查询
            let response = await this.service.place_search(keys[0], keyword, boundStr)
            if(response.hasOwnProperty("data")&&response.data.hasOwnProperty("results")){
                let results = response.data.results
                console.log(results.length)
                if(results.length >= 10){
                    if((bound[2] - bound[0])<0.001||(bound[3]-bound[1])<0.001)
                        continue;
                    let splitedBounds = that._splitBound(tempBound);
                    queue = queue.concat(splitedBounds);
                    console.log(`POI数量：${results.length}`)
                } // 如果范围的poi等于20,就切割该范围,并将切割后的子范围置入栈中
                else if(results.length === 0){
                    zeroBounds.push(tempBound)
                }// 得到数据为空的区域
                else{
                    poiList = poiList.concat(results)
                    console.log(`POI数量：${results.length}`)
                    successfulBounds.push(tempBound)
                }// 数据大于0小于20的进行保存
            }
        }
        callback(null, {poiList:poiList, successfulBounds:successfulBounds, zeroBounds:zeroBounds})
    }

    _segmentBound(polygon, parts){
        let boundsList = []
        let bounds = polygon.getBounds()
        let southwest = bounds.getSouthWest()
        let northeast = bounds.getNorthEast()
        let stepLng = (northeast.lng - southwest.lng) / parseFloat(parts)
        let stepLat = (northeast.lat - southwest.lat) / parseFloat(parts)
        // 将百度地图多边形转为turf包中的多边形
        let path = [];
        polygon.getPath().forEach((point)=>{
            path.push([point.lng, point.lat])
        })
        if(((x, y) => x.lng===y.lng&&x.lat===y.lat)(path[0], path[path.length-1])){
            path.push(path[0]);
        }
        let poly = turf.polygon([path])
        // 切分外接矩阵，剔除不相关的矩形
        for(let i=0;i<parts;i++){
            let lng = southwest.lng + i*stepLng
            for(let j=0;j<parts;j++){
                let lat = southwest.lat + j*stepLat
                let bbox = [lng, lat, lng+stepLng, lat+stepLat]
                let bboxPoly = turf.bboxPolygon(bbox)
                if(turf.booleanDisjoint(poly, bboxPoly))
                    continue;
                boundsList.push([lat, lng, lat+stepLat, lng+stepLng,])
            }
        }
        return boundsList
    }

    _splitBound(bound){
        let [lat1,lng1,lat2,lng2] = bound;
        let splitLat = (lat1+lat2)/2;
        let splitLng = (lng1+lng2)/2;
        let queue = [];

        queue.push([lat1, lng1, splitLat, splitLng]);
        queue.push([lat1, splitLng, splitLat, lng2]);
        queue.push([splitLat, lng1, lat2, splitLng]);
        queue.push([splitLat, splitLng, lat2, lng2]);

        return queue;
    }
}

export default PlaceSearcher