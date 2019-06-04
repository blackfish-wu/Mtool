import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)


// 高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '47cdbd7d0482c51c6ea3708fdb56efc5',
  // 插件集合
  plugin: ['AMap.DistrictSearch', 'AMap.MouseTool']
}); 

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
