<template>
  <div class="w-full rounded-md bg-slate-700/30 px-8 py-7">
    <button :disabled="disabled" @click="emit('click')" type="button" class="btn my-auto mx-auto block w-full lg:w-1/2">
      <slot> Save and Continue </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>()
const emit = defineEmits(['click'])
</script>
