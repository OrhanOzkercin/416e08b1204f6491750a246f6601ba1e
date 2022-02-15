import { ref, type Ref } from 'vue'

const baseUrl = 'https://5f6d939160cf97001641b049.mockapi.io/tkn'

interface ReturnType<T> {
  fetchData: () => Promise<void>
  data: Ref<T | undefined>
  error: any
}

const useFetch = <T>(path: string, options?: any, cb?: any): ReturnType<T> => {
  const error = ref()
  const data = ref<T>()

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json, text/plain, */*'
        },
        ...options
      })
      const result = await res.json()
      let smt
      if (cb) {
        console.log(cb)

        console.log('result:', JSON.stringify(result))
        smt = cb(result)
      }
      console.log('result:', smt)
      data.value = smt
    } catch (error: any) {
      error.value = error
    }
  }
  return { fetchData, data, error }
}

export default useFetch
