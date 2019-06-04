import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const viewTemplate = require('@/components/pages/Template')
const baiduSider = require('@/components/parts/Sidebar')

const baiduPagesPath = 'components/pages/baidu'
const baiduRoute = {
  path: '/baidu',
  name: 'baidu',
  component: viewTemplate.default,
  children: [{
    basePath: '/baidu',
    path: 'searchpoi',
    description: 'POI抓取',
    components: {
      content: require(`@/${baiduPagesPath}/searchpoi/Content`).default
    }
  },{
    basePath: '/baidu',
    path: 'geocoding',
    description: '正向地理编码',
    components: {
      content: require(`@/${baiduPagesPath}/geocoding/Content`).default
    }
  }]
}

const amapPagesPath = 'components/pages/amap'
const amapRoute = {
  path: '/amap',
  name: 'amap',
  component: viewTemplate.default,
  children: [{
    basePath: '/amap',
    path: 'searchpoi',
    description: '高德POI抓取',
    components: {
      content: require(`@/${amapPagesPath}/searchpoi/Content`).default
    }
  }]
}

export default new Router({
  routes: [
    baiduRoute,
    amapRoute,
    {
      path: '/test',
      name: 'test',
      component: require(`@/components/test`).default
    },
    {
      path: '*',
      redirect: '/baidu/searchpoi'
    }
  ]
})