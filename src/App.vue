<template>
  <TheNavBar />
  <main class="relative mx-auto mt-16 flex w-full flex-col items-center justify-center gap-10 lg:w-3/4">
    <TheProgress v-if="store.state.currentStepIndex !== 3" />
    <KeepAlive>
      <HotelSelectionPage v-if="store.state.currentStepIndex === 0" @saveAndContinue="saveAndContinue" />
    </KeepAlive>
    <RoomSelectionPage v-if="store.state.currentStepIndex === 1" @saveAndContinue="saveAndContinue" />
    <PaymentPage v-if="store.state.currentStepIndex === 2" @saveAndContinue="saveAndContinue" />
    <FinishReservationPage v-if="store.state.currentStepIndex === 3" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import TheNavBar from './components/TheNavBar.vue'
import TheProgress from './components/TheProgress.vue'
import { useLocalStorage } from './composables/useLocalStorage'
import type State from './store/state.model'
import HotelSelectionPage from './views/HotelSelectionPage.vue'
import RoomSelectionPage from './views/RoomSelectionPage.vue'
import PaymentPage from './views/PaymentPage.vue'
import FinishReservationPage from './views/FinishReservationPage.vue'

const store = ref(useStore<State>())
const { localStorageValue: step } = useLocalStorage('step', 0)

onMounted(() => {
  store.value.dispatch('setStatus', step.value)
})

const saveAndContinue = () => {
  store.value.dispatch(
    'setStatus',
    store.value.state.currentStepIndex === 3 ? 0 : store.value.state.currentStepIndex + 1
  )
  step.value = store.value.state.currentStepIndex
}
</script>

<style>
@import './assets/base.scss';
</style>
