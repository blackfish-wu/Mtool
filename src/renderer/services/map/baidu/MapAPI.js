import axios from 'axios'

class APIService{
    constructor(){
        this.baseUrl = "http://api.map.baidu.com"
    }
    place_search(key, query, bounds, pageSize="20", pageNumber="0", coord_type="1", scope=2, output="json"){
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
            .then(resolve).catch(reject);
        });
        
    }
}

export default APIService
