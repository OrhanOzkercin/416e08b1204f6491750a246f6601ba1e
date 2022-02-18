<template>
  <div class="grid w-full grid-cols-2 gap-6">
    <TheToastr v-if="error" :message="error.message" @close="error = null" />

    <div
      class="col-span-2 border-b-[1px] border-r-slate-500 pb-8 xl:col-span-1 xl:border-b-0 xl:border-r-[1px] xl:pb-0"
    >
      <TheCreditCard
        v-if="Object.keys(creditCardValues).length"
        @value-chane="onCreditCardValuesChange"
        :values="creditCardValues"
      />
    </div>
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
      <div class="my-8 flex justify-between">
        <input
          placeholder="Enter your cupone code"
          class="mr-5 w-full cursor-pointer appearance-none rounded-md bg-slate-500/20 px-5 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
          type="text"
          v-model="couponCode"
          @keyup.enter="applyCoupon"
        />
        <button class="btn px-5 py-2" @click="applyCoupon">Apply</button>
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
      <p class="text-md mt-2" v-show="discount">
        <span class="font-semibold text-slate-100">Discount: </span>({{ couponCode }}) &nbsp;
        {{ moneyFormatter(discount as number) }}
      </p>
      <hr class="my-3 border-slate-500" />
      <div>
        <h4 class="mb-3 text-center text-2xl font-bold text-slate-100 underline">Total Price</h4>
        <h4 class="text-center text-3xl font-bold text-slate-100">{{ moneyFormatter(totalPrice) }}</h4>
      </div>
    </div>
  </div>
  <TheSaveAndContinueBtn :disabled="!checkCreditCardValid" :is-back-active="true" @save="onSave" @back="goBack"
    >Finish and Pay</TheSaveAndContinueBtn
  >
</template>

<script setup lang="ts">
import { dateDifference as dDifference, moneyFormatter } from '@/utils'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useCoupon } from '@/composables/useCoupon'
import type LocalStorage from '@/models/LocalStorage.model'
import type RoomScenic from '@/models/RoomScenic.model'
import type CreditCard from '@/models/CreditCard.model'
import type RoomType from '@/models/RoomType.model'
import type State from '@/store/state.model'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import TheSaveAndContinueBtn from '../components/TheSaveAndContinueBtn.vue'
import TheToastr from '../components/TheToastr.vue'
import TheCreditCard from '../components/TheCreditCard.vue'
import { useFetch } from '@/composables/useFetch'

const emit = defineEmits(['saveAndContinue'])

const { localStorageValue: userSelection } = useLocalStorage<LocalStorage>('userSelection')
const { localStorageValue: step } = useLocalStorage('step')
const store = useStore<State>()

const error = ref<Error | null>(null)
const couponCode = ref<string>()
const discount = ref<number>()
const creditCardValues = ref<CreditCard>({} as CreditCard)

onMounted(() => {
  fillDataFromLocalStorage()
  if (couponCode.value) applyCoupon()
})

const checkin = computed(() => {
  const date = new Date(userSelection.value?.start_date || '').toLocaleDateString('en-US')
  return date
})

const checkout = computed(() => {
  const date = new Date(userSelection.value?.end_date || '').toLocaleDateString('en-US')
  return date
})

const roomType = computed((): RoomType => {
  const roomType =
    store.state.selectedHotel.room_type?.find((room) => room.id === userSelection.value?.room_type) || ({} as RoomType)
  return roomType
})

const roomScenic = computed((): RoomScenic => {
  const roomScenic =
    store.state.selectedHotel.room_scenic?.find((room) => room.id === userSelection.value?.room_scenic) ||
    ({} as RoomScenic)
  return roomScenic
})

const peopleCount = computed(() => {
  return Number(userSelection.value?.adult) + (Number(userSelection.value?.child) || 0)
})

const dateDifference = computed(() => dDifference(checkin.value, checkout.value))
const roomPrice = computed(() => roomType.value.price * peopleCount.value)
const totalDayPrice = computed(() => roomType.value.price * dateDifference.value)
const totalPrice = computed(
  () => totalDayPrice.value + totalDayPrice.value * (roomScenic.value.price_rate / 100) - (discount.value || 0)
)

const fillDataFromLocalStorage = () => {
  creditCardValues.value.cardName = userSelection.value?.card_name as string
  creditCardValues.value.cardNumber = userSelection.value?.card_number as string
  creditCardValues.value.cardMonth = userSelection.value?.card_date_month as string
  creditCardValues.value.cardYear = userSelection.value?.card_date_year as string
  creditCardValues.value.cardCvv = userSelection.value?.card_cvv as string
  couponCode.value = userSelection.value?.coupon_code
}
const onCreditCardValuesChange = (e: any) => (creditCardValues.value = e.value)

const onSave = () => {
  const isCardValid = checkCreditCardValid()
  if (!isCardValid) return
  const mappedCreditCard = {
    card_name: creditCardValues.value.cardName,
    card_number: creditCardValues.value.cardNumber.trim(),
    card_date_month: creditCardValues.value.cardMonth,
    card_date_year: creditCardValues.value.cardYear,
    card_cvv: creditCardValues.value.cardCvv,
    coupon_code: couponCode.value
  }
  userSelection.value = { ...userSelection.value, ...mappedCreditCard, price: totalPrice.value }

  try {
    createReservation()
    emit('saveAndContinue')
  } catch (err) {
    error.value = new Error('Reservation can not created!')
  }
}

const createReservation = async () => {
  const { error, fetchData } = useFetch('/hotel-bookings', undefined, {
    method: 'POST',
    body: JSON.stringify({ ...userSelection.value })
  })
  await fetchData()
  if (error.value) throw new Error(error.value.message)
}

const checkCreditCardValid = () => {
  const { ...crediCard } = creditCardValues.value
  const allFieldsFilled = Object.values(crediCard).every((val) => !!val)
  if (!allFieldsFilled) {
    error.value = new Error('All fields must be filled')
    return false
  }
  if (isNaN(Number(creditCardValues.value.cardCvv))) {
    error.value = new Error('CVV Number is not valid')
    return false
  }
  if (!/^[a-zA-ZğüşöçİĞÜŞÖÇ ]+$/.test(creditCardValues.value.cardName)) {
    error.value = new Error('Card name is not valid')
    return false
  }
  if (creditCardValues.value.cardNumber.length < 16) {
    error.value = new Error('Card number is not valid')
    return false
  }
  return true
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

const goBack = () => {
  step.value = store.state.currentStepIndex - 1
  store.dispatch('setStatus', store.state.currentStepIndex - 1)
}
</script>
