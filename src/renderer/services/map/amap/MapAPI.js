import axios from 'axios'

class APIService {

  constructor() {
    this.baseUrl = "http://restapi.amap.com"
  }

  place_search(key, types, polygon, keywords = "", offset = "25", page = "1") {
    return new Promise((resolve, reject) => {
      axios.get(this.baseUrl + "/v3/place/polygon", {
        params: {
          key: key,
          types: types,
          polygon: polygon,
          offset: offset,
          keywords: keywords,
          page: page
        }
      })
      .then(resolve).catch(reject);
    });
  }
}

export default APIService
