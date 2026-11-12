const KNOWN_ERRORS = {
  'Empty key!': 'Ключ доступа не задан',
  'Invalid access key': 'Неверный ключ доступа',
  'Invalid key client!': 'Неверный ключ доступа',
  'Empty number goods!': 'Не указан артикул',
  'Request quota exceeded!': 'Превышен лимит запросов',
}

export function mapApiError(message) {
  if (!message) return 'Ошибка запроса'
  return KNOWN_ERRORS[message] || message
}
