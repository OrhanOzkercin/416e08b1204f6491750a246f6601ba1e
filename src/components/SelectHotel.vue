<template>
  <section class="mx-5 my-8">
    <TheSelectbox
      placeholder="Select a hotel"
      :options="getHotels"
      value=""
      @change="selectHotel($event)"
    ></TheSelectbox>
  </section>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import TheSelectbox from './TheSelectbox.vue'
import { computed, ref, watch } from 'vue'

const store = useStore()

let selectedHotelId = ref<string>('')
let hotelIdsNames = ref<{ id: string; hotel_name: string }[]>([])

try {
  hotelIdsNames = await store.dispatch('getHotels')
} catch (error: any) {
  throw new Error(error.message)
}

const getHotels = computed(() => hotelIdsNames.value.map((hotel) => ({ id: hotel.id, name: hotel.hotel_name })))

watch(selectedHotelId, (id: string) => {
  store.dispatch('setSelectedHotel', id)
})

const selectHotel = (e: any) => {
  selectedHotelId.value = e.target.value
}
</script>

<style scoped></style>
