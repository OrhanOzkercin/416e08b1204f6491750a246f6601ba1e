<template>
  <div class="rounded-md bg-slate-700/20 p-10">
    <div class="mb-10 flex flex-col items-center justify-center">
      <TickIcon />
      <p class="text-md mt-5 md:text-xl">Congratulations your reservation has been done successfully. 🥳</p>
    </div>
    <div class="mb-10 flex flex-col gap-3 sm:flex-row">
      <button
        @click="onNewReservation"
        class="btn border-green-300 px-4 py-2 text-slate-200 hover:border-slate-200 hover:text-green-300"
      >
        New Reservation
      </button>
      <button
        @click="onUpdateReservation"
        class="btn border-green-300 px-4 py-2 text-slate-200 hover:border-slate-200 hover:text-green-300"
      >
        Update Reservation
      </button>
      <button
        @click="onCancelReservation"
        class="btn border-red-400 px-4 py-2 text-slate-200 hover:border-slate-200 hover:text-red-400"
      >
        Cancel Reseration
      </button>
    </div>
    <ReservationInformation :is-apply-coupon-active="false" />
  </div>
</template>

<script setup lang="ts">
import ReservationInformation from '../components/ReservationInformation.vue'
import TickIcon from '../assets/icons/TickIcon.vue'
import { useStore } from 'vuex'
import type State from '@/store/state.model'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { onMounted } from 'vue'
import { useReservationInformationState } from '@/composables/useReservationInformation'
import { useFetch } from '@/composables/useFetch'

const store = useStore<State>()
const { localStorageValue: localStorageReservationId } = useLocalStorage<string>('reservationId')
const { localStorageValue: step } = useLocalStorage('step')
const { reservationId, error } = useReservationInformationState()

onMounted(() => {
  localStorageReservationId.value = reservationId.value
})

withDefaults(defineProps<{ isApplyCouponActive: boolean }>(), {
  isApplyCouponActive: false
})

const onNewReservation = () => {
  store.dispatch('clearStatus')
  window.localStorage.removeItem('userSelection')
  window.localStorage.removeItem('step')
  window.location.reload()
}

const onUpdateReservation = () => {
  step.value = 0
  localStorageReservationId.value = reservationId.value
  store.dispatch('setStatus', 0)
}

const onCancelReservation = async () => {
  try {
    await cancelReservation()
    store.dispatch('clearStatus')
    window.localStorage.removeItem('userSelection')
    window.localStorage.removeItem('reservationId')
    window.localStorage.removeItem('step')
    window.location.reload()
  } catch (err) {
    error.value = new Error('Reservation can not canceled!')
  }
}

const cancelReservation = async () => {
  const { error, fetchData } = useFetch(`/hotel-bookings/${reservationId.value}`, undefined, { method: 'DELETE' })
  await fetchData()
  if (error.value) throw new Error(error.value.message)
}
</script>
