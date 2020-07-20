export function formatDateForPicker (increase = 0) {

  const now = new Date()
  now.setDate(now.getDate() + increase)

  const year = now.getFullYear()
  const month = (now.getMonth() < 10) ? '0' + (now.getMonth() + 1) : now.getMonth()
  const day = (now.getDate() < 10) ? '0' + now.getDate() : now.getDate()
  return `${year}-${month}-${day}`
}
