<template>
  <HotelInformation />
  <div v-if="showRoomTypeCard" class="w-f grid grid-cols-3 gap-4">
    <div class="col-span-3 md:col-span-1" v-for="roomType in selectedHotel.room_type" :key="roomType.id">
      <RoomCard
        :selected="selectedRoomType.id === roomType.id"
        @click="selectRoomType(roomType)"
        :key="roomType.id"
        :title="roomType.title"
        :image="roomType.photo"
      >
        <p class="text-md mt-2">Price: {{ moneyFormatter(roomType.price) }}</p>
      </RoomCard>
    </div>
  </div>
  <div v-else>Loading...</div>
  <hr class="w-full border-slate-700" />
  <div v-if="showRoomScenicCard" class="grid grid-cols-3 gap-4">
    <div class="col-span-3 md:col-span-1" v-for="roomScenic in selectedHotel.room_scenic" :key="roomScenic.id">
      <RoomCard
        :selected="selectedRoomScenic.id === roomScenic.id"
        @click="selectRoomScenic(roomScenic)"
        :key="roomScenic.id"
        :title="roomScenic.title"
        :image="roomScenic.photo"
      >
        <p class="text-md mt-2">Price Rate: %{{ roomScenic.price_rate }}</p>
      </RoomCard>
    </div>
  </div>
  <div v-else>Loading...</div>
  <TheSaveAndContinueBtn
    @save="onSaveAndContinue"
    @back="goBack"
    :disabled="!selectedRoomScenic.id || !selectedRoomType.id"
    :isBackActive="true"
  />
</template>

<script setup lang="ts">
import { moneyFormatter } from '@/utils'
import HotelInformation from '../components/HotelInformation.vue'
import RoomCard from '../components/RoomCard.vue'
import type State from '@/store/state.model'
import type LocalStorage from '@/models/LocalStorage.model'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type RoomType from '@/models/RoomType.model'
import type RoomScenic from '@/models/RoomScenic.model'
import TheSaveAndContinueBtn from '../components/TheSaveAndBackBtn.vue'

const emit = defineEmits(['saveAndContinue'])

const { localStorageValue: userSelection, updateLocalStorageValue } = useLocalStorage<LocalStorage>('userSelection')
const { localStorageValue: step } = useLocalStorage('step')

const store = useStore<State>()
const selectedHotel = ref(store.state.selectedHotel)

const selectedRoomType = ref<RoomType>({} as RoomType)
const selectedRoomScenic = ref<RoomScenic>({} as RoomScenic)

onMounted(() => {
  fillDataFromLocalStorage()
})

const showRoomTypeCard = computed(() => {
  return selectedHotel.value.room_type
})

const showRoomScenicCard = computed(() => {
  return selectedHotel.value.room_scenic
})

const peopleCount = computed(() => {
  return Number(userSelection.value?.adult) + (Number(userSelection.value?.child) || 0)
})

const selectRoomType = (roomType: RoomType) => {
  selectedRoomType.value = roomType
}
const selectRoomScenic = (roomScenic: RoomScenic) => {
  selectedRoomScenic.value = roomScenic
}

const fillDataFromLocalStorage = () => {
  selectedRoomType.value.id = userSelection.value?.room_type || ''
  selectedRoomScenic.value.id = userSelection.value?.room_scenic || ''
}

const goBack = () => {
  step.value = store.state.currentStepIndex - 1
  store.dispatch('setStatus', store.state.currentStepIndex - 1)
}

const onSaveAndContinue = () => {
  const userChooses = {
    room_type: selectedRoomType.value.id,
    room_scenic: selectedRoomScenic.value.id,
    price: selectedRoomScenic.value.price_rate * peopleCount.value * selectedRoomType.value.price
  }
  updateLocalStorageValue()
  userSelection.value = { ...userSelection.value, ...userChooses }
  emit('saveAndContinue')
}
</script>
