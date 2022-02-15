<template>
  <TheNavBar />
  <main
    class="relative mx-auto mt-20 flex w-full flex-col items-center justify-center gap-10 lg:w-3/4"
  >
    <TheProgress />
    <div class="relative w-full rounded-md bg-slate-700/30">
      <Suspense>
        <template #default>
          <SelectHotel />
        </template>
        <template #fallback>
          <div class="mx-5 my-8">
            <TheSelectbox placeholder="Loading" disabled />
          </div>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import TheNavBar from './components/TheNavBar.vue'
import TheProgress from './components/TheProgress.vue'
import type State from './store/state.model'
import SelectHotel from './components/SelectHotel.vue'
import TheSelectbox from './components/TheSelectbox.vue'

const store = useStore<State>()
</script>

<style>
@import './assets/base.scss';
</style>
