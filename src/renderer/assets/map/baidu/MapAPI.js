import axios from 'axios'

class APIService{
    
    constructor(){
        this.baseUrl = "http://api.map.baidu.com"
    }

    place_search(key, query, bounds, pageSize=20, pageNumber=0, coord_type=2, scope=2, output="json"){
        return new Promise((resolve, reject) => {
            axios.get(this.baseUrl+"/place/v2/search", {
                params:{
                    ak: key,
                    query: query,
                    bounds: bounds,
                    pageSize: pageSize,
                    pageNumber: pageNumber,
                    coord_type: coord_type,
                    scope: scope,
                    output: output
                }
            })
            .then(resolve).catch(reject)
        });
        
    }

    geocoding(key, address, city="", ret_coordtype="gcj02ll", output="json"){
        return new Promise((resolve, reject) => {
            axios.get(this.baseUrl+"/geocoder/v2/", {
                params:{
                    ak: key,
                    address:address,
                    city:city,
                    ret_coordtype:ret_coordtype,
                    output:output
                }
            })
            .then(resolve).catch(reject)
        });
        
    }
}

export default APIService
