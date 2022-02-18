export default interface LocalStorage {
  hotel_id?: string
  hotel_name?: string
  adult?: number
  child?: number
  start_date?: Date | string
  end_date?: Date | string
  room_type?: string
  room_scenic?: string
  price?: number
  card_name?: string
  card_number?: string
  card_date_month?: string
  card_date_year?: string
  card_cvv?: string
  coupon_code?: string
}
