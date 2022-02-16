import useFetch from '../composables/useFetch'
import { createStore } from 'vuex'
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
      state.selectedHotel = Object.assign(state.selectedHotel, hotel)
    }
  },
  actions: {
    setNextStatus(state, payload: 0 | 1 | 2) {
      state.commit('SET_STATUS', payload)
    },

    async getHotels(): Promise<Ref<{ id: string; hotel_name: string } | undefined>> {
      const { fetchData, data, error } = useFetch<{ id: string; hotel_name: string }>('/hotels')
      await fetchData()
      if (error.value) throw new Error(error.value.message)
      return data
    },

    async setSelectedHotel(state, id: string): Promise<void> {
      const { fetchData, data, error } = useFetch<Hotel[]>('/hotel-details')
      await fetchData()
      if (error.value) throw new Error(error)
      const targetHotel = data?.value?.find((hotel: Hotel) => hotel.id === id) as Hotel

      state.commit('SET_SELECTED_HOTEL', targetHotel)
    }
  }
})

export default store
