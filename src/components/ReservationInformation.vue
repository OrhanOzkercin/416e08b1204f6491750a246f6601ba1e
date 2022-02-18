<template>
  <div class="col-span-2 xl:col-span-1">
    <h3 class="mb-8 font-semibold text-slate-50">
      {{ userSelection?.hotel_name }} ({{ store.state.selectedHotel.city }})
    </h3>
    <div class="grid grid-cols-2 gap-14 xl:gap-1">
      <div class="mb-8">
        <p class="mb-4"><span class="font-semibold text-slate-100">Checkin:</span> &nbsp;&nbsp;{{ checkin }}</p>
        <p class="mb-4">
          <span class="font-semibold text-slate-100">Adult:</span> &nbsp;&nbsp;{{ userSelection?.adult }} people
        </p>
        <p><span class="font-semibold text-slate-100">Room Type:</span> &nbsp;&nbsp;{{ roomType.title || '' }}</p>
      </div>
      <div>
        <p class="mb-4"><span class="font-semibold text-slate-100">Checkout:</span> {{ checkout }}</p>
        <p class="mb-4">
          <span class="font-semibold text-slate-100">Child:</span> {{ userSelection?.child || 0 }} people
        </p>
        <p><span class="font-semibold text-slate-100">Room Scenic:</span> {{ roomScenic.title || '' }}</p>
      </div>
    </div>
    <div v-if="isApplyCouponActive" class="my-8 flex justify-between">
      <input
        placeholder="Enter your cupoun code"
        class="mr-5 w-full cursor-pointer appearance-none rounded-md bg-slate-500/20 px-5 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
        type="text"
        v-model="couponCode"
        @keyup.enter="applyCoupon"
      />
      <button class="btn btn-primary px-5 py-2" @click="applyCoupon">Apply</button>
    </div>
    <p class="text-md mt-2">
      <span class="font-semibold text-slate-100">Room Price:</span> &nbsp;&nbsp;{{ moneyFormatter(roomPrice) }}
    </p>
    <p class="text-md mt-2">
      <span class="font-semibold text-slate-100">Price Rate:</span> &nbsp;&nbsp;%{{ roomScenic.price_rate }}
    </p>
    <p class="text-md mt-2">
      <span class="font-semibold text-slate-100">Total Day Price:</span> ({{ dateDifference + ' days' }}) &nbsp;
      {{ moneyFormatter(totalDayPrice) }}
    </p>
    <p class="text-md mt-2" v-if="discount">
      <span class="font-semibold text-slate-100">Discount: </span>({{ couponCode }}) &nbsp;
      {{ moneyFormatter(discount as number) }}
    </p>
    <hr class="my-3 border-slate-500" />
    <div>
      <h4 class="mb-3 text-center text-2xl font-bold text-slate-100 underline">Total Price</h4>
      <h4 class="text-center text-3xl font-bold text-slate-100">{{ moneyFormatter(totalPrice) }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { moneyFormatter } from '@/utils'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type LocalStorage from '@/models/LocalStorage.model'
import type State from '@/store/state.model'
import { onMounted, watchEffect } from 'vue'
import { useReservationInformationState } from '@/composables/useReservationInformation'
import { useStore } from 'vuex'
import { useCoupon } from '@/composables/useCoupon'

withDefaults(defineProps<{ isApplyCouponActive?: boolean }>(), {
  isApplyCouponActive: false
})

const { localStorageValue: userSelection } = useLocalStorage<LocalStorage>('userSelection')
const store = useStore<State>()

const {
  couponCode,
  error,
  discount,
  checkin,
  checkout,
  roomScenic,
  roomType,
  totalDayPrice,
  totalPrice,
  roomPrice,
  dateDifference
} = useReservationInformationState()

onMounted(() => {
  fillDataFromLocalStorage()
  if (couponCode.value) applyCoupon()
})

watchEffect(() => {
  totalDayPrice.value
})

const fillDataFromLocalStorage = () => {
  couponCode.value = userSelection.value?.coupon_code
}

const applyCoupon = async () => {
  if (couponCode.value) {
    const { discoundedAmount, error: err } = await useCoupon(couponCode.value)
    if (err.value) {
      error.value = err.value
    } else {
      discount.value = discoundedAmount.value
    }
  }
}
</script>
