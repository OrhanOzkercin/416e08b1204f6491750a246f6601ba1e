import type Hotel from '@/models/Hotel.model'

interface State {
  currentStepIndex: 0 | 1 | 2 | 3
  selectedHotel: Hotel
}
export default State
