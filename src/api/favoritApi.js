import { mapApiError } from '../utils/apiError'

export async function fetchPrice({ number, brand, analogues, signal }) {
  const params = new URLSearchParams()
  params.set('number', number)
  if (brand) params.set('brand', brand)
  if (analogues) params.set('analogues', analogues)

  let response
  try {
    response = await fetch(`/api/price?${params.toString()}`, { signal })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new Error('Сетевая ошибка')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(response.ok ? 'Некорректный ответ сервера' : `HTTP ${response.status}`)
  }

  if (!response.ok || data.error) {
    throw new Error(mapApiError(data.error) || `HTTP ${response.status}`)
  }

  return data
}
