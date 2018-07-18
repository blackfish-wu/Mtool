import APIService from '../../../../assets/map/baidu/MapAPI'
import async from 'async'

class Geocoder {
  
  constructor () {
    this.service = new APIService()
  }

  geocode4tableData(data, addressIndex, cityIndex=null, keys=[ "MviPFAcx5I6f1FkRQlq6iTxc" ]){
    const that = this
    return new Promise((resolve) => {
      async.mapLimit(data, 10, (line, callback) => {
        that.service.geocoding(keys[0], line[addressIndex], line[cityIndex])
        .then((response) => {
          let [lng,lat] = [null,null]
          if(response.hasOwnProperty("data")&&response.data.hasOwnProperty("result")){
            lng = response.data.result.location.lng
            lat = response.data.result.location.lat
          }
          line.push(lng)
          line.push(lat)
          callback(null, line)
        })
        .catch((err) => {
          console.log(err)
        })
      }, (err, result) => {
        if (err) throw err
        resolve(result)
      })
    })
  }
}

export default Geocoder