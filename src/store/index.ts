import { createStore } from 'vuex'

interface State {
  currentStatus: 'initial' | 'step1' | 'step2'
}

const store = createStore<State>({
  state() {
    return {
      currentStatus: 'initial'
    }
  },
  mutations: {
    GET_CURRENT_STATUS(state) {
      return state.currentStatus
    },
    SET_NEXT_STATUS(state) {
      switch (state.currentStatus) {
        case 'initial':
          state.currentStatus = 'step1'
          break
        case 'step1':
          state.currentStatus = 'step2'
          break
        default:
          state.currentStatus = 'initial'
          break
      }
    }
  }
})

export default store
