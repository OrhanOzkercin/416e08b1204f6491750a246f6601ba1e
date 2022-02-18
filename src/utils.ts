export const formatDateYYYYMMDD = (date: Date) => {
  if (!date) return
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}
export const dateDifference = (date1: any, date2: any) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = d2 - d1
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const moneyFormatter = (price: number) => {
  const formatedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
  return formatedPrice
}
