<template>
  <section>
    <TheSelectbox :value="hotelId" placeholder="Select a hotel" :options="getHotels" @change="onChange"></TheSelectbox>
  </section>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import TheSelectbox from './TheSelectbox.vue'
import { computed, ref, watch } from 'vue'
import type LocalStorage from '@/models/LocalStorage.model'
import { useLocalStorage } from '@/composables/useLocalStorage'

defineProps<{ hotelId?: string }>()
const store = useStore()
const { localStorageValue: userSelection } = useLocalStorage<LocalStorage>('userSelection')

let selectedHotelId = ref<string>('')
let hotelIdsNames = ref<{ id: string; hotel_name: string }[]>([])

try {
  hotelIdsNames = await store.dispatch('getHotels')
} catch (err: any) {
  throw new Error(err.message)
}

const getHotels = computed(() => hotelIdsNames.value.map((hotel) => ({ id: hotel.id, name: hotel.hotel_name })))

watch(selectedHotelId, async (id: string) => {
  try {
    await store.dispatch('setSelectedHotel', id)
  } catch (err: any) {
    throw new Error('Hotel details can not fetched')
  }
})

const onChange = (id: any) => {
  const selectedHotelName = hotelIdsNames.value.find((hotel) => hotel.id === id)
  if (selectedHotelName) {
    if (userSelection.value) {
      userSelection.value = { ...userSelection.value, hotel_name: selectedHotelName.hotel_name }
    }
    userSelection.value = { hotel_name: selectedHotelName.hotel_name }
  }
  selectedHotelId.value = id
}
</script>

<style scoped></style>
