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
    <ReservationInformation :is-apply-coupon-active="true" />
  </div>

  <TheSaveAndContinueBtn
    v-if="localStorageReservationId"
    :disabled="!checkCreditCardValid"
    :is-back-active="true"
    @save="onUpdateSave"
    @back="goBack"
    >Update Reseration</TheSaveAndContinueBtn
  >
  <TheSaveAndContinueBtn v-else :disabled="!checkCreditCardValid" :is-back-active="true" @save="onSave" @back="goBack"
    >Finish and Pay</TheSaveAndContinueBtn
  >
</template>

<script setup lang="ts">
import { useLocalStorage } from '@/composables/useLocalStorage'
import type LocalStorage from '@/models/LocalStorage.model'
import type CreditCard from '@/models/CreditCard.model'
import type State from '@/store/state.model'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import TheSaveAndContinueBtn from '../components/TheSaveAndContinueBtn.vue'
import TheToastr from '../components/TheToastr.vue'
import TheCreditCard from '../components/TheCreditCard.vue'
import { useFetch } from '@/composables/useFetch'
import ReservationInformation from '../components/ReservationInformation.vue'
import { useReservationInformationState } from '@/composables/useReservationInformation'

const emit = defineEmits(['saveAndContinue'])

const { error, totalPrice, couponCode, reservationId } = useReservationInformationState()
const { localStorageValue: userSelection } = useLocalStorage<LocalStorage>('userSelection')
const { localStorageValue: step } = useLocalStorage<number>('step')
const { localStorageValue: localStorageReservationId } = useLocalStorage<string>('reservationId')

const store = useStore<State>()

const creditCardValues = ref<CreditCard>({} as CreditCard)

onMounted(() => {
  fillDataFromLocalStorage()
  reservationId.value = localStorageReservationId.value
})

const fillDataFromLocalStorage = () => {
  creditCardValues.value.cardName = userSelection.value?.card_name as string
  creditCardValues.value.cardNumber = userSelection.value?.card_number as string
  creditCardValues.value.cardMonth = userSelection.value?.card_date_month as string
  creditCardValues.value.cardYear = userSelection.value?.card_date_year as string
  creditCardValues.value.cardCvv = userSelection.value?.card_cvv as string
  couponCode.value = userSelection.value?.coupon_code
}

const onCreditCardValuesChange = (e: any) => (creditCardValues.value = e.value)

const onSave = async () => {
  const isCardValid = checkCreditCardValid()
  if (!isCardValid) return
  updateLocalStorage()
  try {
    const data: any = await createReservation()
    reservationId.value = data.value.id as string

    emit('saveAndContinue')
  } catch (err) {
    error.value = new Error('Reservation can not created!')
  }
}

const onUpdateSave = async () => {
  const isCardValid = checkCreditCardValid()
  if (!isCardValid) return
  updateLocalStorage()
  try {
    await updateReservation()
    emit('saveAndContinue')
  } catch (err) {
    error.value = new Error('Reservation can not created!')
  }
}

const updateLocalStorage = () => {
  const mappedCreditCard = {
    card_name: creditCardValues.value.cardName,
    card_number: creditCardValues.value.cardNumber.trim(),
    card_date_month: creditCardValues.value.cardMonth,
    card_date_year: creditCardValues.value.cardYear,
    card_cvv: creditCardValues.value.cardCvv
  }
  userSelection.value = { ...userSelection.value, ...mappedCreditCard, price: totalPrice.value }
}

const createReservation = async () => {
  const { data, error, fetchData } = useFetch('/hotel-bookings', undefined, {
    method: 'POST',
    body: JSON.stringify({ ...userSelection.value })
  })
  await fetchData()
  if (error.value) throw new Error(error.value.message)
  return data
}
const updateReservation = async () => {
  const { error, fetchData } = useFetch(`/hotel-bookings/${reservationId.value}`, undefined, {
    method: 'PUT',
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

const goBack = () => {
  step.value = store.state.currentStepIndex - 1
  store.dispatch('setStatus', store.state.currentStepIndex - 1)
}
</script>
