import { onMounted, ref, watch } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: any = '',
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const localStorageValue = ref<T>()
  onMounted(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      localStorageValue.value = deserialize(valueInLocalStorage)
    } else {
      localStorageValue.value = defaultValue
      window.localStorage.setItem(key, serialize(localStorageValue.value))
    }
  })

  watch(localStorageValue, (): void => {
    window.localStorage.setItem(key, serialize(localStorageValue.value))
  })

  const updateLocalStorageValue = () => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      localStorageValue.value = deserialize(valueInLocalStorage)
    }
  }
  return { updateLocalStorageValue, localStorageValue }
}
