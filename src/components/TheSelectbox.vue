<template>
  <select
    class="w-full cursor-pointer appearance-none rounded-md border-none bg-slate-500/20 px-5 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
    :name="name"
    :id="id"
    :value="props.value || undefined"
    @change="onChange($event)"
  >
    <option value="" disabled selected hidden>{{ placeholder }}</option>
    <option class="bg-slate-900" v-for="option in options" :key="option.id" :value="option.id">
      {{ option.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface Prop {
  value?: string | number
  name?: string
  id?: string
  placeholder?: string
  options?: { id: string | number; name: string | number }[]
}
const props = withDefaults(defineProps<Prop>(), {
  name: 'Select',
  id: 'select',
  placeholder: 'Select an option',
  options: () => []
})
const emit = defineEmits(['change'])

const onChange = (e: any) => {
  emit('change', e.target.value)
}
</script>
