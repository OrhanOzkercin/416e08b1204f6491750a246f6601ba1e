<template>
  <select
    class="w-full cursor-pointer appearance-none rounded-md border-none bg-slate-500/20 px-5 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
    :name="name"
    :id="id"
  >
    <option value="" disabled selected hidden>{{ placeholder }}</option>
    <option class="bg-slate-900" v-for="option in options" :key="option.id" :value="option.id">
      {{ option.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface Prop {
  name?: string
  id?: string
  placeholder?: string
  options?: { id: string; name: string }[]
}
withDefaults(defineProps<Prop>(), {
  name: 'Select',
  id: 'select',
  placeholder: 'Select an option',
  options: () => []
})
</script>

<script></script>
