<template>
  <div class="flex w-full rounded-md bg-slate-700/30 px-8 py-7">
    <button
      v-if="isBackActive"
      @click="emit('back')"
      type="button"
      class="btn lg:text-md my-auto mx-auto mr-5 block w-full px-10 py-4 text-xs lg:w-1/2"
    >
      <slot name="back"> Back</slot>
    </button>
    <button
      :disabled="disabled"
      @click="emit('save')"
      type="button"
      class="btn lg:text-md my-auto mx-auto block w-full px-10 py-4 text-xs lg:w-1/2"
    >
      <slot> Save and Continue </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ disabled: boolean; isBackActive?: boolean }>(), {
  disabled: false,
  isBackActive: false
})
const emit = defineEmits(['save', 'back'])
</script>
