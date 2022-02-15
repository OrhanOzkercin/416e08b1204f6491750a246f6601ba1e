<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    :width="size"
    :height="size"
    viewBox="0 0 640 640"
  >
    <title />
    <g id="icomoon-ignore"></g>
    <path
      :fill="fillColor"
      d="M64 384h576v192h-64v-64h-512v64h-64v-512h64v320zM320 192h256c35.346 0 64 28.654 64 64v0 96h-320v-160zM192 352c-53.019 0-96-42.981-96-96s42.981-96 96-96v0c53.019 0 96 42.981 96 96s-42.981 96-96 96v0z"
    />
  </svg>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ size?: number; fillColor?: string }>(), {
  size: 32,
  fillColor: '#eab308'
})
</script>
