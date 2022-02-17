<template>
  <div class="cursor-pointer rounded-md border-2 border-slate-700 px-2 py-2" :class="{ 'border-primary': selected }">
    <p class="mb-1 font-semibold text-slate-400">{{ title }}</p>
    <img class="w-96 rounded-md" :src="image" :alt="title" />
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  image: string
  selected: boolean
}

defineProps<Props>()
</script>
