<template>
  <div class="relative w-full rounded-md bg-slate-700/30 px-8 py-16">
    <TheToastr v-if="error" :message="error.message" @close="error = null" />
    <Suspense>
      <template #default>
        <SelectHotel :hotelId="hotelId" />
      </template>
      <template #fallback>
        <div>
          <TheSelectbox placeholder="Loading" disabled />
        </div>
      </template>
    </Suspense>
    <div class="relative mt-8 grid grid-cols-4 gap-4">
      <div class="col-span-4 w-full text-center lg:col-span-2 xl:col-span-1">
        <h4 class="mb-2 font-bold">Check-in</h4>
        <Datepicker
          class="w-full"
          :placeholder="'Checkin Date'"
          v-model="checkinDate"
          :disabled-start-date="disabledCheckinDate"
          lang="en"
        />
      </div>
      <div class="col-span-4 w-full text-center lg:col-span-2 xl:col-span-1">
        <h4 class="mb-2 font-bold">Check-out</h4>
        <Datepicker
          class="w-full"
          :placeholder="'Checkout Date'"
          v-model="checkoutDate"
          :disabled-start-date="disabledCheckoutDate"
          lang="en"
        />
      </div>
      <div class="col-span-4 w-full text-center lg:col-span-2 xl:col-span-1">
        <h4 class="mb-2 font-bold">Adult</h4>
        <TheSelectbox
          class="h-[50px] w-full max-w-lg border-[1px] pl-4 text-sm outline-none"
          placeholder="Select number of adult people"
          :options="getAdultSelectOption"
          :value="adultCount"
          :disabled="!getAdultSelectOption.length"
          @change="adultCount = $event"
        />
      </div>
      <div class="col-span-4 w-full text-center lg:col-span-2 xl:col-span-1">
        <h4 class="mb-2 font-bold">Child</h4>
        <TheSelectbox
          class="h-[50px] w-full max-w-lg border-[1px] pl-4 text-sm outline-none"
          :placeholder="!getChildSelectOption.length ? 'Child is not allowed' : 'Select number of child people'"
          :options="getChildSelectOption"
          :value="childCount"
          :disabled="!getChildSelectOption.length"
          @change="childCount = $event"
        />
      </div>
    </div>
  </div>
  <TheSaveAndContinueBtn :disabled="isButtonDisabled" @click="onSaveAndContinue" />
</template>

<script setup lang="ts">
import type State from '@/store/state.model'
import { computed, onErrorCaptured, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import TheSelectbox from '../components/TheSelectbox.vue'
import SelectHotel from '../components/SelectHotel.vue'
import TheToastr from '../components/TheToastr.vue'
import TheSaveAndContinueBtn from '../components/TheSaveAndContinueBtn.vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const store = useStore<State>()
const emit = defineEmits(['saveAndContinue'])

const { localStorageKey, localStorageValue } =
  useLocalStorage<{ hotel_id: string; adult: number; child: number; start_date: Date; end_date: Date }>('userSelection')

const error = ref<Error | null>(null)
const checkinDate = ref<Date>()
const disabledCheckinDate = ref<{ to: Date; from?: Date }>({ to: new Date() })
const checkoutDate = ref<Date>()
const disabledCheckoutDate = ref<{ to: Date; from?: Date }>({ to: new Date() })
const adultCount = ref<number>()
const childCount = ref<number>()
const hotelId = ref<string>()

onErrorCaptured((err) => {
  error.value = err
})

onMounted(async () => {
  await fillDataFromLocalStorage()
})

watch(checkinDate, () => {
  if (!checkinDate.value || !checkoutDate.value) return
  if (checkinDate.value > checkoutDate.value) checkoutDate.value = checkinDate.value
  disabledCheckoutDate.value.to = checkinDate.value
})

const isButtonDisabled = computed(() => {
  return (
    !checkinDate.value ||
    !checkoutDate.value ||
    !adultCount.value ||
    (store.state.selectedHotel.child_status && !childCount.value) ||
    !store.state.selectedHotel.id
  )
})

const getAdultSelectOption = computed((): { id: string; name: number }[] => {
  if (!store.state.selectedHotel.id) return []
  const adultSelectOptions = Array.from(Array(store.state.selectedHotel.max_adult_size || 6).keys()).map((elem) => {
    return { id: elem.toString(), name: elem }
  })
  return adultSelectOptions
})

const getChildSelectOption = computed((): { id: string; name: number }[] => {
  if (!store.state.selectedHotel.child_status) return []
  const adultSelectOptions = Array.from(Array(6).keys()).map((elem) => {
    return { id: elem.toString(), name: elem }
  })
  return adultSelectOptions
})

const fillDataFromLocalStorage = async () => {
  try {
    await store.dispatch('setSelectedHotel', localStorageValue.value?.hotel_id)
    hotelId.value = localStorageValue.value?.hotel_id
    adultCount.value = Number(localStorageValue.value?.adult)
    childCount.value = Number(localStorageValue.value?.child)
    checkinDate.value = localStorageValue.value?.start_date
    checkoutDate.value = localStorageValue.value?.end_date
  } catch (err: any) {
    error.value = { name: 'Error', message: 'Hotel details can not fetched' }
  }
}

const onSaveAndContinue = () => {
  const userSelection = {
    hotel_id: store.state.selectedHotel.id as string,
    start_date: checkinDate.value as Date,
    end_date: checkoutDate.value as Date,
    adult: adultCount.value as number,
    child: childCount.value as number
  }
  localStorageValue.value = userSelection
  emit('saveAndContinue')
}
</script>

<style scoped></style>
