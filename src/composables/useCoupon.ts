import type Coupon from '@/models/Coupon.model'
import { dateDifference } from '@/utils'
import { ref } from 'vue'
import { useFetch } from './useFetch'
export async function useCoupon(couponCode: string) {
  const discoundedAmount = ref<number>()

  const { data, error, fetchData } = useFetch<Coupon[]>('/coupons', `code=${couponCode}`)
  await fetchData()
  if (error.value) throw new Error(error.value.message)

  if (data.value) {
    const discount = data.value.find((coupon) => {
      if (coupon.code !== couponCode.toUpperCase()) {
        return false
      }
      return dateDifference(new Date(), new Date(coupon.expiration_at)) > 0
    })

    if (!discount) {
      error.value = new Error('Invalid Coupon')
    } else {
      discoundedAmount.value = discount.discount_ammount
    }
  }

  return { discoundedAmount, error }
}
