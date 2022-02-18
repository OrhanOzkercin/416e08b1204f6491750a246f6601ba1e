import { dateDifference as dDifference } from '@/utils'
import type LocalStorage from '@/models/LocalStorage.model'
import type RoomType from '@/models/RoomType.model'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type State from '@/store/state.model'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type RoomScenic from '@/models/RoomScenic.model'

const couponCode = ref<string>()
const error = ref<Error | null>(null)
const discount = ref<number>()
const reservationId = ref<string>()
export function useReservationInformationState() {
  const store = useStore<State>()
  const { localStorageValue: userSelection } = useLocalStorage<LocalStorage>('userSelection')

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
      store.state.selectedHotel.room_type?.find((room) => room.id === userSelection.value?.room_type) ||
      ({} as RoomType)
    return roomType
  })

  const peopleCount = computed(() => {
    return Number(userSelection.value?.adult) + (Number(userSelection.value?.child) || 0)
  })

  const roomPrice = computed(() => roomType.value.price * peopleCount.value)

  const roomScenic = computed((): RoomScenic => {
    const roomScenic =
      store.state.selectedHotel.room_scenic?.find((room) => room.id === userSelection.value?.room_scenic) ||
      ({} as RoomScenic)
    return roomScenic
  })
  const dateDifference = computed(() => dDifference(checkin.value, checkout.value))

  const totalDayPrice = computed(() => roomType.value.price * dateDifference.value)
  const totalPrice = computed(
    () =>
      peopleCount.value *
      (totalDayPrice.value + totalDayPrice.value * (roomScenic.value.price_rate / 100) - (discount.value || 0))
  )
  return {
    couponCode,
    dateDifference,
    error,
    discount,
    totalPrice,
    totalDayPrice,
    checkin,
    checkout,
    roomType,
    roomScenic,
    roomPrice,
    peopleCount,
    reservationId
  }
}
