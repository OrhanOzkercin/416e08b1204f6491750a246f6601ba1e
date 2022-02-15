<template>
  <section class="mx-5 my-8">
    <TheSelectbox placeholder="Select a hotel" :options="hotels" @change="selectHotel($event)"></TheSelectbox>
  </section>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import TheSelectbox from './TheSelectbox.vue'
import type Hotel from '../models/Hotel.model'
import type { Ref } from 'vue'

const store = useStore()
let hotels: Ref<Hotel[]>

try {
  hotels = await store.dispatch('getHotels')
} catch (error: any) {
  console.error(error.message)
}

const selectHotel = (e: any) => {
  const selectedHotel = hotels.value.find((hotel) => hotel.id === e.target.value)
  store.dispatch('setSelectedHotel', selectedHotel)
}
</script>

<style scoped></style>
