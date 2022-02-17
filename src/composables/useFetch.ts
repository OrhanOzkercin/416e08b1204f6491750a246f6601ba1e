import { ref, type Ref, type UnwrapRef } from 'vue'

const baseUrl = 'https://5f6d939160cf97001641b049.mockapi.io/tkn'

interface ReturnType<T> {
  fetchData: () => Promise<void>
  data: Ref<UnwrapRef<T>>
  error: any
}

export function useFetch<T>(path: string, query?: string, options?: any, cb?: any): ReturnType<T> {
  const error = ref<Error>()
  const data = ref<T>({} as T)

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseUrl}${path}/${'?' + (query ?? '')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json, text/plain, */*'
        },
        ...options
      })

      if (!res.ok) throw new Error(res.statusText)

      let result = await res.json()
      if (cb) {
        result = cb(result)
      }
      data.value = result
    } catch (err: any) {
      error.value = new Error(err.message)
    }
  }
  return { fetchData, data, error }
}
