import { onMounted, ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, { serialize = JSON.stringify, deserialize = JSON.parse } = {}) {
  const localStorageValue = ref<T>()

  onMounted(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      localStorageValue.value = deserialize(valueInLocalStorage)
    }
  })

  const prevKeyRef = ref(key)
  watch(prevKeyRef, (newKey, oldKey): void => {
    if (newKey !== oldKey) {
      window.localStorage.removeItem(oldKey)
    }
  })

  watch(localStorageValue, (): void => {
    window.localStorage.setItem(prevKeyRef.value, serialize(localStorageValue.value))
  })
  return { localStorageKey: prevKeyRef, localStorageValue }
}
