<template>
  <section>
    <TheSelectbox
      :value="hotelId"
      placeholder="Select a hotel"
      :options="getHotels"
      @change="selectedHotelId = $event"
    ></TheSelectbox>
  </section>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import TheSelectbox from './TheSelectbox.vue'
import { computed, ref, watch } from 'vue'

const store = useStore()
defineProps<{ hotelId?: string }>()

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
</script>

<style scoped></style>
