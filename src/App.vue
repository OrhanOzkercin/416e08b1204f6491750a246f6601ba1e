<template>
  <TheNavBar />
  <main class="relative mx-auto mt-20 flex w-full flex-col items-center justify-center gap-10 lg:w-3/4">
    <TheProgress />
    <HotelSelection v-if="store.state.currentStepIndex === 0" @saveAndContinue="saveAndContinue" />
  </main>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import TheNavBar from './components/TheNavBar.vue'
import TheProgress from './components/TheProgress.vue'
import type State from './store/state.model'
import HotelSelection from './views/HotelSelection.vue'

const store = useStore<State>()

const saveAndContinue = () => store.dispatch('setNextStatus')
</script>

<style>
@import './assets/base.scss';
</style>
