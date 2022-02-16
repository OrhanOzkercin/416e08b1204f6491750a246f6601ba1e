import type RoomScenic from './RoomScenic.model'
import type RoomType from './RoomType.model'

export default interface Hotel {
  id: string
  hotel_id: string
  city: string
  possibilities: string[]
  max_adult_size: number
  child_status: boolean
  room_type: RoomType[]
  room_scenic: RoomScenic[]
}
