import { computed, onMounted, ref, watch } from 'vue'

function useLocalStorageState(
  key: string,
  defaultValue: any = '',
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const state = ref()

  onMounted(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      state.value = deserialize(valueInLocalStorage)
    }
    state.value = typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = ref(key)
  watch([state, prevKeyRef], (_, [newKey, oldKey]): void => {
    if (newKey !== oldKey) {
      window.localStorage.removeItem(oldKey)
    }
    window.localStorage.setItem(prevKeyRef.value, serialize(state.value))
  })

  return { key: prevKeyRef, state }
}

export { useLocalStorageState }
