<template>
  <Teleport to="body">
    <div
      id="toast-default"
      class="absolute left-0 bottom-6 flex w-full max-w-xs items-center rounded-lg bg-gray-800 p-4 text-slate-300 transition"
      role="alert"
    >
      <div class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="48" height="48" viewBox="0 0 768 768">
          <title />
          <g id="icomoon-ignore"></g>
          <path
            fill="#b91c1c"
            d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM352.5 223.5h63v192h-63v-192zM352.5 480h63v64.5h-63v-64.5z"
          />
        </svg>
      </div>
      <div class="ml-3 text-sm font-normal">{{ message }}</div>
      <button
        type="button"
        class="-mx-2.5 -my-2.5 ml-auto inline-flex h-8 w-8 rounded-lg text-slate-300 focus:ring-2"
        data-collapse-toggle="toast-default"
        aria-label="Close"
        @click="close"
      >
        <span class="sr-only">Close</span>
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button></div
  ></Teleport>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps<{ message: any; timer?: number }>()
const emit = defineEmits(['close'])

onMounted(() => {
  setTimeout(() => {
    close()
  }, props.timer || 20000)
})

const close = () => {
  emit('close')
}
</script>
