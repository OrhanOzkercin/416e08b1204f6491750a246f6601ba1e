<template>
  <section class="flex w-full justify-around gap-8 rounded-md bg-slate-700/30 px-1 py-7 md:gap-20 md:py-10 md:px-10">
    <div class="text-center" v-for="(option, index) in options" :key="option.label">
      <TheProgressCard :class="{ 'border-primary': activeCard === index }">
        <component :is="option.iconComponent" :size="32" :fillColor="activeCard === index ? '#eab308' : '#fff'" />
      </TheProgressCard>
      <span
        class="mt-3 inline-block max-w-[11rem] break-words text-sm font-bold"
        :class="{ ' text-primary': activeCard === index }"
      >
        {{ option.label }}
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import TheProgressCard from './TheProgressCard.vue'
import SleepIcon from '../assets/icons/SleepIcon.vue'
import CalendarIcon from '../assets/icons/CalendarIcon.vue'
import { useStore } from 'vuex'
import type State from '@/store/state.model'
import PaymentIcon from '@/assets/icons/PaymentIcon.vue'
import { computed } from 'vue'

const options = [
  { label: 'Hotel and time', iconComponent: CalendarIcon },
  { label: 'Room and View', iconComponent: SleepIcon },
  { label: 'Preview and Payment', iconComponent: PaymentIcon }
]

const store = useStore<State>()

const activeCard = computed(() => store.state.currentStepIndex)
</script>
