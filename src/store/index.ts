import useFetch from '../composables/useFetch'
import _default, { createStore } from 'vuex'
import type State from './state.model'
import type Hotel from '@/models/Hotel.model'
import type { Ref } from 'vue'

const store = createStore<State>({
  state() {
    return {
      currentStepIndex: 0,
      selectedHotel: {} as Hotel
    }
  },
  mutations: {
    GET_CURRENT_STATUS(state) {
      return state.currentStepIndex
    },
    SET_STATUS(state, statusIndex: 0 | 1 | 2) {
      state.currentStepIndex = statusIndex
    },
    SET_SELECTED_HOTEL(state, hotel: Hotel) {
      console.log('hotel:', hotel)
      state.selectedHotel = hotel
    }
  },
  actions: {
    setNextStatus(state, payload: 0 | 1 | 2) {
      state.commit('SET_STATUS', payload)
    },

    async getHotels(): Promise<Ref<Hotel | undefined>> {
      const { fetchData, data, error } = useFetch<Hotel>('/hotels', _default, (datas: any) => {
        return datas.map((val: any) => {
          val['name'] = val['hotel_name']
          delete val['hotel_name']
          return val
        })
      })
      await fetchData()
      if (error.value) throw new Error(error)
      console.log('data:', data)
      return data
    },
    setSelectedHotel(state, hotel: Hotel): void {
      state.commit('SET_SELECTED_HOTEL', hotel)
    }
  }
})

export default store
