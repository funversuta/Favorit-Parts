# Favorit hsprice smoke (2026-11-13)

## Ключ

Тестовый ключ покупателя описан в публичной документации Favorit: [wsorder.pdf](https://lk.favorit-parts.ru/static/wsorder.pdf).

Для локального запуска положите ключ только в `.env` (файл в `.gitignore`), не коммитьте его.

Шаблон: `.env.example` → `FAVORIT_API_KEY=`

## Endpoint

- HTTP: `http://api.favorit-parts.ru/hs/hsprice/` — OK
- HTTPS: `https://api.favorit-parts.ru/hs/hsprice/` — OK
- CORS: `Access-Control-Allow-Origin: *`
- WAF/QRATOR: запросы без нормального User-Agent иногда дают 403

## Этап 1 — `key` + `number`

Запрос: `number=01089`

Результат: `goods` = 10 позиций, бренды:
`AP`, `ASAM`, `FEBI`, `GLASER`, `HOFFER`, `Meat & Doria`, `OSSCA`, `Orjin Automotive`, `SEINTEX`, `SUPLEX`

Файл: `stage1_01089.json`

## Этап 2 — `key` + `number` + `brand` + `analogues=on`

| Запрос | goods | analogues | warehouses (main) |
| --- | --- | --- | --- |
| `01089` + `OSSCA` | 1 | 13 | 4 |
| `01089` + `FEBI` | 1 | 193 | 18 |
| `OC47` + `MAHLE` (HTTPS) | 1 | 534 | 21 |

Аналоги лежат в `goods[0].analogues[]`, не в корне.

Файлы: `stage2_01089_OSSCA.json`, `stage2_01089_FEBI.json`, `stage2_https_MAHLE_OC47.json`

## Пустая структура (товар не найден)

`number=ZZZZNOTEXIST99999` → HTTP 200:

```json
{
  "goods": [
    {
      "brand": "",
      "count": 0,
      "goodsID": "00000000-0000-0000-0000-000000000000",
      "name": "",
      "number": "",
      "price": 0,
      "rate": 0,
      "warehouses": []
    }
  ]
}
```

Файл: `notfound.json`

## Ошибки

| Кейс | HTTP | Тело |
| --- | --- | --- |
| пустой `key` | 403 | `{"error":"Empty key!"}` |
| неверный `key` | 403 | `{"error":"Invalid access key"}` (не `Invalid key client!` из PDF) |
| пустой `number` | 200 | `{"error":"Empty number goods!"}` |
