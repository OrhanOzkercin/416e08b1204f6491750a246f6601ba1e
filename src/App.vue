<template>
  <TheNavBar />
  <main class="relative mx-auto mt-20 flex w-full flex-col items-center justify-center gap-10 lg:w-3/4">
    <TheProgress />
    <div class="relative w-full rounded-md bg-slate-700/30">
      <TheToaster v-if="error" :message="error" @close="error = null" />
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
import TheNavBar from './components/TheNavBar.vue'
import TheProgress from './components/TheProgress.vue'
import SelectHotel from './components/SelectHotel.vue'
import TheSelectbox from './components/TheSelectbox.vue'
import { onErrorCaptured, ref } from 'vue'
import TheToaster from './components/TheToastr.vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
})
</script>

<style>
@import './assets/base.scss';
</style>
