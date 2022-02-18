<template>
  <div class="w-full rounded-md bg-slate-700/30 px-8 py-5">
    <h2 class="mb-5 text-xl font-semibold text-slate-400">
      {{ userSelection?.hotel_name }} ({{ store.state.selectedHotel.city }})
    </h2>

    <div class="col-span-1">
      <p class="text-slate-300">
        <span class="font-semibold">Adult: </span> &nbsp;{{ userSelection?.adult }} &nbsp;-&nbsp;
        <span class="font-semibold">Child:</span>&nbsp;
        {{ userSelection?.child || 0 }}
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="font-semibold">Checkin:</span> &nbsp;{{ checkin }} &nbsp;-&nbsp;
        <span class="font-semibold">Checkout:</span>
        {{ checkout }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@/composables/useLocalStorage'
import type LocalStorage from '@/models/LocalStorage.model'
import type State from '@/store/state.model'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const { localStorageValue: userSelection } = useLocalStorage<LocalStorage>('userSelection')
const store = useStore<State>()

const checkin = computed(() => {
  const date = new Date(userSelection.value?.start_date || '').toLocaleDateString('en-US')
  return date
})

const checkout = computed(() => {
  const date = new Date(userSelection.value?.end_date || '').toLocaleDateString('en-US')
  return date
})
</script>

<style scoped></style>
