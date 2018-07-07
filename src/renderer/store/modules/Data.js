const state = {
}

const mutations = {
    UPLOAD_DATA (state, payload) {
        if(!state.hasOwnProperty(payload.menuname)) 
            state[payload.menuname] = {};
        state[payload.menuname][payload.step] = payload.data;
    },
    CLEAR_DATA(state, payload){
        if(state.hasOwnProperty(payload.menuname)&&state[payload.menuname].hasOwnProperty(payload.step))
            state[payload.menuname][payload.step] = null;
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