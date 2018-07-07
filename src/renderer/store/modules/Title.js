const state = {
    menuname: '0',
    stepDict: {
        '0': '0',
        '1': '0'
    }
}
  
const mutations = {
    CHANGE_PAGE (state, payload) {
      state.menuname = payload.menuname;
      state.step = payload.step;
    }
}
  
const actions = {
    someAsyncTask ({ commit }) {
      // do something async
      commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions
}