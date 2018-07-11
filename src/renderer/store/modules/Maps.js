const state = {
    map: 'baidu'
}
  
const mutations = {
    CHANGE_MAP (state) {
      state.map = "amap"
    }
}
  
const actions = {
}

export default {
    state,
    mutations,
    actions
}